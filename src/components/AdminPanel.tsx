import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  Upload, 
  Check, 
  X,
  Image as ImageIcon,
  Save,
  Loader2,
  Settings,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { Question, Category, UserProfile } from '../types';

interface AdminPanelProps {
  onBack: () => void;
  user: UserProfile;
}

export default function AdminPanel({ onBack, user }: AdminPanelProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newPin, setNewPin] = useState('');
  const [pinStatus, setPinStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: 'general'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const qSnap = await getDocs(collection(db, 'questions'));
      const fetched = qSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
      setQuestions(fetched);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `signs/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCurrentQuestion(prev => ({ ...prev, imageUrl: url }));
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!db || !currentQuestion.text) return;
    
    setIsLoading(true);
    try {
      if (currentQuestion.id) {
        // Update
        const { id, ...data } = currentQuestion;
        await updateDoc(doc(db, 'questions', id!), {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create
        await addDoc(collection(db, 'questions'), {
          ...currentQuestion,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setCurrentQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0, category: 'general' });
      fetchQuestions();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm('Delete this question?')) return;
    try {
      await deleteDoc(doc(db, 'questions', id));
      fetchQuestions();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `questions/${id}`);
    }
  };

  const handlePinChange = async () => {
    if (!db || newPin.length < 4) {
      setPinStatus({ type: 'error', msg: 'PIN must be at least 4 digits' });
      return;
    }
    
    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        adminPin: newPin,
        updatedAt: serverTimestamp()
      });
      setPinStatus({ type: 'success', msg: 'Admin PIN updated successfully!' });
      setNewPin('');
    } catch (err) {
      console.error("PIN update error", err);
      setPinStatus({ type: 'error', msg: 'Failed to update PIN' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900">
            <ArrowLeft size={18} />
            Back to List
          </button>
          <h2 className="text-xl font-black text-slate-900">{currentQuestion.id ? 'Edit Question' : 'New Question'}</h2>
        </header>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question Text</label>
            <textarea 
              value={currentQuestion.text}
              onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter the question..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
              <select 
                value={currentQuestion.category}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, category: e.target.value as Category }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option value="road-signs">Road Signs</option>
                <option value="rules">Rules of the Road</option>
                <option value="general">General Knowledge</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sign Image</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="img-upload"
                />
                <label 
                  htmlFor="img-upload"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all text-slate-400 font-bold text-sm"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                  {currentQuestion.imageUrl ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
            </div>
          </div>

          {currentQuestion.imageUrl && (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-100 mx-auto">
              <img src={currentQuestion.imageUrl} className="w-full h-full object-contain" alt="Question Preview" />
              <button 
                onClick={() => setCurrentQuestion(prev => ({ ...prev, imageUrl: undefined }))}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full shadow-lg"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Options (Select Correct)</label>
             {currentQuestion.options?.map((opt, idx) => (
               <div key={idx} className="flex gap-2">
                 <button 
                   onClick={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: idx }))}
                   className={`w-10 h-12 flex items-center justify-center rounded-xl border transition-all ${currentQuestion.correctAnswer === idx ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
                 >
                   <Check size={18} />
                 </button>
                 <input 
                   type="text"
                   value={opt}
                   onChange={(e) => {
                     const newOpts = [...(currentQuestion.options || [])];
                     newOpts[idx] = e.target.value;
                     setCurrentQuestion(prev => ({ ...prev, options: newOpts }));
                   }}
                   placeholder={`Option ${idx + 1}`}
                   className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
                 />
               </div>
             ))}
          </div>

          <button 
            onClick={handleSave}
            disabled={isLoading || isUploading}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900">Manage Quiz</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'questions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Questions
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Settings
          </button>
        </div>
      </header>

      {activeTab === 'questions' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{questions.length} Questions Total</p>
            <button 
              onClick={() => {
                setCurrentQuestion({ text: '', options: ['', '', '', ''], correctAnswer: 0, category: 'general' });
                setIsEditing(true);
              }}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-200 flex items-center gap-2 text-sm font-bold"
            >
              <Plus size={18} />
              Add New
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="animate-spin mx-auto text-emerald-600 mb-2" size={32} />
                <p className="text-sm font-bold text-slate-400">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="p-12 text-center">
                <ImageIcon className="mx-auto text-slate-100 mb-4" size={64} />
                <p className="font-bold text-slate-400">No questions found in cloud.</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 font-bold text-sm mt-2 hover:underline"
                >
                  Add your first question
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {q.imageUrl ? (
                        <img src={q.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                      ) : (
                        <ImageIcon size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{q.text}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setCurrentQuestion(q);
                          setIsEditing(true);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Admin Security</h3>
            <p className="text-sm text-slate-500">Add a secondary PIN code for accessing the admin panel.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Admin PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-6 digits"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Leave empty to remove PIN protection.</p>
            </div>

            {pinStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold border ${pinStatus.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                {pinStatus.msg}
              </div>
            )}

            <button 
              onClick={handlePinChange}
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Update Admin Security
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

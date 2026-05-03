import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  BookOpen, 
  BarChart2, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Trophy,
  ArrowLeft,
  Crown,
  Share2,
  Clock,
  Info,
  Lock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category, Question, QuizResult, UserProfile } from './types';
import { SAMPLE_QUESTIONS } from './data';
import AdminPanel from './components/AdminPanel';
import { getLocalUser, saveLocalUser, saveLocalResult, getLocalResults } from './lib/storage';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Views Types
type View = 'auth' | 'home' | 'quiz' | 'stats' | 'admin';

export default function App() {
  console.log('App component rendering...');
  const [view, setView] = useState<View>('auth');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    // Initial check from local storage
    const savedUser = getLocalUser();
    if (savedUser) {
      setUser(savedUser);
      setView('home');
    }
    
    // Only stop loading if we don't have auth (which will tell us if someone is logged in)
    if (!auth) {
      setIsLoading(false);
    }

    // Fetch Questions
    const fetchQuestions = async () => {
      if (db) {
        try {
          const qSnap = await getDocs(collection(db, 'questions'));
          if (qSnap.empty) {
            setQuestions(SAMPLE_QUESTIONS);
          } else {
            const fetched = qSnap.docs.map(d => ({ id: d.id, ...d.data() } as Question));
            setQuestions(fetched);
          }
        } catch (err) {
          console.error("Error fetching questions:", err);
          setQuestions(SAMPLE_QUESTIONS);
        }
      } else {
        setQuestions(SAMPLE_QUESTIONS);
      }
    };
    fetchQuestions();

    // Firebase Auth Listener
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch from Firestore if available
          if (db) {
            const userPath = `users/${firebaseUser.uid}`;
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data() as UserProfile;
                setUser(userData);
                saveLocalUser(userData);
              } else {
                // Create new user if not exists
                const newUser: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.email?.split('@')[0] || 'User',
                  isPremium: false,
                  isAdmin: firebaseUser.email === 'marcelloswartz45@gmail.com', // Bootstrap admin
                  adminPin: '',
                  stats: {
                    totalQuizzes: 0,
                    averageScore: 0,
                    progress: { 'road-signs': 0, 'rules': 0, 'general': 0 }
                  },
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                };
                try {
                  await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                } catch (err: any) {
                  console.error("Firestore setup error", err);
                  // handleFirestoreError(err, OperationType.WRITE, userPath);
                }
                setUser(newUser);
                saveLocalUser(newUser);
              }
            } catch (err: any) {
              console.error("Firestore fetch error", err);
              // handleFirestoreError(err, OperationType.GET, userPath);
            }
          }
          setView('home');
        } else {
          setUser(null);
          if (!getLocalUser()) setView('auth');
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  // Auth Handlers
  const handleAuth = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      if (auth) {
        if (isRegistering) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } else {
        // Fallback or demo mode
        handleLogin(email);
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (email: string) => {
    const newUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      displayName: email.split('@')[0],
      isPremium: false,
      isAdmin: email === 'marcelloswartz45@gmail.com',
      adminPin: '',
      stats: {
        totalQuizzes: 0,
        averageScore: 0,
        progress: {
          'road-signs': 0,
          'rules': 0,
          'general': 0
        }
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveLocalUser(newUser);
    setUser(newUser);
    setView('home');
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem('licence_pro_user');
    setUser(null);
    setView('auth');
  };

  // Quiz Handlers
  const startQuiz = (category: Category) => {
    const filteredQuestions = (questions.length > 0 ? questions : SAMPLE_QUESTIONS)
      .filter(q => q.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setActiveQuizQuestions(filteredQuestions);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedCategory(category);
    setView('quiz');
  };

  const submitAnswer = async (optionIndex: number) => {
    if (showFeedback) return;
    
    setLastSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === activeQuizQuestions[currentQuestionIndex].correctAnswer;
    setShowFeedback(true);

    setTimeout(async () => {
      const nextAnswers = [...answers, optionIndex];
      if (currentQuestionIndex < activeQuizQuestions.length - 1) {
        setAnswers(nextAnswers);
        setCurrentQuestionIndex(prev => prev + 1);
        setShowFeedback(false);
        setLastSelectedAnswer(null);
      } else {
        const score = nextAnswers.reduce((acc, ans, idx) => {
          return acc + (ans === activeQuizQuestions[idx].correctAnswer ? 1 : 0);
        }, 0);

        const result: QuizResult = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user?.uid || 'guest',
          category: selectedCategory!,
          score,
          totalQuestions: activeQuizQuestions.length,
          completedAt: Date.now(),
          createdAt: serverTimestamp()
        };

        // Save to Firebase
        if (db && user) {
          const resultsPath = 'results';
          const userPath = `users/${user.uid}`;
          
          try {
            await addDoc(collection(db, resultsPath), result);
          } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, resultsPath);
          }

          const updatedStats = { ...user.stats };
          updatedStats.totalQuizzes += 1;
          updatedStats.averageScore = ((updatedStats.averageScore * (updatedStats.totalQuizzes - 1)) + (score / activeQuizQuestions.length * 100)) / updatedStats.totalQuizzes;
          
          const currentProgress = updatedStats.progress[selectedCategory!] || 0;
          const newProgress = (score / activeQuizQuestions.length) * 100;
          if (newProgress > currentProgress) {
            updatedStats.progress[selectedCategory!] = newProgress;
          }
          
          try {
            await updateDoc(doc(db, userPath), { 
              stats: updatedStats,
              updatedAt: serverTimestamp()
            });
          } catch (err) {
            handleFirestoreError(err, OperationType.UPDATE, userPath);
          }
        }

        saveLocalResult(result);
        const updatedUser = getLocalUser();
        if (updatedUser) setUser(updatedUser);
        
        setAnswers(nextAnswers);
        setView('stats'); 
        setShowFeedback(false);
        setLastSelectedAnswer(null);
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      {user && view !== 'quiz' && (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Car size={18} />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">LicencePro</span>
          </div>
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <button 
                onClick={() => setView('admin')}
                className={cn("p-2 rounded-full transition-colors", view === 'admin' ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-50")}
              >
                <div className="relative">
                  <BookOpen size={20} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
              </button>
            )}
            <button 
              onClick={() => setView('stats')}
              className={cn("p-2 rounded-full transition-colors", view === 'stats' ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-50")}
            >
              <BarChart2 size={20} />
            </button>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-600">
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={cn("pt-20 px-4 pb-12 max-w-2xl mx-auto", view === 'quiz' && "pt-8")}>
        <AnimatePresence mode="wait">
          {view === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center pt-12"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center text-white mb-6">
                <Car size={32} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-500 mb-8 text-center max-w-xs">
                {isRegistering 
                  ? 'Join thousands of learners in Namibia acing their exams.' 
                  : 'Start your journey towards a Namibian Learner\'s License today.'}
              </p>
              
              <div className="w-full space-y-4">
                {authError && (
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 mb-4">
                    {authError}
                  </div>
                )}
                
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                </div>

                <button 
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all"
                >
                  {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Continue')}
                </button>

                <div className="text-center pt-4">
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-emerald-600 font-bold text-sm hover:underline"
                  >
                    {isRegistering ? 'Already have an account? Login' : 'New user? Create an account'}
                  </button>
                </div>

                {!auth && (
                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex gap-2">
                      <Info size={16} className="text-amber-600 shrink-0" />
                      <p className="text-[10px] text-amber-700 font-medium">
                        <strong>Demo Mode:</strong> Firebase is not configured yet. Your progress will be saved locally. Check SETUP.md for backend configuration.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'home' && user && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <header>
                <h2 className="text-2xl font-black text-slate-900">Hello, {user.displayName}!</h2>
                <p className="text-slate-500 font-medium opacity-80 italic">Ready to ace your licence today?</p>
              </header>

              {/* Stats Bar */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-around">
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-600">{user.stats.totalQuizzes}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Quizzes</div>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <div className="text-2xl font-black text-emerald-600">{Math.round(user.stats.averageScore)}%</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Avg Score</div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Study Categories</h3>
                <div className="grid gap-4">
                  {[
                    { id: 'road-signs', label: 'Road Signs', icon: Info, count: SAMPLE_QUESTIONS.filter(q => q.category === 'road-signs').length },
                    { id: 'rules', label: 'Rules of the Road', icon: BookOpen, count: SAMPLE_QUESTIONS.filter(q => q.category === 'rules').length },
                    { id: 'general', label: 'General Knowledge', icon: BarChart2, count: SAMPLE_QUESTIONS.filter(q => q.category === 'general').length }
                  ].map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => startQuiz(cat.id as Category)}
                      className="group bg-white p-5 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all text-left flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                        <cat.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{cat.label}</h4>
                        <p className="text-xs text-slate-400">{cat.count} Questions • Mastery {Math.round(user.stats.progress[cat.id as Category])}%</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-transparent transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Lock */}
              {!user.isPremium && (
                <div className="bg-emerald-950 p-6 rounded-3xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Crown size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <Crown size={16} className="text-amber-400" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Unlock Premium</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Upgrade to Premium</h3>
                    <p className="text-emerald-200/60 text-sm mb-6 max-w-[200px]">Unlock 500+ extra questions and simulated exams.</p>
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-900/40">
                      Learn More
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'quiz' && activeQuizQuestions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Quiz Header */}
              <div className="flex items-center justify-between">
                <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    <span>Timer</span>
                  </div>
                  <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
                    Question {currentQuestionIndex + 1} of {activeQuizQuestions.length}
                  </span>
                  <h3 className="text-xl font-bold leading-tight text-slate-800">
                    {activeQuizQuestions[currentQuestionIndex].text}
                  </h3>
                </div>

                {activeQuizQuestions[currentQuestionIndex].imageUrl && (
                  <div className="w-full h-48 rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                    <img src={activeQuizQuestions[currentQuestionIndex].imageUrl} alt="Sign" className="max-w-full max-h-full object-contain" />
                  </div>
                )}

                <div className="grid gap-3">
                  {activeQuizQuestions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = lastSelectedAnswer === idx;
                    const isCorrect = idx === activeQuizQuestions[currentQuestionIndex].correctAnswer;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => submitAnswer(idx)}
                        disabled={showFeedback}
                        className={cn(
                          "w-full p-5 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between group",
                          !showFeedback && "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md",
                          showFeedback && isCorrect && "bg-emerald-50 border-emerald-500 text-emerald-700",
                          showFeedback && isSelected && !isCorrect && "bg-rose-50 border-rose-500 text-rose-700",
                          showFeedback && !isSelected && !isCorrect && "opacity-40 grayscale"
                        )}
                      >
                        <span className="flex-1">{option}</span>
                        {showFeedback && isCorrect && <CheckCircle2 size={18} className="text-emerald-500 shrink-0 ml-2" />}
                        {showFeedback && isSelected && !isCorrect && <XCircle size={18} className="text-rose-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center pt-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trophy size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Quiz Complete!</h2>
                <p className="text-slate-500 font-medium italic">Persistence is the key to mastery.</p>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                <div className="flex items-center justify-around">
                   <div className="text-center">
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Score</div>
                      <div className="text-4xl font-black text-emerald-600">
                        {user?.stats.totalQuizzes ? getLocalResults().slice(-1)[0]?.score : 0}
                        <span className="text-lg text-slate-300 ml-1">/ {activeQuizQuestions.length || 10}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Overall Progress</h3>
                  <div className="space-y-4">
                    {['road-signs', 'rules', 'general'].map((cat) => (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase text-slate-500">
                          <span>{cat.replace('-', ' ')}</span>
                          <span>{Math.round(user?.stats.progress[cat as Category] || 0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${(user?.stats.progress[cat as Category] || 0)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setView('home')}
                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Home
                  </button>
                  <button className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'admin' && user?.isAdmin && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(!user.adminPin || isPinVerified) ? (
                <AdminPanel user={user} onBack={() => {
                  setView('home');
                  setIsPinVerified(false);
                }} />
              ) : (
                <div className="flex flex-col items-center justify-center pt-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-2">Admin Access</h2>
                  <p className="text-sm text-slate-500 mb-8 max-w-[240px]">This section is protected. Please enter your admin PIN.</p>
                  
                  <div className="w-full max-w-[200px] space-y-4">
                    <input 
                      type="password"
                      placeholder="Enter PIN"
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value.replace(/\D/g, ''))}
                      className={cn(
                        "w-full text-center tracking-[1em] font-mono text-xl py-3 rounded-xl border outline-none transition-all",
                        pinError ? "border-rose-300 bg-rose-50 ring-2 ring-rose-500/10" : "border-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                      )}
                    />
                    
                    <button 
                      onClick={() => {
                        if (adminPinInput === user.adminPin) {
                          setIsPinVerified(true);
                          setPinError(false);
                          setAdminPinInput('');
                        } else {
                          setPinError(true);
                          setAdminPinInput('');
                          setTimeout(() => setPinError(false), 2000);
                        }
                      }}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
                    >
                      Verify PIN
                    </button>
                    
                    <button 
                      onClick={() => setView('home')}
                      className="text-slate-400 font-bold text-sm hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

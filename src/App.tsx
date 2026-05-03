/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  X, 
  CheckCircle2, 
  Circle, 
  Settings, 
  Maximize2,
  Minimize2,
  MoreVertical,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [time, setTime] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("zen_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [focus, setFocus] = useState(() => localStorage.getItem("zen_focus") || "");
  const [isEditingFocus, setIsEditingFocus] = useState(!localStorage.getItem("zen_focus"));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("zen_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("zen_focus", focus);
  }, [focus]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: crypto.randomUUID(), text: newTask, completed: false }, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const greeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-x-0 top-0 h-full -z-10 bg-zinc-950">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      <main className="z-10 w-full max-w-4xl px-8 flex flex-col items-center text-center space-y-12">
        {/* Time and Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-8xl md:text-9xl font-serif font-bold tracking-tight text-glow">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </h1>
          <p className="text-2xl font-light text-zinc-400">
            {greeting()}, Marcello.
          </p>
        </motion.div>

        {/* Daily Focus */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-xl space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
              What is your main focus for today?
            </h2>
            {isEditingFocus ? (
              <input
                autoFocus
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                onBlur={() => focus.trim() && setIsEditingFocus(false)}
                onKeyDown={(e) => e.key === "Enter" && focus.trim() && setIsEditingFocus(false)}
                className="w-full bg-transparent border-b border-zinc-800 text-3xl text-center py-2 transition-colors focus:border-zinc-500 focus:outline-none"
                placeholder="Write your intention..."
              />
            ) : (
              <div 
                onClick={() => setIsEditingFocus(true)}
                className="group relative cursor-pointer"
              >
                <p className="text-4xl font-medium tracking-tight">
                  {focus}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                  <Edit2 className="w-4 h-4 text-zinc-600" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Tasks */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md glass rounded-3xl p-6 shadow-2xl space-y-6 self-center"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tasks
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </span>
          </div>

          <form onSubmit={addTask} className="relative">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="Add a quick task..."
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.03] rounded-xl group hover:border-white/10 transition-colors"
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="shrink-0 text-zinc-600 hover:text-emerald-500 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 truncate transition-all ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                    {task.text}
                  </span>
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-zinc-600 text-sm italic">Clear space, clear mind.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer Details */}
      <footer className="absolute bottom-8 w-full px-12 flex justify-between items-center text-[10px] font-mono text-zinc-700 uppercase tracking-widest">
        <div>ZenFocus v1.0</div>
        <div className="flex gap-6">
          <button className="hover:text-zinc-400 transition-colors flex items-center gap-1">
            <Settings className="w-3 h-3" /> Preferences
          </button>
          <button className="hover:text-zinc-400 transition-colors flex items-center gap-1">
            <Maximize2 className="w-3 h-3" /> Fullscreen
          </button>
        </div>
      </footer>
    </div>
  );
}

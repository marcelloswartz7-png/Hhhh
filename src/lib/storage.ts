import { UserProfile, QuizResult } from "../types";

const USER_KEY = "licence_pro_user";
const RESULTS_KEY = "licence_pro_results";

export const getLocalUser = (): UserProfile | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveLocalUser = (user: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getLocalResults = (): QuizResult[] => {
  const data = localStorage.getItem(RESULTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLocalResult = (result: QuizResult) => {
  const results = getLocalResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  
  // Update user stats
  const user = getLocalUser();
  if (user) {
    user.stats.totalQuizzes = results.length;
    const totalScore = results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0);
    user.stats.averageScore = (totalScore / results.length) * 100;
    
    // Simple category progress
    const catResults = results.filter(r => r.category === result.category);
    const catBest = Math.max(...catResults.map(r => (r.score / r.totalQuestions) * 100));
    user.stats.progress[result.category] = catBest;
    
    saveLocalUser(user);
  }
};

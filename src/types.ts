export type Category = 'road-signs' | 'rules' | 'general';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: Category;
  imageUrl?: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  category: Category;
  score: number;
  totalQuestions: number;
  completedAt: number;
  createdAt?: any; // For serverTimestamp
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  progress: Record<Category, number>;
  updatedAt?: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isPremium: boolean;
  isAdmin?: boolean;
  adminPin?: string;
  stats: UserStats;
  createdAt: any;
  updatedAt: any;
}

export type FrequencyType = 'daily' | 'weekly' | 'custom_days';

export interface Habit {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  frequency_type: FrequencyType;
  target_days: number[]; // e.g. [1, 2, 3, 4, 5] for Mon-Fri or [1..7] count for weekly
  target_count: number;  // target units per day/session (default: 1)
  unit: string;          // e.g. 'times', 'minutes', 'pages', 'ml'
  color: string;
  tags: string[];
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;          // YYYY-MM-DD
  completed_at: string;  // ISO timestamp
  value: number;         // count/amount completed
  target_met: boolean;
  notes?: string | null;
  mood?: 'great' | 'good' | 'neutral' | 'hard' | 'terrible' | null;
  rating?: number | null; // 1 - 5
  created_at: string;
  updated_at: string;
}

export interface HabitStats {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  total_value: number;
  completion_rate_7d: number;
  completion_rate_30d: number;
  completion_rate_all_time: number;
  last_completed_date: string | null;
  is_completed_today: boolean;
}

export interface HabitWithStats extends Habit {
  stats: HabitStats;
}

export interface DailyHabitStatus {
  habit: Habit;
  is_scheduled: boolean;
  is_completed: boolean;
  total_value_today: number;
  target_count: number;
  logs: HabitLog[];
}

export interface DailySummary {
  date: string;
  total_scheduled: number;
  total_completed: number;
  completion_rate: number;
  habits: DailyHabitStatus[];
}

export interface AnalyticsOverview {
  total_habits: number;
  active_habits: number;
  archived_habits: number;
  total_logs: number;
  today_completion_rate: number;
  longest_active_streak: {
    habit_id: string;
    habit_name: string;
    streak: number;
  } | null;
  top_habits: Array<{
    id: string;
    name: string;
    category: string;
    current_streak: number;
    completion_rate_30d: number;
  }>;
  habits_at_risk: Array<{
    id: string;
    name: string;
    last_completed_date: string | null;
    streak_lost_potential: number;
  }>;
  category_distribution: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

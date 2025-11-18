// Başarı Rozetleri Sistemi

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category?: string;
  condition: (completedExperiments: number[], userStats: UserStats) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  completedExperiments: number[];
  totalExperiments: number;
  favoriteCategory?: string;
  streakDays: number;
  totalTimeSpent: number; // dakika cinsinden
}

const achievements: Achievement[] = [
  {
    id: 'first_experiment',
    title: 'İlk Adım',
    description: 'İlk deneyini tamamladın! 🎉',
    emoji: '🏅',
    condition: (completed) => completed.length >= 1,
    unlocked: false,
  },
  {
    id: 'chemistry_lover',
    title: 'Kimya Tutkunun',
    description: '3 kimya deneyi tamamladın!',
    emoji: '🧪',
    category: 'Chemistry',
    condition: (completed, _stats) => {
      // Bu örnekte basit bir kontrol, gerçekte kategori bazlı sayım yapılacak
      return completed.length >= 3;
    },
    unlocked: false,
  },
  {
    id: 'physics_explorer',
    title: 'Fizik Kaşifi',
    description: '5 fizik deneyi tamamladın!',
    emoji: '⚡',
    category: 'Physics',
    condition: (completed) => completed.length >= 5,
    unlocked: false,
  },
  {
    id: 'experiment_master',
    title: 'Deney Ustası',
    description: '10 farklı deney tamamladın!',
    emoji: '🔬',
    condition: (completed) => completed.length >= 10,
    unlocked: false,
  },
  {
    id: 'astronomy_star',
    title: 'Yıldız Gözlemcisi',
    description: 'Astronomi deneylerini tamamladın!',
    emoji: '🌟',
    category: 'Astronomy',
    condition: (completed) => completed.length >= 2,
    unlocked: false,
  },
  {
    id: 'tech_genius',
    title: 'Teknoloji Dahisi',
    description: 'Teknoloji deneylerini tamamladın!',
    emoji: '💻',
    category: 'Technology',
    condition: (completed) => completed.length >= 2,
    unlocked: false,
  },
  {
    id: 'ai_pioneer',
    title: 'AI Öncüsü',
    description: 'Yapay zeka deneylerini tamamladın!',
    emoji: '🤖',
    category: 'AI',
    condition: (completed) => completed.length >= 2,
    unlocked: false,
  },
  {
    id: 'week_streak',
    title: 'Haftalık Çaba',
    description: '7 gün üst üste deney yaptın!',
    emoji: '🔥',
    condition: (_completed, stats) => stats.streakDays >= 7,
    unlocked: false,
  },
  {
    id: 'all_categories',
    title: 'Çok Yönlü Bilimci',
    description: 'Her kategoriden en az 1 deney tamamladın!',
    emoji: '🌈',
    condition: (completed) => completed.length >= 8, // Basitleştirilmiş
    unlocked: false,
  },
  {
    id: 'speed_scientist',
    title: 'Hızlı Bilimci',
    description: 'Bir günde 3 deney tamamladın!',
    emoji: '⚡',
    condition: (_completed, stats) => stats.totalTimeSpent >= 60,
    unlocked: false,
  }
];

class AchievementService {
  private userStats: UserStats = {
    completedExperiments: [],
    totalExperiments: 0,
    streakDays: 0,
    totalTimeSpent: 0,
  };

  constructor() {
    this.loadUserStats();
  }

  private loadUserStats() {
    const saved = localStorage.getItem('minilab:userStats');
    if (saved) {
      this.userStats = JSON.parse(saved);
    }
  }

  private saveUserStats() {
    localStorage.setItem('minilab:userStats', JSON.stringify(this.userStats));
  }

  completeExperiment(experimentId: number) {
    if (!this.userStats.completedExperiments.includes(experimentId)) {
      this.userStats.completedExperiments.push(experimentId);
      this.userStats.totalExperiments++;
      this.saveUserStats();
      this.checkAchievements();
    }
  }

  addTimeSpent(minutes: number) {
    this.userStats.totalTimeSpent += minutes;
    this.saveUserStats();
    this.checkAchievements();
  }

  private checkAchievements() {
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(this.userStats.completedExperiments, this.userStats)) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        this.showAchievementNotification(achievement);
      }
    });
  }

  private showAchievementNotification(achievement: Achievement) {
    // Toast notification göster
    const event = new CustomEvent('achievement:unlocked', { detail: achievement });
    window.dispatchEvent(event);
  }

  getAchievements(): Achievement[] {
    return achievements;
  }

  getUnlockedAchievements(): Achievement[] {
    return achievements.filter(a => a.unlocked);
  }

  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  getProgress(): { completed: number; total: number; percentage: number } {
    const unlockedCount = this.getUnlockedAchievements().length;
    return {
      completed: unlockedCount,
      total: achievements.length,
      percentage: Math.round((unlockedCount / achievements.length) * 100),
    };
  }
}

export const achievementService = new AchievementService();

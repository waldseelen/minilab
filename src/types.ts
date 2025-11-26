
export enum Category {
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology',
  Space = 'Astronomy',
  Tech = 'Technology',
  AI = 'AI',
  Environment = 'Environment',
  Robotics = 'Robotics'
}

export interface LocalizedText {
  tr: string;
  en: string;
}

export interface LearningCard {
  id: string;
  title: LocalizedText;
  content: LocalizedText;
  category: Category;
  ageGroup: '4-6' | '6-8' | '8-10';
  level: number;
  duration: string;
  emoji: string;
  tags: string[]; // Tags can remain simple strings or be localized, for simplicity we'll translate display logic
  type: 'Learn' | 'Experiment' | 'Simulation'; 
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

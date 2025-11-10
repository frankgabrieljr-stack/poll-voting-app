export interface Choice {
  id: string;
  text: string;
  votes: number;
}

export interface DesignOptions {
  theme: 'light' | 'dark' | 'colorful' | 'designer';
  primaryColor: string;
  fontStyle: 'sans' | 'serif' | 'mono';
  layout: 'card' | 'list' | 'compact';
  backgroundImage?: string; // URL of selected background image
}

export interface Poll {
  id: string;
  question: string;
  choices: Choice[];
  createdAt: Date;
  design: DesignOptions;
  title?: string; // Optional title for workspace management
  description?: string; // Optional description
  userId?: string; // User who created the poll
  sharedWith?: string[]; // Array of user emails who can access this poll
  permissions?: { [email: string]: 'view' | 'edit' | 'delete' }; // Permissions for shared users
}

export interface PollResults {
  question: string;
  totalVotes: number;
  results: {
    choice: string;
    votes: number;
    percentage: number;
  }[];
  exportedAt: string;
}

export interface ExportData {
  choice: string;
  votes: number;
  percentage: number;
}

export type ViewMode = 'landing' | 'create' | 'vote' | 'results' | 'workspace' | 'login' | 'register' | 'settings' | 'admin' | 'shared-poll';

export interface SavedPoll {
  id: string;
  title?: string;
  description?: string;
  question: string;
  choices: Choice[]; // Store full choices with votes
  createdAt: Date;
  lastModified: Date;
  totalVotes: number;
  design: DesignOptions;
  backgroundImage?: string; // Store background image URL
  userId?: string; // User who created the poll
  sharedWith?: string[]; // Array of user emails who can access this poll
  permissions?: { [email: string]: 'view' | 'edit' | 'delete' }; // Permissions for shared users
}
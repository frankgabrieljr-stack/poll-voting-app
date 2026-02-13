export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: Date;
  lastModified: Date;
  pollCount: number;
}

export interface WorkspaceSettings {
  defaultTheme: 'light' | 'dark' | 'colorful';
  defaultColorPalette: string;
  defaultTemplate: string;
  allowImageUploads: boolean;
  maxPollsPerWorkspace: number;
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: 'business' | 'creative' | 'minimal' | 'colorful' | 'professional';
  description: string;
  preview: string;
  colors: string[];
  layout: 'card' | 'list' | 'compact' | 'modern' | 'classic';
  fontStyle: 'sans' | 'serif' | 'mono';
  backgroundStyle: 'solid' | 'gradient' | 'pattern' | 'image';
}

export interface ColorPalette {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'minimal' | 'vibrant' | 'pastel' | 'neon' | 'tropical' | 'sunset';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  description: string;
}

export interface StockImage {
  id: string;
  url: string;
  thumbnail: string;
  category:
    | 'business'
    | 'nature'
    | 'abstract'
    | 'technology'
    | 'lifestyle'
    | 'education'
    | 'holiday'
    | 'winter'
    | 'vacation'
    | 'clothes';
  tags: string[];
  alt: string;
  attribution?: string;
}

export interface PollDesign {
  template: string;
  colorPalette: string;
  backgroundImage?: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontStyle: 'sans' | 'serif' | 'mono';
  layout: 'card' | 'list' | 'compact' | 'modern' | 'classic';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadow: 'none' | 'small' | 'medium' | 'large';
  animation: 'none' | 'fade' | 'slide' | 'bounce';
}





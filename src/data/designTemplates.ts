import { DesignTemplate, ColorPalette, StockImage } from '../types/workspace.types';

export const designTemplates: DesignTemplate[] = [
  {
    id: 'business-professional',
    name: 'Business Professional',
    category: 'business',
    description: 'Clean, professional design for corporate polls',
    preview: '💼',
    colors: ['#1e40af', '#3b82f6', '#60a5fa', '#dbeafe'],
    layout: 'modern',
    fontStyle: 'sans',
    backgroundStyle: 'solid'
  },
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    category: 'creative',
    description: 'Bold, colorful design for creative projects',
    preview: '🎨',
    colors: ['#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
    layout: 'card',
    fontStyle: 'sans',
    backgroundStyle: 'gradient'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'minimal',
    description: 'Simple, clean design with focus on content',
    preview: '⚪',
    colors: ['#374151', '#6b7280', '#9ca3af', '#f3f4f6'],
    layout: 'compact',
    fontStyle: 'sans',
    backgroundStyle: 'solid'
  },
  {
    id: 'colorful-gradient',
    name: 'Colorful Gradient',
    category: 'colorful',
    description: 'Eye-catching gradient backgrounds',
    preview: '🌈',
    colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    layout: 'card',
    fontStyle: 'sans',
    backgroundStyle: 'gradient'
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    category: 'professional',
    description: 'Formal design for business environments',
    preview: '🏢',
    colors: ['#1f2937', '#374151', '#4b5563', '#f9fafb'],
    layout: 'classic',
    fontStyle: 'serif',
    backgroundStyle: 'solid'
  }
];

export const colorPalettes: ColorPalette[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    category: 'professional',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: '#f0f9ff',
      text: '#0c4a6e'
    },
    description: 'Calming blue tones for professional polls'
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    category: 'vibrant',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fff7ed',
      text: '#9a3412'
    },
    description: 'Warm orange tones for energetic polls'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'professional',
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      accent: '#4ade80',
      background: '#f0fdf4',
      text: '#14532d'
    },
    description: 'Natural green tones for eco-friendly polls'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    category: 'creative',
    colors: {
      primary: '#9333ea',
      secondary: '#7c3aed',
      accent: '#a855f7',
      background: '#faf5ff',
      text: '#581c87'
    },
    description: 'Rich purple tones for creative polls'
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    category: 'pastel',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: '#fdf2f8',
      text: '#831843'
    },
    description: 'Soft pink tones for gentle polls'
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    category: 'minimal',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#4b5563',
      background: '#111827',
      text: '#f9fafb'
    },
    description: 'Dark theme for modern polls'
  }
];

export const stockImages: StockImage[] = [
  // Business theme
  {
    id: 'business-meeting',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop',
    category: 'business',
    tags: ['meeting', 'office', 'professional', 'team', 'work', 'business'],
    alt: 'Business meeting',
    attribution: 'Unsplash'
  },
  {
    id: 'business-office',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop',
    category: 'business',
    tags: ['office', 'desk', 'work', 'professional', 'business'],
    alt: 'Modern office',
    attribution: 'Unsplash'
  },
  {
    id: 'business-handshake',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=150&fit=crop',
    category: 'business',
    tags: ['handshake', 'deal', 'partnership', 'business', 'professional'],
    alt: 'Business handshake',
    attribution: 'Unsplash'
  },
  // Nature theme
  {
    id: 'nature-forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
    category: 'nature',
    tags: ['forest', 'nature', 'green', 'trees', 'outdoor', 'peaceful'],
    alt: 'Forest landscape',
    attribution: 'Unsplash'
  },
  {
    id: 'nature-ocean',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=150&fit=crop',
    category: 'nature',
    tags: ['ocean', 'beach', 'water', 'blue', 'calm', 'nature'],
    alt: 'Ocean waves',
    attribution: 'Unsplash'
  },
  {
    id: 'nature-mountain',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    category: 'nature',
    tags: ['mountain', 'peak', 'sky', 'nature', 'outdoor', 'adventure'],
    alt: 'Mountain peak',
    attribution: 'Unsplash'
  },
  // Creative/Fun theme
  {
    id: 'creative-paint',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=150&fit=crop',
    category: 'lifestyle',
    tags: ['paint', 'colorful', 'creative', 'art', 'fun', 'bright'],
    alt: 'Colorful paint',
    attribution: 'Unsplash'
  },
  {
    id: 'fun-party',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=200&h=150&fit=crop',
    category: 'lifestyle',
    tags: ['party', 'celebration', 'fun', 'colorful', 'happy', 'festive'],
    alt: 'Party celebration',
    attribution: 'Unsplash'
  },
  {
    id: 'creative-art',
    url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=150&fit=crop',
    category: 'lifestyle',
    tags: ['art', 'creative', 'colorful', 'design', 'fun', 'artistic'],
    alt: 'Colorful art',
    attribution: 'Unsplash'
  },
  // Technology theme
  {
    id: 'tech-abstract',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
    category: 'technology',
    tags: ['technology', 'abstract', 'digital', 'futuristic', 'modern', 'tech'],
    alt: 'Abstract technology',
    attribution: 'Unsplash'
  },
  {
    id: 'tech-code',
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=150&fit=crop',
    category: 'technology',
    tags: ['code', 'programming', 'computer', 'tech', 'digital', 'coding'],
    alt: 'Computer code',
    attribution: 'Unsplash'
  },
  {
    id: 'tech-device',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
    category: 'technology',
    tags: ['device', 'phone', 'modern', 'tech', 'digital', 'gadget'],
    alt: 'Modern device',
    attribution: 'Unsplash'
  },
  // Education theme
  {
    id: 'education-books',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop',
    category: 'education',
    tags: ['education', 'books', 'learning', 'study', 'school', 'knowledge'],
    alt: 'Education books',
    attribution: 'Unsplash'
  },
  {
    id: 'education-classroom',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=150&fit=crop',
    category: 'education',
    tags: ['classroom', 'school', 'education', 'learning', 'students', 'study'],
    alt: 'Classroom',
    attribution: 'Unsplash'
  },
  // Lifestyle theme
  {
    id: 'lifestyle-coffee',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=150&fit=crop',
    category: 'lifestyle',
    tags: ['coffee', 'lifestyle', 'relax', 'comfort', 'warm', 'cozy'],
    alt: 'Coffee cup',
    attribution: 'Unsplash'
  },
  {
    id: 'lifestyle-food',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop',
    category: 'lifestyle',
    tags: ['food', 'meal', 'delicious', 'lifestyle', 'eating', 'yummy'],
    alt: 'Delicious food',
    attribution: 'Unsplash'
  },
  // Abstract/Minimal theme
  {
    id: 'abstract-geometric',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=150&fit=crop',
    category: 'abstract',
    tags: ['abstract', 'geometric', 'pattern', 'art', 'minimal', 'simple'],
    alt: 'Abstract geometric pattern',
    attribution: 'Unsplash'
  },
  {
    id: 'minimal-white',
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&h=150&fit=crop',
    category: 'abstract',
    tags: ['minimal', 'clean', 'simple', 'white', 'modern', 'abstract'],
    alt: 'Minimal design',
    attribution: 'Unsplash'
  }
];

export const getTemplatesByCategory = (category: string) => {
  return designTemplates.filter(template => template.category === category);
};

export const getColorPalettesByCategory = (category: string) => {
  return colorPalettes.filter(palette => palette.category === category);
};

export const getStockImagesByCategory = (category: string) => {
  return stockImages.filter(image => image.category === category);
};





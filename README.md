# Poll Voting App

A modern, user-friendly poll voting application built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Poll Creation**: Create custom polls with multiple choice options
- ✅ **Design Customization**: Light/dark/colorful themes, color schemes, fonts, and layouts
- ✅ **Voting Interface**: Interactive voting with real-time updates
- ✅ **Results Visualization**: Charts, progress bars, and detailed statistics
- ✅ **Export Functionality**: CSV and JSON export options
- ✅ **Shareable Links**: Generate shareable poll links
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Smooth Animations**: Beautiful transitions and micro-interactions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite
- **Export**: Custom utilities for CSV/JSON

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd poll-voting-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploying to Production

🚀 **Ready to go live?** See our deployment guides:

- **[Quick Start Guide](./QUICK_START_DEPLOYMENT.md)** - Deploy in 5 minutes
- **[Full Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step instructions
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist

**Recommended Platforms:**
- **Vercel** (Recommended) - Zero config, automatic deployments
- **Netlify** - Great alternative with similar features

Both platforms offer:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Continuous deployment from GitHub
- ✅ Custom domain support

## Usage

### Creating a Poll

1. Enter your poll question
2. Add 2-10 choice options
3. Customize the design (optional)
4. Click "Create Poll"

### Voting

1. View the poll question and choices
2. Click on your preferred choice
3. See real-time vote updates
4. View results after voting

### Customizing Design

1. Click the "🎨 Design" button in the header
2. Choose from:
   - **Theme**: Light, Dark, or Colorful
   - **Primary Color**: Custom color picker
   - **Font Style**: Sans-serif, Serif, or Monospace
   - **Layout**: Card, List, or Compact view

### Exporting Results

1. After voting, click "View Results"
2. Use the export buttons to download:
   - **CSV**: Spreadsheet format with vote counts and percentages
   - **JSON**: Complete poll data in JSON format
   - **Share**: Copy shareable link to clipboard

## Project Structure

```
src/
├── components/          # React components
│   ├── PollCreator.tsx     # Poll creation form
│   ├── PollVoting.tsx      # Voting interface
│   ├── PollResults.tsx     # Results display
│   ├── DesignOptions.tsx   # Theme customization
│   └── ExportButtons.tsx   # Export functionality
├── context/             # React Context providers
│   ├── PollContext.tsx     # Poll state management
│   └── ThemeContext.tsx    # Theme state management
├── utils/               # Utility functions
│   ├── exportUtils.ts      # Export functionality
│   └── validation.ts       # Form validation
├── types/               # TypeScript type definitions
│   └── poll.types.ts       # Poll-related types
├── styles/              # CSS styles
│   └── themes.css          # Custom theme styles
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Features in Detail

### Poll Creation
- Dynamic form with add/remove choice buttons
- Form validation with error messages
- Minimum 2 choices, maximum 10 choices
- No duplicate choices allowed

### Design Customization
- **Themes**: Light mode, Dark mode, Colorful gradient
- **Colors**: Custom primary color picker
- **Fonts**: Sans-serif, Serif, Monospace options
- **Layouts**: Card view, List view, Compact view
- Live preview of design changes

### Voting System
- Real-time vote counting
- Visual feedback on vote submission
- Progress bars showing percentages
- Duplicate vote prevention (optional)
- Smooth animations and transitions

### Results & Export
- Live results with vote counts and percentages
- Visual charts and progress bars
- CSV export with formatted data
- JSON export with complete poll information
- Shareable link generation

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Optimized for tablets and desktops

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.





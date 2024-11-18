export type ThemePreset = {
  name: string
  gradient: string
  colors: {
    background: string
    primary: string
    secondary: string
    accent1: string
    accent2: string
  }
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  // Vibrant Themes
  forest: {
    name: 'Forest',
    gradient: 'linear-gradient(to bottom right, #5a3f37, #2c7744)',
    colors: {
      background: '#2c7744',
      primary: '#5a3f37',
      secondary: '#2c7744',
      accent1: '#3b8d99',
      accent2: '#6b4226'
    }
  },
  sunset: {
    name: 'Sunset',
    gradient: 'linear-gradient(to bottom right, #ff7e5f, #feb47b)',
    colors: {
      background: '#feb47b',
      primary: '#ff7e5f',
      secondary: '#feb47b',
      accent1: '#ff6f61',
      accent2: '#ff9a8b'
    }
  },
  ocean: {
    name: 'Ocean',
    gradient: 'linear-gradient(to bottom right, #2e3192, #1bffff)',
    colors: {
      background: '#1bffff',
      primary: '#2e3192',
      secondary: '#1bffff',
      accent1: '#1c92d2',
      accent2: '#f2fcfe'
    }
  },
  // ... other existing vibrant themes

  // Subtle Dark Themes
  obsidian: {
    name: 'Obsidian',
    gradient: 'linear-gradient(to bottom right, #13151a, #090909)',
    colors: {
      background: '#090909',
      primary: '#1a1d25',
      secondary: '#13151a',
      accent1: '#1f2937',
      accent2: '#161923'
    }
  },
  carbon: {
    name: 'Carbon',
    gradient: 'linear-gradient(to bottom right, #2b2b2b, #1c1c1c)',
    colors: {
      background: '#1c1c1c',
      primary: '#2b2b2b',
      secondary: '#1c1c1c',
      accent1: '#3a3a3a',
      accent2: '#2a2a2a'
    }
  },
  midnight: {
    name: 'Midnight',
    gradient: 'linear-gradient(to bottom right, #2c3e50, #000000)',
    colors: {
      background: '#000000',
      primary: '#2c3e50',
      secondary: '#000000',
      accent1: '#34495e',
      accent2: '#2c3e50'
    }
  },
  // ... other existing subtle dark themes
}
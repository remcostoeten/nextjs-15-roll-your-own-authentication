// Vercel/Midday/Resend inspired theme
export const theme = {
  // Colors
  colors: {
    primary: '#000000', // Black for primary actions (Vercel style)
    primaryHover: '#333333',
    text: '#000000',
    textSecondary: '#666666',
    textMuted: '#888888',
    background: '#fafafa', // Very light gray background (like Vercel)
    backgroundCard: '#ffffff',
    border: '#eaeaea', // Light gray border (like Vercel)
    borderFocus: '#000000', // Black border on focus
    error: '#ff0000',
    success: '#0070f3', // Vercel blue
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Borders
  border: {
    radius: '0.25rem', // Slightly rounded corners (Vercel style)
    width: '1px',
    style: 'solid',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  // Transitions
  transitions: {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease',
  },
}; 
# Dark/Light Mode Theme Implementation

## Overview
This document describes the light/dark mode toggle functionality implemented in the DevConnect project.

## Files Created/Modified

### New Files Created:

1. **`src/context/ThemeContext.tsx`** - Theme context provider
   - Manages theme state (light/dark)
   - Persists theme preference to localStorage
   - Respects system preference on first load
   - Provides `useTheme()` hook for consuming components

2. **`src/theme.css`** - Theme color definitions
   - Defines CSS variables for both light and dark modes
   - Contains color overrides for Tailwind classes
   - Smooth transitions between theme changes

### Modified Files:

1. **`src/main.tsx`** - Updated to include ThemeProvider
   - Added import for `theme.css`
   - Wrapped app with `<ThemeProvider>` context

2. **`src/components/Navbar.tsx`** - Added theme toggle button
   - Imported `useTheme` hook
   - Imported `Sun` and `Moon` icons from lucide-react
   - Added theme toggle button (desktop and mobile views)
   - Button shows sun icon in dark mode, moon icon in light mode

## How It Works

### Theme Context (`ThemeContext.tsx`)
```tsx
- Reads theme from localStorage or system preference
- Updates localStorage when theme changes
- Adds 'light' or 'dark' class to <html> element
- Exports useTheme() hook for components
```

### CSS Variables System (`theme.css`)
The app uses CSS custom properties (variables) that change based on theme:

**Dark Mode (Default):**
- Background: slate-950 (#0f172a)
- Text: white/light colors
- Accents: cyan colors

**Light Mode:**
- Background: light grays (slate-100, #f1f5f9)
- Text: dark colors (slate-900, #0f172a)
- Accents: darker cyan variants

### Color Mappings
The theme.css file maps Tailwind utility classes to appropriate light mode colors:
- `bg-slate-950` → light gray background
- `text-white` → dark text
- `text-cyan-300` → darker cyan
- `border-cyan-900/30` → light cyan border with opacity

## Usage in Components

### Using the Theme Hook
```tsx
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
    );
};
```

### Accessing Current Theme
- `theme`: 'light' | 'dark' - Current theme
- `toggleTheme()`: Function to toggle between themes

## Features

✅ **Persistent Storage**: Theme preference is saved to localStorage
✅ **System Preference**: Respects user's system color scheme preference on first visit
✅ **Smooth Transitions**: CSS transitions for theme changes
✅ **Mobile Friendly**: Works on desktop and mobile devices
✅ **Icon Toggle**: Shows sun icon in dark mode, moon icon in light mode
✅ **Full Coverage**: All colors updated across the application

## Theme Persistence

- Theme choice is saved to `localStorage` with key `"theme"`
- On page reload, the saved theme is restored automatically
- If no saved theme, the system preference is used
- If no system preference detected, defaults to light mode

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties (CSS Variables)
- localStorage
- `matchMedia()` API for system preference detection

## Future Enhancements

Potential improvements:
1. Add animated transitions when switching themes
2. Implement theme-specific images/logos
3. Add more theme options (e.g., auto, custom)
4. Persist theme preference in user database (authenticated users)
5. Add theme preview before applying

## Testing the Feature

1. Click the sun/moon icon in the navbar (top-right on desktop, or in mobile menu)
2. Page colors should smoothly transition
3. Refresh the page - theme preference should persist
4. Open in a new private/incognito window - should use system preference

## Color Reference

### Dark Mode (Default)
- Primary Background: `#0f172a` (slate-950)
- Secondary Background: `#1e293b` (slate-900)
- Primary Text: `#f8fafc` (white)
- Secondary Text: `#cbd5e1` (gray-300)
- Accent: `#06b6d4` (cyan-400)

### Light Mode
- Primary Background: `#ffffff` or `#f1f5f9` (white/light gray)
- Secondary Background: `#f8fafc` (slate-50)
- Primary Text: `#0f172a` (slate-900)
- Secondary Text: `#475569` (gray-700)
- Accent: `#0891b2` (cyan-600)

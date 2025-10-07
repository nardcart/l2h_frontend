# Logo Configuration Guide

## Overview
The logo system has been made configurable so you can easily change your logo without modifying any component code. Simply update the configuration file to change your logo.

## Files Created
- `src/config/logo.tsx` - Logo configuration
- `src/components/Logo.tsx` - Logo component
- Updated `src/components/Navigation.tsx` - Now uses the configurable logo

## How to Change Your Logo

### Option 1: Use an Image Logo
1. Place your logo image in the `public` folder (e.g., `public/logo.png`)
2. Edit `src/config/logo.tsx` and change the `logoConfig`:

```typescript
export const logoConfig: LogoConfig = {
  type: 'image',
  imageUrl: '/logo.png', // Path to your image in public folder
  imageAlt: 'Your Company Logo',
  width: '120px',
  height: '40px',
  linkClassName: 'hover-scale',
};
```

### Option 2: Use Text Only Logo
Edit `src/config/logo.tsx`:

```typescript
export const logoConfig: LogoConfig = {
  type: 'text-only',
  text: 'Your Company Name',
  textClassName: 'text-2xl font-bold text-blue-600',
  linkClassName: 'hover-scale',
};
```

### Option 3: Use Icon + Text Logo (Current Setup)
The current setup is already using this. To modify:

```typescript
import { YourIcon } from 'lucide-react'; // Import your desired icon

export const logoConfig: LogoConfig = {
  type: 'icon-text',
  icon: YourIcon, // Change the icon
  iconClassName: 'w-6 h-6 text-white',
  text: 'Your Company', // Change the text
  textClassName: 'text-xl font-bold text-gray-900',
  containerClassName: 'w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center',
  linkClassName: 'flex items-center space-x-3 hover-scale',
};
```

## Pre-configured Examples
The config file includes several pre-made configurations you can use:
- `imageLogoConfig` - For image logos
- `textOnlyLogoConfig` - For text-only logos  
- `alternativeIconTextConfig` - Alternative icon+text styling

To use any of these, simply change the export:
```typescript
export const logoConfig = imageLogoConfig; // Use image logo
```

## Styling Classes
You can customize the appearance using Tailwind CSS classes in the configuration:
- `linkClassName` - Styles the clickable area
- `containerClassName` - Styles the icon container (for icon-text type)
- `iconClassName` - Styles the icon
- `textClassName` - Styles the text

## Tips
- Logo changes are applied immediately after saving the config file
- Keep image logos under 200KB for best performance  
- Use SVG format for crisp logos at all sizes
- Test your logo on both light and dark backgrounds



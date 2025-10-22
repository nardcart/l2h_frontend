import { BookOpen, LucideIcon } from 'lucide-react';

export interface LogoConfig {
  type: 'image' | 'icon-text' | 'text-only';
  // For image logos
  imageUrl?: string;
  imageAlt?: string;
  // For icon + text logos
  icon?: LucideIcon;
  iconClassName?: string;
  text?: string;
  textClassName?: string;
  // Common properties
  containerClassName?: string;
  linkClassName?: string;
  width?: string;
  height?: string;
}

// Default logo configuration - Change this to customize your logo
export const logoConfig: LogoConfig = {
  type: 'image', // Options: 'image', 'icon-text', 'text-only'
  
  // Image Configuration (L2H Logo)
  imageUrl: '/images/logo.png',
  imageAlt: 'L2H - Low to High Upskilling Courses',
  width: '120px',
  height: '40px',
  linkClassName: 'flex items-center hover-scale transition-all duration-300',

  // OLD Icon + Text Configuration (commented out)
  // icon: BookOpen,
  // iconClassName: 'w-5 h-5 text-primary-foreground',
  // text: 'L2H',
  // textClassName: 'text-xl font-bold gradient-primary bg-clip-text text-transparent',
  // containerClassName: 'w-8 h-8 gradient-primary rounded-lg flex items-center justify-center',
  // linkClassName: 'flex items-center space-x-2 hover-scale',
  
  // Text Only Configuration (uncomment to use text only)
  // text: 'L2H Education',
  // textClassName: 'text-2xl font-bold gradient-primary bg-clip-text text-transparent',
  // linkClassName: 'hover-scale',
};

// Alternative logo configurations you can switch to:

// Example 1: Image Logo
export const imageLogoConfig: LogoConfig = {
  type: 'image',
  imageUrl: '/logo.png', // Place your logo in the public folder
  imageAlt: 'L2H Logo',
  width: '120px',
  height: '40px',
  linkClassName: 'hover-scale',
};

// Example 2: Text Only Logo
export const textOnlyLogoConfig: LogoConfig = {
  type: 'text-only',
  text: 'L2H Education',
  textClassName: 'text-2xl font-bold gradient-primary bg-clip-text text-transparent',
  linkClassName: 'hover-scale',
};

// Example 3: Different Icon + Text
export const alternativeIconTextConfig: LogoConfig = {
  type: 'icon-text',
  icon: BookOpen, // You can import and use different icons from lucide-react
  iconClassName: 'w-6 h-6 text-white',
  text: 'Learn2Hire',
  textClassName: 'text-xl font-bold text-gray-900',
  containerClassName: 'w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center',
  linkClassName: 'flex items-center space-x-3 hover-scale',
};

/* 
HOW TO CHANGE THE LOGO:

1. FOR IMAGE LOGO:
   - Place your logo image in the public folder (e.g., public/logo.png)
   - Change logoConfig to imageLogoConfig or modify logoConfig:
   
   export const logoConfig: LogoConfig = {
     type: 'image',
     imageUrl: '/your-logo.png',
     imageAlt: 'Your Company Logo',
     width: '120px',
     height: '40px',
     linkClassName: 'hover-scale',
   };

2. FOR TEXT ONLY LOGO:
   - Change logoConfig to textOnlyLogoConfig or modify logoConfig:
   
   export const logoConfig: LogoConfig = {
     type: 'text-only',
     text: 'Your Company Name',
     textClassName: 'text-2xl font-bold text-blue-600',
     linkClassName: 'hover-scale',
   };

3. FOR ICON + TEXT LOGO:
   - Import your desired icon from lucide-react
   - Modify the logoConfig as needed
   
   import { YourIcon } from 'lucide-react';
   
   export const logoConfig: LogoConfig = {
     type: 'icon-text',
     icon: YourIcon,
     iconClassName: 'w-6 h-6 text-white',
     text: 'Your Company',
     textClassName: 'text-xl font-bold text-gray-900',
     // ... other styling
   };

Simply modify the logoConfig object above and the logo will update throughout your app!
*/



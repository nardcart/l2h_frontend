# Floating Contact Button Component Documentation

A modern, interactive floating action button (FAB) component for Next.js that provides quick access to WhatsApp and phone contact options.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Component Code](#component-code)
- [Usage Examples](#usage-examples)
- [Props API](#props-api)
- [Styling](#styling)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)

---

## Overview

This component creates a fixed-position floating button that expands on hover or click to reveal WhatsApp and phone call options. It's perfect for websites that want to provide easy customer contact methods.

### Visual Behavior

- **Default State**: Circular button with custom image icon
- **Hover/Click**: Expands upward (dropup) showing WhatsApp and Call options
- **Position**: Fixed at bottom-left or bottom-right of viewport
- **Responsive**: Adjusts size and spacing on mobile devices

---

## Features

✅ **WhatsApp Integration** - Direct link to WhatsApp with pre-filled message  
✅ **Click-to-Call** - One-tap phone dialing on mobile devices  
✅ **Smooth Animations** - Fade and slide transitions  
✅ **Mobile Responsive** - Optimized for all screen sizes  
✅ **Accessible** - Full ARIA labels and keyboard navigation  
✅ **TypeScript Support** - Fully typed props and components  
✅ **Customizable** - Props for all major configurations  
✅ **Modern React** - Uses hooks and functional components  
✅ **No External Dependencies** - Only requires `react-icons`

---

## Installation

### Step 1: Install Dependencies

```bash
npm install react-icons
# or
yarn add react-icons
# or
pnpm add react-icons
```

### Step 2: Copy Component Files

Choose one of three versions based on your preference:

#### Option A: TypeScript with Inline Styles (Recommended)
Copy `FloatingContactButton.tsx` to your components folder.

#### Option B: JavaScript with Inline Styles
Copy `FloatingContactButton.jsx` to your components folder.

#### Option C: TypeScript with CSS Modules
Copy both:
- `FloatingContactButtonWithCSS.tsx`
- `FloatingContactButton.module.css`

---

## Component Code

### Version 1: TypeScript with Inline Styles

```typescript
'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

interface FloatingContactButtonProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  whatsappMessage?: string;
  position?: 'left' | 'right';
  buttonImage?: string;
}

const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ 
  whatsappNumber = '917065922160', 
  phoneNumber = '+917065922160',
  whatsappMessage = 'Hi.',
  position = 'left',
  buttonImage = 'http://i.imgur.com/DvHeluF.png'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropup = (): void => {
    setIsOpen(!isOpen);
  };

  const showDropup = (): void => {
    setIsOpen(true);
  };

  const hideDropup = (): void => {
    setIsOpen(false);
  };

  const positionClass = position === 'right' ? 'right-10' : 'left-10';

  return (
    <>
      <style jsx>{`
        .dropup {
          position: fixed;
          bottom: 40px;
          z-index: 1000;
        }

        .dropup-btn {
          width: 60px;
          height: 60px;
          background-color: #25d366;
          color: #fff;
          border: none;
          border-radius: 50px;
          text-align: center;
          font-size: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .dropup-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .dropup-btn img {
          width: 100%;
          height: auto;
          border-radius: 50%;
          overflow: hidden;
        }

        .dropup-content {
          position: absolute;
          bottom: 70px;
          left: 0;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
          border-radius: 8px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .dropup-content.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .dropup-content a {
          color: #333;
          padding: 12px 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          cursor: pointer;
          background-color: white;
          border: none;
          outline: none;
          transition: background-color 0.2s ease;
        }

        .dropup-content a:hover {
          background-color: #f1f1f1;
        }

        .contact-icon {
          font-size: 24px;
          margin-right: 12px;
          min-width: 24px;
        }

        .whatsapp-icon {
          color: #25d366;
        }

        .phone-icon {
          color: #4CAF50;
          transform: rotate(100deg);
        }

        .contact-text {
          font-size: 14px;
          color: black;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dropup {
            bottom: 20px;
          }

          .dropup-btn {
            width: 50px;
            height: 50px;
          }

          .dropup-content {
            min-width: 140px;
          }

          .contact-icon {
            font-size: 20px;
          }

          .contact-text {
            font-size: 12px;
          }
        }
      `}</style>

      <div 
        className={`dropup ${positionClass}`}
        onMouseEnter={showDropup}
        onMouseLeave={hideDropup}
      >
        <button 
          className="dropup-btn"
          onClick={toggleDropup}
          aria-label="Contact us"
        >
          <img 
            src={buttonImage} 
            alt="Contact" 
          />
        </button>

        <div 
          className={`dropup-content ${isOpen ? 'show' : ''}`}
          onMouseEnter={showDropup}
          onMouseLeave={hideDropup}
        >
          <a
            href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp className="contact-icon whatsapp-icon" />
            <span className="contact-text">WhatsApp</span>
          </a>

          <a
            href={`tel:${phoneNumber}`}
            aria-label="Call us"
          >
            <FaPhone className="contact-icon phone-icon" />
            <span className="contact-text">Call Us</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default FloatingContactButton;
```

### Version 2: JavaScript with Inline Styles

```javascript
'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const FloatingContactButton = ({ 
  whatsappNumber = '917065922160', 
  phoneNumber = '+917065922160',
  whatsappMessage = 'Hi.',
  position = 'left',
  buttonImage = 'http://i.imgur.com/DvHeluF.png'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropup = () => {
    setIsOpen(!isOpen);
  };

  const showDropup = () => {
    setIsOpen(true);
  };

  const hideDropup = () => {
    setIsOpen(false);
  };

  const positionClass = position === 'right' ? 'right-10' : 'left-10';

  return (
    <>
      <style jsx>{`
        .dropup {
          position: fixed;
          bottom: 40px;
          z-index: 1000;
        }

        .dropup-btn {
          width: 60px;
          height: 60px;
          background-color: #25d366;
          color: #fff;
          border: none;
          border-radius: 50px;
          text-align: center;
          font-size: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .dropup-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .dropup-btn img {
          width: 100%;
          height: auto;
          border-radius: 50%;
          overflow: hidden;
        }

        .dropup-content {
          position: absolute;
          bottom: 70px;
          left: 0;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
          border-radius: 8px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .dropup-content.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .dropup-content a {
          color: #333;
          padding: 12px 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          cursor: pointer;
          background-color: white;
          border: none;
          outline: none;
          transition: background-color 0.2s ease;
        }

        .dropup-content a:hover {
          background-color: #f1f1f1;
        }

        .contact-icon {
          font-size: 24px;
          margin-right: 12px;
          min-width: 24px;
        }

        .whatsapp-icon {
          color: #25d366;
        }

        .phone-icon {
          color: #4CAF50;
          transform: rotate(100deg);
        }

        .contact-text {
          font-size: 14px;
          color: black;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dropup {
            bottom: 20px;
          }

          .dropup-btn {
            width: 50px;
            height: 50px;
          }

          .dropup-content {
            min-width: 140px;
          }

          .contact-icon {
            font-size: 20px;
          }

          .contact-text {
            font-size: 12px;
          }
        }
      `}</style>

      <div 
        className={`dropup ${positionClass}`}
        onMouseEnter={showDropup}
        onMouseLeave={hideDropup}
      >
        <button 
          className="dropup-btn"
          onClick={toggleDropup}
          aria-label="Contact us"
        >
          <img 
            src={buttonImage} 
            alt="Contact" 
          />
        </button>

        <div 
          className={`dropup-content ${isOpen ? 'show' : ''}`}
          onMouseEnter={showDropup}
          onMouseLeave={hideDropup}
        >
          <a
            href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp className="contact-icon whatsapp-icon" />
            <span className="contact-text">WhatsApp</span>
          </a>

          <a
            href={`tel:${phoneNumber}`}
            aria-label="Call us"
          >
            <FaPhone className="contact-icon phone-icon" />
            <span className="contact-text">Call Us</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default FloatingContactButton;
```

### Version 3: CSS Module Version

**FloatingContactButton.module.css**

```css
.dropup {
  position: fixed;
  bottom: 40px;
  z-index: 1000;
}

.left {
  left: 40px;
}

.right {
  right: 40px;
}

.dropupBtn {
  width: 60px;
  height: 60px;
  background-color: #25d366;
  color: #fff;
  border: none;
  border-radius: 50px;
  text-align: center;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.dropupBtn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.dropupBtn img {
  width: 100%;
  height: auto;
  border-radius: 50%;
  overflow: hidden;
}

.dropupContent {
  position: absolute;
  bottom: 70px;
  left: 0;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: all 0.3s ease;
}

.dropupContent.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.contactLink {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: white;
  border: none;
  outline: none;
  transition: background-color 0.2s ease;
}

.contactLink:hover {
  background-color: #f1f1f1;
}

.contactIcon {
  font-size: 24px;
  margin-right: 12px;
  min-width: 24px;
}

.whatsappIcon {
  color: #25d366;
}

.phoneIcon {
  color: #4CAF50;
  transform: rotate(100deg);
}

.contactText {
  font-size: 14px;
  color: black;
  font-weight: 500;
}

@media (max-width: 768px) {
  .dropup {
    bottom: 20px;
  }

  .left {
    left: 20px;
  }

  .right {
    right: 20px;
  }

  .dropupBtn {
    width: 50px;
    height: 50px;
  }

  .dropupContent {
    min-width: 140px;
  }

  .contactIcon {
    font-size: 20px;
  }

  .contactText {
    font-size: 12px;
  }
}
```

**FloatingContactButtonWithCSS.tsx**

```typescript
'use client';

import { useState } from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import styles from './FloatingContactButton.module.css';

interface FloatingContactButtonProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  whatsappMessage?: string;
  position?: 'left' | 'right';
  buttonImage?: string;
}

const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ 
  whatsappNumber = '917065922160', 
  phoneNumber = '+917065922160',
  whatsappMessage = 'Hi.',
  position = 'left',
  buttonImage = 'http://i.imgur.com/DvHeluF.png'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropup = (): void => {
    setIsOpen(!isOpen);
  };

  const showDropup = (): void => {
    setIsOpen(true);
  };

  const hideDropup = (): void => {
    setIsOpen(false);
  };

  return (
    <div 
      className={`${styles.dropup} ${styles[position]}`}
      onMouseEnter={showDropup}
      onMouseLeave={hideDropup}
    >
      <button 
        className={styles.dropupBtn}
        onClick={toggleDropup}
        aria-label="Contact us"
      >
        <img 
          src={buttonImage} 
          alt="Contact" 
        />
      </button>

      <div 
        className={`${styles.dropupContent} ${isOpen ? styles.show : ''}`}
        onMouseEnter={showDropup}
        onMouseLeave={hideDropup}
      >
        <a
          href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
          aria-label="Contact via WhatsApp"
        >
          <FaWhatsapp className={`${styles.contactIcon} ${styles.whatsappIcon}`} />
          <span className={styles.contactText}>WhatsApp</span>
        </a>

        <a
          href={`tel:${phoneNumber}`}
          className={styles.contactLink}
          aria-label="Call us"
        >
          <FaPhone className={`${styles.contactIcon} ${styles.phoneIcon}`} />
          <span className={styles.contactText}>Call Us</span>
        </a>
      </div>
    </div>
  );
};

export default FloatingContactButton;
```

---

## Usage Examples

### Example 1: Basic Usage in a Page

```typescript
// app/page.tsx
import FloatingContactButton from '@/components/FloatingContactButton';

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Our Website</h1>
      <p>Your content here...</p>
      
      <FloatingContactButton />
    </main>
  );
}
```

### Example 2: In Root Layout (Recommended - Shows on All Pages)

```typescript
// app/layout.tsx
import FloatingContactButton from '@/components/FloatingContactButton';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* This will appear on all pages */}
        <FloatingContactButton 
          whatsappNumber="917065922160"
          phoneNumber="+917065922160"
          whatsappMessage="Hi, I would like to inquire about your services."
          position="left"
        />
      </body>
    </html>
  );
}
```

### Example 3: With Environment Variables

**.env.local**
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=917065922160
NEXT_PUBLIC_PHONE_NUMBER=+917065922160
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello! I need assistance with your services.
```

**app/layout.tsx**
```typescript
import FloatingContactButton from '@/components/FloatingContactButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        
        <FloatingContactButton 
          whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
          phoneNumber={process.env.NEXT_PUBLIC_PHONE_NUMBER}
          whatsappMessage={process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE}
        />
      </body>
    </html>
  );
}
```

### Example 4: Position on Right Side

```typescript
import FloatingContactButton from '@/components/FloatingContactButton';

export default function ContactPage() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>Get in touch with our team</p>
      
      <FloatingContactButton 
        position="right"
        whatsappMessage="I'm on the contact page and need help"
      />
    </main>
  );
}
```

### Example 5: E-commerce Store

```typescript
import FloatingContactButton from '@/components/FloatingContactButton';

export default function ProductPage() {
  return (
    <>
      <div className="product-details">
        <h1>Product Name</h1>
        <p>Product description...</p>
      </div>
      
      <FloatingContactButton 
        whatsappNumber="919876543210"
        phoneNumber="+919876543210"
        whatsappMessage="Hi, I have a question about this product"
        position="right"
      />
    </>
  );
}
```

### Example 6: Custom Button Image

```typescript
import FloatingContactButton from '@/components/FloatingContactButton';

export default function CustomPage() {
  return (
    <>
      <main>
        <h1>My Page</h1>
      </main>
      
      <FloatingContactButton 
        whatsappNumber="917065922160"
        phoneNumber="+917065922160"
        buttonImage="/images/custom-contact-icon.png"
      />
    </>
  );
}
```

### Example 7: Conditional Rendering

```typescript
// components/ConditionalFloatingButton.tsx
'use client';

import { usePathname } from 'next/navigation';
import FloatingContactButton from './FloatingContactButton';

export default function ConditionalFloatingButton() {
  const pathname = usePathname();
  
  // Only show on specific pages
  const showOnPages = ['/', '/contact', '/products', '/support'];
  const shouldShow = showOnPages.includes(pathname);
  
  if (!shouldShow) return null;
  
  return (
    <FloatingContactButton 
      whatsappNumber="917065922160"
      phoneNumber="+917065922160"
      whatsappMessage="Hi! I need some help."
    />
  );
}

// Then use in layout:
// app/layout.tsx
import ConditionalFloatingButton from '@/components/ConditionalFloatingButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConditionalFloatingButton />
      </body>
    </html>
  );
}
```

### Example 8: Different Settings Per Page

```typescript
// app/support/page.tsx
import FloatingContactButton from '@/components/FloatingContactButton';

export default function SupportPage() {
  return (
    <>
      <main>
        <h1>Customer Support</h1>
      </main>
      
      <FloatingContactButton 
        whatsappNumber="919999999999"
        phoneNumber="+919999999999"
        whatsappMessage="I need technical support"
        position="right"
      />
    </>
  );
}

// app/sales/page.tsx
import FloatingContactButton from '@/components/FloatingContactButton';

export default function SalesPage() {
  return (
    <>
      <main>
        <h1>Sales Inquiries</h1>
      </main>
      
      <FloatingContactButton 
        whatsappNumber="918888888888"
        phoneNumber="+918888888888"
        whatsappMessage="I'm interested in your products"
        position="left"
      />
    </>
  );
}
```

---

## Props API

### FloatingContactButton Props

| Prop Name | Type | Default Value | Required | Description |
|-----------|------|--------------|----------|-------------|
| `whatsappNumber` | `string` | `'917065922160'` | No | WhatsApp number with country code (no + or spaces). Format: `917065922160` |
| `phoneNumber` | `string` | `'+917065922160'` | No | Phone number for click-to-call with country code. Format: `+917065922160` |
| `whatsappMessage` | `string` | `'Hi.'` | No | Pre-filled message that appears in WhatsApp chat |
| `position` | `'left' \| 'right'` | `'left'` | No | Position of the button on the screen |
| `buttonImage` | `string` | `'http://i.imgur.com/DvHeluF.png'` | No | URL or path to custom button image |

### Props Examples

```typescript
// Minimal usage (uses all defaults)
<FloatingContactButton />

// Custom WhatsApp number
<FloatingContactButton 
  whatsappNumber="919876543210"
/>

// Custom message
<FloatingContactButton 
  whatsappMessage="Hello! I need help with my order #12345"
/>

// Right side positioning
<FloatingContactButton 
  position="right"
/>

// All props customized
<FloatingContactButton 
  whatsappNumber="919876543210"
  phoneNumber="+919876543210"
  whatsappMessage="I need assistance"
  position="right"
  buttonImage="/images/contact.png"
/>
```

### TypeScript Interface

```typescript
interface FloatingContactButtonProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  whatsappMessage?: string;
  position?: 'left' | 'right';
  buttonImage?: string;
}
```

---

## Styling

### Color Customization

The component uses the following color scheme by default:

- **WhatsApp Green**: `#25d366`
- **Phone Green**: `#4CAF50`
- **Background**: `white`
- **Text**: `black`
- **Hover**: `#f1f1f1`

To customize colors, modify the inline styles or CSS module:

```typescript
// In the component, modify these style values:
.dropup-btn {
  background-color: #YOUR_BRAND_COLOR; /* Change button background */
}

.whatsapp-icon {
  color: #YOUR_BRAND_COLOR; /* Change WhatsApp icon color */
}

.phone-icon {
  color: #YOUR_BRAND_COLOR; /* Change phone icon color */
}
```

### Size Customization

Default sizes:
- **Desktop Button**: 60px × 60px
- **Mobile Button**: 50px × 50px
- **Icon Size Desktop**: 24px
- **Icon Size Mobile**: 20px

To change sizes:

```css
.dropup-btn {
  width: 70px;  /* Increase button size */
  height: 70px;
}

.contact-icon {
  font-size: 28px;  /* Increase icon size */
}
```

### Position Customization

Adjust the fixed positioning:

```css
.dropup {
  bottom: 60px;  /* Move up/down */
  left: 60px;    /* Move left/right */
}
```

### Animation Customization

Modify transition speeds:

```css
.dropup-btn {
  transition: all 0.5s ease;  /* Slower button animation */
}

.dropup-content {
  transition: all 0.2s ease;  /* Faster dropdown animation */
}
```

---

## Customization

### Adding More Contact Options

You can extend the component to include additional contact methods:

```typescript
// Add Email option
<a
  href="mailto:support@example.com"
  className={styles.contactLink}
  aria-label="Email us"
>
  <FaEnvelope className={styles.contactIcon} />
  <span className={styles.contactText}>Email</span>
</a>

// Add Telegram option
<a
  href="https://t.me/yourusername"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.contactLink}
  aria-label="Contact on Telegram"
>
  <FaTelegram className={styles.contactIcon} />
  <span className={styles.contactText}>Telegram</span>
</a>

// Add Messenger option
<a
  href="https://m.me/yourpage"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.contactLink}
  aria-label="Message on Messenger"
>
  <FaFacebookMessenger className={styles.contactIcon} />
  <span className={styles.contactText}>Messenger</span>
</a>
```

### Using Different Icons

```bash
# Install additional icon packs
npm install @react-icons/all-files
```

```typescript
import { IoLogoWhatsapp } from '@react-icons/all-files/io5/IoLogoWhatsapp';
import { IoCall } from '@react-icons/all-files/io5/IoCall';
```

### Creating Theme Variants

```typescript
// components/FloatingContactButton.tsx
interface FloatingContactButtonProps {
  // ... other props
  theme?: 'default' | 'dark' | 'brand';
}

const themes = {
  default: {
    buttonBg: '#25d366',
    iconColor: '#25d366',
    contentBg: 'white',
  },
  dark: {
    buttonBg: '#1a1a1a',
    iconColor: '#25d366',
    contentBg: '#2a2a2a',
  },
  brand: {
    buttonBg: '#yourBrandColor',
    iconColor: '#yourBrandColor',
    contentBg: 'white',
  },
};

// Then use the theme object in your styles
```

### Adding Analytics Tracking

```typescript
<a
  href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contact via WhatsApp"
  onClick={() => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact', {
        method: 'whatsapp',
      });
    }
    
    // Or custom tracking
    console.log('WhatsApp link clicked');
  }}
>
  <FaWhatsapp className="contact-icon whatsapp-icon" />
  <span className="contact-text">WhatsApp</span>
</a>
```

---

## Browser Support

### Desktop Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari iOS 14+
- ✅ Samsung Internet
- ✅ Firefox Mobile
- ✅ Opera Mobile

### Features Used
- CSS Fixed Positioning
- CSS Transitions & Transforms
- CSS Flexbox
- React Hooks (useState)
- ES6+ JavaScript

---

## Accessibility

### ARIA Support

The component includes proper ARIA labels:

```typescript
<button 
  aria-label="Contact us"  // Describes button purpose
>

<a 
  aria-label="Contact via WhatsApp"  // Describes link purpose
>

<a 
  aria-label="Call us"  // Describes link purpose
>
```

### Keyboard Navigation

- **Tab**: Navigate to button
- **Enter/Space**: Toggle dropdown
- **Tab**: Navigate through contact options
- **Enter**: Activate selected contact method
- **Escape**: Close dropdown (can be added)

### Screen Reader Support

All interactive elements have descriptive labels that screen readers will announce.

### Focus States

Add visible focus styles for keyboard users:

```css
.dropup-btn:focus {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

.dropup-content a:focus {
  outline: 2px solid #4CAF50;
  outline-offset: -2px;
}
```

### Color Contrast

- Button text meets WCAG AA standards
- Icon colors are distinguishable
- Hover states provide clear visual feedback

---

## Troubleshooting

### Issue: Button Not Showing

**Solution 1**: Check z-index conflicts
```css
.dropup {
  z-index: 9999; /* Increase if needed */
}
```

**Solution 2**: Ensure component is imported correctly
```typescript
import FloatingContactButton from '@/components/FloatingContactButton';
```

**Solution 3**: Check if component is rendered
```typescript
// Add to your layout/page
<FloatingContactButton />
```

### Issue: WhatsApp Link Not Working

**Solution**: Check phone number format
```typescript
// Correct format (no spaces, no +, include country code)
whatsappNumber="917065922160"

// Incorrect formats:
// whatsappNumber="+91 7065922160"  ❌
// whatsappNumber="7065922160"      ❌ (missing country code)
```

### Issue: Hover Not Working on Mobile

**Solution**: This is expected - mobile uses click/tap instead
```typescript
// The onClick handler works on mobile
<button onClick={toggleDropup}>
```

### Issue: Styling Conflicts

**Solution 1**: Use CSS modules version
```typescript
import FloatingContactButton from '@/components/FloatingContactButtonWithCSS';
```

**Solution 2**: Add !important to critical styles
```css
.dropup {
  position: fixed !important;
  z-index: 1000 !important;
}
```

### Issue: Icons Not Displaying

**Solution**: Install react-icons
```bash
npm install react-icons
# or
yarn add react-icons
```

### Issue: TypeScript Errors

**Solution**: Ensure proper types
```typescript
// If using JavaScript, rename to .jsx instead of .tsx
// Or install types:
npm install --save-dev @types/react @types/node
```

### Issue: Button Covers Content

**Solution 1**: Adjust position
```typescript
<FloatingContactButton position="right" />
```

**Solution 2**: Add margin to page content
```css
.page-content {
  margin-bottom: 100px; /* Give space for button */
}
```

### Issue: Next.js "use client" Error

**Solution**: Ensure the file starts with `'use client';`
```typescript
'use client';  // Must be first line

import { useState } from 'react';
// ... rest of code
```

---

## Advanced Configurations

### Global Configuration with Context

```typescript
// context/ContactContext.tsx
'use client';

import { createContext, useContext } from 'react';

interface ContactConfig {
  whatsappNumber: string;
  phoneNumber: string;
  defaultMessage: string;
}

const ContactContext = createContext<ContactConfig>({
  whatsappNumber: '917065922160',
  phoneNumber: '+917065922160',
  defaultMessage: 'Hi.',
});

export const ContactProvider = ({ children, config }: { 
  children: React.ReactNode;
  config: ContactConfig;
}) => (
  <ContactContext.Provider value={config}>
    {children}
  </ContactContext.Provider>
);

export const useContact = () => useContext(ContactContext);

// Then in your component:
const config = useContact();
<FloatingContactButton {...config} />
```

### Multi-language Support

```typescript
// i18n/messages.ts
export const messages = {
  en: {
    whatsapp: 'WhatsApp',
    call: 'Call Us',
    message: 'Hi, I need help.',
  },
  hi: {
    whatsapp: 'व्हाट्सएप',
    call: 'कॉल करें',
    message: 'नमस्ते, मुझे मदद चाहिए।',
  },
};

// Use in component
const { locale } = useRouter();
const t = messages[locale] || messages.en;
```

---

## Performance Optimization

### Lazy Loading

```typescript
// app/layout.tsx
import dynamic from 'next/dynamic';

const FloatingContactButton = dynamic(
  () => import('@/components/FloatingContactButton'),
  { ssr: false }
);
```

### Memoization

```typescript
import { memo } from 'react';

const FloatingContactButton = memo(({ 
  whatsappNumber,
  phoneNumber,
  // ... props
}) => {
  // Component code
});
```

---

## License

MIT License - Free to use in commercial and personal projects.

---

## Credits

Based on the floating contact button from CounselIndia website.  
Converted to modern Next.js React component with enhancements.

---

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the examples
3. Verify all dependencies are installed
4. Ensure Next.js version is 13.0+

---

## Version History

- **v1.0** - Initial release with TypeScript and JavaScript versions
- **v1.1** - Added CSS modules support
- **v1.2** - Enhanced accessibility features
- **v1.3** - Added comprehensive documentation

---

**Happy Coding! 🚀**


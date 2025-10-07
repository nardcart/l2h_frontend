# Blog Editor Implementation Specification (HLD/LLD)

**Document Type:** Technical Specification  
**Version:** 1.0.0  
**Created:** October 5, 2025  
**Purpose:** Complete implementation guide for AI-assisted coding

---

## 🎯 Purpose

This document provides High-Level Design (HLD) and Low-Level Design (LLD) specifications for implementing a fully functional blog editor with TipTap. Use this document to have AI implement the editor from scratch with all features working correctly.

---

## 📋 Table of Contents

1. [High-Level Design (HLD)](#high-level-design-hld)
2. [Low-Level Design (LLD)](#low-level-design-lld)
3. [Component Specifications](#component-specifications)
4. [Feature Implementation Details](#feature-implementation-details)
5. [Testing Requirements](#testing-requirements)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## High-Level Design (HLD)

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Blog Editor System                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐         ┌─────────────────┐        │
│  │  User Input    │────────▶│  Editor State   │        │
│  │  - Typing      │         │  - Content      │        │
│  │  - Toolbar     │         │  - Selection    │        │
│  │  - Shortcuts   │         │  - History      │        │
│  └────────────────┘         └────────┬────────┘        │
│                                      │                  │
│                                      ▼                  │
│  ┌────────────────────────────────────────────┐        │
│  │          TipTap Editor Core                │        │
│  │  - Document Model                          │        │
│  │  - Commands & Transactions                 │        │
│  │  - Extension System                        │        │
│  └───────┬────────────────────────────────┬───┘        │
│          │                                │            │
│          ▼                                ▼            │
│  ┌──────────────┐              ┌──────────────────┐   │
│  │  Extensions  │              │  Node Views      │   │
│  │  - Headings  │              │  - Image         │   │
│  │  - Links     │              │  - Video         │   │
│  │  - Images    │              │  - Custom Nodes  │   │
│  │  - Videos    │              │                  │   │
│  └──────────────┘              └──────────────────┘   │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │              Output (HTML/JSON)                 │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Architecture Layers

1. **Presentation Layer**
   - Toolbar UI (buttons, dropdowns, dialogs)
   - Editor content area
   - Status indicators
   - Modals (link, image, video)

2. **Business Logic Layer**
   - TipTap editor instance
   - Extension configuration
   - Command execution
   - State management

3. **Data Layer**
   - Content storage (HTML/JSON)
   - Media file handling
   - API integration
   - Local storage (drafts)

### Key Components

1. **RichTextEditor** - Main editor wrapper
2. **EditorToolbar** - Toolbar with formatting buttons
3. **LinkDialog** - Link insertion modal
4. **ImageUploadDialog** - Image upload modal
5. **VideoEmbedDialog** - Video embed modal
6. **EditorExtensions** - TipTap extensions configuration

---

## Low-Level Design (LLD)

### 1. Package Dependencies

```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@tiptap/extension-link": "^2.1.13",
    "@tiptap/extension-image": "^2.1.13",
    "@tiptap/extension-underline": "^2.1.13",
    "@tiptap/extension-text-align": "^2.1.13",
    "@tiptap/extension-placeholder": "^2.1.13",
    "@tiptap/extension-character-count": "^2.1.13",
    "lucide-react": "^0.294.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### 2. Project Structure

```
src/
├── components/
│   └── editor/
│       ├── RichTextEditor.tsx          # Main editor component
│       ├── EditorToolbar.tsx           # Toolbar with buttons
│       ├── LinkDialog.tsx              # Link insertion dialog
│       ├── ImageUploadDialog.tsx       # Image upload dialog
│       ├── VideoEmbedDialog.tsx        # Video embed dialog
│       ├── editorExtensions.ts         # TipTap extensions config
│       └── styles/
│           └── editor.css              # Editor-specific styles
├── hooks/
│   └── useEditor.ts                    # Custom editor hook
└── types/
    └── editor.ts                       # TypeScript types
```

### 3. Data Flow

```
User Action (Click H1 button)
    ↓
Toolbar Button onClick Handler
    ↓
editor.chain().focus().toggleHeading({ level: 1 }).run()
    ↓
TipTap Command Execution
    ↓
Document State Update
    ↓
Re-render with Updated Content
    ↓
HTML Output Updated
```

---

## Component Specifications

### Component 1: RichTextEditor

**File:** `src/components/editor/RichTextEditor.tsx`

**Requirements:**
- Accept initial content (HTML string)
- Provide onChange callback with updated HTML
- Support all formatting options (H1-H6, bold, italic, etc.)
- Handle image uploads
- Handle video embeds
- Support links
- Character count display

**Props Interface:**

```typescript
interface RichTextEditorProps {
  content: string;                          // Initial HTML content
  onChange: (html: string) => void;         // Callback when content changes
  placeholder?: string;                     // Placeholder text
  editable?: boolean;                       // Allow editing (default: true)
  className?: string;                       // Additional CSS classes
  maxLength?: number;                       // Max character count
  onImageUpload?: (file: File) => Promise<string>; // Image upload handler
}
```

**Implementation Requirements:**

```typescript
// MUST HAVE: All these extensions configured
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

// CRITICAL: StarterKit MUST be configured with heading levels 1-6
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],  // ← IMPORTANT: All 6 levels
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg my-4',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Start writing your content...',
    }),
    CharacterCount.configure({
      limit: maxLength || 50000,
    }),
  ],
  content,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-4 border rounded-lg',
    },
  },
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});
```

**Full Component Code:**

```tsx
// src/components/editor/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useState } from 'react';

import EditorToolbar from './EditorToolbar';
import LinkDialog from './LinkDialog';
import ImageUploadDialog from './ImageUploadDialog';
import VideoEmbedDialog from './VideoEmbedDialog';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  maxLength?: number;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
  className = '',
  maxLength = 50000,
  onImageUpload,
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6], // CRITICAL: All heading levels
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageInsert = async (file: File, alt?: string) => {
    if (!editor) return;

    try {
      let imageUrl: string;

      if (onImageUpload) {
        // Use provided upload handler
        imageUrl = await onImageUpload(file);
      } else {
        // Convert to base64 as fallback
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl, alt: alt || '' })
        .run();
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const handleImageUrlInsert = (url: string, alt?: string) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: alt || '' })
      .run();
  };

  const handleLinkInsert = (url: string, text?: string) => {
    if (!editor) return;

    if (text) {
      // Insert new link with text
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}">${text}</a>`)
        .run();
    } else {
      // Add link to selected text
      editor
        .chain()
        .focus()
        .setLink({ href: url })
        .run();
    }
  };

  const handleVideoEmbed = (url: string) => {
    if (!editor) return;

    // Extract video ID and create embed HTML
    let embedHtml = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        embedHtml = `<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = extractVimeoId(url);
      if (videoId) {
        embedHtml = `<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
      }
    }

    if (embedHtml) {
      editor.chain().focus().insertContent(embedHtml).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      <EditorToolbar
        editor={editor}
        onLinkClick={() => setShowLinkDialog(true)}
        onImageClick={() => setShowImageDialog(true)}
        onVideoClick={() => setShowVideoDialog(true)}
      />

      <EditorContent editor={editor} className="prose-editor" />

      {/* Character Count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t flex justify-between items-center">
        <span>
          {editor.storage.characterCount.characters()} / {maxLength} characters
        </span>
        <span>
          {editor.storage.characterCount.words()} words
        </span>
      </div>

      {/* Dialogs */}
      <LinkDialog
        open={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onInsert={handleLinkInsert}
        selectedText={editor.state.selection.empty ? '' : editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)}
      />

      <ImageUploadDialog
        open={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onInsertFile={handleImageInsert}
        onInsertUrl={handleImageUrlInsert}
      />

      <VideoEmbedDialog
        open={showVideoDialog}
        onClose={() => setShowVideoDialog(false)}
        onInsert={handleVideoEmbed}
      />
    </div>
  );
}

// Helper functions
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}
```

---

### Component 2: EditorToolbar

**File:** `src/components/editor/EditorToolbar.tsx`

**Requirements:**
- Button for each formatting option
- Visual feedback for active states
- Keyboard shortcut tooltips
- Disable buttons when appropriate
- Group related buttons together

**Props Interface:**

```typescript
interface EditorToolbarProps {
  editor: Editor;                          // TipTap editor instance
  onLinkClick: () => void;                 // Open link dialog
  onImageClick: () => void;                // Open image dialog
  onVideoClick: () => void;                // Open video dialog
}
```

**Implementation Requirements:**

```typescript
// CRITICAL: For headings to work, use this exact syntax
<Button
  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
  variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
  size="sm"
  title="Heading 1"
>
  <Heading1 className="w-4 h-4" />
</Button>

// Repeat for levels 2-6
// level: 2, level: 3, level: 4, level: 5, level: 6
```

**Full Component Code:**

```tsx
// src/components/editor/EditorToolbar.tsx
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  onLinkClick: () => void;
  onImageClick: () => void;
  onVideoClick: () => void;
}

export default function EditorToolbar({
  editor,
  onLinkClick,
  onImageClick,
  onVideoClick,
}: EditorToolbarProps) {
  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    disabled, 
    icon: Icon, 
    title 
  }: any) => (
    <Button
      type="button"
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-9 w-9 p-0"
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="Redo (Ctrl+Y)"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Inline Code"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings - CRITICAL: All 6 levels */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          isActive={editor.isActive('heading', { level: 4 })}
          icon={Heading4}
          title="Heading 4"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          isActive={editor.isActive('heading', { level: 5 })}
          icon={Heading5}
          title="Heading 5"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          isActive={editor.isActive('heading', { level: 6 })}
          icon={Heading6}
          title="Heading 6"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Quote"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          title="Justify"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Media & Links */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={onLinkClick}
          isActive={editor.isActive('link')}
          icon={Link2}
          title="Insert Link (Ctrl+K)"
        />
        <ToolbarButton
          onClick={onImageClick}
          icon={ImageIcon}
          title="Insert Image"
        />
        <ToolbarButton
          onClick={onVideoClick}
          icon={Video}
          title="Embed Video"
        />
      </div>
    </div>
  );
}
```

---

### Component 3: LinkDialog

**File:** `src/components/editor/LinkDialog.tsx`

**Requirements:**
- URL input field
- Optional link text input
- Validation for URL format
- Open in new tab option
- Remove link functionality

**Props Interface:**

```typescript
interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  selectedText?: string;
}
```

**Full Component Code:**

```tsx
// src/components/editor/LinkDialog.tsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  selectedText?: string;
}

export default function LinkDialog({
  open,
  onClose,
  onInsert,
  selectedText = '',
}: LinkDialogProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setText(selectedText);
      setUrl('');
      setError('');
    }
  }, [open, selectedText]);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      // Try adding https://
      try {
        new URL(`https://${url}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    let finalUrl = url.trim();

    // Add https:// if missing
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    if (!validateUrl(finalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    onInsert(finalUrl, text.trim() || undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Add a hyperlink to your content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">
              URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInsert();
                }
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text (Optional)</Label>
            <Input
              id="link-text"
              placeholder="Click here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInsert();
                }
              }}
            />
            <p className="text-xs text-gray-500">
              {selectedText
                ? 'Leave empty to use selected text'
                : 'Text to display for the link'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Component 4: ImageUploadDialog

**File:** `src/components/editor/ImageUploadDialog.tsx`

**Requirements:**
- File upload (drag & drop + click)
- URL input option
- Alt text input
- Image preview
- File size validation (max 5MB)
- File type validation (jpg, png, gif, webp)
- Progress indicator during upload

**Props Interface:**

```typescript
interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onInsertFile: (file: File, alt?: string) => Promise<void>;
  onInsertUrl: (url: string, alt?: string) => void;
}
```

**Full Component Code:**

```tsx
// src/components/editor/ImageUploadDialog.tsx
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onInsertFile: (file: File, alt?: string) => Promise<void>;
  onInsertUrl: (url: string, alt?: string) => void;
}

export default function ImageUploadDialog({
  open,
  onClose,
  onInsertFile,
  onInsertUrl,
}: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please use JPG, PNG, GIF, or WebP.');
      return false;
    }

    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    setError('');

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    try {
      await onInsertFile(selectedFile, altText || undefined);
      handleClose();
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlInsert = () => {
    if (!imageUrl.trim()) {
      setError('URL is required');
      return;
    }

    onInsertUrl(imageUrl.trim(), altText || undefined);
    handleClose();
  };

  const handleClose = () => {
    setImageUrl('');
    setAltText('');
    setSelectedFile(null);
    setPreview('');
    setError('');
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image file or provide a URL
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {preview ? (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-64 object-contain rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedFile?.name} ({(selectedFile?.size ?? 0 / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium mb-1">
                  {dragActive
                    ? 'Drop image here'
                    : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setError('');
                }}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="alt-text">Alt Text (Optional)</Label>
          <Input
            id="alt-text"
            placeholder="Describe the image"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Helps with accessibility and SEO
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          {selectedFile ? (
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Insert Image'
              )}
            </Button>
          ) : (
            <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
              Insert Image
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Component 5: VideoEmbedDialog

**File:** `src/components/editor/VideoEmbedDialog.tsx`

**Requirements:**
- Support YouTube URLs
- Support Vimeo URLs
- Extract video ID from various URL formats
- Preview embed before inserting
- Responsive embed

**Props Interface:**

```typescript
interface VideoEmbedDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}
```

**Full Component Code:**

```tsx
// src/components/editor/VideoEmbedDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';

interface VideoEmbedDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

export default function VideoEmbedDialog({
  open,
  onClose,
  onInsert,
}: VideoEmbedDialogProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ type: 'youtube' | 'vimeo'; id: string } | null>(null);

  const extractVideoInfo = (url: string): { type: 'youtube' | 'vimeo'; id: string } | null => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /youtube\.com\/shorts\/([^&\?\/]+)/,
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return { type: 'youtube', id: match[1] };
      }
    }

    // Vimeo pattern
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }

    return null;
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setError('');

    const videoInfo = extractVideoInfo(value);
    if (videoInfo) {
      setPreview(videoInfo);
    } else {
      setPreview(null);
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    const videoInfo = extractVideoInfo(url);
    if (!videoInfo) {
      setError('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    onInsert(url.trim());
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Embed Video</DialogTitle>
          <DialogDescription>
            Add a YouTube or Vimeo video to your content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-url">
              Video URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="video-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInsert();
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Supports YouTube and Vimeo URLs
            </p>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Preview */}
          {preview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {preview.type === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${preview.id}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    src={`https://player.vimeo.com/video/${preview.id}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!preview}>
            <Video className="w-4 h-4 mr-2" />
            Embed Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Feature Implementation Details

### Feature 1: Headings (H1-H6)

**Problem:** Headings not working  
**Root Cause:** StarterKit not configured with all heading levels

**Solution:**

```typescript
// ❌ WRONG - This won't work
StarterKit

// ✅ CORRECT - Configure with all levels
StarterKit.configure({
  heading: {
    levels: [1, 2, 3, 4, 5, 6],
  },
})
```

**Test Cases:**

```typescript
// Test 1: Click H1 button
editor.chain().focus().toggleHeading({ level: 1 }).run();
// Expected: Selected text becomes <h1>

// Test 2: Click H2 while H1 is active
editor.chain().focus().toggleHeading({ level: 2 }).run();
// Expected: <h1> becomes <h2>

// Test 3: Click H3 button on paragraph
editor.chain().focus().toggleHeading({ level: 3 }).run();
// Expected: <p> becomes <h3>

// Test 4: Click same heading level again
editor.chain().focus().toggleHeading({ level: 1 }).run(); // Apply
editor.chain().focus().toggleHeading({ level: 1 }).run(); // Remove
// Expected: <h1> becomes <p>

// Test 5: Check active state
editor.isActive('heading', { level: 1 })
// Expected: true when cursor is in H1, false otherwise
```

---

### Feature 2: Links

**Problem:** Links not inserting properly  
**Root Cause:** Link extension not configured correctly

**Solution:**

```typescript
// ✅ CORRECT Configuration
Link.configure({
  openOnClick: false,  // IMPORTANT: Prevent opening on click in editor
  HTMLAttributes: {
    class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})

// ✅ CORRECT Insertion
// For selected text:
editor.chain().focus().setLink({ href: url }).run();

// For new link with text:
editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();

// Remove link:
editor.chain().focus().unsetLink().run();
```

**Test Cases:**

```typescript
// Test 1: Add link to selected text
// 1. Select "click here"
// 2. Click link button
// 3. Enter URL
// Expected: <a href="URL">click here</a>

// Test 2: Insert new link with text
// 1. Cursor in empty paragraph
// 2. Click link button
// 3. Enter URL and text
// Expected: <a href="URL">text</a>

// Test 3: Edit existing link
// 1. Click on link
// 2. Click link button
// 3. Change URL
// Expected: URL updated

// Test 4: Remove link
// 1. Select linked text
// 2. Click link button
// 3. Click "Remove Link"
// Expected: <a> tags removed, text remains
```

---

### Feature 3: Image Upload

**Problem:** Image upload not working  
**Root Cause:** No upload handler or incorrect Image extension config

**Solution:**

```typescript
// ✅ CORRECT Image Extension Configuration
Image.configure({
  inline: false,  // Block-level images
  allowBase64: true,  // Allow base64 for fallback
  HTMLAttributes: {
    class: 'max-w-full h-auto rounded-lg my-4',
  },
})

// ✅ CORRECT Image Insertion
// Method 1: From file (with upload)
const handleImageUpload = async (file: File) => {
  // Upload file to server
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  
  // Insert into editor
  editor.chain().focus().setImage({ src: url, alt: 'description' }).run();
};

// Method 2: From URL
editor.chain().focus().setImage({ src: url, alt: 'description' }).run();

// Method 3: Base64 (fallback, no upload)
const reader = new FileReader();
reader.onloadend = () => {
  editor.chain().focus().setImage({ src: reader.result as string }).run();
};
reader.readAsDataURL(file);
```

**Test Cases:**

```typescript
// Test 1: Upload image file
// 1. Click image button
// 2. Select JPG file (< 5MB)
// Expected: Image appears in editor

// Test 2: Upload via drag & drop
// 1. Drag image file into upload area
// Expected: Image preview shows, then inserts

// Test 3: Insert from URL
// 1. Switch to URL tab
// 2. Enter image URL
// Expected: Image appears in editor

// Test 4: File size validation
// 1. Select file > 5MB
// Expected: Error "File too large"

// Test 5: File type validation
// 1. Select .pdf file
// Expected: Error "Invalid file type"

// Test 6: Alt text
// 1. Upload image
// 2. Enter alt text
// Expected: <img alt="text" ...>
```

---

### Feature 4: Video Embed

**Problem:** Video embed not working  
**Root Cause:** Incorrect video ID extraction or HTML insertion

**Solution:**

```typescript
// ✅ CORRECT Video ID Extraction
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

// ✅ CORRECT Video Embed HTML
const embedYouTube = (videoId: string) => {
  return `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe 
      src="https://www.youtube.com/embed/${videoId}" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>`;
};

const embedVimeo = (videoId: string) => {
  return `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe 
      src="https://player.vimeo.com/video/${videoId}" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      frameborder="0" 
      allow="autoplay; fullscreen; picture-in-picture" 
      allowfullscreen>
    </iframe>
  </div>`;
};

// ✅ CORRECT Insertion
editor.chain().focus().insertContent(embedHtml).run();
```

**Test Cases:**

```typescript
// Test 1: YouTube standard URL
// Input: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// Expected: Video embeds correctly

// Test 2: YouTube short URL
// Input: https://youtu.be/dQw4w9WgXcQ
// Expected: Video embeds correctly

// Test 3: YouTube embed URL
// Input: https://www.youtube.com/embed/dQw4w9WgXcQ
// Expected: Video embeds correctly

// Test 4: YouTube Shorts
// Input: https://www.youtube.com/shorts/dQw4w9WgXcQ
// Expected: Video embeds correctly

// Test 5: Vimeo URL
// Input: https://vimeo.com/123456789
// Expected: Video embeds correctly

// Test 6: Invalid URL
// Input: https://example.com/video
// Expected: Error "Please enter valid YouTube or Vimeo URL"

// Test 7: Responsive
// Expected: Video maintains 16:9 aspect ratio on all screen sizes
```

---

## Testing Requirements

### Unit Tests

```typescript
// test/editor.test.tsx
describe('RichTextEditor', () => {
  it('should render editor with initial content', () => {
    // Test implementation
  });

  it('should call onChange when content changes', () => {
    // Test implementation
  });

  it('should apply bold formatting', () => {
    // Test implementation
  });

  it('should apply all heading levels (1-6)', () => {
    // Test implementation
  });

  it('should insert links correctly', () => {
    // Test implementation
  });

  it('should handle image upload', () => {
    // Test implementation
  });

  it('should embed videos', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// test/editor-integration.test.tsx
describe('Editor Integration', () => {
  it('should save content on form submit', () => {
    // Test implementation
  });

  it('should handle image upload to server', () => {
    // Test implementation
  });

  it('should display character count', () => {
    // Test implementation
  });

  it('should maintain formatting after save/load', () => {
    // Test implementation
  });
});
```

### Manual Testing Checklist

```markdown
## Text Formatting
- [ ] Bold (Ctrl+B)
- [ ] Italic (Ctrl+I)
- [ ] Underline (Ctrl+U)
- [ ] Strikethrough
- [ ] Inline code

## Headings
- [ ] H1 button works
- [ ] H2 button works
- [ ] H3 button works
- [ ] H4 button works
- [ ] H5 button works
- [ ] H6 button works
- [ ] Toggle heading removes formatting
- [ ] Active state shows correct button

## Lists
- [ ] Bullet list
- [ ] Numbered list
- [ ] Nested lists
- [ ] Tab to indent
- [ ] Shift+Tab to outdent

## Alignment
- [ ] Align left
- [ ] Align center
- [ ] Align right
- [ ] Justify

## Links
- [ ] Add link to selected text
- [ ] Add new link with text
- [ ] Edit existing link
- [ ] Remove link
- [ ] Link opens in new tab (frontend view)
- [ ] Link validation works

## Images
- [ ] Upload via file picker
- [ ] Upload via drag & drop
- [ ] Insert from URL
- [ ] Alt text saves correctly
- [ ] File size validation (5MB max)
- [ ] File type validation (jpg, png, gif, webp)
- [ ] Image preview works
- [ ] Image displays in editor
- [ ] Image is responsive

## Videos
- [ ] YouTube standard URL
- [ ] YouTube short URL  
- [ ] YouTube embed URL
- [ ] YouTube Shorts URL
- [ ] Vimeo URL
- [ ] Video preview in dialog
- [ ] Video embeds correctly
- [ ] Video is responsive
- [ ] Invalid URL shows error

## General
- [ ] Character count updates
- [ ] Undo (Ctrl+Z)
- [ ] Redo (Ctrl+Y)
- [ ] Placeholder shows when empty
- [ ] Content persists after page reload (if auto-save)
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
```

---

## Common Issues & Solutions

### Issue 1: Headings Not Working

**Symptoms:**
- Clicking H1-H6 buttons does nothing
- Heading buttons don't show active state
- Headings don't appear in output HTML

**Diagnosis:**

```typescript
// Check your extensions configuration
console.log(editor.extensionManager.extensions);
// Look for StarterKit and check heading configuration
```

**Solutions:**

```typescript
// ✅ Solution 1: Configure StarterKit properly
StarterKit.configure({
  heading: {
    levels: [1, 2, 3, 4, 5, 6],
  },
})

// ✅ Solution 2: Use correct toggle command
editor.chain().focus().toggleHeading({ level: 1 }).run();
// NOT: editor.chain().focus().setHeading({ level: 1 }).run();

// ✅ Solution 3: Check active state correctly
editor.isActive('heading', { level: 1 })
// NOT: editor.isActive('heading1')
```

---

### Issue 2: Links Not Inserting

**Symptoms:**
- Link dialog opens but link doesn't insert
- Link inserts but doesn't show as link
- Link styling not applied

**Solutions:**

```typescript
// ✅ Solution 1: Configure Link extension
Link.configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'text-blue-600 underline',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})

// ✅ Solution 2: Use correct insertion method
// For selected text:
editor.chain().focus().setLink({ href: url }).run();

// For new link:
editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();

// ✅ Solution 3: Add CSS for link styling
// In your CSS file:
.prose a {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.prose a:hover {
  color: #1e40af;
}
```

---

### Issue 3: Image Upload Not Working

**Symptoms:**
- Image dialog opens but image doesn't insert
- Upload button doesn't respond
- Image shows broken icon

**Solutions:**

```typescript
// ✅ Solution 1: Configure Image extension
Image.configure({
  inline: false,
  allowBase64: true,
  HTMLAttributes: {
    class: 'max-w-full h-auto',
  },
})

// ✅ Solution 2: Implement proper upload handler
const handleImageUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  return data.url;  // Return the URL
};

// ✅ Solution 3: Use base64 as fallback
const reader = new FileReader();
reader.onloadend = () => {
  editor.chain().focus().setImage({ src: reader.result as string }).run();
};
reader.readAsDataURL(file);

// ✅ Solution 4: Check CORS if using external API
// Add to server:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST');
```

---

### Issue 4: Video Embed Not Working

**Symptoms:**
- Video URL accepted but nothing appears
- Video appears but doesn't play
- Video not responsive

**Solutions:**

```typescript
// ✅ Solution 1: Use correct embed HTML
const embedHtml = `
<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>`;

editor.chain().focus().insertContent(embedHtml).run();

// ✅ Solution 2: Add responsive CSS
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

// ✅ Solution 3: Handle all URL formats
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\?\/]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};
```

---

### Issue 5: Toolbar Buttons Not Showing Active State

**Symptoms:**
- Buttons don't highlight when formatting is active
- Can't tell what formatting is applied

**Solutions:**

```typescript
// ✅ Solution 1: Use correct active check
const isActive = editor.isActive('bold');
// NOT: editor.isFocused()

// ✅ Solution 2: Pass active state to button
<Button
  variant={editor.isActive('bold') ? 'default' : 'ghost'}
  onClick={() => editor.chain().focus().toggleBold().run()}
>
  <Bold />
</Button>

// ✅ Solution 3: For headings with level
<Button
  variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
>
  <H1 />
</Button>
```

---

## CSS Requirements

### Editor Styles

```css
/* src/components/editor/styles/editor.css */

/* Editor container */
.prose-editor {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

/* Prose styling for editor content */
.prose {
  max-width: none !important;
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.2;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.3;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.4;
}

.prose h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.4;
}

.prose h5 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

.prose h6 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  line-height: 1.5;
}

.prose p {
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  line-height: 1.75;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.prose a:hover {
  color: #1e40af;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: monospace;
}

/* Video wrapper for responsive embeds */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  max-width: 100%;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Placeholder */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}

/* Focus styles */
.ProseMirror:focus {
  outline: none;
}

.ProseMirror:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

---

## API Requirements

### Image Upload Endpoint

```typescript
// Backend: POST /api/media/upload
interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// Example implementation (Express.js)
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.post('/api/media/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const url = `${process.env.BASE_URL}/uploads/images/${req.file.filename}`;

  res.json({
    success: true,
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimeType: req.file.mimetype,
  });
});
```

---

## Summary Checklist

Use this checklist to verify the implementation:

### Setup
- [ ] Install all required packages
- [ ] Create all component files
- [ ] Add editor CSS file
- [ ] Configure TipTap extensions

### Components
- [ ] RichTextEditor component created
- [ ] EditorToolbar component created
- [ ] LinkDialog component created
- [ ] ImageUploadDialog component created
- [ ] VideoEmbedDialog component created

### Features
- [ ] All 6 heading levels (H1-H6) working
- [ ] Bold, italic, underline, strikethrough working
- [ ] Bullet and numbered lists working
- [ ] Text alignment (left, center, right, justify) working
- [ ] Links can be inserted and edited
- [ ] Images can be uploaded via file picker
- [ ] Images can be uploaded via drag & drop
- [ ] Images can be inserted from URL
- [ ] Videos can be embedded (YouTube)
- [ ] Videos can be embedded (Vimeo)
- [ ] Character count displays correctly
- [ ] Undo/Redo working

### Testing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual testing checklist completed
- [ ] Works on desktop browsers
- [ ] Works on mobile browsers
- [ ] Works on tablet

### API
- [ ] Image upload endpoint implemented
- [ ] File size validation (5MB max)
- [ ] File type validation
- [ ] CORS configured if needed

---

**Document Version:** 1.0.0  
**Last Updated:** October 5, 2025  
**Status:** Ready for Implementation

**Usage:** Give this entire document to an AI coding assistant and ask:  
> "Please implement the blog editor exactly as specified in this document. Follow all requirements, use the provided code examples, and ensure all features work correctly."


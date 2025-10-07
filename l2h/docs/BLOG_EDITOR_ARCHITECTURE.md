# Blog Editor & Publisher Architecture

**Document:** Blog Editor & Publishing System  
**Version:** 1.0.0  
**Created:** October 5, 2025  
**Tech Stack:** React 18.3.1 + TypeScript + TipTap + Vite

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Editor Component Architecture](#editor-component-architecture)
4. [Publishing Workflow](#publishing-workflow)
5. [Rich Text Editor (TipTap) Deep Dive](#rich-text-editor-tiptap-deep-dive)
6. [Media Management](#media-management)
7. [Content Structure](#content-structure)
8. [State Management](#state-management)
9. [Auto-Save & Draft System](#auto-save--draft-system)
10. [Preview System](#preview-system)
11. [SEO & Metadata](#seo--metadata)
12. [Publishing Options](#publishing-options)
13. [Visual Design Guide](#visual-design-guide)
14. [Component Specifications](#component-specifications)
15. [API Integration](#api-integration)
16. [Performance Optimization](#performance-optimization)

---

## Overview

The Blog Editor & Publisher is a sophisticated content creation and management system that provides authors with a powerful, intuitive interface for writing, formatting, and publishing blog posts. It combines a rich text editor, media management, metadata configuration, and flexible publishing options.

### Key Features

- 📝 **Rich Text Editing** - Full-featured WYSIWYG editor with TipTap
- 🎨 **Media Management** - Image upload, optimization, and embedding
- 💾 **Auto-Save** - Automatic draft saving every 30 seconds
- 👁️ **Live Preview** - Real-time preview of how posts will look
- 🏷️ **Metadata Management** - SEO, tags, categories, slug generation
- 📅 **Flexible Publishing** - Draft, schedule, publish, archive
- 🎥 **Video Support** - Embed videos or upload video files
- 🔍 **SEO Optimization** - Meta tags, social sharing, structured data
- ✍️ **Collaborative** - Multiple authors, revision history
- 📱 **Responsive** - Works on desktop, tablet, and mobile

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BLOG EDITOR SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Editor UI  │  │  Media Mgmt  │  │  Metadata Panel │   │
│  │              │  │              │  │                 │   │
│  │  - TipTap    │  │  - Upload    │  │  - SEO          │   │
│  │  - Toolbar   │  │  - Preview   │  │  - Tags         │   │
│  │  - Content   │  │  - Optimize  │  │  - Category     │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘   │
│         │                 │                    │            │
│         └─────────────────┴────────────────────┘            │
│                           │                                 │
│                  ┌────────▼────────┐                        │
│                  │  State Manager  │                        │
│                  │  (React Query)  │                        │
│                  └────────┬────────┘                        │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐               │
│         │                                   │               │
│  ┌──────▼───────┐                  ┌────────▼────────┐     │
│  │  Auto-Save   │                  │  Publishing     │     │
│  │  Service     │                  │  Service        │     │
│  └──────┬───────┘                  └────────┬────────┘     │
│         │                                   │               │
└─────────┼───────────────────────────────────┼───────────────┘
          │                                   │
          └───────────────┬───────────────────┘
                          │
                  ┌───────▼────────┐
                  │   Backend API  │
                  │  (Express.js)  │
                  └───────┬────────┘
                          │
                  ┌───────▼────────┐
                  │    MongoDB     │
                  └────────────────┘
```

### Component Hierarchy

```
BlogEditor (Root)
│
├── EditorHeader
│   ├── BackButton
│   ├── TitleDisplay
│   ├── StatusIndicator
│   ├── PreviewButton
│   └── PublishButton
│
├── EditorLayout
│   │
│   ├── MainContentArea (2/3 width)
│   │   │
│   │   ├── ContentCard
│   │   │   ├── TitleInput
│   │   │   ├── SlugInput
│   │   │   ├── ExcerptTextarea
│   │   │   └── RichTextEditor
│   │   │       ├── EditorToolbar
│   │   │       │   ├── FormatButtons
│   │   │       │   ├── HeadingButtons
│   │   │       │   ├── ListButtons
│   │   │       │   ├── MediaButtons
│   │   │       │   └── LinkButtons
│   │   │       └── EditorContent
│   │   │
│   │   └── SEOCard
│   │       ├── MetaTitleInput
│   │       └── MetaDescriptionTextarea
│   │
│   └── MetadataSidebar (1/3 width)
│       │
│       ├── StatusCard
│       │   ├── StatusSelect
│       │   └── ScheduleInput
│       │
│       ├── CoverImageCard
│       │   └── ImageUpload
│       │
│       ├── CategoryCard
│       │   └── CategorySelect
│       │
│       ├── TagsCard
│       │   └── TagInput
│       │
│       └── VideoCard
│           ├── VideoToggle
│           ├── VideoTypeSelect
│           └── VideoURLInput
│
└── SaveIndicator
```

---

## Editor Component Architecture

### Core Editor Component

```tsx
// src/components/blog-editor/BlogEditor.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';

import EditorHeader from './EditorHeader';
import EditorLayout from './EditorLayout';
import RichTextEditor from './RichTextEditor';
import MetadataSidebar from './MetadataSidebar';
import PreviewModal from './PreviewModal';
import PublishDialog from './PublishDialog';

import { blogSchema, type BlogFormData } from '@/schemas/blog';
import { useAutoSave } from '@/hooks/useAutoSave';
import { toast } from '@/hooks/use-toast';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // Form State
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'draft',
      isVideo: false,
      tags: [],
    },
  });

  // Local State
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    enabled: isEditing,
  });

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setValue('title', existingPost.title);
      setValue('slug', existingPost.slug);
      setValue('excerpt', existingPost.excerpt);
      setValue('categoryId', existingPost.categoryId);
      setValue('tags', existingPost.tags);
      setValue('status', existingPost.status);
      setValue('isVideo', existingPost.isVideo);
      setValue('videoType', existingPost.videoType);
      setValue('videoUrl', existingPost.videoUrl);
      setValue('metaTitle', existingPost.metaTitle);
      setValue('metaDescription', existingPost.metaDescription);
      setContent(existingPost.content);
      setCoverImagePreview(existingPost.coverImage);
    }
  }, [existingPost, setValue]);

  // Auto-save functionality
  const autoSave = useCallback(
    debounce(async (data: Partial<BlogFormData>) => {
      if (!isDirty) return;

      setIsSaving(true);
      try {
        const payload = {
          ...data,
          content,
          isDraft: true,
        };

        await fetch(`/api/blogs/${id || 'draft'}/autosave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 30000), // Auto-save every 30 seconds
    [id, content, isDirty]
  );

  // Trigger auto-save on content change
  useEffect(() => {
    const formData = watch();
    autoSave(formData);
  }, [watch(), content, autoSave]);

  // Save/Publish mutation
  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      formData.append('content', content);

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const url = isEditing ? `/api/blogs/${id}` : '/api/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: 'Success',
        description: `Post ${isEditing ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/blogs');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      });
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title && !isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, setValue, isEditing]);

  const onSubmit = (data: BlogFormData) => {
    saveMutation.mutate(data);
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorHeader
        title={watch('title') || 'Untitled Post'}
        status={watch('status')}
        lastSaved={lastSaved}
        isSaving={isSaving}
        onBack={() => navigate('/admin/blogs')}
        onPreview={() => setShowPreview(true)}
        onPublish={() => setShowPublishDialog(true)}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <EditorLayout
          mainContent={
            <>
              <ContentCard
                register={register}
                watch={watch}
                errors={errors}
                content={content}
                onContentChange={setContent}
              />
              <SEOCard
                register={register}
                errors={errors}
              />
            </>
          }
          sidebar={
            <MetadataSidebar
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              coverImage={coverImage}
              coverImagePreview={coverImagePreview}
              onCoverImageChange={setCoverImage}
              onCoverImagePreviewChange={setCoverImagePreview}
            />
          }
        />
      </form>

      {/* Preview Modal */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={watch('title')}
        content={content}
        coverImage={coverImagePreview}
        category={watch('categoryId')}
        tags={watch('tags')}
      />

      {/* Publish Dialog */}
      <PublishDialog
        open={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        onPublish={handlePublish}
        status={watch('status')}
      />
    </div>
  );
}
```

---

## Publishing Workflow

### Publishing State Machine

```
┌─────────┐
│  Draft  │ ←──────────────────┐
└────┬────┘                    │
     │                         │
     │ [Author: Save as Draft] │
     │                         │
     ▼                         │
┌─────────┐                    │
│ Pending │                    │
│ Review  │                    │
└────┬────┘                    │
     │                         │
     │ [Admin: Approve]        │ [Author/Admin:
     │                         │  Unpublish]
     ▼                         │
┌──────────┐                   │
│Published │───────────────────┘
└────┬─────┘
     │
     │ [Admin: Archive]
     │
     ▼
┌──────────┐
│ Archived │
└──────────┘
```

### Publishing Options

```tsx
// src/types/publishing.ts
export type PostStatus = 'draft' | 'pending' | 'scheduled' | 'published' | 'archived';

export interface PublishingOptions {
  status: PostStatus;
  publishAt?: Date;
  scheduledFor?: Date;
  notifySubscribers: boolean;
  publishToSocial: boolean;
  featuredPost: boolean;
  allowComments: boolean;
  visibility: 'public' | 'private' | 'password-protected';
  password?: string;
}

export interface PublishingConfig {
  autoPublish: boolean;
  requireReview: boolean;
  allowScheduling: boolean;
  maxScheduleDays: number;
  defaultVisibility: 'public' | 'private';
}
```

### Publishing Flow Component

```tsx
// src/components/blog-editor/PublishDialog.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  onPublish: (options: PublishingOptions) => void;
  status: PostStatus;
}

export default function PublishDialog({
  open,
  onClose,
  onPublish,
  status,
}: PublishDialogProps) {
  const [publishNow, setPublishNow] = useState(true);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const handlePublish = () => {
    const options: PublishingOptions = {
      status: publishNow ? 'published' : 'scheduled',
      scheduledFor: publishNow ? undefined : scheduleDate,
      notifySubscribers,
      publishToSocial: true,
      featuredPost: false,
      allowComments: true,
      visibility,
    };

    onPublish(options);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Publish Post</DialogTitle>
          <DialogDescription>
            Configure publishing options for your post
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="timing" className="space-y-4">
            <RadioGroup
              value={publishNow ? 'now' : 'schedule'}
              onValueChange={(value) => setPublishNow(value === 'now')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="font-normal">
                  Publish immediately
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule" className="font-normal">
                  Schedule for later
                </Label>
              </div>
            </RadioGroup>

            {!publishNow && (
              <div className="space-y-2">
                <Label>Select date and time</Label>
                <Calendar
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                {scheduleDate && (
                  <p className="text-sm text-muted-foreground">
                    Will be published on {format(scheduleDate, 'PPP')}
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notify Subscribers</Label>
                <p className="text-sm text-muted-foreground">
                  Send email to newsletter subscribers
                </p>
              </div>
              <Switch
                checked={notifySubscribers}
                onCheckedChange={setNotifySubscribers}
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Public - Visible to everyone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private - Only visible to admins
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePublish}>
            {publishNow ? 'Publish Now' : 'Schedule Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Rich Text Editor (TipTap) Deep Dive

### Editor Configuration

```tsx
// src/components/blog-editor/RichTextEditor/config.ts
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import Youtube from '@tiptap/extension-youtube';

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
    codeBlock: false, // Disabled in favor of CodeBlockLowlight
  }),
  
  Underline,
  
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline cursor-pointer',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),
  
  Image.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg my-4',
    },
  }),
  
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  
  Typography,
  
  Placeholder.configure({
    placeholder: 'Start writing your amazing content...',
  }),
  
  CharacterCount.configure({
    limit: 50000,
  }),
  
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: 'rounded-lg bg-gray-900 text-gray-100 p-4 my-4 overflow-x-auto',
    },
  }),
  
  Youtube.configure({
    controls: true,
    nocookie: true,
    HTMLAttributes: {
      class: 'w-full aspect-video rounded-lg my-4',
    },
  }),
];

export const editorProps = {
  attributes: {
    class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] p-8',
  },
};
```

### Custom Extensions

```tsx
// src/components/blog-editor/RichTextEditor/extensions/ImageUpload.ts
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageUploadComponent from './ImageUploadComponent';

export const ImageUploadExtension = Node.create({
  name: 'imageUpload',
  
  group: 'block',
  
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      caption: {
        default: null,
      },
      alignment: {
        default: 'center',
      },
      width: {
        default: '100%',
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image-upload"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent);
  },
  
  addCommands() {
    return {
      setImageUpload: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
```

### Editor Toolbar

```tsx
// src/components/blog-editor/RichTextEditor/EditorToolbar.tsx
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
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Link2,
  Image as ImageIcon,
  Youtube,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
  onLinkAdd: () => void;
  onYoutubeEmbed: () => void;
}

export default function EditorToolbar({
  editor,
  onImageUpload,
  onLinkAdd,
  onYoutubeEmbed,
}: EditorToolbarProps) {
  if (!editor) return null;

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    disabled, 
    icon: Icon, 
    title, 
    shortcut 
  }: any) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={`h-9 w-9 p-0 ${isActive ? 'bg-accent' : ''}`}
          >
            <Icon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
          {shortcut && <p className="text-xs text-muted-foreground">{shortcut}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="Undo"
          shortcut="Ctrl+Z"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="Redo"
          shortcut="Ctrl+Y"
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
          shortcut="Ctrl+B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
          shortcut="Ctrl+I"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="Underline"
          shortcut="Ctrl+U"
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

      {/* Headings */}
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
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists & Quotes */}
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
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon={CodeSquare}
          title="Code Block"
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
          onClick={onLinkAdd}
          isActive={editor.isActive('link')}
          icon={Link2}
          title="Insert Link"
          shortcut="Ctrl+K"
        />
        <ToolbarButton
          onClick={onImageUpload}
          icon={ImageIcon}
          title="Insert Image"
        />
        <ToolbarButton
          onClick={onYoutubeEmbed}
          icon={Youtube}
          title="Embed YouTube Video"
        />
      </div>

      {/* More Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 ml-auto">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            Insert Horizontal Line
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear Formatting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Character Count */}
      <div className="ml-auto text-xs text-muted-foreground px-2">
        {editor.storage.characterCount.characters()}/{editor.storage.characterCount.limit} characters
      </div>
    </div>
  );
}
```

---

## Media Management

### Image Upload Flow

```
User Action → Select File → Validate → Compress → Upload → Store URL → Insert into Editor
                                ↓         ↓          ↓
                            Check Size  Optimize   S3/Cloud
                            Check Type  Resize     Storage
```

### Image Upload Component

```tsx
// src/components/blog-editor/MediaUpload/ImageUploadDialog.tsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string, alt?: string) => void;
}

export default function ImageUploadDialog({
  open,
  onClose,
  onInsert,
}: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadedUrl(response.url);
          toast({
            title: 'Success',
            description: 'Image uploaded successfully',
          });
        }
      });

      xhr.open('POST', '/api/media/upload');
      xhr.send(formData);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleInsert = () => {
    const url = uploadedUrl || imageUrl;
    if (url) {
      onInsert(url, altText);
      handleClose();
    }
  };

  const handleClose = () => {
    setImageUrl('');
    setAltText('');
    setUploadedUrl('');
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {uploadedUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-lg border overflow-hidden">
                  <img
                    src={uploadedUrl}
                    alt="Uploaded"
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => setUploadedUrl('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  Image uploaded successfully
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}
                  ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm font-medium mb-1">
                  {uploading
                    ? 'Uploading...'
                    : isDragActive
                    ? 'Drop image here'
                    : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-center text-muted-foreground">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="alt-text">Alt Text (Optional)</Label>
          <Input
            id="alt-text"
            placeholder="Describe the image for accessibility"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Help screen readers understand the image
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleInsert}
            disabled={!uploadedUrl && !imageUrl}
          >
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Auto-Save & Draft System

### Auto-Save Hook

```tsx
// src/hooks/useAutoSave.ts
import { useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { toast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  data: any;
  saveFunction: (data: any) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave({
  data,
  saveFunction,
  interval = 30000, // 30 seconds default
  enabled = true,
}: AutoSaveOptions) {
  const lastSaveRef = useRef<Date | null>(null);
  const isSavingRef = useRef(false);

  const save = useCallback(
    debounce(async (currentData: any) => {
      if (!enabled || isSavingRef.current) return;

      try {
        isSavingRef.current = true;
        await saveFunction(currentData);
        lastSaveRef.current = new Date();
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast({
          title: 'Auto-save failed',
          description: 'Your changes may not be saved',
          variant: 'destructive',
        });
      } finally {
        isSavingRef.current = false;
      }
    }, interval),
    [saveFunction, interval, enabled]
  );

  useEffect(() => {
    if (data && enabled) {
      save(data);
    }
  }, [data, save, enabled]);

  return {
    lastSaved: lastSaveRef.current,
    isSaving: isSavingRef.current,
  };
}
```

---

## Preview System

### Preview Modal

```tsx
// src/components/blog-editor/PreviewModal.tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, Tag } from 'lucide-react';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: { name: string; image: string };
}

export default function PreviewModal({
  open,
  onClose,
  title,
  content,
  coverImage,
  category,
  tags = [],
  author,
}: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <article className="bg-white">
          {/* Cover Image */}
          {coverImage && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {category && (
                <Badge variant="secondary">{category}</Badge>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(), 'MMMM dd, yyyy')}
              </div>
              {author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {author.name}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-6">
              {title || 'Untitled Post'}
            </h1>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Visual Design Guide

### Editor Layout

```
┌───────────────────────────────────────────────────────────────┐
│ ┌─────┐ Untitled Post          [Auto-saved] [Preview] [Publish]│
│ │ ←   │                                                        │
│ └─────┘                                                        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Main Content (66%)                   Sidebar (33%)           │
│  ┌──────────────────────────────┐    ┌──────────────────┐    │
│  │ Post Content                 │    │ Status           │    │
│  │                              │    │ [Draft ▼]        │    │
│  │ Title: [..................] │    └──────────────────┘    │
│  │ Slug:  [..................] │    ┌──────────────────┐    │
│  │ Excerpt: [................] │    │ Cover Image      │    │
│  │                              │    │ [Upload/Preview] │    │
│  │ ┌────────────────────────┐   │    └──────────────────┘    │
│  │ │ [B][I][U] [H1][H2] ... │   │    ┌──────────────────┐    │
│  │ ├────────────────────────┤   │    │ Category         │    │
│  │ │                        │   │    │ [Select... ▼]    │    │
│  │ │  Write your content... │   │    └──────────────────┘    │
│  │ │                        │   │    ┌──────────────────┐    │
│  │ │                        │   │    │ Tags             │    │
│  │ └────────────────────────┘   │    │ [tag1][tag2]...  │    │
│  └──────────────────────────────┘    └──────────────────┘    │
│  ┌──────────────────────────────┐                            │
│  │ SEO Settings                 │                            │
│  │ Meta Title: [..............] │                            │
│  │ Meta Desc:  [..............] │                            │
│  └──────────────────────────────┘                            │
└───────────────────────────────────────────────────────────────┘
```

### Color Scheme

```css
/* Editor-specific colors */
:root {
  /* Main editor */
  --editor-bg: #ffffff;
  --editor-border: #e2e8f0;
  --editor-focus: #3b82f6;
  
  /* Toolbar */
  --toolbar-bg: #f8fafc;
  --toolbar-border: #e2e8f0;
  --toolbar-hover: #f1f5f9;
  --toolbar-active: #e0e7ff;
  
  /* Content */
  --content-text: #1e293b;
  --content-muted: #64748b;
  --content-link: #3b82f6;
  
  /* Status indicators */
  --status-draft: #94a3b8;
  --status-published: #10b981;
  --status-scheduled: #f59e0b;
  --status-archived: #6b7280;
  
  /* Alerts */
  --save-success: #10b981;
  --save-error: #ef4444;
  --save-pending: #f59e0b;
}
```

### Typography

```css
/* Editor typography */
.editor-title {
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  line-height: 1.2;
  color: var(--content-text);
}

.editor-content {
  font-size: 1.125rem; /* 18px */
  line-height: 1.75;
  color: var(--content-text);
}

.editor-heading-1 {
  font-size: 2rem; /* 32px */
  font-weight: 700;
  margin: 1.5em 0 0.5em;
}

.editor-heading-2 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  margin: 1.5em 0 0.5em;
}

.editor-heading-3 {
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  margin: 1.5em 0 0.5em;
}
```

### Spacing

```css
/* Editor spacing */
.editor-container {
  padding: 2rem; /* 32px */
}

.editor-section {
  margin-bottom: 1.5rem; /* 24px */
}

.editor-field {
  margin-bottom: 1rem; /* 16px */
}

.toolbar-group {
  gap: 0.25rem; /* 4px */
}

.content-spacing {
  padding: 2rem; /* 32px */
}
```

---

## API Integration

### Editor API Endpoints

```typescript
// src/api/blog-editor.ts

export const blogEditorApi = {
  // Create draft
  createDraft: async (data: Partial<BlogFormData>) => {
    const response = await fetch('/api/blogs/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Auto-save
  autoSave: async (id: string, data: Partial<BlogFormData>) => {
    const response = await fetch(`/api/blogs/${id}/autosave`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Upload media
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Publish post
  publish: async (id: string, options: PublishingOptions) => {
    const response = await fetch(`/api/blogs/${id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    return response.json();
  },

  // Generate slug
  generateSlug: async (title: string) => {
    const response = await fetch('/api/blogs/generate-slug', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return response.json();
  },
};
```

---

## Summary

This comprehensive guide provides:

✅ **Complete Editor Architecture** - Component hierarchy, state management, data flow  
✅ **Publishing System** - Draft, schedule, publish workflow with all states  
✅ **Rich Text Editor** - Full TipTap implementation with custom extensions  
✅ **Media Management** - Upload, optimize, embed images and videos  
✅ **Auto-Save System** - Automatic draft saving with visual feedback  
✅ **Preview System** - Real-time preview of published post  
✅ **SEO Tools** - Meta tags, slug generation, optimization  
✅ **Visual Design** - Complete styling guide with colors, typography, spacing  
✅ **API Integration** - All endpoints for editor functionality  

---

**Version:** 1.0.0  
**Last Updated:** October 5, 2025  
**Related Documentation:** docs/ADMIN_STYLE_GUIDE.md, docs/0001.md


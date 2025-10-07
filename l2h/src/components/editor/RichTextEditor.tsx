import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import { useState, useEffect } from 'react';

import EditorToolbar from './EditorToolbar';
import LinkDialog from './LinkDialog';
import ImageUploadDialog from './ImageUploadDialog';
import VideoEmbedDialog from './VideoEmbedDialog';
import { VideoEmbed } from './extensions/VideoEmbed';

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
  placeholder = 'Start writing your amazing content...',
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
        openOnClick: false, // CRITICAL: Prevent opening on click in editor
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true, // CRITICAL: Allow base64 for fallback
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      VideoEmbed.configure({
        HTMLAttributes: {
          class: '',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes (for editing existing posts)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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

    // Extract video ID and create embed URL
    let embedUrl = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (url.includes('vimeo.com')) {
      const videoId = extractVimeoId(url);
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }

    if (embedUrl) {
      editor.chain().focus().setVideoEmbed({ src: embedUrl }).run();
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
    /youtube\.com\/shorts\/([^?]+)/,
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


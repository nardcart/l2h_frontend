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




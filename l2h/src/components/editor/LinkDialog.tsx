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




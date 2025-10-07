import { useState, useRef } from 'react';
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
import { Upload, Link2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onInsertFile?: (file: File, alt?: string) => void;
  onInsertUrl?: (url: string, alt?: string) => void;
}

export default function ImageUploadDialog({ open, onClose, onInsertFile, onInsertUrl }: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 10MB',
          variant: 'destructive',
        });
        return;
      }

      setUploadFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // If onInsertFile is provided, use it (for direct file handling)
      if (onInsertFile) {
        onInsertFile(uploadFile, altText || undefined);
        handleClose();
        return;
      }

      // Otherwise, upload to server and get URL
      const formData = new FormData();
      formData.append('file', uploadFile);

      const result = await apiService.uploadFileSimple<{ url: string; key: string; size: number; mimetype: string }>(
        API_ENDPOINTS.UPLOAD_DIRECT,
        formData,
        true
      );

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      if (onInsertUrl) {
        onInsertUrl(result.url, altText || undefined);
      }
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInsertUrl = () => {
    if (!imageUrl.trim()) {
      toast({
        title: 'No URL provided',
        description: 'Please enter an image URL',
        variant: 'destructive',
      });
      return;
    }

    if (onInsertUrl) {
      onInsertUrl(imageUrl, altText || undefined);
    }
    handleClose();
  };

  const handleClose = () => {
    setImageUrl('');
    setUploadFile(null);
    setPreview('');
    setAltText('');
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image from your computer or paste a URL
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">From URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Alt Text Input */}
              <div>
                <Label htmlFor="alt-text-upload">Alt Text (Optional)</Label>
                <Input
                  id="alt-text-upload"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                    <p className="text-sm text-gray-600">{uploadFile?.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadFile(null);
                        setPreview('');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, WebP or GIF (max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {uploadFile && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    File will be uploaded to Vercel Blob storage
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadFile || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Insert
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInsertUrl()}
                />
              </div>

              <div>
                <Label htmlFor="alt-text-url">Alt Text (Optional)</Label>
                <Input
                  id="alt-text-url"
                  placeholder="Describe the image for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              {imageUrl && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleInsertUrl}>
                <Link2 className="mr-2 h-4 w-4" />
                Insert Image
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

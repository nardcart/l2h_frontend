import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ebookApi } from '@/api/ebookApi';
import type { Ebook } from '@/types/ebook';
import { Loader2 } from 'lucide-react';

const downloadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  hearAbout: z.string().optional(),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  ebook: Ebook;
}

export default function DownloadModal({ open, onClose, ebook }: DownloadModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const onSubmit = async (data: DownloadFormData) => {
    setIsSubmitting(true);
    try {
      const response = await ebookApi.downloadEbook({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        hearAbout: data.hearAbout,
        ebookId: ebook._id,
      });

      // Fetch the file as a blob to force download (works with cross-origin URLs)
      const downloadUrl = response.data.downloadUrl;
      const fileResponse = await fetch(downloadUrl);
      const blob = await fileResponse.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${ebook.name}.pdf` || 'ebook.pdf';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      // Close modal and reset form immediately
      onClose();
      reset();
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to download ebook',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-2 border-purple-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-purple-600">
            📚 Download {ebook.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter your details and we'll send you the PDF instantly!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 flex items-center gap-2 font-medium">
              <span className="text-xl">⚡</span>
              <span>Instant download - No OTP verification needed!</span>
            </p>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-base">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-base">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <Label htmlFor="mobile" className="text-base">
              Mobile Number
            </Label>
            <Input
              id="mobile"
              placeholder="1234567890"
              {...register('mobile')}
            />
          </div>

          {/* How did you hear about us */}
          <div>
            <Label htmlFor="hearAbout" className="text-base">
              How did you hear about us?
            </Label>
            <Select onValueChange={(value) => setValue('hearAbout', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="friend">Friend/Colleague</SelectItem>
                <SelectItem value="advertisement">Advertisement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-6 font-bold shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                📥 Download PDF Instantly
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your download will start automatically in a new tab!
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}



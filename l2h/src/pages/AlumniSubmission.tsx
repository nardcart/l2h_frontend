import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { alumniService } from '@/services/alumni.service';
import type { AlumniCreatePayload } from '@/types/alumni';
import { DEFAULT_ALUMNI_FORM } from '@/types/alumni';
import {
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

const MAX_PROFILE_IMAGE_SIZE_MB = 20;
const MAX_CERTIFICATE_SIZE_MB = 100;

const cropImageToSquare = async (file: File): Promise<File> => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to read selected image.'));
      img.src = imageUrl;
    });

    const cropSize = Math.min(image.width, image.height);
    const offsetX = (image.width - cropSize) / 2;
    const offsetY = (image.height - cropSize) / 2;
    const outputSize = Math.min(cropSize, 1200);

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to prepare image canvas.');
    }

    context.drawImage(
      image,
      offsetX,
      offsetY,
      cropSize,
      cropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });

    if (!blob) {
      throw new Error('Failed to process image.');
    }

    return new File([blob], `alumni-profile-${Date.now()}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

export default function AlumniSubmission() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AlumniCreatePayload>(DEFAULT_ALUMNI_FORM);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState('');

  const createMutation = useMutation({
    mutationFn: async (payload: AlumniCreatePayload) => alumniService.create(payload),
    onSuccess: () => {
      toast({
        title: 'Application submitted',
        description:
          'Your alumni submission has been received and is now waiting for admin approval.',
      });
      setFormData(DEFAULT_ALUMNI_FORM);
      setCertificateName('');
      queryClient.invalidateQueries({ queryKey: ['public-alumni'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Submission failed',
        description: error.message || 'Unable to submit your alumni profile right now.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile?.trim() || '',
      program_name: formData.program_name.trim(),
      profession: formData.profession?.trim() || '',
      skills: formData.skills?.trim() || '',
      profile_image_url: formData.profile_image_url?.trim() || '',
      certificate_url: formData.certificate_url?.trim() || '',
    });
  };

  const handleProfileImageChange = async (file: File) => {
    setIsUploadingProfileImage(true);

    try {
      const croppedFile = await cropImageToSquare(file);

      if (croppedFile.size > MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024) {
        throw new Error(`Profile image must be ${MAX_PROFILE_IMAGE_SIZE_MB}MB or smaller after square crop.`);
      }

      const uploadResult = await alumniService.uploadProfileImage(croppedFile);
      setFormData((current) => ({
        ...current,
        profile_image_url: uploadResult.url,
      }));

      toast({
        title: 'Profile photo uploaded',
        description: 'Your image was square-cropped and uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Image upload failed',
        description: error.message || 'Unable to upload profile photo right now.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const handleCertificateChange = async (file: File) => {
    setIsUploadingCertificate(true);

    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed for certificates.');
      }

      if (file.size > MAX_CERTIFICATE_SIZE_MB * 1024 * 1024) {
        throw new Error(`Certificate PDF must be ${MAX_CERTIFICATE_SIZE_MB}MB or smaller.`);
      }

      const uploadResult = await alumniService.uploadCertificate(file);
      setFormData((current) => ({
        ...current,
        certificate_url: uploadResult.url,
      }));
      setCertificateName(uploadResult.fileName || file.name);

      toast({
        title: 'Certificate uploaded',
        description: 'Your certificate PDF was uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Certificate upload failed',
        description: error.message || 'Unable to upload certificate PDF right now.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className="bg-gradient-to-b from-white to-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/learners-network"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Alumni Directory
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="rounded-3xl bg-slate-950 p-8 text-white">
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/10">Public Submission Form</Badge>
              <h1 className="text-3xl font-bold">Join the L2H alumni network</h1>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                Submit your profile here. Every submission is stored privately first and appears publicly only after an
                admin approves it.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                  <p className="text-sm text-slate-200">Your profile starts in pending review status by default.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                  <p className="text-sm text-slate-200">
                    Approved alumni are shown on the public directory below.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                  <p className="text-sm text-slate-200">
                    Unique ID and course name help the admin verify your record faster.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                  <p className="text-sm text-slate-200">
                    Profile photo is auto-cropped to a square ratio. Image limit is 20MB and certificate PDF limit is
                    100MB.
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-sky-300" />
                  <p className="text-sm leading-6 text-slate-200">
                    Once approved by the admin, your profile becomes visible on the public alumni page automatically.
                  </p>
                </div>
              </div>
            </div>

            <Card className="border border-slate-200 shadow-lg">
              <CardHeader>
                <h2 className="text-2xl font-bold text-slate-900">Submit your alumni profile</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in your details and we will send your profile to the admin review queue.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      required
                      value={formData.full_name}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, full_name: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, email: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile || ''}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, mobile: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="program_name">Program Name</Label>
                    <Input
                      id="program_name"
                      required
                      value={formData.program_name}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, program_name: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession || ''}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, profession: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="profile_image_upload">Profile Photo</Label>
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border bg-white">
                          {formData.profile_image_url ? (
                            <img
                              src={formData.profile_image_url}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                              <ImagePlus className="h-8 w-8" />
                              <span className="text-xs">1:1 preview</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <Input
                            id="profile_image_upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                void handleProfileImageChange(file);
                              }
                            }}
                            disabled={isUploadingProfileImage}
                          />
                          <p className="text-xs text-muted-foreground">
                            We automatically crop the image to a square ratio before uploading to Vercel Blob. Max size:
                            20MB.
                          </p>
                          {formData.profile_image_url && (
                            <div className="space-y-2">
                              <Input value={formData.profile_image_url} readOnly />
                              <a
                                href={formData.profile_image_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Open uploaded image
                              </a>
                            </div>
                          )}
                          {isUploadingProfileImage && (
                            <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading profile photo...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="certificate_upload">Certificate PDF</Label>
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <div className="space-y-3">
                        <Input
                          id="certificate_upload"
                          type="file"
                          accept="application/pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              void handleCertificateChange(file);
                            }
                          }}
                          disabled={isUploadingCertificate}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload your certificate as a PDF. Max size: 100MB.
                        </p>
                        {formData.certificate_url && (
                          <div className="rounded-xl border bg-white p-3">
                            <div className="flex items-start gap-3">
                              <FileText className="mt-0.5 h-5 w-5 text-rose-500" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900">
                                  {certificateName || 'Uploaded certificate.pdf'}
                                </p>
                                <Input value={formData.certificate_url} readOnly className="mt-2" />
                                <a
                                  href={formData.certificate_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open uploaded certificate
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                        {isUploadingCertificate && (
                          <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading certificate PDF...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills || ''}
                      onChange={(event) =>
                        setFormData((current) => ({ ...current, skills: event.target.value }))
                      }
                      className="min-h-[120px]"
                      placeholder="Share the most important skills you built with L2H."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      disabled={createMutation.isPending || isUploadingProfileImage || isUploadingCertificate}
                    >
                      {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit for Review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

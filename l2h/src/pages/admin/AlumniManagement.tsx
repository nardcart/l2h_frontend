import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  UserRoundCheck,
  UserRoundX,
  Users,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { alumniService } from '@/services/alumni.service';
import type { AlumniRecord, AlumniUpdatePayload } from '@/types/alumni';
import { DEFAULT_ALUMNI_FORM } from '@/types/alumni';

const MAX_PROFILE_IMAGE_SIZE_MB = 20;
const MAX_CERTIFICATE_SIZE_MB = 100;

const getStatusBadge = (status: boolean) =>
  status
    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
    : 'bg-amber-100 text-amber-800 hover:bg-amber-100';

const getFileNameFromUrl = (url?: string) => {
  if (!url) {
    return '';
  }

  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split('/').pop() || '');
  } catch {
    return url.split('/').pop() || '';
  }
};

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

export default function AlumniManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'true' | 'false'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);
  const [formData, setFormData] = useState<AlumniUpdatePayload>(DEFAULT_ALUMNI_FORM);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState('');

  const { data: alumni = [], isLoading } = useQuery({
    queryKey: ['admin-alumni', statusFilter],
    queryFn: () =>
      alumniService.listAdmin(statusFilter === 'all' ? undefined : statusFilter),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: AlumniUpdatePayload }) =>
      alumniService.update(id, payload),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Alumni record updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      queryClient.invalidateQueries({ queryKey: ['public-alumni'] });
      setIsEditOpen(false);
      setSelectedAlumni(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update alumni record.',
        variant: 'destructive',
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) =>
      alumniService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      toast({
        title: 'Success',
        description: variables.status
          ? 'Alumni record approved successfully.'
          : 'Alumni record denied successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      queryClient.invalidateQueries({ queryKey: ['public-alumni'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update alumni status.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => alumniService.delete(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Alumni record deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-alumni'] });
      queryClient.invalidateQueries({ queryKey: ['public-alumni'] });
      setIsDeleteOpen(false);
      setSelectedAlumni(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete alumni record.',
        variant: 'destructive',
      });
    },
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredAlumni = alumni.filter((record) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      record.full_name,
      record.email,
      record.unique_id,
      record.program_name,
      record.profession || '',
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const totalCount = alumni.length;
  const approvedCount = alumni.filter((record) => record.status).length;
  const pendingCount = alumni.filter((record) => !record.status).length;

  const openEditDialog = (record: AlumniRecord) => {
    setSelectedAlumni(record);
    setFormData({
      full_name: record.full_name || '',
      email: record.email || '',
      mobile: record.mobile || '',
      program_name: record.program_name || '',
      profession: record.profession || '',
      skills: record.skills || '',
      profile_image_url: record.profile_image_url || '',
      certificate_url: record.certificate_url || '',
      storage_folder: record.storage_folder || '',
    });
    setCertificateName(getFileNameFromUrl(record.certificate_url));
    setIsEditOpen(true);
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
        description: 'The image was square-cropped and uploaded successfully.',
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
        description: 'Certificate PDF uploaded successfully.',
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

  const handleUpdate = () => {
    if (!selectedAlumni) {
      return;
    }

    updateMutation.mutate({
      id: selectedAlumni.id,
      payload: formData,
    });
  };

  const handleDelete = () => {
    if (!selectedAlumni) {
      return;
    }

    deleteMutation.mutate(selectedAlumni.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alumni Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review public submissions, update alumni details, and approve profiles for display.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-3xl">{totalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, ID, program, or profession..."
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value: 'all' | 'true' | 'false') => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alumni Directory</CardTitle>
          <CardDescription>
            Public submissions stay hidden until an admin approves them.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No alumni records matched your filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unique ID</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Profession</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlumni.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">#{record.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.full_name}</div>
                        <div className="text-sm text-muted-foreground">{record.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-slate-700">{record.unique_id}</span>
                    </TableCell>
                    <TableCell>{record.program_name}</TableCell>
                    <TableCell>{record.profession || 'Not shared'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(record.status)}>
                        {record.status ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(record)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => statusMutation.mutate({ id: record.id, status: true })}
                          disabled={statusMutation.isPending || record.status}
                        >
                          <UserRoundCheck className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-amber-600 text-white hover:bg-amber-700"
                          onClick={() => statusMutation.mutate({ id: record.id, status: false })}
                          disabled={statusMutation.isPending || !record.status}
                        >
                          <UserRoundX className="mr-2 h-4 w-4" />
                          Deny
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="More actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedAlumni(record);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setSelectedAlumni(null);
            setCertificateName('');
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Alumni</DialogTitle>
            <DialogDescription>
              Update the alumni record. Approval status is managed separately from the table.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Generated Unique ID</Label>
              <Input value={selectedAlumni?.unique_id || ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label>Numeric Alumni ID</Label>
              <Input value={selectedAlumni?.id ? `#${selectedAlumni.id}` : ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
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
            <div className="space-y-2">
              <Label htmlFor="program_name">Program Name</Label>
              <Input
                id="program_name"
                value={formData.program_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, program_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
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
                      Auto-crops to square before upload. Max size: 20MB.
                    </p>
                    <Input
                      value={formData.profile_image_url || ''}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          profile_image_url: event.target.value,
                        }))
                      }
                      placeholder="Profile image URL"
                    />
                    {formData.profile_image_url && (
                      <a
                        href={formData.profile_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open uploaded image
                      </a>
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
                  <p className="text-xs text-muted-foreground">PDF only. Max size: 100MB.</p>
                  <Input
                    value={formData.certificate_url || ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        certificate_url: event.target.value,
                      }))
                    }
                    placeholder="Certificate PDF URL"
                  />
                  {formData.certificate_url && (
                    <div className="rounded-xl border bg-white p-3">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 text-rose-500" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {certificateName || getFileNameFromUrl(formData.certificate_url)}
                          </p>
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
              <Label htmlFor="storage_folder">Storage Folder</Label>
              <Input
                id="storage_folder"
                value={formData.storage_folder || ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    storage_folder: event.target.value,
                  }))
                }
              />
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedAlumni(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || isUploadingProfileImage || isUploadingCertificate}
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setSelectedAlumni(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete alumni record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>{selectedAlumni?.full_name}</strong> from the alumni directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

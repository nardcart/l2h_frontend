import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
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

const getStatusBadge = (status: boolean) =>
  status
    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
    : 'bg-amber-100 text-amber-800 hover:bg-amber-100';

export default function AlumniManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'true' | 'false'>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);
  const [formData, setFormData] = useState<AlumniUpdatePayload>(DEFAULT_ALUMNI_FORM);

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
    setIsEditOpen(true);
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
            <div className="space-y-2">
              <Label htmlFor="profile_image_url">Profile Image URL</Label>
              <Input
                id="profile_image_url"
                value={formData.profile_image_url || ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    profile_image_url: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certificate_url">Certificate URL</Label>
              <Input
                id="certificate_url"
                value={formData.certificate_url || ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    certificate_url: event.target.value,
                  }))
                }
              />
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
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
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

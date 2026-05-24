import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  MinusCircle,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
  UserPlus,
  Video,
  XCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { candidateService } from '@/services/candidate.service';
import type {
  CandidateApprovalStatus,
  CandidateRecord,
  CandidateRegistrationPayload,
  CandidateUpdatePayload,
  ExperienceLevel,
  Qualification,
  WorkExperience,
  WorkMode,
} from '@/types/candidate';
import {
  DEFAULT_CANDIDATE_FORM,
  DEFAULT_WORK_EXPERIENCE,
  EXPERIENCE_LEVEL_LABELS,
  QUALIFICATION_LABELS,
  WORK_MODE_LABELS,
} from '@/types/candidate';

type StatusFilter = 'all' | CandidateApprovalStatus;

const MAX_RESUME_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;

const getStatusBadge = (status: CandidateApprovalStatus) => {
  if (status === 'accepted') {
    return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100';
  }

  if (status === 'denied') {
    return 'bg-red-100 text-red-800 hover:bg-red-100';
  }

  return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
};

const getStatusLabel = (status: CandidateApprovalStatus) => {
  if (status === 'accepted') {
    return 'Accepted';
  }

  if (status === 'denied') {
    return 'Denied';
  }

  return 'Pending';
};

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

const QUALIFICATION_OPTIONS: Qualification[] = [
  'high_school',
  'diploma',
  'bachelors',
  'masters',
  'phd',
  'other',
];

const WORK_MODE_OPTIONS: WorkMode[] = ['remote', 'onsite', 'hybrid'];

const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevel[] = ['fresher', 'experienced'];

export default function CandidateManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRecord | null>(null);
  const [formData, setFormData] = useState<CandidateUpdatePayload>({
    ...DEFAULT_CANDIDATE_FORM,
  });
  const [createFormData, setCreateFormData] = useState<CandidateRegistrationPayload>({
    ...DEFAULT_CANDIDATE_FORM,
  });
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [createResumeName, setCreateResumeName] = useState('');
  const [isUploadingCreateResume, setIsUploadingCreateResume] = useState(false);
  const [isUploadingCreateVideo, setIsUploadingCreateVideo] = useState(false);

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['admin-candidates', statusFilter],
    queryFn: () =>
      candidateService.listAdmin(statusFilter === 'all' ? undefined : statusFilter),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CandidateUpdatePayload }) =>
      candidateService.update(id, payload),
    onSuccess: () => {
      toast({
        title: 'Candidate updated',
        description: 'Candidate details were updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['public-candidates'] });
      setIsEditOpen(false);
      setSelectedCandidate(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update candidate.',
        variant: 'destructive',
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CandidateRegistrationPayload) =>
      candidateService.create(payload),
    onSuccess: () => {
      toast({
        title: 'Candidate created',
        description: 'Candidate added successfully. Pending admin approval.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['public-candidates'] });
      setIsCreateOpen(false);
      setCreateFormData({ ...DEFAULT_CANDIDATE_FORM });
      setCreateResumeName('');
    },
    onError: (error: any) => {
      toast({
        title: 'Create failed',
        description: error.message || 'Failed to create candidate.',
        variant: 'destructive',
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: CandidateApprovalStatus;
    }) => candidateService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      toast({
        title: 'Status updated',
        description:
          variables.status === 'accepted'
            ? 'Candidate accepted and now visible publicly.'
            : variables.status === 'denied'
              ? 'Candidate denied and hidden from public listing.'
              : 'Candidate moved back to pending review.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['public-candidates'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Status update failed',
        description: error.message || 'Failed to update candidate status.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => candidateService.delete(id),
    onSuccess: () => {
      toast({
        title: 'Candidate deleted',
        description: 'Candidate record was deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['public-candidates'] });
      setIsDeleteOpen(false);
      setSelectedCandidate(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete candidate.',
        variant: 'destructive',
      });
    },
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCandidates = candidates.filter((record) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      record.full_name,
      record.email,
      record.unique_id,
      record.mobile_number,
      record.preferred_job_role,
      record.college_name,
      record.city || '',
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const totalCount = candidates.length;
  const acceptedCount = candidates.filter((c) => c.status === 'accepted').length;
  const pendingCount = candidates.filter((c) => c.status === 'pending').length;
  const deniedCount = candidates.filter((c) => c.status === 'denied').length;

  const openEditDialog = (record: CandidateRecord) => {
    setSelectedCandidate(record);
    setFormData({
      full_name: record.full_name || '',
      mobile_number: record.mobile_number || '',
      email: record.email || '',
      city: record.city || '',
      state: record.state || '',
      linkedin_url: record.linkedin_url || '',
      portfolio_url: record.portfolio_url || '',
      photograph_url: record.photograph_url || '',
      photograph_key: record.photograph_key || '',
      college_name: record.college_name || '',
      highest_qualification: record.highest_qualification || 'bachelors',
      current_course: record.current_course || '',
      preferred_job_role: record.preferred_job_role || '',
      preferred_work_mode: record.preferred_work_mode || 'onsite',
      preferred_job_location: record.preferred_job_location || '',
      expected_salary: record.expected_salary || '',
      available_joining_date: record.available_joining_date || '',
      additional_skills: record.additional_skills || '',
      resume_url: record.resume_url || '',
      resume_key: record.resume_key || '',
      experience_level: record.experience_level || 'fresher',
      previous_company_name: record.previous_company_name || '',
      company_position: record.company_position || '',
      description: record.description || '',
      work_experiences: record.work_experiences?.length
        ? record.work_experiences
        : [],
      internship_experience: record.internship_experience || '',
      total_work_experience: record.total_work_experience || '',
      key_responsibilities: record.key_responsibilities || '',
      career_goals: record.career_goals || '',
      video_introduction_url: record.video_introduction_url || '',
      video_introduction_key: record.video_introduction_key || '',
      terms_accepted: record.terms_accepted ?? false,
    });
    setResumeName(getFileNameFromUrl(record.resume_url));
    setIsEditOpen(true);
  };

  const handleResumeUpload = async (file: File) => {
    setIsUploadingResume(true);

    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed for resume.');
      }

      if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
        throw new Error(`Resume must be ${MAX_RESUME_SIZE_MB}MB or smaller.`);
      }

      const uploadResult = await candidateService.uploadResume(file);
      setFormData((current) => ({
        ...current,
        resume_url: uploadResult.url,
        resume_key: uploadResult.key,
      }));
      setResumeName(uploadResult.fileName || file.name);

      toast({
        title: 'Resume uploaded',
        description: 'Resume PDF uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Resume upload failed',
        description: error.message || 'Unable to upload resume.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handlePhotographChange = async (file: File) => {
    try {
      const uploadResult = await candidateService.uploadPhotograph(file);
      setFormData((current) => ({
        ...current,
        photograph_url: uploadResult.url,
        photograph_key: uploadResult.key,
      }));

      toast({
        title: 'Photograph uploaded',
        description: 'Professional photograph uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Photograph upload failed',
        description: error.message || 'Unable to upload photograph.',
        variant: 'destructive',
      });
    }
  };

  const handleVideoUpload = async (file: File) => {
    setIsUploadingVideo(true);

    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Only video files are allowed.');
      }

      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        throw new Error(`Video must be ${MAX_VIDEO_SIZE_MB}MB or smaller.`);
      }

      const uploadResult = await candidateService.uploadVideo(file);
      setFormData((current) => ({
        ...current,
        video_introduction_url: uploadResult.url,
        video_introduction_key: uploadResult.key,
      }));

      toast({
        title: 'Video uploaded',
        description: 'Video introduction uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Video upload failed',
        description: error.message || 'Unable to upload video.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleCreateResumeUpload = async (file: File) => {
    setIsUploadingCreateResume(true);

    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed for resume.');
      }

      if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
        throw new Error(`Resume must be ${MAX_RESUME_SIZE_MB}MB or smaller.`);
      }

      const uploadResult = await candidateService.uploadResume(file);
      setCreateFormData((current) => ({
        ...current,
        resume_url: uploadResult.url,
        resume_key: uploadResult.key,
      }));
      setCreateResumeName(uploadResult.fileName || file.name);

      toast({
        title: 'Resume uploaded',
        description: 'Resume PDF uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Resume upload failed',
        description: error.message || 'Unable to upload resume.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingCreateResume(false);
    }
  };

  const handleCreatePhotographChange = async (file: File) => {
    try {
      const uploadResult = await candidateService.uploadPhotograph(file);
      setCreateFormData((current) => ({
        ...current,
        photograph_url: uploadResult.url,
        photograph_key: uploadResult.key,
      }));

      toast({
        title: 'Photograph uploaded',
        description: 'Professional photograph uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Photograph upload failed',
        description: error.message || 'Unable to upload photograph.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateVideoUpload = async (file: File) => {
    setIsUploadingCreateVideo(true);

    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Only video files are allowed.');
      }

      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        throw new Error(`Video must be ${MAX_VIDEO_SIZE_MB}MB or smaller.`);
      }

      const uploadResult = await candidateService.uploadVideo(file);
      setCreateFormData((current) => ({
        ...current,
        video_introduction_url: uploadResult.url,
        video_introduction_key: uploadResult.key,
      }));

      toast({
        title: 'Video uploaded',
        description: 'Video introduction uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Video upload failed',
        description: error.message || 'Unable to upload video.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingCreateVideo(false);
    }
  };

  const handleUpdate = () => {
    if (!selectedCandidate) {
      return;
    }

    updateMutation.mutate({
      id: selectedCandidate.id,
      payload: {
        ...formData,
        expected_salary: formData.expected_salary
          ? Number(formData.expected_salary)
          : '',
        total_work_experience: formData.total_work_experience
          ? Number(formData.total_work_experience)
          : '',
      },
    });
  };

  const handleCreate = () => {
    createMutation.mutate({
      ...createFormData,
      expected_salary: createFormData.expected_salary
        ? Number(createFormData.expected_salary)
        : '',
      total_work_experience: createFormData.total_work_experience
        ? Number(createFormData.total_work_experience)
        : '',
    });
  };

  const handleDelete = () => {
    if (!selectedCandidate) {
      return;
    }

    deleteMutation.mutate(selectedCandidate.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidate Management</h1>
          <p className="mt-1 text-muted-foreground">
            Review candidate submissions and control which profiles appear on the public placement listing.
          </p>
        </div>
        <Button
          onClick={() => {
            setCreateFormData({ ...DEFAULT_CANDIDATE_FORM });
            setCreateResumeName('');
            setIsCreateOpen(true);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Candidates</CardDescription>
            <CardTitle className="text-3xl">{totalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl">{acceptedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Denied</CardDescription>
            <CardTitle className="text-3xl">{deniedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, ID, mobile, job role, college, or city..."
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value: StatusFilter) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Candidates</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate Review Queue</CardTitle>
          <CardDescription>
            Only accepted candidates are visible in the public placement API/page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No candidate submissions matched your filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">#{record.id}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                        onClick={() => navigate(`/admin/candidates/${record.id}`)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-slate-50">
                          {record.photograph_url ? (
                            <img
                              src={record.photograph_url}
                              alt={`${record.full_name} photo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserPlus className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-blue-600 hover:underline">{record.full_name}</div>
                          <div className="text-sm text-muted-foreground">{record.email}</div>
                          <div className="text-xs text-slate-500">{record.unique_id}</div>
                        </div>
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{record.preferred_job_role}</div>
                      <div className="text-sm text-muted-foreground">
                        {WORK_MODE_LABELS[record.preferred_work_mode]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{record.college_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {QUALIFICATION_LABELS[record.highest_qualification]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {EXPERIENCE_LEVEL_LABELS[record.experience_level]}
                      </Badge>
                      {record.experience_level === 'experienced' && record.total_work_experience && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {record.total_work_experience} yr(s)
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(record.status)}>
                        {getStatusLabel(record.status)}
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
                          onClick={() =>
                            statusMutation.mutate({ id: record.id, status: 'accepted' })
                          }
                          disabled={statusMutation.isPending || record.status === 'accepted'}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() =>
                            statusMutation.mutate({ id: record.id, status: 'denied' })
                          }
                          disabled={statusMutation.isPending || record.status === 'denied'}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
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
                              onClick={() =>
                                statusMutation.mutate({ id: record.id, status: 'pending' })
                              }
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Mark Pending
                            </DropdownMenuItem>
                            {record.linkedin_url && (
                              <DropdownMenuItem asChild>
                                <a href={record.linkedin_url} target="_blank" rel="noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  LinkedIn Profile
                                </a>
                              </DropdownMenuItem>
                            )}
                            {record.resume_url && (
                              <DropdownMenuItem asChild>
                                <a href={record.resume_url} target="_blank" rel="noreferrer">
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Resume
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedCandidate(record);
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
            setSelectedCandidate(null);
            setResumeName('');
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Update candidate details. Accept/deny visibility is managed from the table actions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Generated Candidate ID</Label>
              <Input value={selectedCandidate?.unique_id || ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label>Numeric Candidate ID</Label>
              <Input value={selectedCandidate?.id ? `#${selectedCandidate.id}` : ''} readOnly disabled />
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
              <Label htmlFor="mobile_number">Mobile Number</Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, mobile_number: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, city: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, state: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, linkedin_url: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio / Website</Label>
              <Input
                id="portfolio_url"
                value={formData.portfolio_url || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, portfolio_url: event.target.value }))
                }
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="photograph_upload">Professional Photograph</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border bg-white">
                    {formData.photograph_url ? (
                      <img
                        src={formData.photograph_url}
                        alt="Photograph preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-xs">Photo preview</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <Input
                      id="photograph_upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handlePhotographChange(file);
                        }
                      }}
                    />
                    <Input
                      value={formData.photograph_url || ''}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          photograph_url: event.target.value,
                        }))
                      }
                      placeholder="Photograph URL"
                    />
                    {formData.photograph_url && (
                      <a
                        href={formData.photograph_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open uploaded photograph
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college_name">College / University Name</Label>
              <Input
                id="college_name"
                value={formData.college_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, college_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="highest_qualification">Highest Qualification</Label>
              <Select
                value={formData.highest_qualification}
                onValueChange={(value: Qualification) =>
                  setFormData((current) => ({ ...current, highest_qualification: value }))
                }
              >
                <SelectTrigger id="highest_qualification">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATION_OPTIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {QUALIFICATION_LABELS[q]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_course">Current Course Enrolled</Label>
              <Input
                id="current_course"
                value={formData.current_course || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, current_course: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_job_role">Preferred Job Role</Label>
              <Input
                id="preferred_job_role"
                value={formData.preferred_job_role}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, preferred_job_role: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_work_mode">Preferred Work Mode</Label>
              <Select
                value={formData.preferred_work_mode}
                onValueChange={(value: WorkMode) =>
                  setFormData((current) => ({ ...current, preferred_work_mode: value }))
                }
              >
                <SelectTrigger id="preferred_work_mode">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODE_OPTIONS.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {WORK_MODE_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_job_location">Preferred Job Location</Label>
              <Input
                id="preferred_job_location"
                value={formData.preferred_job_location}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, preferred_job_location: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_salary">Expected Salary / Stipend</Label>
              <Input
                id="expected_salary"
                type="number"
                value={formData.expected_salary || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, expected_salary: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_joining_date">Available Joining Date</Label>
              <Input
                id="available_joining_date"
                type="date"
                value={
                  formData.available_joining_date
                    ? new Date(formData.available_joining_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={(event) =>
                  setFormData((current) => ({ ...current, available_joining_date: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value: ExperienceLevel) =>
                  setFormData((current) => ({ ...current, experience_level: value }))
                }
              >
                <SelectTrigger id="experience_level">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {EXPERIENCE_LEVEL_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.experience_level === 'experienced' && (
              <>
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Work Experiences</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          work_experiences: [
                            ...(current.work_experiences || []),
                            { ...DEFAULT_WORK_EXPERIENCE },
                          ],
                        }))
                      }
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>
                  {(formData.work_experiences || []).length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                      No work experiences added yet. Click "Add Experience" to add one.
                    </p>
                  )}
                  {(formData.work_experiences || []).map((exp, index) => (
                    <div key={index} className="rounded-xl border bg-slate-50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">
                          Experience #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-500 hover:text-rose-700"
                          onClick={() =>
                            setFormData((current) => ({
                              ...current,
                              work_experiences: (current.work_experiences || []).filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label>Company Name</Label>
                          <Input
                            value={exp.company_name}
                            onChange={(event) => {
                              const updated = [...(formData.work_experiences || [])];
                              updated[index] = { ...exp, company_name: event.target.value };
                              setFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(event) => {
                              const updated = [...(formData.work_experiences || [])];
                              updated[index] = { ...exp, position: event.target.value };
                              setFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g. Jan 2022 - Dec 2024"
                            value={exp.duration || ''}
                            onChange={(event) => {
                              const updated = [...(formData.work_experiences || [])];
                              updated[index] = { ...exp, duration: event.target.value };
                              setFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1 flex items-end pb-1">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.is_current}
                              onChange={(event) => {
                                const updated = [...(formData.work_experiences || [])];
                                updated[index] = { ...exp, is_current: event.target.checked };
                                setFormData((current) => ({ ...current, work_experiences: updated }));
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            Currently working here
                          </label>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description || ''}
                            onChange={(event) => {
                              const updated = [...(formData.work_experiences || [])];
                              updated[index] = { ...exp, description: event.target.value };
                              setFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="internship_experience">Internship Experience</Label>
                  <Input
                    id="internship_experience"
                    value={formData.internship_experience || ''}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, internship_experience: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_work_experience">Total Work Experience (Years)</Label>
                  <Input
                    id="total_work_experience"
                    type="number"
                    value={formData.total_work_experience || ''}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, total_work_experience: event.target.value }))
                    }
                  />
                </div>
              </>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="key_responsibilities">Key Responsibilities Handled</Label>
              <Textarea
                id="key_responsibilities"
                value={formData.key_responsibilities || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, key_responsibilities: event.target.value }))
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="additional_skills">Additional Skills</Label>
              <Textarea
                id="additional_skills"
                value={formData.additional_skills || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, additional_skills: event.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea
                id="career_goals"
                value={formData.career_goals || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, career_goals: event.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="resume_upload">Resume / CV</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="space-y-3">
                  <Input
                    id="resume_upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleResumeUpload(file);
                      }
                    }}
                    disabled={isUploadingResume}
                  />
                  <p className="text-xs text-muted-foreground">PDF only. Max size: {MAX_RESUME_SIZE_MB}MB.</p>
                  <Input
                    value={formData.resume_url || ''}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, resume_url: event.target.value }))
                    }
                    placeholder="Resume URL"
                  />
                  {formData.resume_url && (
                    <div className="rounded-xl border bg-white p-3">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 text-rose-500" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {resumeName || getFileNameFromUrl(formData.resume_url)}
                          </p>
                          <a
                            href={formData.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open uploaded resume
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {isUploadingResume && (
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading resume...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="video_upload">Video Introduction (30-40 sec)</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="space-y-3">
                  <Input
                    id="video_upload"
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleVideoUpload(file);
                      }
                    }}
                    disabled={isUploadingVideo}
                  />
                  <p className="text-xs text-muted-foreground">Video only. Max size: {MAX_VIDEO_SIZE_MB}MB.</p>
                  <Input
                    value={formData.video_introduction_url || ''}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, video_introduction_url: event.target.value }))
                    }
                    placeholder="Video introduction URL"
                  />
                  {formData.video_introduction_url && (
                    <a
                      href={formData.video_introduction_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Video className="h-4 w-4" />
                      Open uploaded video
                    </a>
                  )}
                  {isUploadingVideo && (
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading video...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="terms_accepted"
                checked={formData.terms_accepted}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, terms_accepted: event.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="terms_accepted" className="text-sm">
                I agree to share my profile with hiring partners associated with the platform.
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedCandidate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending || isUploadingResume || isUploadingVideo}
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setCreateFormData({ ...DEFAULT_CANDIDATE_FORM });
            setCreateResumeName('');
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Manually add a new candidate. The candidate will be created with pending status.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create_full_name">Full Name *</Label>
              <Input
                id="create_full_name"
                value={createFormData.full_name}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, full_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_email">Email *</Label>
              <Input
                id="create_email"
                type="email"
                value={createFormData.email}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_mobile_number">Mobile Number *</Label>
              <Input
                id="create_mobile_number"
                value={createFormData.mobile_number}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, mobile_number: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_password">Password *</Label>
              <Input
                id="create_password"
                type="password"
                value={createFormData.password}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_city">City *</Label>
              <Input
                id="create_city"
                value={createFormData.city}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, city: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_state">State *</Label>
              <Input
                id="create_state"
                value={createFormData.state}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, state: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_linkedin_url">LinkedIn Profile URL</Label>
              <Input
                id="create_linkedin_url"
                value={createFormData.linkedin_url || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, linkedin_url: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_portfolio_url">Portfolio / Website</Label>
              <Input
                id="create_portfolio_url"
                value={createFormData.portfolio_url || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, portfolio_url: event.target.value }))
                }
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="create_photograph_upload">Professional Photograph</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border bg-white">
                    {createFormData.photograph_url ? (
                      <img
                        src={createFormData.photograph_url}
                        alt="Photograph preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-xs">Photo preview</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <Input
                      id="create_photograph_upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          void handleCreatePhotographChange(file);
                        }
                      }}
                    />
                    <Input
                      value={createFormData.photograph_url || ''}
                      onChange={(event) =>
                        setCreateFormData((current) => ({
                          ...current,
                          photograph_url: event.target.value,
                        }))
                      }
                      placeholder="Photograph URL"
                    />
                    {createFormData.photograph_url && (
                      <a
                        href={createFormData.photograph_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open uploaded photograph
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create_college_name">College / University Name *</Label>
              <Input
                id="create_college_name"
                value={createFormData.college_name}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, college_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_highest_qualification">Highest Qualification *</Label>
              <Select
                value={createFormData.highest_qualification}
                onValueChange={(value: Qualification) =>
                  setCreateFormData((current) => ({ ...current, highest_qualification: value }))
                }
              >
                <SelectTrigger id="create_highest_qualification">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  {QUALIFICATION_OPTIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {QUALIFICATION_LABELS[q]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_current_course">Current Course Enrolled</Label>
              <Input
                id="create_current_course"
                value={createFormData.current_course || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, current_course: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_preferred_job_role">Preferred Job Role *</Label>
              <Input
                id="create_preferred_job_role"
                value={createFormData.preferred_job_role}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, preferred_job_role: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_preferred_work_mode">Preferred Work Mode *</Label>
              <Select
                value={createFormData.preferred_work_mode}
                onValueChange={(value: WorkMode) =>
                  setCreateFormData((current) => ({ ...current, preferred_work_mode: value }))
                }
              >
                <SelectTrigger id="create_preferred_work_mode">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODE_OPTIONS.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {WORK_MODE_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_preferred_job_location">Preferred Job Location *</Label>
              <Input
                id="create_preferred_job_location"
                value={createFormData.preferred_job_location}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, preferred_job_location: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_expected_salary">Expected Salary / Stipend *</Label>
              <Input
                id="create_expected_salary"
                type="number"
                value={createFormData.expected_salary || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, expected_salary: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_available_joining_date">Available Joining Date *</Label>
              <Input
                id="create_available_joining_date"
                type="date"
                value={
                  createFormData.available_joining_date
                    ? new Date(createFormData.available_joining_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, available_joining_date: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create_experience_level">Experience Level *</Label>
              <Select
                value={createFormData.experience_level}
                onValueChange={(value: ExperienceLevel) =>
                  setCreateFormData((current) => ({ ...current, experience_level: value }))
                }
              >
                <SelectTrigger id="create_experience_level">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {EXPERIENCE_LEVEL_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createFormData.experience_level === 'experienced' && (
              <>
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label>Work Experiences</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCreateFormData((current) => ({
                          ...current,
                          work_experiences: [
                            ...(current.work_experiences || []),
                            { ...DEFAULT_WORK_EXPERIENCE },
                          ],
                        }))
                      }
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>
                  {(createFormData.work_experiences || []).length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                      No work experiences added yet. Click "Add Experience" to add one.
                    </p>
                  )}
                  {(createFormData.work_experiences || []).map((exp, index) => (
                    <div key={index} className="rounded-xl border bg-slate-50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">
                          Experience #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-500 hover:text-rose-700"
                          onClick={() =>
                            setCreateFormData((current) => ({
                              ...current,
                              work_experiences: (current.work_experiences || []).filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <Label>Company Name</Label>
                          <Input
                            value={exp.company_name}
                            onChange={(event) => {
                              const updated = [...(createFormData.work_experiences || [])];
                              updated[index] = { ...exp, company_name: event.target.value };
                              setCreateFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Position</Label>
                          <Input
                            value={exp.position}
                            onChange={(event) => {
                              const updated = [...(createFormData.work_experiences || [])];
                              updated[index] = { ...exp, position: event.target.value };
                              setCreateFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g. Jan 2022 - Dec 2024"
                            value={exp.duration || ''}
                            onChange={(event) => {
                              const updated = [...(createFormData.work_experiences || [])];
                              updated[index] = { ...exp, duration: event.target.value };
                              setCreateFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                          />
                        </div>
                        <div className="space-y-1 flex items-end pb-1">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.is_current}
                              onChange={(event) => {
                                const updated = [...(createFormData.work_experiences || [])];
                                updated[index] = { ...exp, is_current: event.target.checked };
                                setCreateFormData((current) => ({ ...current, work_experiences: updated }));
                              }}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            Currently working here
                          </label>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description || ''}
                            onChange={(event) => {
                              const updated = [...(createFormData.work_experiences || [])];
                              updated[index] = { ...exp, description: event.target.value };
                              setCreateFormData((current) => ({ ...current, work_experiences: updated }));
                            }}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_internship_experience">Internship Experience</Label>
                  <Input
                    id="create_internship_experience"
                    value={createFormData.internship_experience || ''}
                    onChange={(event) =>
                      setCreateFormData((current) => ({ ...current, internship_experience: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_total_work_experience">Total Work Experience (Years)</Label>
                  <Input
                    id="create_total_work_experience"
                    type="number"
                    value={createFormData.total_work_experience || ''}
                    onChange={(event) =>
                      setCreateFormData((current) => ({ ...current, total_work_experience: event.target.value }))
                    }
                  />
                </div>
              </>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="create_key_responsibilities">Key Responsibilities Handled</Label>
              <Textarea
                id="create_key_responsibilities"
                value={createFormData.key_responsibilities || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, key_responsibilities: event.target.value }))
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="create_additional_skills">Additional Skills</Label>
              <Textarea
                id="create_additional_skills"
                value={createFormData.additional_skills || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, additional_skills: event.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="create_career_goals">Career Goals</Label>
              <Textarea
                id="create_career_goals"
                value={createFormData.career_goals || ''}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, career_goals: event.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="create_resume_upload">Resume / CV</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="space-y-3">
                  <Input
                    id="create_resume_upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleCreateResumeUpload(file);
                      }
                    }}
                    disabled={isUploadingCreateResume}
                  />
                  <p className="text-xs text-muted-foreground">PDF only. Max size: {MAX_RESUME_SIZE_MB}MB.</p>
                  <Input
                    value={createFormData.resume_url || ''}
                    onChange={(event) =>
                      setCreateFormData((current) => ({ ...current, resume_url: event.target.value }))
                    }
                    placeholder="Resume URL"
                  />
                  {createFormData.resume_url && (
                    <div className="rounded-xl border bg-white p-3">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 text-rose-500" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">
                            {createResumeName || getFileNameFromUrl(createFormData.resume_url)}
                          </p>
                          <a
                            href={createFormData.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open uploaded resume
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {isUploadingCreateResume && (
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading resume...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="create_video_upload">Video Introduction (30-40 sec)</Label>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="space-y-3">
                  <Input
                    id="create_video_upload"
                    type="file"
                    accept="video/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleCreateVideoUpload(file);
                      }
                    }}
                    disabled={isUploadingCreateVideo}
                  />
                  <p className="text-xs text-muted-foreground">Video only. Max size: {MAX_VIDEO_SIZE_MB}MB.</p>
                  <Input
                    value={createFormData.video_introduction_url || ''}
                    onChange={(event) =>
                      setCreateFormData((current) => ({ ...current, video_introduction_url: event.target.value }))
                    }
                    placeholder="Video introduction URL"
                  />
                  {createFormData.video_introduction_url && (
                    <a
                      href={createFormData.video_introduction_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Video className="h-4 w-4" />
                      Open uploaded video
                    </a>
                  )}
                  {isUploadingCreateVideo && (
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading video...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="create_terms_accepted"
                checked={createFormData.terms_accepted}
                onChange={(event) =>
                  setCreateFormData((current) => ({ ...current, terms_accepted: event.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="create_terms_accepted" className="text-sm">
                I agree to share my profile with hiring partners associated with the platform.
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setCreateFormData({ ...DEFAULT_CANDIDATE_FORM });
                setCreateResumeName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || isUploadingCreateResume || isUploadingCreateVideo}
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setSelectedCandidate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete candidate record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>{selectedCandidate?.full_name}</strong> from candidates.
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

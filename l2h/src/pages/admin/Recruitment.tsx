import { type ElementType, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Copy,
  Edit,
  ExternalLink,
  FileCode2,
  Globe2,
  LayoutDashboard,
  Loader2,
  MapPin,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Star,
  Trash2,
  Users,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { recruitmentService } from '@/services/recruitment.service';
import { cn } from '@/lib/utils';
import type {
  ApplicationStatus,
  JobApplication,
  JobOpening,
  JobPayload,
  PortalPayload,
  RecruitmentPortal,
  ScreeningQuestion,
} from '@/types/recruitment';
import {
  DEFAULT_JOB_FORM,
  DEFAULT_PORTAL_FORM,
} from '@/types/recruitment';

interface ScreeningQuestionDraft extends Omit<ScreeningQuestion, 'options'> {
  optionsText: string;
}

interface JobFormDraft
  extends Omit<
    JobPayload,
    'requirements' | 'responsibilities' | 'perks' | 'recruitmentStages' | 'screeningQuestions'
  > {
  requirementsText: string;
  responsibilitiesText: string;
  perksText: string;
  recruitmentStagesText: string;
  screeningQuestions: ScreeningQuestionDraft[];
}

const defaultStages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

const statusStyles: Record<ApplicationStatus, string> = {
  active: 'bg-teal-100 text-teal-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  withdrawn: 'bg-slate-200 text-slate-700',
};

const jobStatusStyles: Record<JobOpening['status'], string> = {
  draft: 'bg-amber-100 text-amber-800',
  published: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
};

const emptyQuestionDraft = (): ScreeningQuestionDraft => ({
  question: '',
  type: 'text',
  required: false,
  optionsText: '',
});

const createEmptyJobForm = (): JobFormDraft => ({
  ...DEFAULT_JOB_FORM,
  requirementsText: '',
  responsibilitiesText: '',
  perksText: '',
  recruitmentStagesText: DEFAULT_JOB_FORM.recruitmentStages.join(', '),
  screeningQuestions: [],
});

const linesToArray = (value: string): string[] =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value?: string) => {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const formatRelativeCurrency = (
  value?: number,
  currency: string = 'INR'
): string => {
  if (typeof value !== 'number') return 'Not set';

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (_error) {
    return `${currency} ${value}`;
  }
};

const getPortalId = (portal: RecruitmentPortal | null) => portal?._id ?? '';

const mapPortalToForm = (portal?: RecruitmentPortal | null): PortalPayload => ({
  companyName: portal?.companyName ?? DEFAULT_PORTAL_FORM.companyName,
  slug: portal?.slug ?? DEFAULT_PORTAL_FORM.slug,
  companyWebsite: portal?.companyWebsite ?? DEFAULT_PORTAL_FORM.companyWebsite,
  companyDescription:
    portal?.companyDescription ?? DEFAULT_PORTAL_FORM.companyDescription,
  careersTitle: portal?.careersTitle ?? DEFAULT_PORTAL_FORM.careersTitle,
  careersDescription:
    portal?.careersDescription ?? DEFAULT_PORTAL_FORM.careersDescription,
  logoUrl: portal?.logoUrl ?? DEFAULT_PORTAL_FORM.logoUrl,
  brandColor: portal?.brandColor ?? DEFAULT_PORTAL_FORM.brandColor,
  accentColor: portal?.accentColor ?? DEFAULT_PORTAL_FORM.accentColor,
  isActive: portal?.isActive ?? DEFAULT_PORTAL_FORM.isActive,
});

const mapJobToForm = (job: JobOpening): JobFormDraft => ({
  portalId:
    typeof job.portalId === 'string' ? job.portalId : job.portalId?._id ?? '',
  title: job.title,
  slug: job.slug,
  department: job.department ?? '',
  location: job.location ?? '',
  workplaceType: job.workplaceType,
  employmentType: job.employmentType,
  shortDescription: job.shortDescription ?? '',
  description: job.description,
  requirementsText: job.requirements.join('\n'),
  responsibilitiesText: job.responsibilities.join('\n'),
  perksText: job.perks.join('\n'),
  recruitmentStagesText: job.recruitmentStages.join(', '),
  screeningQuestions: job.screeningQuestions.map((question) => ({
    ...question,
    optionsText: question.options.join(', '),
  })),
  openings: job.openings,
  minExperienceYears: job.minExperienceYears,
  maxExperienceYears: job.maxExperienceYears,
  salaryMin: job.salaryMin,
  salaryMax: job.salaryMax,
  currency: job.currency,
  status: job.status,
  publishAt: job.publishAt ? job.publishAt.slice(0, 10) : '',
  isFeatured: job.isFeatured,
});

const buildJobPayload = (jobForm: JobFormDraft, portalId: string): JobPayload => ({
  portalId,
  title: jobForm.title.trim(),
  slug: jobForm.slug?.trim() || undefined,
  department: jobForm.department?.trim() || undefined,
  location: jobForm.location?.trim() || undefined,
  workplaceType: jobForm.workplaceType,
  employmentType: jobForm.employmentType,
  shortDescription: jobForm.shortDescription?.trim() || undefined,
  description: jobForm.description.trim(),
  requirements: linesToArray(jobForm.requirementsText),
  responsibilities: linesToArray(jobForm.responsibilitiesText),
  perks: linesToArray(jobForm.perksText),
  recruitmentStages:
    linesToArray(jobForm.recruitmentStagesText).length > 0
      ? linesToArray(jobForm.recruitmentStagesText)
      : defaultStages,
  screeningQuestions: jobForm.screeningQuestions
    .filter((question) => question.question.trim())
    .map((question) => ({
      question: question.question.trim(),
      type: question.type,
      required: question.required,
      options: linesToArray(question.optionsText),
    })),
  openings: Number(jobForm.openings) || 1,
  minExperienceYears:
    jobForm.minExperienceYears === undefined || jobForm.minExperienceYears === null
      ? undefined
      : Number(jobForm.minExperienceYears),
  maxExperienceYears:
    jobForm.maxExperienceYears === undefined || jobForm.maxExperienceYears === null
      ? undefined
      : Number(jobForm.maxExperienceYears),
  salaryMin:
    jobForm.salaryMin === undefined || jobForm.salaryMin === null
      ? undefined
      : Number(jobForm.salaryMin),
  salaryMax:
    jobForm.salaryMax === undefined || jobForm.salaryMax === null
      ? undefined
      : Number(jobForm.salaryMax),
  currency: jobForm.currency?.trim() || 'INR',
  status: jobForm.status,
  publishAt: jobForm.publishAt || undefined,
  isFeatured: jobForm.isFeatured,
});

const getApplicationJob = (application: JobApplication) =>
  typeof application.jobId === 'string' ? null : application.jobId;

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tint,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ElementType;
  tint: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </div>
          <div className={cn('rounded-2xl p-3 text-white shadow-sm', tint)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecruitmentAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPortalId, setSelectedPortalId] = useState('');
  const [portalForm, setPortalForm] = useState<PortalPayload>(DEFAULT_PORTAL_FORM);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobForm, setJobForm] = useState<JobFormDraft>(createEmptyJobForm());
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(
    null
  );
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);
  const [candidateDraft, setCandidateDraft] = useState<{
    stage: string;
    status: ApplicationStatus;
    score: string;
    adminNotes: string;
  }>({
    stage: 'Applied',
    status: 'active',
    score: '',
    adminNotes: '',
  });
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateStatusFilter, setCandidateStatusFilter] = useState('all');
  const [candidateJobFilter, setCandidateJobFilter] = useState('all');

  const portalsQuery = useQuery({
    queryKey: ['recruitment-portals'],
    queryFn: recruitmentService.listPortals,
  });

  const portals = portalsQuery.data ?? [];
  const currentPortal =
    portals.find((portal) => portal._id === selectedPortalId) ?? portals[0] ?? null;

  useEffect(() => {
    if (!selectedPortalId && portals.length > 0) {
      setSelectedPortalId(portals[0]._id);
    }
  }, [portals, selectedPortalId]);

  useEffect(() => {
    setPortalForm(mapPortalToForm(currentPortal));
  }, [currentPortal]);

  const portalId = getPortalId(currentPortal);

  const dashboardQuery = useQuery({
    queryKey: ['recruitment-dashboard', portalId],
    queryFn: () => recruitmentService.getDashboard(portalId),
    enabled: Boolean(portalId),
  });

  const jobsQuery = useQuery({
    queryKey: ['recruitment-jobs', portalId],
    queryFn: () =>
      recruitmentService.listJobs({
        portalId,
        limit: 200,
      }),
    enabled: Boolean(portalId),
  });

  const applicationsQuery = useQuery({
    queryKey: [
      'recruitment-applications',
      portalId,
      candidateSearch,
      candidateStatusFilter,
      candidateJobFilter,
    ],
    queryFn: () =>
      recruitmentService.listApplications({
        portalId,
        search: candidateSearch || undefined,
        status:
          candidateStatusFilter !== 'all' ? candidateStatusFilter : undefined,
        jobId: candidateJobFilter !== 'all' ? candidateJobFilter : undefined,
        limit: 200,
      }),
    enabled: Boolean(portalId),
  });

  const dashboard = dashboardQuery.data;
  const jobs = jobsQuery.data?.data ?? [];
  const applications = applicationsQuery.data?.data ?? [];

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesStatus =
          jobStatusFilter === 'all' || job.status === jobStatusFilter;
        const matchesSearch =
          !jobSearch.trim() ||
          [job.title, job.department, job.location]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(jobSearch.trim().toLowerCase())
            );

        return matchesStatus && matchesSearch;
      }),
    [jobSearch, jobStatusFilter, jobs]
  );

  const stageOrder = useMemo(() => {
    const orderedStages = jobs.flatMap((job) => job.recruitmentStages);
    const uniqueStages = orderedStages.filter(
      (stage, index) => orderedStages.indexOf(stage) === index
    );
    return uniqueStages.length > 0 ? uniqueStages : defaultStages;
  }, [jobs]);

  const stageColumns = useMemo(
    () =>
      stageOrder.map((stage) => ({
        stage,
        items: applications.filter(
          (application) =>
            application.stage === stage &&
            (candidateStatusFilter === 'all'
              ? application.status === 'active'
              : true)
        ),
      })),
    [applications, candidateStatusFilter, stageOrder]
  );

  const portalMutation = useMutation({
    mutationFn: async (payload: PortalPayload) => {
      if (currentPortal) {
        return recruitmentService.updatePortal(currentPortal._id, payload);
      }
      return recruitmentService.createPortal(payload);
    },
    onSuccess: (portal) => {
      toast({
        title: 'Portal saved',
        description:
          'Your careers portal is ready for job publishing and embed setup.',
      });
      queryClient.invalidateQueries({ queryKey: ['recruitment-portals'] });
      setSelectedPortalId(portal._id);
    },
    onError: (error: any) => {
      toast({
        title: 'Portal save failed',
        description: error.message || 'Unable to save portal settings right now.',
        variant: 'destructive',
      });
    },
  });

  const regenerateTokenMutation = useMutation({
    mutationFn: async () => {
      if (!currentPortal) {
        throw new Error('Create a portal first before regenerating the token.');
      }
      return recruitmentService.regeneratePortalToken(currentPortal._id);
    },
    onSuccess: (portal) => {
      toast({
        title: 'New embed token generated',
        description:
          'Update any frontend embed code that still uses the previous token.',
      });
      queryClient.invalidateQueries({ queryKey: ['recruitment-portals'] });
      setSelectedPortalId(portal._id);
    },
    onError: (error: any) => {
      toast({
        title: 'Token generation failed',
        description: error.message || 'Unable to regenerate token right now.',
        variant: 'destructive',
      });
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async (payload: JobPayload) => {
      if (editingJob) {
        return recruitmentService.updateJob(editingJob._id, payload);
      }
      return recruitmentService.createJob(payload);
    },
    onSuccess: () => {
      toast({
        title: editingJob ? 'Job updated' : 'Job created',
        description:
          'The hiring team can now manage this role from the recruitment console.',
      });
      queryClient.invalidateQueries({ queryKey: ['recruitment-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-dashboard'] });
      setJobDialogOpen(false);
      setEditingJob(null);
      setJobForm(createEmptyJobForm());
    },
    onError: (error: any) => {
      toast({
        title: 'Job save failed',
        description: error.message || 'Unable to save the job opening right now.',
        variant: 'destructive',
      });
    },
  });

  const quickJobMutation = useMutation({
    mutationFn: async ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: Partial<JobPayload>;
    }) => recruitmentService.updateJob(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruitment-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Job update failed',
        description: error.message || 'Unable to update job status right now.',
        variant: 'destructive',
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (jobId: string) => recruitmentService.deleteJob(jobId),
    onSuccess: () => {
      toast({
        title: 'Job deleted',
        description: 'The role has been removed from the admin panel.',
      });
      queryClient.invalidateQueries({ queryKey: ['recruitment-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-dashboard'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description:
          error.message ||
          'This role could not be deleted. Close it instead if candidates already exist.',
        variant: 'destructive',
      });
    },
  });

  const updateCandidateMutation = useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: {
        stage: string;
        status: ApplicationStatus;
        score?: number;
        adminNotes?: string;
      };
    }) => recruitmentService.updateApplication(applicationId, payload),
    onSuccess: () => {
      toast({
        title: 'Candidate updated',
        description: 'Pipeline changes were saved successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['recruitment-applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruitment-dashboard'] });
      setCandidateDialogOpen(false);
      setSelectedApplication(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Candidate update failed',
        description: error.message || 'Unable to save candidate changes.',
        variant: 'destructive',
      });
    },
  });

  const handlePortalSubmit = () => {
    if (!portalForm.companyName?.trim()) {
      toast({
        title: 'Company name required',
        description: 'Start with the company name so the portal can be created.',
        variant: 'destructive',
      });
      return;
    }

    portalMutation.mutate({
      ...portalForm,
      companyName: portalForm.companyName.trim(),
      slug: portalForm.slug?.trim() || undefined,
      companyWebsite: portalForm.companyWebsite?.trim() || undefined,
      companyDescription: portalForm.companyDescription?.trim() || undefined,
      careersTitle: portalForm.careersTitle?.trim() || undefined,
      careersDescription: portalForm.careersDescription?.trim() || undefined,
      logoUrl: portalForm.logoUrl?.trim() || undefined,
    });
  };

  const openNewJobDialog = () => {
    setEditingJob(null);
    setJobForm({
      ...createEmptyJobForm(),
      portalId,
    });
    setJobDialogOpen(true);
  };

  const openEditJobDialog = (job: JobOpening) => {
    setEditingJob(job);
    setJobForm(mapJobToForm(job));
    setJobDialogOpen(true);
  };

  const handleSaveJob = () => {
    if (!portalId) {
      toast({
        title: 'Portal needed first',
        description: 'Set up the recruitment portal before creating roles.',
        variant: 'destructive',
      });
      setActiveTab('portal');
      return;
    }

    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      toast({
        title: 'Role details missing',
        description: 'Job title and job description are required.',
        variant: 'destructive',
      });
      return;
    }

    saveJobMutation.mutate(buildJobPayload(jobForm, portalId));
  };

  const handleDeleteJob = (job: JobOpening) => {
    const confirmed = window.confirm(
      `Delete "${job.title}"? Jobs with candidate records should be closed instead of deleted.`
    );

    if (confirmed) {
      deleteJobMutation.mutate(job._id);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${label} copied`,
        description: 'You can paste it directly into the frontend now.',
      });
    } catch (_error) {
      toast({
        title: 'Copy failed',
        description: `Unable to copy ${label.toLowerCase()} right now.`,
        variant: 'destructive',
      });
    }
  };

  const openCandidateDialog = (application: JobApplication) => {
    setSelectedApplication(application);
    setCandidateDraft({
      stage: application.stage,
      status: application.status,
      score:
        typeof application.score === 'number' ? String(application.score) : '',
      adminNotes: application.adminNotes ?? '',
    });
    setCandidateDialogOpen(true);
  };

  const handleSaveCandidate = () => {
    if (!selectedApplication) return;

    updateCandidateMutation.mutate({
      applicationId: selectedApplication._id,
      payload: {
        stage: candidateDraft.stage,
        status: candidateDraft.status,
        score:
          candidateDraft.score.trim() === ''
            ? undefined
            : Number(candidateDraft.score),
        adminNotes: candidateDraft.adminNotes.trim() || undefined,
      },
    });
  };

  const selectedApplicationJob =
    selectedApplication && typeof selectedApplication.jobId !== 'string'
      ? selectedApplication.jobId
      : null;

  const candidateStages =
    selectedApplicationJob?.recruitmentStages && selectedApplicationJob.recruitmentStages.length
      ? selectedApplicationJob.recruitmentStages
      : stageOrder;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#f0fdfa_0%,#fefce8_45%,#ffffff_100%)] p-8 shadow-sm">
        <div className="absolute inset-y-0 right-0 hidden w-72 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.16),transparent_60%)] lg:block" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              Recruitment Command Center
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
              Build a Keka-style hiring workflow for your team.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Manage portal branding, publish openings, review candidate pipelines,
              and copy the embed script from one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="bg-slate-950 text-white hover:bg-slate-800"
                onClick={() => setActiveTab('jobs')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Opening
              </Button>
              <Button
                variant="outline"
                className="border-teal-200 bg-white/90 text-teal-800 hover:bg-teal-50"
                onClick={() => setActiveTab('portal')}
              >
                <FileCode2 className="mr-2 h-4 w-4" />
                Portal & Embed
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-md border-white/70 bg-white/90 shadow-lg backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-teal-700" />
                Active Portal
              </CardTitle>
              <CardDescription>
                Switch between recruitment portals if you manage multiple brands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portalsQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading portals...
                </div>
              ) : portals.length > 0 ? (
                <>
                  <Select value={selectedPortalId} onValueChange={setSelectedPortalId}>
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Select a portal" />
                    </SelectTrigger>
                    <SelectContent>
                      {portals.map((portal) => (
                        <SelectItem key={portal._id} value={portal._id}>
                          {portal.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">
                          {currentPortal?.companyName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          /{currentPortal?.slug}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          currentPortal?.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        )}
                      >
                        {currentPortal?.isActive ? 'Live' : 'Paused'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {currentPortal?.careersDescription ||
                        currentPortal?.companyDescription ||
                        'Use the portal tab to shape the public careers experience and copy the widget embed.'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  No recruitment portal exists yet. Start from the Portal tab and create
                  the first company portal.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-slate-100 p-2">
          <TabsTrigger value="overview" className="rounded-xl px-4 py-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-xl px-4 py-2">
            <Briefcase className="mr-2 h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="candidates" className="rounded-xl px-4 py-2">
            <Users className="mr-2 h-4 w-4" />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="portal" className="rounded-xl px-4 py-2">
            <Globe2 className="mr-2 h-4 w-4" />
            Portal & Embed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {!portalId ? (
            <Card className="border-dashed border-amber-300 bg-amber-50">
              <CardContent className="flex flex-col items-start gap-4 p-8">
                <Badge className="bg-amber-200 text-amber-900">Portal setup needed</Badge>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Start with your careers portal
                  </h2>
                  <p className="mt-2 max-w-2xl text-slate-600">
                    Create the company portal first, then jobs, candidate pipelines,
                    and embed code all become available here.
                  </p>
                </div>
                <Button onClick={() => setActiveTab('portal')}>Go to Portal Setup</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Live Openings"
                  value={dashboard?.totals.publishedJobs ?? 0}
                  description="Roles currently visible on the careers portal"
                  icon={Briefcase}
                  tint="bg-teal-600"
                />
                <MetricCard
                  title="Total Roles"
                  value={dashboard?.totals.totalJobs ?? 0}
                  description="All draft, live, and closed openings"
                  icon={Building2}
                  tint="bg-slate-900"
                />
                <MetricCard
                  title="Candidates"
                  value={dashboard?.totals.totalApplications ?? 0}
                  description="Total applications captured by the system"
                  icon={Users}
                  tint="bg-amber-500"
                />
                <MetricCard
                  title="Active Pipeline"
                  value={dashboard?.totals.activeApplications ?? 0}
                  description="Candidates currently in motion"
                  icon={Workflow}
                  tint="bg-rose-500"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.45fr,0.95fr]">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>Stage Momentum</CardTitle>
                    <CardDescription>
                      Snapshot of the current hiring pipeline across this portal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {(dashboard?.stageSummary ?? []).map((stage) => (
                        <div
                          key={stage.stage}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              {stage.stage}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                          </div>
                          <p className="mt-3 text-3xl font-semibold text-slate-950">
                            {stage.count}
                          </p>
                        </div>
                      ))}
                    </div>

                    {(dashboard?.stageSummary ?? []).length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                        Candidate stage metrics will appear here once applications
                        start coming in.
                      </div>
                    )}

                    <div className="rounded-3xl bg-slate-950 p-6 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                            Quick Move
                          </p>
                          <h3 className="mt-2 text-xl font-semibold">
                            Keep roles and candidates flowing.
                          </h3>
                        </div>
                        <Star className="h-5 w-5 text-amber-300" />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="secondary"
                          onClick={openNewJobDialog}
                          className="bg-white text-slate-950 hover:bg-slate-100"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add a role
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 bg-transparent text-white hover:bg-white/10"
                          onClick={() => setActiveTab('candidates')}
                        >
                          Review candidates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Recent Candidates</CardTitle>
                      <CardDescription>
                        The latest applicants entering your hiring funnel.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(dashboard?.recentApplications ?? []).length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                          Applications will appear here once candidates start applying.
                        </div>
                      ) : (
                        dashboard?.recentApplications.map((application) => (
                          <button
                            type="button"
                            key={application._id}
                            onClick={() => openCandidateDialog(application)}
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-950">
                                  {application.fullName}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {typeof application.jobId === 'string'
                                    ? 'Job'
                                    : application.jobId?.title || 'Job'}
                                </p>
                              </div>
                              <Badge
                                className={cn(
                                  'capitalize',
                                  statusStyles[application.status]
                                )}
                              >
                                {application.status}
                              </Badge>
                            </div>
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                              {application.candidateSummary || 'Candidate profile summary'}
                            </p>
                          </button>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Embed Ready</CardTitle>
                      <CardDescription>
                        Use this widget code to publish jobs on any frontend.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Widget snippet
                        </p>
                        <p className="mt-2 break-all text-sm leading-6 text-slate-700">
                          {currentPortal?.embedCode}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() =>
                            currentPortal &&
                            handleCopy(currentPortal.embedCode, 'Embed code')
                          }
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Embed Code
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('portal')}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Portal Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Jobs</h2>
              <p className="mt-1 text-slate-500">
                Publish roles, control status, and keep the careers portal fresh.
              </p>
            </div>
            <Button
              onClick={openNewJobDialog}
              disabled={!portalId}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          </div>

          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="grid gap-3 lg:grid-cols-[1.2fr,220px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={jobSearch}
                    onChange={(event) => setJobSearch(event.target.value)}
                    placeholder="Search jobs by title, department, or location"
                    className="pl-10"
                  />
                </div>
                <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-0">
              {!portalId ? (
                <div className="p-8 text-sm text-slate-500">
                  Set up a recruitment portal first to start managing jobs.
                </div>
              ) : jobsQuery.isLoading ? (
                <div className="flex items-center justify-center p-10 text-slate-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading jobs...
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-8">
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-xl font-semibold text-slate-950">
                      No openings yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Create the first role and start building the hiring pipeline.
                    </p>
                    <Button className="mt-5" onClick={openNewJobDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Opening
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Compensation</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell className="min-w-[280px]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-950">
                                {job.title}
                              </span>
                              {job.isFeatured && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" />
                                {job.department || 'Department not set'}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location || 'Location flexible'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-slate-700">{job.employmentType}</p>
                            <p className="text-slate-500">{job.workplaceType}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={jobStatusStyles[job.status]}>{job.status}</Badge>
                        </TableCell>
                        <TableCell>{job.applicationCount}</TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {job.salaryMin || job.salaryMax
                            ? `${formatRelativeCurrency(job.salaryMin, job.currency)} - ${formatRelativeCurrency(job.salaryMax, job.currency)}`
                            : 'Custom range'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(job.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {job.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  quickJobMutation.mutate({
                                    jobId: job._id,
                                    payload: { status: 'published' },
                                  })
                                }
                              >
                                Publish
                              </Button>
                            )}
                            {job.status === 'published' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  quickJobMutation.mutate({
                                    jobId: job._id,
                                    payload: { status: 'closed' },
                                  })
                                }
                              >
                                Close
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditJobDialog(job)}
                            >
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-rose-600 hover:text-rose-700"
                              onClick={() => handleDeleteJob(job)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Candidate Pipeline
              </h2>
              <p className="mt-1 text-slate-500">
                Review applicants, update stages, and keep hiring decisions visible.
              </p>
            </div>
          </div>

          <Card className="border-slate-200">
            <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr,220px,220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={candidateSearch}
                  onChange={(event) => setCandidateSearch(event.target.value)}
                  placeholder="Search by candidate name, email, or summary"
                  className="pl-10"
                />
              </div>
              <Select
                value={candidateJobFilter}
                onValueChange={setCandidateJobFilter}
                disabled={jobs.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={candidateStatusFilter}
                onValueChange={setCandidateStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All candidate states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Active board</SelectItem>
                  <SelectItem value="active">Active only</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {!portalId ? (
            <Card className="border-dashed border-slate-200">
              <CardContent className="p-8 text-sm text-slate-500">
                Candidate workflows become available after the first recruitment portal
                is created.
              </CardContent>
            </Card>
          ) : applicationsQuery.isLoading ? (
            <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading candidates...
            </div>
          ) : stageColumns.every((column) => column.items.length === 0) ? (
            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">
                    No candidates match these filters
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    As applications come in, they’ll appear here grouped by hiring
                    stage.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-5">
              {stageColumns.map((column) => (
                <Card key={column.stage} className="border-slate-200 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{column.stage}</CardTitle>
                        <CardDescription>
                          {column.items.length} candidate
                          {column.items.length === 1 ? '' : 's'}
                        </CardDescription>
                      </div>
                      <Badge className="bg-slate-100 text-slate-700">
                        {column.items.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {column.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-400">
                        Nobody in this stage yet.
                      </div>
                    ) : (
                      column.items.map((application) => {
                        const job = getApplicationJob(application);
                        return (
                          <button
                            type="button"
                            key={application._id}
                            onClick={() => openCandidateDialog(application)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-950">
                                  {application.fullName}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {job?.title || 'Role'}
                                </p>
                              </div>
                              <Badge
                                className={cn(
                                  'capitalize',
                                  statusStyles[application.status]
                                )}
                              >
                                {application.status}
                              </Badge>
                            </div>
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                              {application.candidateSummary ||
                                'Candidate summary will appear here.'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                              {application.currentLocation && (
                                <span className="rounded-full bg-white px-2 py-1">
                                  {application.currentLocation}
                                </span>
                              )}
                              {typeof application.yearsExperience === 'number' && (
                                <span className="rounded-full bg-white px-2 py-1">
                                  {application.yearsExperience} yrs
                                </span>
                              )}
                              {application.score !== undefined && (
                                <span className="rounded-full bg-white px-2 py-1">
                                  Score {application.score}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portal" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>
                  {currentPortal ? 'Portal Settings' : 'Create Recruitment Portal'}
                </CardTitle>
                <CardDescription>
                  This controls the hiring brand, widget configuration, and careers
                  experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={portalForm.companyName ?? ''}
                      onChange={(event) =>
                        setPortalForm((current) => ({
                          ...current,
                          companyName: event.target.value,
                        }))
                      }
                      placeholder="L2H Careers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portal-slug">Portal Slug</Label>
                    <Input
                      id="portal-slug"
                      value={portalForm.slug ?? ''}
                      onChange={(event) =>
                        setPortalForm((current) => ({
                          ...current,
                          slug: event.target.value,
                        }))
                      }
                      placeholder="l2h-careers"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="portal-website">Company Website</Label>
                    <Input
                      id="portal-website"
                      value={portalForm.companyWebsite ?? ''}
                      onChange={(event) =>
                        setPortalForm((current) => ({
                          ...current,
                          companyWebsite: event.target.value,
                        }))
                      }
                      placeholder="https://www.l2h.in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portal-logo">Logo URL</Label>
                    <Input
                      id="portal-logo"
                      value={portalForm.logoUrl ?? ''}
                      onChange={(event) =>
                        setPortalForm((current) => ({
                          ...current,
                          logoUrl: event.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careers-title">Careers Title</Label>
                  <Input
                    id="careers-title"
                    value={portalForm.careersTitle ?? ''}
                    onChange={(event) =>
                      setPortalForm((current) => ({
                        ...current,
                        careersTitle: event.target.value,
                      }))
                    }
                    placeholder="Join the team shaping the future of learning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Company Description</Label>
                  <Textarea
                    id="company-description"
                    value={portalForm.companyDescription ?? ''}
                    onChange={(event) =>
                      setPortalForm((current) => ({
                        ...current,
                        companyDescription: event.target.value,
                      }))
                    }
                    placeholder="Tell candidates what makes the company special."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careers-description">Careers Description</Label>
                  <Textarea
                    id="careers-description"
                    value={portalForm.careersDescription ?? ''}
                    onChange={(event) =>
                      setPortalForm((current) => ({
                        ...current,
                        careersDescription: event.target.value,
                      }))
                    }
                    placeholder="A short intro shown in the public careers widget."
                    className="min-h-[110px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brand-color">Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="brand-color"
                        type="color"
                        value={portalForm.brandColor ?? '#0f766e'}
                        onChange={(event) =>
                          setPortalForm((current) => ({
                            ...current,
                            brandColor: event.target.value,
                          }))
                        }
                        className="h-12 w-20 rounded-xl p-1"
                      />
                      <Input
                        value={portalForm.brandColor ?? ''}
                        onChange={(event) =>
                          setPortalForm((current) => ({
                            ...current,
                            brandColor: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="accent-color"
                        type="color"
                        value={portalForm.accentColor ?? '#111827'}
                        onChange={(event) =>
                          setPortalForm((current) => ({
                            ...current,
                            accentColor: event.target.value,
                          }))
                        }
                        className="h-12 w-20 rounded-xl p-1"
                      />
                      <Input
                        value={portalForm.accentColor ?? ''}
                        onChange={(event) =>
                          setPortalForm((current) => ({
                            ...current,
                            accentColor: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-950">Portal status</p>
                    <p className="text-sm text-slate-500">
                      Toggle whether the public careers portal stays accessible.
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(portalForm.isActive)}
                    onCheckedChange={(checked) =>
                      setPortalForm((current) => ({
                        ...current,
                        isActive: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handlePortalSubmit}
                    disabled={portalMutation.isPending}
                    className="bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {portalMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {currentPortal ? 'Save Portal' : 'Create Portal'}
                  </Button>
                  {currentPortal && (
                    <Button
                      variant="outline"
                      onClick={() => regenerateTokenMutation.mutate()}
                      disabled={regenerateTokenMutation.isPending}
                    >
                      {regenerateTokenMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Regenerate Token
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Embed Details</CardTitle>
                  <CardDescription>
                    Copy the token, widget URL, or complete script snippet.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPortal ? (
                    <>
                      <div className="space-y-2">
                        <Label>Embed token</Label>
                        <div className="flex gap-2">
                          <Input value={currentPortal.embedToken} readOnly />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleCopy(currentPortal.embedToken, 'Embed token')
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Widget script URL</Label>
                        <div className="flex gap-2">
                          <Input value={currentPortal.widgetScriptUrl} readOnly />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleCopy(
                                currentPortal.widgetScriptUrl,
                                'Widget script URL'
                              )
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Embed code</Label>
                        <Textarea
                          value={currentPortal.embedCode}
                          readOnly
                          className="min-h-[140px] font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleCopy(currentPortal.embedCode, 'Embed code')}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy snippet
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                      Create the portal first and the embed instructions will appear
                      automatically here.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-slate-950 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Frontend handoff
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Minimal instructions for your website team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-white/80">
                  <p>
                    1. Add the widget script tag to the frontend page where careers
                    should appear.
                  </p>
                  <p>
                    2. Use the portal token from this page as `data-token`.
                  </p>
                  <p>
                    3. Publish jobs from the Jobs tab and candidates will start flowing
                    into the Candidates tab.
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-xs text-white/90">
                    {currentPortal?.embedCode ||
                      '<script src="YOUR_WIDGET_URL" data-token="YOUR_TOKEN" defer></script>'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={jobDialogOpen}
        onOpenChange={(open) => {
          setJobDialogOpen(open);
          if (!open) {
            setEditingJob(null);
            setJobForm(createEmptyJobForm());
          }
        }}
      >
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit job opening' : 'Create a new job opening'}
            </DialogTitle>
            <DialogDescription>
              Define the role, how it appears publicly, and the internal recruitment
              stages your team will use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job title</Label>
                <Input
                  id="job-title"
                  value={jobForm.title}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Senior Growth Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-slug">Slug</Label>
                <Input
                  id="job-slug"
                  value={jobForm.slug ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                  placeholder="senior-growth-manager"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={jobForm.department ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      department: event.target.value,
                    }))
                  }
                  placeholder="Marketing"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={jobForm.location ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder="Mumbai / Remote"
                />
              </div>
              <div className="space-y-2">
                <Label>Workplace</Label>
                <Select
                  value={jobForm.workplaceType}
                  onValueChange={(value) =>
                    setJobForm((current) => ({
                      ...current,
                      workplaceType: value as JobFormDraft['workplaceType'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Employment type</Label>
                <Select
                  value={jobForm.employmentType}
                  onValueChange={(value) =>
                    setJobForm((current) => ({
                      ...current,
                      employmentType: value as JobFormDraft['employmentType'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Short description</Label>
              <Input
                value={jobForm.shortDescription ?? ''}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    shortDescription: event.target.value,
                  }))
                }
                placeholder="A quick pitch shown in cards and widgets"
              />
            </div>

            <div className="space-y-2">
              <Label>Job description</Label>
              <Textarea
                value={jobForm.description}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="min-h-[140px]"
                placeholder="Describe the role, impact, and expectations."
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="space-y-2">
                <Label>Responsibilities</Label>
                <Textarea
                  value={jobForm.responsibilitiesText}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      responsibilitiesText: event.target.value,
                    }))
                  }
                  className="min-h-[150px]"
                  placeholder="One item per line"
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements</Label>
                <Textarea
                  value={jobForm.requirementsText}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      requirementsText: event.target.value,
                    }))
                  }
                  className="min-h-[150px]"
                  placeholder="One item per line"
                />
              </div>
              <div className="space-y-2">
                <Label>Perks</Label>
                <Textarea
                  value={jobForm.perksText}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      perksText: event.target.value,
                    }))
                  }
                  className="min-h-[150px]"
                  placeholder="One item per line"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label>Openings</Label>
                <Input
                  type="number"
                  value={jobForm.openings}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      openings: Number(event.target.value) || 1,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum experience</Label>
                <Input
                  type="number"
                  value={jobForm.minExperienceYears ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      minExperienceYears:
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum experience</Label>
                <Input
                  type="number"
                  value={jobForm.maxExperienceYears ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      maxExperienceYears:
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="8"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={jobForm.status}
                  onValueChange={(value) =>
                    setJobForm((current) => ({
                      ...current,
                      status: value as JobFormDraft['status'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label>Salary minimum</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMin ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      salaryMin:
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Salary maximum</Label>
                <Input
                  type="number"
                  value={jobForm.salaryMax ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      salaryMax:
                        event.target.value === ''
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={jobForm.currency ?? 'INR'}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      currency: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="INR"
                />
              </div>
              <div className="space-y-2">
                <Label>Publish date</Label>
                <Input
                  type="date"
                  value={jobForm.publishAt ?? ''}
                  onChange={(event) =>
                    setJobForm((current) => ({
                      ...current,
                      publishAt: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="font-medium text-slate-950">Feature this role</p>
                <p className="text-sm text-slate-500">
                  Featured jobs are shown first in the widget and public listings.
                </p>
              </div>
              <Switch
                checked={Boolean(jobForm.isFeatured)}
                onCheckedChange={(checked) =>
                  setJobForm((current) => ({
                    ...current,
                    isFeatured: checked,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Recruitment stages</Label>
              <Input
                value={jobForm.recruitmentStagesText}
                onChange={(event) =>
                  setJobForm((current) => ({
                    ...current,
                    recruitmentStagesText: event.target.value,
                  }))
                }
                placeholder="Applied, Screening, Interview, Offer, Hired"
              />
              <p className="text-xs text-slate-500">
                Comma-separated. These stages power the candidate board.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screening questions</Label>
                  <p className="mt-1 text-xs text-slate-500">
                    Add pre-screen prompts shown inside the widget form.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setJobForm((current) => ({
                      ...current,
                      screeningQuestions: [
                        ...current.screeningQuestions,
                        emptyQuestionDraft(),
                      ],
                    }))
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-3">
                {jobForm.screeningQuestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    No screening questions yet. Add one if you want to capture extra
                    candidate details before review.
                  </div>
                ) : (
                  jobForm.screeningQuestions.map((question, index) => (
                    <div
                      key={`${question.question}-${index}`}
                      className="grid gap-3 rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-[1.3fr,180px,120px,48px]">
                        <Input
                          value={question.question}
                          onChange={(event) =>
                            setJobForm((current) => ({
                              ...current,
                              screeningQuestions: current.screeningQuestions.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, question: event.target.value }
                                    : item
                              ),
                            }))
                          }
                          placeholder="Ask about domain experience, shift preference, etc."
                        />
                        <Select
                          value={question.type}
                          onValueChange={(value) =>
                            setJobForm((current) => ({
                              ...current,
                              screeningQuestions: current.screeningQuestions.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? {
                                        ...item,
                                        type: value as ScreeningQuestionDraft['type'],
                                      }
                                    : item
                              ),
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3">
                          <Switch
                            checked={question.required}
                            onCheckedChange={(checked) =>
                              setJobForm((current) => ({
                                ...current,
                                screeningQuestions: current.screeningQuestions.map(
                                  (item, itemIndex) =>
                                    itemIndex === index
                                      ? { ...item, required: checked }
                                      : item
                                ),
                              }))
                            }
                          />
                          <span className="text-sm text-slate-600">Required</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() =>
                            setJobForm((current) => ({
                              ...current,
                              screeningQuestions: current.screeningQuestions.filter(
                                (_item, itemIndex) => itemIndex !== index
                              ),
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {question.type === 'select' && (
                        <Input
                          value={question.optionsText}
                          onChange={(event) =>
                            setJobForm((current) => ({
                              ...current,
                              screeningQuestions: current.screeningQuestions.map(
                                (item, itemIndex) =>
                                  itemIndex === index
                                    ? { ...item, optionsText: event.target.value }
                                    : item
                              ),
                            }))
                          }
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setJobDialogOpen(false);
                setEditingJob(null);
                setJobForm(createEmptyJobForm());
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveJob}
              disabled={saveJobMutation.isPending}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              {saveJobMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingJob ? (
                <PencilLine className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingJob ? 'Update job' : 'Create job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={candidateDialogOpen}
        onOpenChange={(open) => {
          setCandidateDialogOpen(open);
          if (!open) {
            setSelectedApplication(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Review</DialogTitle>
            <DialogDescription>
              Update stage, notes, and decision details for the selected applicant.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">
                      {selectedApplication.fullName}
                    </h3>
                    <p className="mt-1 text-slate-500">{selectedApplication.email}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className={statusStyles[selectedApplication.status]}>
                        {selectedApplication.status}
                      </Badge>
                      <Badge className="bg-slate-200 text-slate-700">
                        {selectedApplication.stage}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-950">Role:</span>{' '}
                      {selectedApplicationJob?.title || 'Role'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-950">Location:</span>{' '}
                      {selectedApplication.currentLocation || 'Not shared'}
                    </p>
                    <p>
                      <span className="font-medium text-slate-950">Experience:</span>{' '}
                      {selectedApplication.yearsExperience ?? 'NA'} years
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {selectedApplication.candidateSummary ||
                    'No summary generated for this profile yet.'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select
                    value={candidateDraft.stage}
                    onValueChange={(value) =>
                      setCandidateDraft((current) => ({
                        ...current,
                        stage: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {candidateStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={candidateDraft.status}
                    onValueChange={(value) =>
                      setCandidateDraft((current) => ({
                        ...current,
                        status: value as ApplicationStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Score</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={candidateDraft.score}
                    onChange={(event) =>
                      setCandidateDraft((current) => ({
                        ...current,
                        score: event.target.value,
                      }))
                    }
                    placeholder="0 - 100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <h4 className="font-semibold text-slate-950">Candidate details</h4>
                  <dl className="mt-4 space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="font-medium text-slate-950">Current company</dt>
                      <dd>{selectedApplication.currentCompany || 'Not shared'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-950">Current designation</dt>
                      <dd>{selectedApplication.currentDesignation || 'Not shared'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-950">Expected CTC</dt>
                      <dd>
                        {selectedApplication.expectedCTC !== undefined
                          ? formatRelativeCurrency(selectedApplication.expectedCTC)
                          : 'Not shared'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-950">Notice period</dt>
                      <dd>
                        {selectedApplication.noticePeriodDays !== undefined
                          ? `${selectedApplication.noticePeriodDays} days`
                          : 'Not shared'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <h4 className="font-semibold text-slate-950">Links & assets</h4>
                  <div className="mt-4 space-y-3 text-sm">
                    {selectedApplication.resumeUrl ? (
                      <a
                        href={selectedApplication.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open resume
                      </a>
                    ) : (
                      <p className="text-slate-500">Resume not attached</p>
                    )}
                    {selectedApplication.linkedInUrl ? (
                      <a
                        href={selectedApplication.linkedInUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn profile
                      </a>
                    ) : (
                      <p className="text-slate-500">LinkedIn not shared</p>
                    )}
                    {selectedApplication.portfolioUrl ? (
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Portfolio
                      </a>
                    ) : (
                      <p className="text-slate-500">Portfolio not shared</p>
                    )}
                  </div>

                  {selectedApplication.skills.length > 0 && (
                    <>
                      <h4 className="mt-6 font-semibold text-slate-950">Skills</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedApplication.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-slate-200 text-slate-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedApplication.customAnswers.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Screening answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedApplication.customAnswers.map((answer) => (
                      <div key={`${answer.question}-${answer.answer}`}>
                        <p className="font-medium text-slate-950">{answer.question}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {answer.answer}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label>Admin notes</Label>
                <Textarea
                  value={candidateDraft.adminNotes}
                  onChange={(event) =>
                    setCandidateDraft((current) => ({
                      ...current,
                      adminNotes: event.target.value,
                    }))
                  }
                  className="min-h-[140px]"
                  placeholder="Capture interviewer feedback, concerns, or next steps."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCandidateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCandidate}
              disabled={updateCandidateMutation.isPending}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              {updateCandidateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

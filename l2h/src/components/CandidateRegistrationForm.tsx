import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { candidateService } from '@/services/candidate.service';
import {
  DEFAULT_CANDIDATE_FORM,
  DEFAULT_WORK_EXPERIENCE,
  EXPERIENCE_LEVEL_LABELS,
  QUALIFICATION_LABELS,
  WORK_MODE_LABELS,
  type CandidateRegistrationPayload,
  type CandidateRegistrationResponse,
  type ExperienceLevel,
  type Qualification,
  type WorkMode,
} from '@/types/candidate';
import {
  CheckCircle2,
  Loader2,
  MinusCircle,
  PlusCircle,
  UploadCloud,
} from 'lucide-react';

const MAX_RESUME_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;

type CandidateRegistrationForm = CandidateRegistrationPayload & {
  confirm_password: string;
};

type CandidateRegistrationFormProps = {
  embedded?: boolean;
};

const defaultForm: CandidateRegistrationForm = {
  ...DEFAULT_CANDIDATE_FORM,
  confirm_password: '',
};

const steps = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Please provide your basic contact and profile details',
  },
  {
    id: 2,
    title: 'Education & Job Preferences',
    description: 'Tell us about your education and what kind of job you are looking for',
  },
  {
    id: 3,
    title: 'Experience & Documents',
    description: 'Share your work experience, skills, resume, and introduction video',
  },
  {
    id: 4,
    title: 'Account Setup',
    description: 'Create your login credentials and agree to share your profile',
  },
];

const fieldClass =
  'h-10 rounded-xl border-primary/10 bg-white px-4 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:ring-offset-0';
const labelClass = 'text-xs font-bold text-primary';

export default function CandidateRegistrationForm({ embedded = false }: CandidateRegistrationFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CandidateRegistrationForm>(defaultForm);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [submittedCandidate, setSubmittedCandidate] = useState<CandidateRegistrationResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateField = <K extends keyof CandidateRegistrationForm>(
    field: K,
    value: CandidateRegistrationForm[K]
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const showValidationToast = (message: string) => {
    toast({ title: 'Please check the form', description: message, variant: 'destructive' });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.full_name.trim()) { showValidationToast('Full name is required.'); return false; }
      if (!formData.mobile_number.trim()) { showValidationToast('Mobile number is required.'); return false; }
      if (!formData.email.trim()) { showValidationToast('Email address is required.'); return false; }
      if (!formData.city.trim() || !formData.state.trim()) { showValidationToast('City and state are required.'); return false; }
    }

    if (step === 2) {
      if (!formData.college_name.trim()) { showValidationToast('College name is required.'); return false; }
      if (!formData.preferred_job_role.trim()) { showValidationToast('Preferred job role is required.'); return false; }
      if (!formData.preferred_job_location.trim()) { showValidationToast('Preferred job location is required.'); return false; }
      if (!formData.expected_salary || Number(formData.expected_salary) <= 0) { showValidationToast('Expected salary is required.'); return false; }
      if (!formData.available_joining_date) { showValidationToast('Available joining date is required.'); return false; }
    }

    if (step === 4) {
      if (!formData.email.trim()) { showValidationToast('Email address is required.'); return false; }
      if (formData.password.length < 6) { showValidationToast('Password must be at least 6 characters.'); return false; }
      if (formData.password !== formData.confirm_password) { showValidationToast('Password and retype password do not match.'); return false; }
      if (!formData.terms_accepted) { showValidationToast('Please agree to share your profile with hiring partners.'); return false; }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length));
  };
  const goPrevious = () => setCurrentStep((step) => Math.max(step - 1, 1));

  const handleFileChange = (
    file: File | undefined,
    setFile: (f: File | null) => void,
    setName: (n: string) => void
  ) => {
    if (!file) return;
    setFile(file);
    setName(file.name);
  };

  const createMutation = useMutation({
    mutationFn: async (): Promise<CandidateRegistrationResponse> => {
      let resumeUrl = formData.resume_url?.trim() || '';
      let resumeKey = formData.resume_key?.trim() || '';
      let videoUrl = formData.video_introduction_url?.trim() || '';
      let videoKey = formData.video_introduction_key?.trim() || '';
      let photoUrl = formData.photograph_url?.trim() || '';
      let photoKey = formData.photograph_key?.trim() || '';

      if (resumeFile) {
        const uploaded = await candidateService.uploadResume(resumeFile);
        resumeUrl = uploaded.url;
        resumeKey = uploaded.key;
      }

      if (videoFile) {
        const uploaded = await candidateService.uploadVideo(videoFile);
        videoUrl = uploaded.url;
        videoKey = uploaded.key;
      }

      if (photoFile) {
        const uploaded = await candidateService.uploadPhotograph(photoFile);
        photoUrl = uploaded.url;
        photoKey = uploaded.key;
      }

      const payload: CandidateRegistrationPayload = {
        full_name: formData.full_name.trim(),
        mobile_number: formData.mobile_number.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        linkedin_url: formData.linkedin_url?.trim() || '',
        portfolio_url: formData.portfolio_url?.trim() || '',
        photograph_url: photoUrl,
        photograph_key: photoKey,
        college_name: formData.college_name.trim(),
        highest_qualification: formData.highest_qualification,
        current_course: formData.current_course?.trim() || '',
        preferred_job_role: formData.preferred_job_role.trim(),
        preferred_work_mode: formData.preferred_work_mode,
        preferred_job_location: formData.preferred_job_location.trim(),
        expected_salary: Number(formData.expected_salary) || '',
        available_joining_date: formData.available_joining_date,
        additional_skills: formData.additional_skills?.trim() || '',
        resume_url: resumeUrl,
        resume_key: resumeKey,
        experience_level: formData.experience_level,
        previous_company_name: formData.previous_company_name?.trim() || '',
        company_position: formData.company_position?.trim() || '',
        description: formData.description?.trim() || '',
        work_experiences: formData.work_experiences || [],
        internship_experience: formData.internship_experience?.trim() || '',
        total_work_experience: formData.total_work_experience ? Number(formData.total_work_experience) : '',
        key_responsibilities: formData.key_responsibilities?.trim() || '',
        career_goals: formData.career_goals?.trim() || '',
        video_introduction_url: videoUrl,
        video_introduction_key: videoKey,
        terms_accepted: formData.terms_accepted,
        password: formData.password,
      };

      return candidateService.register(payload);
    },
    onSuccess: (data) => {
      setSubmittedCandidate(data);
      setFormData(defaultForm);
      setResumeFile(null); setResumeFileName('');
      setVideoFile(null); setVideoFileName('');
      setPhotoFile(null); setPhotoFileName('');
      setCurrentStep(1);
      setIsUploading(false);
      toast({ title: 'Profile submitted', description: 'Your profile is waiting for admin approval.' });
    },
    onError: (error: any) => {
      toast({ title: 'Registration failed', description: error.message || 'Unable to register.', variant: 'destructive' });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(4)) return;
    setIsUploading(true);
    createMutation.mutate();
  };

  if (submittedCandidate) {
    return (
      <div className={embedded ? 'rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-6 text-center' : 'rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200'}>
        {!embedded && (
          <img src="/images/logo.png" alt="L2H" className="mx-auto h-auto w-56 object-contain" />
        )}
        <div className={`${embedded ? 'mt-0' : 'mt-8'} mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50`}>
          <CheckCircle2 className="h-9 w-9 text-emerald-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Profile submitted</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {submittedCandidate.candidate.full_name}, your profile is now waiting for admin approval.
        </p>
        <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          Candidate ID: {submittedCandidate.candidate.unique_id}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={() => setSubmittedCandidate(null)}>
            Register another
          </Button>
          <Button asChild className="bg-primary text-white hover:bg-primary-light">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={embedded ? 'w-full' : 'rounded-2xl bg-white px-6 py-8 shadow-xl shadow-slate-200 sm:px-9'}>
      {!embedded && (
        <div className="text-center">
          <img src="/images/logo.png" alt="L2H" className="mx-auto h-auto w-56 object-contain" />
          <p className="mt-4 text-base text-slate-900">candidate registration</p>
        </div>
      )}

      <div className={`${embedded ? 'mt-0' : 'mt-7'} relative flex items-center justify-between px-1`}>
        <div className="absolute left-5 right-5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#e8edf4]" />
        <div
          className="absolute left-5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `calc((100% - 2.5rem) * ${(currentStep - 1) / (steps.length - 1)})` }}
        />
        {steps.map((step) => (
          <div
            key={step.id}
            className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold shadow-lg transition-all ${
              currentStep >= step.id ? 'bg-primary text-white shadow-primary/10' : 'bg-white text-slate-500 shadow-slate-200'
            }`}
          >
            {step.id}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h1 className="text-lg font-bold text-primary">{steps[currentStep - 1].title}</h1>
        <p className="mt-1 text-sm leading-5 text-[#1f3351]">{steps[currentStep - 1].description}</p>
        <div className="mt-3 h-px w-full bg-[#dbe3ef]" />
      </div>

      {currentStep === 1 && (
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className={labelClass}>Full Name *</Label>
            <Input id="full_name" required className={fieldClass} placeholder="Your full name" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile_number" className={labelClass}>Mobile Number *</Label>
              <Input id="mobile_number" required className={fieldClass} placeholder="+91 99999 99999" value={formData.mobile_number} onChange={(e) => updateField('mobile_number', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={labelClass}>Email Address *</Label>
              <Input id="email" type="email" required className={fieldClass} placeholder="you@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className={labelClass}>City *</Label>
              <Input id="city" required className={fieldClass} placeholder="City" value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className={labelClass}>State *</Label>
              <Input id="state" required className={fieldClass} placeholder="State" value={formData.state} onChange={(e) => updateField('state', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin_url" className={labelClass}>LinkedIn Profile URL</Label>
            <Input id="linkedin_url" className={fieldClass} placeholder="https://linkedin.com/in/yourprofile" value={formData.linkedin_url || ''} onChange={(e) => updateField('linkedin_url', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio_url" className={labelClass}>Portfolio / Website (Optional)</Label>
            <Input id="portfolio_url" className={fieldClass} placeholder="https://yourportfolio.com" value={formData.portfolio_url || ''} onChange={(e) => updateField('portfolio_url', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Professional Photograph</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className={fieldClass}
                onChange={(e) => handleFileChange(e.target.files?.[0], setPhotoFile, setPhotoFileName)}
              />
            </div>
            {photoFileName && <p className="text-xs text-emerald-600">{photoFileName}</p>}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="college_name" className={labelClass}>College / University Name *</Label>
            <Input id="college_name" required className={fieldClass} placeholder="Your college or university" value={formData.college_name} onChange={(e) => updateField('college_name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClass}>Highest Qualification *</Label>
              <Select value={formData.highest_qualification} onValueChange={(v: Qualification) => updateField('highest_qualification', v)}>
                <SelectTrigger className={fieldClass}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {(['high_school', 'diploma', 'bachelors', 'masters', 'phd', 'other'] as Qualification[]).map((q) => (
                    <SelectItem key={q} value={q}>{QUALIFICATION_LABELS[q]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_course" className={labelClass}>Current Course Enrolled</Label>
              <Input id="current_course" className={fieldClass} placeholder="Course name" value={formData.current_course || ''} onChange={(e) => updateField('current_course', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred_job_role" className={labelClass}>Preferred Job Role *</Label>
            <Input id="preferred_job_role" required className={fieldClass} placeholder="e.g. Frontend Developer" value={formData.preferred_job_role} onChange={(e) => updateField('preferred_job_role', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClass}>Preferred Work Mode *</Label>
              <Select value={formData.preferred_work_mode} onValueChange={(v: WorkMode) => updateField('preferred_work_mode', v)}>
                <SelectTrigger className={fieldClass}><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {(['remote', 'onsite', 'hybrid'] as WorkMode[]).map((m) => (
                    <SelectItem key={m} value={m}>{WORK_MODE_LABELS[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_job_location" className={labelClass}>Preferred Job Location *</Label>
              <Input id="preferred_job_location" required className={fieldClass} placeholder="e.g. Bangalore" value={formData.preferred_job_location} onChange={(e) => updateField('preferred_job_location', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_salary" className={labelClass}>Expected Salary / Stipend *</Label>
              <Input id="expected_salary" type="number" required className={fieldClass} placeholder="500000" value={formData.expected_salary || ''} onChange={(e) => updateField('expected_salary', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_joining_date" className={labelClass}>Available Joining Date *</Label>
              <Input id="available_joining_date" type="date" required className={fieldClass} value={formData.available_joining_date ? new Date(formData.available_joining_date).toISOString().split('T')[0] : ''} onChange={(e) => updateField('available_joining_date', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label className={labelClass}>Experience Level *</Label>
            <Select value={formData.experience_level} onValueChange={(v: ExperienceLevel) => updateField('experience_level', v)}>
              <SelectTrigger className={fieldClass}><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {(['fresher', 'experienced'] as ExperienceLevel[]).map((l) => (
                  <SelectItem key={l} value={l}>{EXPERIENCE_LEVEL_LABELS[l]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.experience_level === 'experienced' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={labelClass}>Work Experiences</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData((c) => ({ ...c, work_experiences: [...(c.work_experiences || []), { ...DEFAULT_WORK_EXPERIENCE }] }))}>
                  <PlusCircle className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              {(formData.work_experiences || []).length === 0 && (
                <p className="text-sm text-muted-foreground py-3 text-center border rounded-md">No work experiences added. Click "Add" to add one.</p>
              )}
              {(formData.work_experiences || []).map((exp, idx) => (
                <div key={idx} className="rounded-xl border bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">Experience #{idx + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-rose-500" onClick={() => setFormData((c) => ({ ...c, work_experiences: (c.work_experiences || []).filter((_, i) => i !== idx) }))}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input className={fieldClass} placeholder="Company Name" value={exp.company_name} onChange={(e) => { const u = [...(formData.work_experiences || [])]; u[idx] = { ...exp, company_name: e.target.value }; updateField('work_experiences', u); }} />
                    <Input className={fieldClass} placeholder="Position" value={exp.position} onChange={(e) => { const u = [...(formData.work_experiences || [])]; u[idx] = { ...exp, position: e.target.value }; updateField('work_experiences', u); }} />
                    <Input className={fieldClass} placeholder="Duration (e.g. Jan 2022 - Dec 2024)" value={exp.duration || ''} onChange={(e) => { const u = [...(formData.work_experiences || [])]; u[idx] = { ...exp, duration: e.target.value }; updateField('work_experiences', u); }} />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={exp.is_current} onChange={(e) => { const u = [...(formData.work_experiences || [])]; u[idx] = { ...exp, is_current: e.target.checked }; updateField('work_experiences', u); }} className="h-4 w-4 rounded border-gray-300" />
                      Currently working here
                    </label>
                    <Textarea className="min-h-[60px] md:col-span-2" placeholder="Description of responsibilities" value={exp.description || ''} onChange={(e) => { const u = [...(formData.work_experiences || [])]; u[idx] = { ...exp, description: e.target.value }; updateField('work_experiences', u); }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="additional_skills" className={labelClass}>Additional Skills</Label>
            <Textarea id="additional_skills" className="min-h-[80px] rounded-xl border-primary/10 bg-white px-4 py-3 text-sm shadow-sm" placeholder="e.g. React, Node.js, Python, Communication, Leadership..." value={formData.additional_skills || ''} onChange={(e) => updateField('additional_skills', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="career_goals" className={labelClass}>Career Goals</Label>
            <Textarea id="career_goals" className="min-h-[80px] rounded-xl border-primary/10 bg-white px-4 py-3 text-sm shadow-sm" placeholder="What are your career aspirations?" value={formData.career_goals || ''} onChange={(e) => updateField('career_goals', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Upload Resume / CV</Label>
            <Input type="file" accept="application/pdf" className={fieldClass} onChange={(e) => handleFileChange(e.target.files?.[0], setResumeFile, setResumeFileName)} />
            {resumeFileName && <p className="text-xs text-emerald-600">{resumeFileName} (PDF, max {MAX_RESUME_SIZE_MB}MB)</p>}
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Video Introduction (30-40 sec)</Label>
            <Input type="file" accept="video/*" className={fieldClass} onChange={(e) => handleFileChange(e.target.files?.[0], setVideoFile, setVideoFileName)} />
            {videoFileName && <p className="text-xs text-emerald-600">{videoFileName} (max {MAX_VIDEO_SIZE_MB}MB)</p>}
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg_email" className={labelClass}>Email Address *</Label>
            <Input id="reg_email" type="email" required className={fieldClass} placeholder="you@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg_password" className={labelClass}>Password *</Label>
              <Input id="reg_password" type="password" required className={fieldClass} placeholder="Min 6 characters" value={formData.password} onChange={(e) => updateField('password', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password" className={labelClass}>Retype Password *</Label>
              <Input id="confirm_password" type="password" required className={fieldClass} placeholder="Retype password" value={formData.confirm_password} onChange={(e) => updateField('confirm_password', e.target.value)} />
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-white p-4">
            <input
              type="checkbox"
              id="terms_accepted"
              checked={formData.terms_accepted}
              onChange={(e) => updateField('terms_accepted', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="terms_accepted" className="text-sm leading-5 text-slate-600">
              I agree to share my profile with hiring partners associated with the platform.
            </Label>
          </div>
        </div>
      )}

      <div className={`mt-8 grid gap-2 ${currentStep === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={goPrevious} className="h-11 rounded-xl">
            Previous
          </Button>
        )}
        {currentStep < steps.length ? (
          <Button type="button" onClick={goNext} className="h-11 rounded-xl bg-primary text-white hover:bg-primary-light">
            Next
          </Button>
        ) : (
          <Button type="submit" disabled={createMutation.isPending || isUploading} className="h-11 rounded-xl bg-primary text-white hover:bg-primary-light">
            {(createMutation.isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Profile
          </Button>
        )}
      </div>
    </form>
  );
}

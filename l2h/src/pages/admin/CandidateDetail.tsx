import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Video,
  BriefcaseBusiness,
  Clock,
  IndianRupee,
  Award,
  Target,
  User,
  BookOpen,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { candidateService } from '@/services/candidate.service';
import {
  EXPERIENCE_LEVEL_LABELS,
  QUALIFICATION_LABELS,
  WORK_MODE_LABELS,
} from '@/types/candidate';

const getStatusBadge = (status: string) => {
  if (status === 'accepted') return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100';
  if (status === 'denied') return 'bg-red-100 text-red-800 hover:bg-red-100';
  return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
};

const getStatusLabel = (status: string) => {
  if (status === 'accepted') return 'Accepted';
  if (status === 'denied') return 'Denied';
  return 'Pending';
};

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: candidate,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-candidate', id],
    queryFn: () => candidateService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <User className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Candidate not found</h2>
        <Button variant="outline" onClick={() => navigate('/admin/candidates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/candidates')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Candidate Profile</h1>
          <p className="text-muted-foreground">{candidate.unique_id}</p>
        </div>
        <Badge className={getStatusBadge(candidate.status)}>
          {getStatusLabel(candidate.status)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50">
                {candidate.photograph_url ? (
                  <img
                    src={candidate.photograph_url}
                    alt={candidate.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-slate-300" />
                )}
              </div>
              <h2 className="text-xl font-bold">{candidate.full_name}</h2>
              <p className="text-sm text-muted-foreground">{candidate.preferred_job_role}</p>
              <Badge variant="outline" className="mt-2 capitalize">
                {EXPERIENCE_LEVEL_LABELS[candidate.experience_level]}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${candidate.email}`} className="text-sm text-blue-600 hover:underline">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${candidate.mobile_number}`} className="text-sm text-blue-600 hover:underline">
                  {candidate.mobile_number}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {[candidate.city, candidate.state].filter(Boolean).join(', ')}
                </span>
              </div>
              {candidate.linkedin_url && (
                <div className="flex items-center gap-3">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {candidate.portfolio_url && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={candidate.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Portfolio / Website
                  </a>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Documents</h3>
              {candidate.resume_url ? (
                <a
                  href={candidate.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-rose-500" />
                  View Resume / CV
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded</p>
              )}
              {candidate.video_introduction_url ? (
                <a
                  href={candidate.video_introduction_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-slate-50"
                >
                  <Video className="h-4 w-4 text-blue-500" />
                  Video Introduction
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">No video uploaded</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>College / University</Label>
                  <p className="font-medium">{candidate.college_name}</p>
                </div>
                <div>
                  <Label>Highest Qualification</Label>
                  <p className="font-medium">{QUALIFICATION_LABELS[candidate.highest_qualification]}</p>
                </div>
                {candidate.current_course && (
                  <div className="sm:col-span-2">
                    <Label>Current Course Enrolled</Label>
                    <p className="font-medium">{candidate.current_course}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5" />
                Job Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Preferred Job Role</Label>
                  <p className="font-medium">{candidate.preferred_job_role}</p>
                </div>
                <div>
                  <Label>Preferred Work Mode</Label>
                  <p className="font-medium">{WORK_MODE_LABELS[candidate.preferred_work_mode]}</p>
                </div>
                <div>
                  <Label>Preferred Job Location</Label>
                  <p className="font-medium">{candidate.preferred_job_location}</p>
                </div>
                <div>
                  <Label>Expected Salary / Stipend</Label>
                  <p className="font-medium">
                    {candidate.expected_salary
                      ? `₹${candidate.expected_salary.toLocaleString('en-IN')}`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Available Joining Date</Label>
                  <p className="font-medium">
                    {candidate.available_joining_date
                      ? new Date(candidate.available_joining_date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Badge variant="outline" className="capitalize">
                    {EXPERIENCE_LEVEL_LABELS[candidate.experience_level]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {candidate.work_experiences && candidate.work_experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidate.work_experiences.map((exp, index) => (
                    <div key={index} className="rounded-xl border bg-slate-50 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Experience #{index + 1}
                        </span>
                        {exp.is_current && (
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Company</Label>
                          <p className="font-medium">{exp.company_name}</p>
                        </div>
                        <div>
                          <Label>Position</Label>
                          <p className="font-medium">{exp.position}</p>
                        </div>
                        {exp.duration && (
                          <div>
                            <Label>Duration</Label>
                            <p className="text-sm">{exp.duration}</p>
                          </div>
                        )}
                        {exp.description && (
                          <div className="sm:col-span-2">
                            <Label>Description</Label>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {candidate.experience_level === 'experienced' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5" />
                  Experience Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {candidate.previous_company_name && (
                    <div>
                      <Label>Previous Company</Label>
                      <p className="font-medium">{candidate.previous_company_name}</p>
                    </div>
                  )}
                  {candidate.company_position && (
                    <div>
                      <Label>Company Position</Label>
                      <p className="font-medium">{candidate.company_position}</p>
                    </div>
                  )}
                  {candidate.internship_experience && (
                    <div>
                      <Label>Internship Experience</Label>
                      <p className="font-medium">{candidate.internship_experience}</p>
                    </div>
                  )}
                  {candidate.total_work_experience != null && (
                    <div>
                      <Label>Total Work Experience</Label>
                      <p className="font-medium">{candidate.total_work_experience} year(s)</p>
                    </div>
                  )}
                  {candidate.description && (
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {candidate.description}
                      </p>
                    </div>
                  )}
                  {candidate.key_responsibilities && (
                    <div className="sm:col-span-2">
                      <Label>Key Responsibilities</Label>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {candidate.key_responsibilities}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {candidate.experience_level !== 'experienced' && (
            candidate.previous_company_name ||
            candidate.company_position ||
            candidate.internship_experience ||
            candidate.key_responsibilities ||
            candidate.description
          ) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Additional Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {candidate.previous_company_name && (
                    <div>
                      <Label>Previous Company</Label>
                      <p className="font-medium">{candidate.previous_company_name}</p>
                    </div>
                  )}
                  {candidate.company_position && (
                    <div>
                      <Label>Company Position</Label>
                      <p className="font-medium">{candidate.company_position}</p>
                    </div>
                  )}
                  {candidate.internship_experience && (
                    <div>
                      <Label>Internship Experience</Label>
                      <p className="font-medium">{candidate.internship_experience}</p>
                    </div>
                  )}
                  {candidate.description && (
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {candidate.description}
                      </p>
                    </div>
                  )}
                  {candidate.key_responsibilities && (
                    <div className="sm:col-span-2">
                      <Label>Key Responsibilities</Label>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {candidate.key_responsibilities}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills & Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.additional_skills && (
                  <div>
                    <Label>Additional Skills</Label>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {candidate.additional_skills}
                    </p>
                  </div>
                )}
                {candidate.career_goals && (
                  <div>
                    <Label>Career Goals</Label>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {candidate.career_goals}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Candidate ID</Label>
                  <p className="font-medium">#{candidate.id}</p>
                </div>
                <div>
                  <Label>Unique ID</Label>
                  <p className="font-medium font-mono text-sm">{candidate.unique_id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusBadge(candidate.status)}>
                    {getStatusLabel(candidate.status)}
                  </Badge>
                </div>
                <div>
                  <Label>Terms Accepted</Label>
                  {candidate.terms_accepted ? (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">No</Badge>
                  )}
                </div>
                <div>
                  <Label>Registered On</Label>
                  <p className="text-sm">
                    {new Date(candidate.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm">
                    {new Date(candidate.updatedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground mb-0.5">{children}</p>;
}

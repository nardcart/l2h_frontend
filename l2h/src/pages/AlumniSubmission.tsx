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
import { CheckCircle2, ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';

export default function AlumniSubmission() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<AlumniCreatePayload>(DEFAULT_ALUMNI_FORM);

  const createMutation = useMutation({
    mutationFn: async (payload: AlumniCreatePayload) => alumniService.create(payload),
    onSuccess: () => {
      toast({
        title: 'Application submitted',
        description:
          'Your alumni submission has been received and is now waiting for admin approval.',
      });
      setFormData(DEFAULT_ALUMNI_FORM);
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
    });
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
                      disabled={createMutation.isPending}
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

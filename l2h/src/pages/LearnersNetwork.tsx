import { FormEvent, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { alumniService } from '@/services/alumni.service';
import type { AlumniRecord } from '@/types/alumni';
import {
  Award,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  IdCard,
  Loader2,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const skillsPreview = (skills: string) =>
  skills.length > 70 ? `${skills.slice(0, 70)}...` : skills;

const LearnersNetwork = () => {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<AlumniRecord | null>(null);

  const { data: learners = [], isLoading } = useQuery({
    queryKey: ['public-alumni'],
    queryFn: alumniService.listPublic,
  });

  const fuse = useMemo(
    () =>
      new Fuse(learners, {
        keys: [
          { name: 'full_name', weight: 2.2 },
          { name: 'unique_id', weight: 2 },
          { name: 'program_name', weight: 1.6 },
          { name: 'profession', weight: 1.4 },
          { name: 'skills', weight: 1.1 },
        ],
        threshold: 0.35,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
      }),
    [learners]
  );

  const filteredLearners = useMemo(() => {
    const query = activeSearch.trim();

    if (!query) {
      return learners;
    }

    return fuse.search(query).map((result) => result.item);
  }, [activeSearch, fuse, learners]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveSearch(search);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className="relative overflow-hidden bg-white py-8 lg:py-8">
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="relative h-[520px] lg:hidden">
            <img
              src="/images/collage.jpg"
              alt="L2H learners and community sessions"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/60" />
            <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-white via-white/70 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 text-white">
              <h1 className="mb-5 text-3xl font-bold leading-tight">Alumni Network</h1>
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-none text-green-400" />
                  <span className="text-sm font-medium">Approved alumni profiles only</span>
                </div>
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 flex-none text-green-400" />
                  <span className="text-sm font-medium">Search by name, ID, course, or profession</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 flex-none text-green-400" />
                  <span className="text-sm font-medium">Submit your profile for admin review</span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                asChild
              >
                <Link to="/learners-network/submit">Join Alumni Network</Link>
              </Button>
            </div>
          </div>

          <div className="hidden h-[500px] px-4 sm:px-6 lg:block lg:px-8">
            <div className="grid h-full grid-cols-2 items-center gap-12">
              <div className="space-y-8">
                <div>
                  <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Approved Alumni
                  </Badge>
                  <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">Alumni Network</h1>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                    Meet L2H learners building real skills across marketing, technology, communication, leadership, and
                    career growth.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">{learners.length}+</span> approved alumni profiles
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Searchable</span> by learner name, unique ID, course, or role
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Public form</span> sends every new submission for admin approval
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    className="bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                    onClick={() =>
                      document.getElementById('learner-directory')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    Explore Learners
                  </Button>
                  <Link to="/courses">
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
                    >
                      View Courses
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <img
                  src="/images/collage.jpg"
                  alt="L2H learners and community sessions"
                  className="-ml-[2.5%] -mt-5 h-[560px] w-[105%] object-cover brightness-95 image-edge-fade"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[90%] via-transparent to-white/95" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-[10%] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-sky-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">Public Submission Form</Badge>
                <h2 className="text-2xl font-bold text-slate-900">Want your profile listed here?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Submit your alumni profile on the dedicated form page. Every submission stays private until the admin
                  reviews and approves it.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Your Unique ID is generated automatically after submission, so you do not need to enter it manually.
                </p>
              </div>

              <Button asChild className="bg-blue-600 text-white hover:bg-blue-700 lg:h-12 lg:px-6">
                <Link to="/learners-network/submit">
                  Go to Alumni Form
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="learner-directory" className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Learners Directory</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Browse approved alumni and the skills they have built through L2H programs.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <div className="relative sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, ID, course, or profession"
                  className="h-11 bg-white pl-10"
                />
              </div>
              <Button type="submit" className="h-11 bg-blue-600 px-7 font-semibold text-white hover:bg-blue-700">
                Search
              </Button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLearners.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredLearners.map((learner) => (
                <Card
                  key={learner._id}
                  className="group border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      {learner.profile_image_url ? (
                        <img
                          src={learner.profile_image_url}
                          alt={learner.full_name}
                          className="h-14 w-14 flex-none rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                          {getInitials(learner.full_name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600">
                              {learner.full_name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {learner.profession || 'Profession not shared'}
                            </p>
                          </div>
                          <CheckCircle2 className="h-6 w-6 flex-none fill-sky-50 text-sky-500" />
                        </div>
                        <Badge className="mt-3 bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {learner.unique_id}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-gray-700">
                    <div className="flex gap-3">
                      <GraduationCap className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>
                        <strong>Course Name:</strong> {learner.program_name}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <IdCard className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>
                        <strong>Unique ID:</strong> {learner.unique_id}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <BriefcaseBusiness className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>
                        <strong>Profession:</strong> {learner.profession || 'Not shared'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <Award className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                      <span>
                        <strong>Skills Learned:</strong>{' '}
                        {skillsPreview(learner.skills || 'Skills not shared yet')}{" "}
                        {(learner.skills || '').length > 70 ? (
                          <button
                            type="button"
                            onClick={() => setSelectedLearner(learner)}
                            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                          >
                            Read More
                          </button>
                        ) : null}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-2xl font-semibold text-gray-900">No alumni found</h3>
              <p className="mt-2 text-muted-foreground">Try searching by another name, program, profession, or ID.</p>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Showing {filteredLearners.length} of {learners.length} approved learners
          </p>
        </div>
      </section>

      <Dialog open={!!selectedLearner} onOpenChange={(open) => !open && setSelectedLearner(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Skills Learned</DialogTitle>
            <DialogDescription>{selectedLearner?.full_name}</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-7 text-gray-700">{selectedLearner?.skills}</p>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default LearnersNetwork;

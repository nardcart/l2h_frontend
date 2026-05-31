import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Footer from '@/components/Footer';
import CompanyRegistrationForm from '@/components/CompanyRegistrationForm';
import CandidateRegistrationForm from '@/components/CandidateRegistrationForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { candidateService } from '@/services/candidate.service';
import { companyService } from '@/services/company.service';
import type { CandidateRecord } from '@/types/candidate';
import type { CompanyRecord } from '@/types/company';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Code2,
  FileText,
  GraduationCap,
  Palette,
  Play,
  Rocket,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const fadeScale = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const heroStats = [
  {
    value: '100+',
    label: 'Hours of Practical Learning',
    icon: GraduationCap,
    tone: 'text-indigo-600 bg-indigo-50',
  },
  {
    value: '500+',
    label: 'Hours of coding practice',
    icon: Code2,
    tone: 'text-orange-600 bg-orange-50',
  },
  {
    value: '8+',
    label: 'Capstone projects completed',
    icon: BadgeCheck,
    tone: 'text-emerald-600 bg-emerald-50',
  },
];

const placementSteps = [
  {
    number: '1',
    title: 'Share Your Requirements',
    description: 'A dedicated hiring expert will be assigned to understand your role and team needs.',
    icon: FileText,
  },
  {
    number: '2',
    title: 'Get Curated Profiles',
    description: 'We handpick trained learners whose skills align with your requirements.',
    icon: Users,
  },
  {
    number: '3',
    title: 'Start Selection Process',
    description: 'Evaluate candidates with your own tests, assignments, and interview rounds.',
    icon: ClipboardCheck,
  },
  {
    number: '4',
    title: 'Pick Your Best Fit',
    description: 'Candidates can join quickly and start contributing to your projects.',
    icon: UserCheck,
  },
];

const studentPlacementSteps = [
  {
    number: '01',
    title: 'Registration & Profile Creation',
    description:
      'Students register and submit personal details, academic records, and skill profiles on the placement portal.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Training & Skill Enhancement',
    description:
      'Eligible students attend pre-placement training sessions, mock interviews, and skill-development workshops.',
    icon: GraduationCap,
  },
  {
    number: '03',
    title: 'Company Selection & Application',
    description:
      'Students browse available job opportunities, choose preferred companies, and apply through the portal.',
    icon: BriefcaseBusiness,
  },
  {
    number: '04',
    title: 'Interviews & Final Placement',
    description:
      'Shortlisted candidates attend interviews, and successful students receive offer letters from recruiters.',
    icon: BadgeCheck,
  },
];

const careerSupportServices = [
  {
    title: 'Resume-Building',
    description:
      "Step-by-step guidance in creating impactful resumes that catch recruiters' attention. We help tailor your profile for specific job roles, giving you a competitive edge.",
    icon: FileText,
  },
  {
    title: 'Industry Mentorship',
    description:
      'Personalized guidance from industry experts who share insights on market trends and emerging technologies, bridging academic learning with workplace expectations.',
    icon: Users,
  },
  {
    title: 'Job Prep Sessions',
    description:
      'Regular mock interviews, aptitude tests, and group discussions to develop confidence and skills needed to succeed in real placement drives.',
    icon: ClipboardCheck,
  },
];

const careerJourney = [
  {
    title: 'Set Your Goals',
    description: 'Define your career aspirations and target companies',
    icon: Star,
  },
  {
    title: 'Build Skills',
    description: 'Enhance your capabilities through our training programs',
    icon: Sparkles,
  },
  {
    title: 'Launch Career',
    description: 'Join leading organizations and start your professional journey',
    icon: Rocket,
  },
];

type PlacementPartnerLogo = {
  id: string;
  name: string;
  logoUrl?: string;
  website?: string;
  sector?: string;
};

const getCompanyInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

const normalizeWebsiteUrl = (url?: string) => {
  if (!url?.trim()) return undefined;

  const trimmedUrl = url.trim();
  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
};

const mapCompanyToPlacementPartner = (company: CompanyRecord): PlacementPartnerLogo => ({
  id: company._id || company.unique_id || String(company.id),
  name: company.company_name.trim(),
  logoUrl: company.company_logo_url?.trim() || undefined,
  website: normalizeWebsiteUrl(company.company_website),
  sector: company.sector?.trim() || company.category?.trim() || undefined,
});

const getPartnerDedupeKey = (partner: PlacementPartnerLogo) =>
  `${partner.name.trim().toLowerCase()}|${partner.website || ''}`;

const dedupePlacementPartners = (partners: PlacementPartnerLogo[]) =>
  Array.from(
    partners.reduce((partnerMap, partner) => {
      const key = getPartnerDedupeKey(partner);

      if (!partnerMap.has(key)) {
        partnerMap.set(key, partner);
      }

      return partnerMap;
    }, new Map<string, PlacementPartnerLogo>()).values()
  );

const createLoopedPartnerRow = (partners: PlacementPartnerLogo[], minimumItems = 12) => {
  if (partners.length === 0) return [];

  const visibleItems: PlacementPartnerLogo[] = [];

  while (visibleItems.length < minimumItems) {
    visibleItems.push(...partners);
  }

  return [...visibleItems, ...visibleItems];
};

const createPartnerMarqueeRows = (partners: PlacementPartnerLogo[]) => {
  if (partners.length === 0) return [];

  if (partners.length <= 8) {
    const reversePartners = [...partners].reverse();

    return [
      createLoopedPartnerRow(partners, 12),
      createLoopedPartnerRow(reversePartners, 12),
    ];
  }

  const midpoint = Math.ceil(partners.length / 2);
  return [
    createLoopedPartnerRow(partners.slice(0, midpoint), 12),
    createLoopedPartnerRow(partners.slice(midpoint), 12),
  ].filter((row) => row.length > 0);
};

const PartnerLogoCard = ({ partner }: { partner: PlacementPartnerLogo }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const hasLogo = Boolean(partner.logoUrl && !logoFailed);
  const websiteLabel = partner.website?.replace(/^https?:\/\//i, '').replace(/\/$/, '') || 'Not provided';

  const card = (
    <div className="group relative flex h-[72px] w-[148px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-lg hover:shadow-red-100/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white to-red-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden transition duration-300 group-hover:-translate-y-5 group-hover:opacity-25">
        {hasLogo ? (
          <img
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-full w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
          />
        ) : (
          <span className="text-base font-black text-slate-500">
            {getCompanyInitials(partner.name)}
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-1.5 z-20 flex translate-y-2 flex-col justify-center rounded-md bg-white/95 px-2 text-left opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-red-600">Website</p>
        <p className="truncate text-[11px] font-semibold leading-4 text-slate-900">{websiteLabel}</p>
        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-red-600">Sector</p>
        <p className="truncate text-[11px] font-semibold leading-4 text-slate-900">
          {partner.sector || 'Not provided'}
        </p>
      </div>
    </div>
  );

  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visit ${partner.name}`}
    >
      {card}
    </a>
  ) : (
    card
  );
};

const darkMetrics = [
  {
    value: '4.5+3.5',
    suffix: 'Mo',
    label: 'Intensive Training + Capstone',
  },
  {
    value: '100+',
    suffix: 'Hrs',
    label: 'Practical Learning',
  },
  {
    value: '500+',
    suffix: 'Hrs',
    label: 'Coding practice sets',
  },
  {
    value: '8',
    suffix: 'Proj',
    label: 'Hands-on + Capstone',
  },
];

const techOrbit = [
  { name: 'AI', mark: 'AI', angle: -70, radius: 106, color: 'text-sky-200' },
  { name: 'Management', mark: 'Mg', angle: 20, radius: 106, color: 'text-orange-200' },
  { name: 'Soft Skills', mark: 'SS', angle: 110, radius: 106, color: 'text-sky-100' },
  { name: 'Language', mark: 'Ln', angle: 200, radius: 106, color: 'text-blue-100' },
  { name: 'Digital Marketing', mark: 'DM', angle: -35, radius: 170, color: 'text-emerald-100' },
  { name: 'Healing', mark: 'He', angle: 55, radius: 170, color: 'text-amber-100' },
  { name: 'Mental Health', mark: 'MH', angle: 145, radius: 170, color: 'text-cyan-100' },
  { name: 'Job Skills', mark: 'Job', angle: 235, radius: 170, color: 'text-violet-100' },
];

const roles = [
  {
    title: 'Digital Marketing Specialist',
    description: 'Marketing Mastery, AI digital marketing, Instagram growth, funnels, ads, and analytics',
    icon: Sparkles,
  },
  {
    title: 'Content Designer',
    description: 'Content Designing Mastery for social creatives, campaign visuals, brand assets, and layouts',
    icon: Palette,
  },
  {
    title: 'Business Growth Executive',
    description: 'Business Mastery learners trained in sales thinking, market strategy, and client acquisition',
    icon: BriefcaseBusiness,
  },
  {
    title: 'LinkedIn & Career Branding Associate',
    description: 'LinkedIn growth, profile optimization, networking, and job-market positioning',
    icon: BadgeCheck,
  },
  {
    title: 'Communication & Soft Skills Associate',
    description: 'Confidence, communication, professional etiquette, interview readiness, and workplace behavior',
    icon: Users,
  },
  {
    title: 'Counselling Support Associate',
    description: 'Counsellors Venture Launchpad, child psychology, neuroscience basics, and guided support skills',
    icon: UserCheck,
  },
  {
    title: 'Wellness & Mindfulness Facilitator',
    description: 'Mindful Reset, self-development, emotional wellness, and reflective growth sessions',
    icon: Star,
  },
  {
    title: 'Placement-Ready Candidate',
    description: 'GetPlaced 360 learners prepared with resumes, mock interviews, and workplace readiness',
    icon: ClipboardCheck,
  },
];

const partnerVideos = [
  'Campus Interview by TemplateTrip',
  'Training Workshop with Hiring Partner',
  'Best Company Student Review',
];

const feedbackReels = [
  {
    company: 'Gemkaps Export Pvt. Ltd.',
    person: 'Recruiter feedback',
  },
  {
    company: 'Daydream Soft Infotech',
    person: 'Talent acquisition',
  },
  {
    company: 'Vivaan Zone',
    person: 'Founder testimonial',
  },
  {
    company: 'Artious Solution',
    person: 'Hiring manager',
  },
];

type AlumniCandidate = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  location?: string;
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const mapCandidateToAlumni = (candidate: CandidateRecord): AlumniCandidate => {
  const currentWork = candidate.work_experiences?.find((experience) => experience.is_current);
  const role =
    currentWork?.position ||
    candidate.company_position ||
    candidate.preferred_job_role ||
    candidate.current_course ||
    'L2H Learner';
  const location = [candidate.city, candidate.state].filter(Boolean).join(', ');

  return {
    id: candidate._id || candidate.unique_id || candidate.email || candidate.full_name,
    name: candidate.full_name.trim(),
    role,
    photoUrl: candidate.photograph_url?.trim() || undefined,
    location: location || undefined,
  };
};

const dedupeAlumniCandidates = (candidates: AlumniCandidate[]) =>
  Array.from(
    candidates.reduce((candidateMap, candidate) => {
      const key = candidate.id || `${candidate.name.trim().toLowerCase()}|${candidate.role.trim().toLowerCase()}`;

      if (!candidateMap.has(key)) {
        candidateMap.set(key, candidate);
      }

      return candidateMap;
    }, new Map<string, AlumniCandidate>()).values()
  );

const AlumniCandidateCard = ({ candidate }: { candidate: AlumniCandidate }) => {
  const [photoFailed, setPhotoFailed] = useState(false);
  const hasPhoto = Boolean(candidate.photoUrl && !photoFailed);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 transition-colors duration-300 hover:border-primary/20"
      variants={fadeScale}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      whileHover={{ y: -3 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-black text-primary ring-1 ring-primary/10">
          {hasPhoto ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              loading="lazy"
              onError={() => setPhotoFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(candidate.name)
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">{candidate.name}</p>
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-500">
            {candidate.role}
          </p>
          {candidate.location ? (
            <p className="mt-1 truncate text-[11px] font-semibold text-slate-400">{candidate.location}</p>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

type PortalTab = 'student' | 'company';

const portalTabs: Array<{ id: PortalTab; label: string }> = [
  { id: 'student', label: 'Student Register' },
  { id: 'company', label: 'Company Register' },
];

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  inverse = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  inverse?: boolean;
}) => (
  <motion.div
    className="mx-auto max-w-3xl text-center"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
    variants={fadeUp}
    transition={{ duration: 0.55, ease: easeOutExpo }}
  >
    <Badge
      className={`mb-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${
        inverse ? 'bg-white/10 text-white hover:bg-white/10' : 'bg-primary/10 text-primary hover:bg-primary/10'
      }`}
    >
      {eyebrow}
    </Badge>
    <h2 className={`text-3xl font-black tracking-tight md:text-4xl ${inverse ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h2>
    {subtitle ? (
      <p className={`mt-3 text-sm leading-7 md:text-base ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>
        {subtitle}
      </p>
    ) : null}
  </motion.div>
);

const GetInTouchButton = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={className}
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
  >
    <Button
      asChild
      className="group h-full min-h-11 rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-light"
    >
      <Link to="/placement/company/register">
        Get in Touch
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </Button>
  </motion.div>
);

export default function Placement() {
  const shouldReduceMotion = useReducedMotion();
  const [activePortalTab, setActivePortalTab] = useState<PortalTab>('company');
  const [placementPartners, setPlacementPartners] = useState<PlacementPartnerLogo[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [partnersError, setPartnersError] = useState<string | null>(null);
  const [alumniCandidates, setAlumniCandidates] = useState<AlumniCandidate[]>([]);
  const [alumniLoading, setAlumniLoading] = useState(true);
  const [alumniError, setAlumniError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlacementPartners = async () => {
      try {
        setPartnersLoading(true);
        setPartnersError(null);

        const companies = await companyService.listPublic();
        const partners = dedupePlacementPartners(
          companies
            .filter((company) => company.company_name?.trim())
            .map(mapCompanyToPlacementPartner)
        );

        if (isMounted) {
          setPlacementPartners(partners);
        }
      } catch (error) {
        console.error('Failed to load placement partners', error);

        if (isMounted) {
          setPlacementPartners([]);
          setPartnersError('Unable to load placement partners right now.');
        }
      } finally {
        if (isMounted) {
          setPartnersLoading(false);
        }
      }
    };

    loadPlacementPartners();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAlumniCandidates = async () => {
      try {
        setAlumniLoading(true);
        setAlumniError(null);

        const candidates = await candidateService.listPublic();
        const alumni = dedupeAlumniCandidates(
          candidates
            .filter((candidate) => candidate.full_name?.trim())
            .map(mapCandidateToAlumni)
        );

        if (isMounted) {
          setAlumniCandidates(alumni);
        }
      } catch (error) {
        console.error('Failed to load alumni candidates', error);

        if (isMounted) {
          setAlumniCandidates([]);
          setAlumniError('Unable to load alumni network right now.');
        }
      } finally {
        if (isMounted) {
          setAlumniLoading(false);
        }
      }
    };

    loadAlumniCandidates();

    return () => {
      isMounted = false;
    };
  }, []);

  const partnerLogoRows = useMemo(
    () => createPartnerMarqueeRows(placementPartners),
    [placementPartners]
  );

  return (
    <div className="min-h-screen overflow-hidden bg-white pt-16 text-slate-900">
      <style>{`
        @keyframes placement-marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes placement-marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        @keyframes placement-marquee-single {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }

        .placement-marquee-track {
          width: max-content;
          animation-duration: 28s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .placement-marquee-left {
          animation-name: placement-marquee-left;
        }

        .placement-marquee-right {
          animation-name: placement-marquee-right;
        }

        .placement-marquee-single {
          animation-name: placement-marquee-single;
        }

        .placement-marquee-row:hover .placement-marquee-track {
          animation-play-state: paused;
        }

        @keyframes placement-orbit-core {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.14)); }
          50% { filter: drop-shadow(0 0 26px rgba(255, 255, 255, 0.34)); }
        }

        .placement-orbit-core {
          animation: placement-orbit-core 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .placement-marquee-track {
            animation: none;
            transform: translateX(0);
          }

          .placement-orbit-core {
            animation: none;
          }
        }
      `}</style>

      <motion.section className="relative overflow-hidden border-b border-slate-100 bg-white">
        <motion.div
          className="absolute left-[-8rem] top-[-16rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10rem] right-[-9rem] h-96 w-96 rounded-full bg-sky-100 blur-3xl"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.55, 0.75, 0.55] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />

        <motion.div
          className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr,0.95fr] lg:px-8 lg:py-20"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
            variants={fadeUp}
            transition={{ duration: 0.65, ease: easeOutExpo }}
          >
            <Badge className="mb-5 rounded-full bg-primary/10 px-4 py-2 font-bold text-primary hover:bg-primary/10">
              Placement support for companies
            </Badge>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-primary md:text-6xl">
              Looking for <span className="italic text-primary-light">top talent?</span>
              <span className="block">We&apos;ve got you covered!</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 lg:mx-0">
              Connect with L2H learners trained through practical projects, guided mentorship, interview readiness, and
              role-specific skill tracks.
            </p>

            <motion.div className="mt-8 grid gap-3 sm:grid-cols-2" variants={stagger}>
              {heroStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white/95 p-4 text-left shadow-sm shadow-slate-200/60 ring-1 ring-transparent transition-colors duration-300 hover:border-primary/15 hover:ring-primary/5"
                  variants={fadeScale}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-primary">{stat.value}</p>
                    <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <GetInTouchButton className="h-12" />
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-primary/20 px-6 font-bold text-primary hover:bg-primary hover:text-white"
              >
                <a href="#hiring-process">How It Works</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            id="placement-portal"
            className="relative mx-auto w-full max-w-lg"
            variants={fadeScale}
            transition={{ duration: 0.65, ease: easeOutExpo, delay: 0.1 }}
          >
            <motion.div
              className="rounded-[1.75rem] border border-primary/10 bg-white/95 p-4 shadow-2xl shadow-slate-300/50 backdrop-blur"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="rounded-[1.35rem] border border-primary/10 bg-gradient-to-b from-slate-50 to-white p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm ring-1 ring-primary/10">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
                      Company access
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500">For verified hiring partners</p>
                  </div>
                  <img src="/images/logo.png" alt="L2H logo" className="h-12 w-auto object-contain" />
                </div>

                <div
                  className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-primary/10 bg-white p-1 shadow-sm"
                  role="tablist"
                  aria-label="Placement portal tabs"
                >
                  {portalTabs.map((tab) => {
                    const isActive = activePortalTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                      onClick={() => setActivePortalTab(tab.id)}
                        className={`rounded-xl px-3 py-2.5 text-center text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {activePortalTab === 'company' ? (
                  <CompanyRegistrationForm embedded />
                ) : (
                  <CandidateRegistrationForm embedded />
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      <section className="relative overflow-hidden bg-white py-14 lg:py-16">
        <div className="absolute left-[-9rem] top-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-sky-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <Badge className="mb-5 rounded-full bg-primary/10 px-4 py-2 font-bold text-primary hover:bg-primary/10">
              Student Placement Journey
            </Badge>
            <h2 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Your Journey from Learning to Earning Starts Here
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              5,000 careers transformed through our comprehensive placement program. We connect talented students
              with leading companies, providing the training, mentorship, and support needed to launch successful
              careers.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="group h-12 rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-light"
              >
                <a href="#student-placement-process">
                  View Placement Process
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-primary/20 px-6 font-bold text-primary hover:bg-primary hover:text-white"
              >
                <a href="#placement-portal">Open Portal</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.div
              className="sm:col-span-2 rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-primary to-[#15527a] p-6 text-white shadow-2xl shadow-primary/20"
              variants={fadeScale}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              whileHover={{ y: -4 }}
            >
              <p className="text-5xl font-black tracking-tight">5,000</p>
              <p className="mt-2 text-sm font-semibold text-white/80">careers transformed through guided placement support</p>
            </motion.div>

            {careerJourney.map((item) => (
              <motion.div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition-colors duration-300 hover:border-primary/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -4 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-black text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="student-placement-process" className="relative overflow-hidden bg-[#f4f7fb] py-14 lg:py-16">
        <div className="absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Placement Process"
            title={<>How Our <span className="text-primary-light">Placement Process</span> Works</>}
            subtitle="Our systematic approach guides students through every step from registration to final placement, ensuring maximum success."
          />

          <motion.div
            className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {studentPlacementSteps.map((step) => (
              <motion.div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white p-6 shadow-sm shadow-slate-200/70 transition-colors duration-300 hover:border-primary/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -5 }}
              >
                <span className="absolute right-5 top-4 text-5xl font-black tracking-tight text-primary/[0.06]">
                  {step.number}
                </span>
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-primary/60">{step.number}</p>
                  <h3 className="mt-2 text-lg font-black text-primary">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Story"
            title={
              <>
                Why companies are <span className="text-primary-light">hiring</span> with L2H?
              </>
            }
            subtitle="See how practical training and project-based learning translate into confident, interview-ready talent."
          />

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-300">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/Dfhb1Mtt_ok"
                  title="L2H learner success story"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-6 text-slate-500">
              Dive into heartfelt experiences from learners and hiring partners who built momentum through L2H.
            </p>
          </div>
        </div>
      </section>

      <section id="hiring-process" className="relative overflow-hidden bg-[#f4f7fb] py-14 lg:py-16">
        <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title={
              <>
                <span className="text-primary-light">Find the right match</span>{' '}
                <span className="text-primary">for your team, fast</span>
              </>
            }
          />

          <motion.div
            className="relative mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {placementSteps.map((step) => (
              <motion.div
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-white p-5 text-left shadow-sm shadow-slate-200/60 transition-colors duration-300 hover:border-primary/20 sm:p-6"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary ring-1 ring-primary/10">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-primary">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <GetInTouchButton />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-none px-0">
          <motion.div
            className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <Badge className="mb-4 rounded-full border border-red-200 bg-red-50 px-4 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-red-600 hover:bg-red-50">
              Hiring Partners
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              <span className="text-red-600">100+ Companies</span>{' '}
              Have Hired L2H Learners
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
              We collaborate with leading companies across various industries to provide diverse career opportunities for our students.
            </p>
          </motion.div>

          <motion.div
            className="relative mt-8 space-y-3 overflow-hidden py-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeScale}
            transition={{ duration: 0.45, ease: easeOutExpo }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/90 to-transparent" />

            {partnersLoading ? (
              <div className="flex gap-5 overflow-hidden px-6 py-1.5">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={`partner-loading-${index}`}
                    className="h-[72px] w-[148px] shrink-0 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                  />
                ))}
              </div>
            ) : partnersError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-800">
                {partnersError}
              </div>
            ) : placementPartners.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm font-semibold text-slate-600">
                Approved placement partners will appear here as soon as companies are added.
              </div>
            ) : (
              partnerLogoRows.map((row, rowIndex) => (
                <div
                  key={`partner-row-${rowIndex}`}
                  className="placement-marquee-row overflow-hidden py-1.5"
                >
                  <div
                    className={`placement-marquee-track flex gap-5 ${
                      rowIndex === 0 ? 'placement-marquee-left' : 'placement-marquee-right'
                    }`}
                    style={{ animationDuration: rowIndex === 0 ? '34s' : '38s' }}
                  >
                    {row.map((partner, index) => {
                      return (
                        <PartnerLogoCard
                          key={`${partner.id}-${rowIndex}-${index}`}
                          partner={partner}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Button
                asChild
                className="group min-h-11 rounded-lg bg-red-600 px-7 font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700"
              >
                <Link to="/placement/company/register">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Career Support Services"
            title={
              <>
                Support that turns <span className="text-primary-light">preparation</span> into confidence
              </>
            }
          />

          <motion.div
            className="mt-10 grid gap-5 lg:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {careerSupportServices.map((service) => (
              <motion.div
                key={service.title}
                className="group rounded-[1.5rem] border border-primary/10 bg-white p-6 shadow-sm shadow-slate-200/70 transition-colors duration-300 hover:border-primary/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-black text-primary">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section
        className="relative overflow-hidden bg-[#163f56] py-12 text-white lg:py-14"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-120px' }}
        variants={stagger}
      >
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.55fr,0.85fr]">
          <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: easeOutExpo }}>
            <Badge className="mb-5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-white hover:bg-white/10">
              Industry Ready
            </Badge>
            <h2 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-tight md:text-5xl">
              <span className="block text-[#f3263a]">Hire trained Professionals</span>
              <span className="block text-white">who start creating impact from Day 1</span>
            </h2>
            <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-200 md:text-base">
              We recommend the best-fit candidates from our pool of rigorously trained and professionally assessed
              talent.
            </p>

            <motion.div className="mt-6 grid max-w-4xl gap-3 sm:grid-cols-2" variants={stagger}>
              {darkMetrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.08] px-5 py-4 shadow-sm shadow-black/10"
                  variants={fadeScale}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                  whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.12)' }}
                >
                  <p className="text-2xl font-black text-white md:text-3xl">
                    {metric.value}
                    <span className="ml-1 text-sm font-medium text-slate-300">{metric.suffix}</span>
                  </p>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-300">{metric.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-7 inline-flex"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Button
                asChild
                className="h-12 rounded-xl bg-[#ef233c] px-7 font-bold text-white shadow-lg shadow-black/20 hover:bg-[#d91f35]"
              >
                <Link to="/placement/company/register">Get in Touch</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto hidden h-[420px] w-[420px] overflow-visible xl:block"
            variants={fadeScale}
            transition={{ duration: 0.65, ease: easeOutExpo }}
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_63%)]" />
            <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            <div className="placement-orbit-core absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
                <Rocket className="h-6 w-6" />
              </div>
              Core
            </div>

            {techOrbit.map((tech, index) => (
              <div
                key={tech.name}
                className="absolute left-1/2 top-1/2 z-20 h-0 w-0"
                style={{
                  transform: `rotate(${tech.angle}deg) translate(${tech.radius}px) rotate(${-tech.angle}deg)`,
                }}
              >
                <motion.div
                  className="absolute -left-10 -top-10 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-center text-[10px] font-medium tracking-wide text-slate-300 shadow-xl shadow-black/30 backdrop-blur-xl transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.14] hover:text-white"
                  animate={shouldReduceMotion ? undefined : { y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                  whileHover={{ scale: 1.12, y: -6 }}
                  transition={{
                    y: {
                      duration: 3.4 + index * 0.12,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.08,
                    },
                    scale: { duration: 0.28, ease: easeOutExpo },
                  }}
                >
                  <p
                    className={`mb-1 font-black leading-none ${
                      tech.mark.length > 2 ? 'text-sm' : 'text-xl'
                    } ${tech.color}`}
                  >
                    {tech.mark}
                  </p>
                  <p className="leading-none">{tech.name}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Multiple Specializations"
            title={
              <>
                Hire for <span className="text-primary-light">diverse</span> career needs
              </>
            }
            subtitle="Mapped to the live L2H course catalog across marketing, business, content, communication, counselling, wellness, and job readiness."
          />

          <motion.div
            className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {roles.map((role) => (
              <motion.div
                key={role.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-primary/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-black text-slate-900">{role.title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{role.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <GetInTouchButton />
          </div>
        </div>
      </section>

      <section className="bg-[#0d2635] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Partner Voices"
            inverse
            title={
              <>
                Hear what our <span className="text-sky-200">hiring partners</span> say
              </>
            }
          />

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {partnerVideos.map((title, index) => (
              <motion.div
                key={title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl shadow-black/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-slate-700 via-slate-900 to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(59,130,246,0.42),transparent_32%),radial-gradient(circle_at_75%_70%,rgba(14,165,233,0.35),transparent_30%)]" />
                  <div className="absolute left-4 top-4 rounded-full bg-primary px-2 py-1 text-[10px] font-black text-white">
                    L2H
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Play ${title}`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </span>
                  </button>
                  <p className="absolute bottom-4 left-4 right-4 text-sm font-black text-white">{title}</p>
                </div>
                <div className="flex items-center justify-between bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300">
                  <span>Hiring story #{index + 1}</span>
                  <span>Watch on YouTube</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <GetInTouchButton />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Real Stories"
            title={
              <>
                What Our Proud Alumni Have to Say
              </>
            }
            subtitle="Short, social-style feedback cards highlighting real career confidence and practical readiness."
          />

          <motion.div
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {feedbackReels.map((reel) => (
              <motion.div
                key={reel.company}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 hover:border-primary/20"
                variants={fadeScale}
                transition={{ duration: 0.45, ease: easeOutExpo }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-xs font-black text-slate-900">{reel.company}</p>
                    <p className="text-[11px] text-slate-500">{reel.person}</p>
                  </div>
                  <span className="text-[11px] font-bold text-primary">View</span>
                </div>
                <div className="relative mx-4 mb-4 mt-3 aspect-[9/13] overflow-hidden rounded-xl bg-slate-950">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(59,130,246,0.48),transparent_30%),linear-gradient(160deg,rgba(15,23,42,0.2),rgba(15,23,42,0.98))]" />
                  <div className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-black text-primary">
                    L2H
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/10 p-3 text-white backdrop-blur">
                    <div className="flex items-center gap-1 text-amber-300">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="mt-2 text-xs font-semibold">Great communication and practical skill readiness.</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex justify-center">
            <GetInTouchButton />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Alumni Network"
            title={
              <>
                L2H alumni work at <span className="text-primary-light">growing companies</span>
              </>
            }
          />

          <motion.div
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {alumniLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`alumni-loading-${index}`}
                  className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-28 rounded-full bg-slate-100" />
                      <div className="h-2.5 w-36 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))
            ) : alumniError ? (
              <div className="col-span-full rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-semibold text-amber-800">
                {alumniError}
              </div>
            ) : alumniCandidates.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center text-sm font-semibold text-slate-600">
                Approved candidate profiles will appear here as soon as they are added.
              </div>
            ) : (
              alumniCandidates.map((candidate) => (
                <AlumniCandidateCard key={candidate.id} candidate={candidate} />
              ))
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#e4f5ff] py-14 text-slate-950 lg:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0)_45%),linear-gradient(180deg,rgba(14,165,233,0.1)_0%,rgba(255,255,255,0.28)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-sky-200/80" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <p className="text-xs font-black uppercase tracking-[0.26em] text-sky-700">
              Learning path / guided prep / career launch
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
              Start Your Journey Towards a Successful Career
            </h2>
          </motion.div>

          <motion.div
            className="mt-11 grid gap-7 lg:grid-cols-3 lg:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            {careerJourney.map((item, index) => {
              const clipPath =
                index === 0
                  ? 'polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%, 18px 50%)'
                  : index === careerJourney.length - 1
                    ? 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 28px 50%)'
                    : 'polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%, 28px 50%)';

              return (
                <motion.div
                  key={`cta-${item.title}`}
                  className="group"
                  variants={fadeScale}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    className="relative flex h-24 items-center justify-center overflow-hidden border border-sky-200 bg-sky-100/75 shadow-sm shadow-sky-200/70 transition-all duration-300 group-hover:border-sky-300 group-hover:bg-white/85 group-hover:shadow-xl group-hover:shadow-sky-200/80"
                    style={{ clipPath }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/45 via-transparent to-white/35 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm ring-1 ring-sky-200 transition-transform duration-300 group-hover:scale-110">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="px-5 pt-6 text-left sm:px-6 lg:px-7">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Step 0{index + 1}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{item.title}</h3>
                    <p className="mt-3 max-w-sm text-base leading-7 text-slate-700">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="mt-11 flex flex-col gap-3 sm:flex-row"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            transition={{ duration: 0.55, ease: easeOutExpo }}
          >
            <Button asChild className="h-12 rounded-lg bg-sky-600 px-7 font-black text-white shadow-lg shadow-sky-200 hover:bg-sky-700">
              <a href="#placement-portal">
                Open Placement Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-lg border-sky-600 bg-white/70 px-7 font-black text-sky-700 shadow-sm hover:bg-sky-600 hover:text-white"
            >
              <Link to="/placement/company/register">Company Hiring Support</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

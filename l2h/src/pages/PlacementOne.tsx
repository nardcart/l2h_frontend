import { Link } from 'react-router-dom';
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  Factory,
  FileText,
  Goal,
  GraduationCap,
  MonitorCog,
  Network,
  ShoppingBag,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import placementHeroImage from '../../images/tBMKO8yMBzmpsx_WZ1g7W.png';

const placementSteps = [
  {
    number: '01',
    title: 'Registration & Profile Creation',
    description:
      'Students register and submit personal details, academic records, and skill profiles on our placement portal.',
  },
  {
    number: '02',
    title: 'Training & Skill Enhancement',
    description:
      'Eligible students attend pre-placement training sessions, mock interviews, and skill-development workshops.',
  },
  {
    number: '03',
    title: 'Company Selection & Application',
    description:
      'Students browse available job opportunities, choose preferred companies, and apply through the portal.',
  },
  {
    number: '04',
    title: 'Interviews & Final Placement',
    description:
      'Shortlisted candidates attend interviews, and successful students receive offer letters from recruiters.',
  },
];

const partnerIcons = [MonitorCog, BarChart3, Network, ShoppingBag, Factory];

const supportServices = [
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
    icon: UsersRound,
  },
  {
    title: 'Job Prep Sessions',
    description:
      'Regular mock interviews, aptitude tests, and group discussions to develop confidence and skills needed to succeed in real placement drives.',
    icon: ClipboardList,
  },
];

const careerJourney = [
  {
    title: 'Set Your Goals',
    description: 'Define your career aspirations and target companies',
    icon: Goal,
  },
  {
    title: 'Build Skills',
    description: 'Enhance your capabilities through our training programs',
    icon: TrendingUp,
  },
  {
    title: 'Launch Career',
    description: 'Join leading organizations and start your professional journey',
    icon: BriefcaseBusiness,
  },
];

const placementPolicyUrl = 'https://www.l2h.in/placement-policy-violation';

const PlacementOne = () => {
  return (
    <main className="bg-white text-[#353535]">
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${placementHeroImage})` }}
        />
        <div className="absolute inset-0 bg-white/45" />

        <div className="relative mx-auto flex min-h-[390px] max-w-[980px] flex-col justify-center px-6 pb-16 pt-28 sm:px-8 lg:px-0">
          <h1 className="font-serif text-[32px] font-bold leading-tight tracking-normal text-black sm:text-[42px]">
            Your Journey from Learning to Earning Starts Here
          </h1>
          <p className="mt-6 max-w-[745px] text-[14px] font-semibold leading-6 text-[#505a62] sm:text-base">
            44,200+ careers transformed through our comprehensive placement program. We connect talented students with
            leading companies, providing the training, mentorship, and support needed to launch successful careers.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/placement_landing"
              className="inline-flex min-h-10 items-center rounded-[4px] bg-[#0b8fd3] px-4 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#087fbd]"
            >
              View Open Positions
            </Link>
            <a
              href={placementPolicyUrl}
              className="inline-flex min-h-10 items-center rounded-[4px] border border-[#0b8fd3] bg-white px-4 text-[14px] font-bold text-[#0b8fd3] transition hover:bg-sky-50"
            >
              Placement Policy for Candidates
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[980px] px-6 pb-28 pt-20 sm:px-8 lg:px-0">
        <h2 className="font-serif text-[32px] font-bold leading-tight text-black sm:text-[40px]">
          How Our Placement Process Works
        </h2>
        <p className="mt-7 max-w-[720px] text-[15px] font-semibold leading-6 text-[#535b62]">
          Our systematic approach guides students through every step from registration to final placement, ensuring
          maximum success.
        </p>

        <div className="mt-5 grid gap-x-4 gap-y-6 md:grid-cols-2">
          {placementSteps.map((step) => (
            <article key={step.number}>
              <p className="text-[13px] font-semibold text-[#7d8790]">{step.number}</p>
              <div className="mt-1 h-[2px] bg-[#0794dd]" />
              <h3 className="mt-2 font-serif text-[18px] font-bold leading-tight text-[#333]">{step.title}</h3>
              <p className="mt-3 text-[15px] font-semibold leading-6 text-[#505860]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[980px] px-6 pb-32 sm:px-8 lg:px-0">
        <h2 className="font-serif text-[32px] font-bold leading-tight text-black sm:text-[40px]">
          Our Trusted Placement Partners
        </h2>
        <p className="mt-7 text-[15px] font-semibold leading-6 text-[#535b62]">
          We collaborate with leading companies across various industries to provide diverse career opportunities for our
          students.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-7 text-[#0b8fd3]">
          {partnerIcons.map((Icon, index) => (
            <Icon key={index} className="h-8 w-8 stroke-[2.2] text-[#0b8fd3]" fill="rgba(11,143,211,0.18)" />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#fbfdff] to-[#dff5ff]">
        <div className="mx-auto max-w-[980px] px-6 py-20 sm:px-8 lg:px-0">
          <h2 className="font-serif text-[32px] font-bold leading-tight text-black sm:text-[40px]">
            Career Support Services
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {supportServices.map((service) => (
              <article
                key={service.title}
                className="rounded-[4px] border border-[#a5def8] bg-[#c9effd] p-4 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#078ccc] text-white">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-[18px] font-bold leading-tight text-[#333]">{service.title}</h3>
                <p className="mt-3 text-[15px] font-semibold leading-6 text-[#48535c]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dff5ff]">
        <div className="mx-auto max-w-[980px] px-6 pb-16 pt-10 sm:px-8 lg:px-0">
          <h2 className="font-serif text-[31px] font-bold leading-tight text-black sm:text-[40px]">
            Start Your Journey Towards a Successful Career
          </h2>

          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {careerJourney.map((step) => (
              <article key={step.title} className="relative pt-16">
                <div className="absolute left-0 top-0 flex h-12 w-full items-center justify-center border border-[#b7e6f7] bg-[#c9effd] text-[#65747c] [clip-path:polygon(0_0,96%_0,100%_50%,96%_100%,0_100%,4%_50%)]">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-[18px] font-bold leading-tight text-[#333]">{step.title}</h3>
                <p className="mt-3 text-[15px] font-semibold leading-6 text-[#4d5961]">{step.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/placement_landing"
              className="inline-flex min-h-10 items-center rounded-[4px] bg-[#0b8fd3] px-4 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#087fbd]"
            >
              Get Started Now
            </Link>
            <a
              href={placementPolicyUrl}
              className="inline-flex min-h-10 items-center rounded-[4px] border border-[#0b8fd3] bg-white px-4 text-[14px] font-bold text-[#0b8fd3] transition hover:bg-sky-50"
            >
              Placement Policy for Candidates
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PlacementOne;

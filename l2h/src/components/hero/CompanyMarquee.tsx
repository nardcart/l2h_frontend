// Single Responsibility: Company logos marquee
// Open/Closed: Easy to add/remove companies without modifying the component logic

import React from 'react';

interface Company {
  id: string;
  name: string;
  logoUrl: string;
  altText: string;
}

interface CompanyMarqueeProps {
  title?: string;
  companies?: Company[];
  speed?: number;
  fadeOut?: boolean;
}

const CompanyMarquee: React.FC<CompanyMarqueeProps> = ({
  title = "Trusted by professionals at",
  companies = defaultCompanies,
  speed = 20,
  fadeOut = false
}) => {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarqueeHeader title={title} />
        <MarqueeContainer companies={companies} speed={speed} fadeOut={fadeOut} />
      </div>
    </section>
  );
};

// Single Responsibility: Marquee header
const MarqueeHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center mb-8">
    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
      {title}
    </p>
  </div>
);

// Single Responsibility: Marquee animation container
const MarqueeContainer: React.FC<{ companies: Company[]; speed: number; fadeOut: boolean }> = ({ companies, speed, fadeOut }) => (
  <div className={`relative overflow-hidden ${fadeOut ? 'fade-out-marquee' : ''}`}>
    <div 
      className="flex animate-marquee whitespace-nowrap"
      style={{ animationDuration: `${speed}s` }}
    >
      <CompanyLogos companies={companies} />
      <CompanyLogos companies={companies} /> {/* Duplicate for seamless loop */}
    </div>
  </div>
);

// Single Responsibility: Company logos rendering
const CompanyLogos: React.FC<{ companies: Company[] }> = ({ companies }) => (
  <div className="flex items-center justify-around min-w-full">
    {companies.map((company) => (
      <CompanyLogo key={company.id} company={company} />
    ))}
  </div>
);

// Single Responsibility: Individual company logo
const CompanyLogo: React.FC<{ company: Company }> = ({ company }) => (
  <img
    src={company.logoUrl}
    alt={company.altText}
    className="h-12 opacity-60 hover:opacity-100 transition-opacity duration-300"
    loading="lazy"
  />
);

// Configuration - Dependency Inversion: depends on abstraction
const defaultCompanies: Company[] = [
  { id: '1', name: 'Microsoft', logoUrl: '/api/placeholder/120/60', altText: 'Microsoft' },
  { id: '2', name: 'IIM Kozhikode', logoUrl: '/api/placeholder/120/60', altText: 'Indian Institute of Management Kozhikode' },
  { id: '3', name: 'Government', logoUrl: '/api/placeholder/120/60', altText: 'Government Partner' },
  { id: '4', name: 'EduTech', logoUrl: '/api/placeholder/120/60', altText: 'EduTech Partner' },
  { id: '5', name: 'Caltech', logoUrl: '/api/placeholder/120/60', altText: 'Caltech CTME' },
  { id: '6', name: 'AWS', logoUrl: '/api/placeholder/120/60', altText: 'AWS' }
];

export default CompanyMarquee;

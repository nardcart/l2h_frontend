// Single Responsibility: Hero text content and CTA
// Open/Closed: Easy to modify content without touching other components

import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';

interface HeroContentProps {
  badge?: string;
  title: string[];
  subtitle: string;
  ctaText: string;
  onCtaClick?: () => void;
}

const HeroContent: React.FC<HeroContentProps> = ({
  badge = "FROM LOW TO TOP 1%",
  title,
  subtitle,
  ctaText,
  onCtaClick
}) => {
  return (
    <div className="relative z-10 text-center max-w-4xl">
      <HeroBadge text={badge} />
      <HeroTitle lines={title} />
      <HeroSubtitle text={subtitle} />
      <HeroCTA text={ctaText} onClick={onCtaClick} />
    </div>
  );
};

// Atomic components - Single Responsibility
const HeroBadge: React.FC<{ text: string }> = ({ text }) => (
  <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-400/20 rounded-full text-blue-700 text-sm font-medium mb-8 animate-fade-in">
    <Star className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
    {text}
  </div>
);

const HeroTitle: React.FC<{ lines: string[] }> = ({ lines }) => (
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900 animate-fade-in-up">
    {lines.map((line, index) => (
      <span
        key={index}
        className={index === 1 ? "block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text" : "block text-slate-900"}
      >
        {line}
      </span>
    ))}
  </h1>
);

const HeroSubtitle: React.FC<{ text: string }> = ({ text }) => (
  <p 
    className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" 
    style={{ animationDelay: '0.2s' }}
  >
    {text}
  </p>
);

const HeroCTA: React.FC<{ text: string; onClick?: () => void }> = ({ text, onClick }) => (
  <Button
    size="lg"
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg animate-fade-in-up"
    style={{ animationDelay: '0.4s' }}
    onClick={onClick}
  >
    {text} <ArrowRight className="ml-2 w-5 h-5" />
  </Button>
);

export default HeroContent;

// Main Hero Section Component - Composition Root
// Follows Dependency Inversion: All dependencies are injected
// Open/Closed: Easy to extend without modifying existing code

import React from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import RingSystem from './RingSystem';
import CompanyMarquee from './CompanyMarquee';
import { 
  createRingConfiguration, 
  radiusCalculators, 
  defaultHeroContent 
} from './heroConfig';
import { RingConfiguration } from './types';

interface HeroSectionProps {
  // Dependency Injection - all dependencies can be overridden
  ringConfiguration?: RingConfiguration;
  radiusCalculator?: (ringIndex: number, totalRings: number) => number;
  heroContent?: {
    badge: string;
    title: string[];
    subtitle: string;
    ctaText: string;
  };
  onCtaClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  ringConfiguration = createRingConfiguration(),
  radiusCalculator = radiusCalculators.linear,
  heroContent = defaultHeroContent,
  onCtaClick
}) => {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HeroBackground />
        <HeroContainer>
          <HeroContent
            badge={heroContent.badge}
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            ctaText={heroContent.ctaText}
            onCtaClick={onCtaClick}
          />
          <RingSystem
            configuration={ringConfiguration}
            calculateRadius={radiusCalculator}
          />
        </HeroContainer>
      </section>
      <CompanyMarquee fadeOut={true} />
    </>
  );
};

// Single Responsibility: Hero container layout
const HeroContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-center min-h-[80vh]">
      {children}
    </div>
  </div>
);

export default HeroSection;

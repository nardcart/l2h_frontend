// Single Responsibility: Hero background and gradient effects
// Open/Closed: Easy to modify visual effects without touching other components

import React from 'react';

interface GradientCircle {
  id: string;
  className: string;
  style: React.CSSProperties;
}

interface HeroBackgroundProps {
  gradientCircles?: GradientCircle[];
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ gradientCircles = defaultGradientCircles }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-blue-50 to-white">
      <GradientCircles circles={gradientCircles} />
      <FadeOverlay />
    </div>
  );
};

// Single Responsibility: Manages gradient circles
const GradientCircles: React.FC<{ circles: GradientCircle[] }> = ({ circles }) => (
  <div className="absolute top-0 left-0 w-full h-full">
    {circles.map((circle) => (
      <div
        key={circle.id}
        className={circle.className}
        style={circle.style}
      />
    ))}
  </div>
);

// Single Responsibility: Fade overlay for smooth transitions
const FadeOverlay: React.FC = () => (
  <>
    {/* Enhanced fade-out effect like in the image */}
    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
  </>
);

// Configuration - easily modifiable
const defaultGradientCircles: GradientCircle[] = [
  {
    id: 'circle-1',
    className: 'absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl',
    style: {}
  },
  {
    id: 'circle-2',
    className: 'absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl',
    style: {}
  },
  {
    id: 'circle-3',
    className: 'absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl',
    style: {}
  }
];

export default HeroBackground;

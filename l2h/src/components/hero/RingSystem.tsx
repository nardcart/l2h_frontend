// Single Responsibility: Manages the ring system layout
// Dependency Inversion: Depends on abstractions, not concretions

import React from 'react';
import ComponentRenderer from './ComponentRenderer';
import { RingSystemProps } from './types';

const RingSystem: React.FC<RingSystemProps> = ({ configuration, calculateRadius }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[1400px] h-[1400px] md:w-[1600px] md:h-[1600px] lg:w-[1800px] lg:h-[1800px]">
        {configuration.rings.map((ring, ringIndex) => (
          <RingRenderer
            key={ring.id}
            ring={ring}
            radius={calculateRadius(ringIndex, configuration.rings.length)}
          />
        ))}
        <AmbientEffects />
      </div>
    </div>
  );
};

// Single Responsibility: Renders a single ring
const RingRenderer: React.FC<{ ring: any; radius: number }> = ({ ring, radius }) => {
  return (
    <div className="absolute inset-0">
      <RingBorder radius={radius} />
      {ring.components.map((component: any) => {
        const position = calculateComponentPosition(component, radius);
        return (
          <ComponentRenderer
            key={component.id}
            component={component}
            position={position}
          />
        );
      })}
    </div>
  );
};

// Single Responsibility: Renders ring border
const RingBorder: React.FC<{ radius: number }> = ({ radius }) => (
  <div
    className="absolute rounded-full border border-slate-300/40"
    style={{
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }}
  />
);

// Single Responsibility: Ambient visual effects
const AmbientEffects: React.FC = () => (
  <>
    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
    <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
  </>
);

// Pure function - no side effects, easily testable
const calculateComponentPosition = (component: any, radius: number) => {
  const baseX = Math.cos((component.angle * Math.PI) / 180) * radius;
  const baseY = Math.sin((component.angle * Math.PI) / 180) * radius;
  
  return {
    x: baseX + (component.position?.offsetX || 0),
    y: baseY + (component.position?.offsetY || 0)
  };
};

export default RingSystem;

// Single Responsibility: Renders individual ring components
// Open/Closed: Easily extensible for new component types

import React from 'react';
import { Star } from 'lucide-react';
import { ComponentRendererProps, RingComponent } from './types';

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, position }) => {
  const baseStyle = {
    left: `calc(50% + ${position.x}px)`,
    top: `calc(50% + ${position.y}px)`,
    transform: 'translate(-50%, -50%)',
    animationDelay: component.delay,
    animationDuration: '4s'
  };

  const renderComponent = (comp: RingComponent) => {
    switch (comp.type) {
      case 'project':
        return <ProjectCard component={comp} />;
      case 'user':
        return <UserCard component={comp} />;
      case 'feature':
        return <FeatureCard component={comp} />;
      case 'testimonial':
        return <TestimonialCard component={comp} />;
      case 'tech':
        return <TechCircle component={comp} />;
      default:
        return null;
    }
  };

  return (
    <div
      key={component.id}
      className="absolute animate-float"
      style={baseStyle}
    >
      {renderComponent(component)}
    </div>
  );
};

// Specialized component renderers - following Single Responsibility
const ProjectCard: React.FC<{ component: Extract<RingComponent, { type: 'project' }> }> = ({ component }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 max-w-xs cursor-pointer hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
        <component.icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <div className="font-semibold text-slate-800 text-sm">{component.content}</div>
        <div className="text-xs text-slate-600">{component.subtitle}</div>
        <div className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1 font-medium">
          {component.xp}
        </div>
      </div>
    </div>
  </div>
);

const UserCard: React.FC<{ component: Extract<RingComponent, { type: 'user' }> }> = ({ component }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-lg border border-slate-200/50 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300">
    <div className="text-2xl">{component.avatar}</div>
    <div className="text-sm font-medium text-slate-700">{component.name}</div>
  </div>
);

const FeatureCard: React.FC<{ component: Extract<RingComponent, { type: 'feature' }> }> = ({ component }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200/50 max-w-xs cursor-pointer hover:scale-105 transition-all duration-300">
    <div className="text-sm font-semibold text-slate-800">{component.content}</div>
    <div className="text-xs text-slate-600">{component.subtitle}</div>
  </div>
);

const TestimonialCard: React.FC<{ component: Extract<RingComponent, { type: 'testimonial' }> }> = ({ component }) => (
  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200/50 max-w-xs cursor-pointer hover:scale-105 transition-all duration-300">
    <div className="flex mb-2">
      {Array.from({ length: component.rating }, (_, i) => (
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <div className="text-xs text-slate-600 italic">"{component.content}"</div>
  </div>
);

const TechCircle: React.FC<{ component: Extract<RingComponent, { type: 'tech' }> }> = ({ component }) => (
  <div className="relative group cursor-pointer">
    <div className={`w-16 h-16 md:w-20 md:h-20 ${component.color} rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110`}>
      <component.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
    </div>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-slate-600 whitespace-nowrap shadow-sm border border-slate-200/50">
        {component.label}
      </div>
    </div>
  </div>
);

export default ComponentRenderer;

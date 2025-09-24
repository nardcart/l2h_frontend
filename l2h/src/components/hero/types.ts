// Types and interfaces for the hero section components
// Following Interface Segregation Principle

import { LucideIcon } from 'lucide-react';

export interface Position {
  offsetX: number;
  offsetY: number;
}

export interface BaseComponent {
  id: string;
  angle: number;
  position?: Position;
  delay: string;
}

export interface ProjectComponent extends BaseComponent {
  type: 'project';
  content: string;
  subtitle: string;
  xp: string;
  icon: LucideIcon;
}

export interface UserComponent extends BaseComponent {
  type: 'user';
  name: string;
  avatar: string;
}

export interface FeatureComponent extends BaseComponent {
  type: 'feature';
  content: string;
  subtitle: string;
}

export interface TestimonialComponent extends BaseComponent {
  type: 'testimonial';
  content: string;
  rating: number;
}

export interface TechComponent extends BaseComponent {
  type: 'tech';
  label: string;
  icon: LucideIcon;
  color: string;
}

export type RingComponent = ProjectComponent | UserComponent | FeatureComponent | TestimonialComponent | TechComponent;

export interface Ring {
  id: string;
  radius: number;
  components: RingComponent[];
}

export interface RingConfiguration {
  rings: Ring[];
}

export interface RingSystemProps {
  configuration: RingConfiguration;
  calculateRadius: (ringIndex: number, totalRings: number) => number;
}

export interface ComponentRendererProps {
  component: RingComponent;
  position: { x: number; y: number };
}

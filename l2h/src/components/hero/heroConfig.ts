// Configuration file - Dependency Inversion Principle
// All dependencies are injected, making the system highly configurable and testable

import { 
  CheckCircle, 
  Code, 
  Database, 
  Smartphone, 
  Monitor, 
  Cpu, 
  Palette, 
  Brain, 
  Zap 
} from 'lucide-react';
import { RingConfiguration } from './types';

// Strategy Pattern: Different radius calculation strategies
export const radiusCalculators = {
  // Linear scaling - each ring gets smaller by a fixed amount
  linear: (ringIndex: number, totalRings: number) => {
    const baseRadius = 600;
    const radiusStep = 150;
    return baseRadius - (ringIndex * radiusStep);
  },
  
  // Exponential scaling - rings get progressively smaller
  exponential: (ringIndex: number, totalRings: number) => {
    const baseRadius = 600;
    return baseRadius * Math.pow(0.75, ringIndex);
  },
  
  // Golden ratio scaling - aesthetically pleasing proportions
  goldenRatio: (ringIndex: number, totalRings: number) => {
    const baseRadius = 600;
    const phi = 1.618033988749;
    return baseRadius / Math.pow(phi, ringIndex);
  }
};

// Factory Pattern: Create different ring configurations
export const createRingConfiguration = (): RingConfiguration => ({
  rings: [
    {
      id: "outer-ring",
      radius: 600,
      components: [
        {
          id: "project-completion",
          type: "project",
          content: "Complete a project",
          subtitle: "Get AI feedback for your code",
          xp: "20 XP",
          icon: CheckCircle,
          angle: 0,
          position: { offsetX: 0, offsetY: 0 },
          delay: "1s"
        },
        {
          id: "practice-user",
          type: "user",
          name: "Practice",
          avatar: "👨‍💻",
          angle: 90,
          position: { offsetX: 20, offsetY: -10 },
          delay: "1.5s"
        },
        {
          id: "apply-learning",
          type: "feature",
          content: "Apply as you learn",
          subtitle: "without leaving your browser",
          angle: 180,
          position: { offsetX: -15, offsetY: 5 },
          delay: "2s"
        },
        {
          id: "user-testimonial",
          type: "testimonial",
          content: "Great platform for learning to code.",
          rating: 5,
          angle: 270,
          position: { offsetX: 10, offsetY: -20 },
          delay: "2.5s"
        }
      ]
    },
    {
      id: "inner-ring",
      radius: 450,
      components: [
        {
          id: "html-css-tech",
          type: "tech",
          label: "HTML/CSS",
          icon: Code,
          color: "bg-orange-500",
          angle: 45,
          position: { offsetX: -5, offsetY: 10 },
          delay: "0.5s"
        },
        {
          id: "javascript-tech",
          type: "tech",
          label: "JavaScript",
          icon: Monitor,
          color: "bg-yellow-500",
          angle: 135,
          position: { offsetX: 15, offsetY: -5 },
          delay: "1s"
        },
        {
          id: "react-tech",
          type: "tech",
          label: "React",
          icon: Smartphone,
          color: "bg-cyan-500",
          angle: 225,
          position: { offsetX: -11, offsetY: 15 },
          delay: "1.5s"
        },
        {
          id: "nodejs-tech",
          type: "tech",
          label: "Node.js",
          icon: Cpu,
          color: "bg-green-500",
          angle: 315,
          position: { offsetX: 5, offsetY: -12 },
          delay: "2s"
        }
      ]
    }
  ]
});

// Builder Pattern: Create hero content configuration
export class HeroContentBuilder {
  private config = {
    badge: "FROM LOW TO TOP 1%",
    title: ["INDIA'S MOST", "AFFORDABLE LIVE", "SKILL TRAINING PLATFORM"],
    subtitle: "Transform your career with expert-led live training sessions, interactive workshops, and personalized mentorship programs.",
    ctaText: "LEARN ANYTHING FOR JUST RS 99/-"
  };

  setBadge(badge: string) {
    this.config.badge = badge;
    return this;
  }

  setTitle(title: string[]) {
    this.config.title = title;
    return this;
  }

  setSubtitle(subtitle: string) {
    this.config.subtitle = subtitle;
    return this;
  }

  setCTA(ctaText: string) {
    this.config.ctaText = ctaText;
    return this;
  }

  build() {
    return { ...this.config };
  }
}

// Default configurations
export const defaultHeroContent = new HeroContentBuilder().build();

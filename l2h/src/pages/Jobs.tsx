import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { 
  Briefcase,
  Users,
  Target,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

const Jobs = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              India's Only Skilling and Training Marketplace
            </h1>
          </div>
        </div>
      </section>

      {/* What Drives Us Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What Drives Us</h2>
          
          <div className="bg-yellow-100 p-8 rounded-lg">
            <p className="text-lg leading-relaxed text-gray-800">
              We believe in empowering individuals through affordable upskilling courses. Our mission is to provide accessible education that enables personal and professional growth, regardless of financial constraints. At low 2 high we understand the importance of continuous learning in an ever-evolving world. That's why we offer a wide range of short-term and long-term upskilling courses designed to enhance your skills and open doors to new opportunities. We firmly believe that education should not be a luxury, but a fundamental right for everyone. That's why we have made it our goal to offer these courses at incredibly low costs, ensuring that financial barriers do not hinder your pursuit of knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* The Power of Community Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">The Power of Community</h2>
          
          <div className="bg-yellow-100 p-8 rounded-lg">
            <p className="text-lg leading-relaxed text-gray-800">
              We are proud to be the catalyst for positive change in the lives of countless individuals. Our commitment to providing affordable upskilling courses has empowered our students to achieve their goals, secure better job opportunities, and embrace lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Biggest Live Skill Training Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Biggest Live Skill Training Programs at one Place
          </h2>
          
          <div className="bg-yellow-100 p-8 rounded-lg">
            <p className="text-lg leading-relaxed text-gray-800">
              When you join L2H, you become part of a community dedicated to personal and professional growth. We provide ongoing support to our students, even after completing a course. We offer career guidance, job placement assistance, and access to a network of industry professionals, ensuring that you have the resources and support to succeed in your chosen field.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Briefcase className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Career Guidance</h3>
                    <p className="text-muted-foreground">
                      Expert mentors to guide you through your career journey and help you make informed decisions about your professional path.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Target className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Job Placement Assistance</h3>
                    <p className="text-muted-foreground">
                      Direct connections with hiring companies and personalized support to help you land your dream job after course completion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Users className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Industry Network</h3>
                    <p className="text-muted-foreground">
                      Access to a vibrant community of industry professionals, alumni, and peers to expand your network and opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-12 h-12 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Continuous Support</h3>
                    <p className="text-muted-foreground">
                      Ongoing assistance even after course completion to ensure your long-term success and career growth.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Interested in Joining L2H */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Interested in Joining L2H?
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
            Take the first step towards transforming your career. Join thousands of students who have already started their journey with L2H.
          </p>
          <Button 
            asChild
            size="lg" 
            variant="secondary" 
            className="text-lg px-12 py-6 hover-scale"
          >
            <a 
              href="https://forms.gle/XY6juCo4JXLeBma96" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Apply Now
              <ExternalLink className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
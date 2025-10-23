import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Briefcase,
  Users,
  Target,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Khushi Subtamanian',
    role: 'Marketing Expert',
    image: '/images/kool1.png'
  },
  {
    name: 'Devansh Ganatra',
    role: 'Brand & Communication',
    image: '/images/subhum.png'
  },
  {
    name: 'Sumit Sahu',
    role: 'Business Development',
    image: '/images/kool.png'
  },
  {
    name: 'Meet Bhanushali',
    role: 'AI Specialist',
    image: '/images/meet.png'
  }
];

const Jobs = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <img 
                src="/images/logo.png" 
                alt="L2H - Low to High Upskilling Courses" 
                className="h-24 w-auto object-contain"
              />
            </motion.div>
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
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-yellow-100 p-8 rounded-lg">
              <p className="text-lg leading-relaxed text-gray-800">
                We believe in empowering individuals through affordable upskilling courses. Our mission is to provide accessible education that enables personal and professional growth, regardless of financial constraints. At low 2 high we understand the importance of continuous learning in an ever-evolving world. That's why we offer a wide range of short-term and long-term upskilling courses designed to enhance your skills and open doors to new opportunities. We firmly believe that education should not be a luxury, but a fundamental right for everyone. That's why we have made it our goal to offer these courses at incredibly low costs, ensuring that financial barriers do not hinder your pursuit of knowledge.
              </p>
            </div>
            
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img 
                src="/images/12.jpg" 
                alt="Professional training and development" 
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Power of Community Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">The Power of Community</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1"
            >
              <img 
                src="/images/13.jpg" 
                alt="Success stories and community testimonials" 
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
            
            <div className="bg-yellow-100 p-8 rounded-lg order-1 lg:order-2">
              <p className="text-lg leading-relaxed text-gray-800">
                We are proud to be the catalyst for positive change in the lives of countless individuals. Our commitment to providing affordable upskilling courses has empowered our students to achieve their goals, secure better job opportunities, and embrace lifelong learning.
              </p>
            </div>
          </div>

          {/* Community Links */}
          <div className="mt-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Join Our Communities</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Mental Health Community */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-pink-300 overflow-hidden bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/images/com_cummunity.png" 
                      alt="Mental Health Community Logo" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Mental Health Community</h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Connect with over 5,000+ mental health professionals across India. Access exclusive resources and case studies.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a 
                      href="https://shreemcircle-a3xymj1.gamma.site/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Join Community
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Entrepreneur Community */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-green-300 overflow-hidden bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/images/whatsapp.png" 
                      alt="WhatsApp Logo" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Entrepreneur Community</h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Network with entrepreneurs, share innovative ideas, and grow your business together on WhatsApp.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a 
                      href="https://chat.whatsapp.com/DotnurYTnICHzwQpRonkab?mode=wwc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Join on WhatsApp
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* L2H Community */}
              <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <img 
                      src="/images/whatsapp.png" 
                      alt="WhatsApp Logo" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">L2H Community</h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Join our main WhatsApp community for course updates, live discussions, and peer support from learners.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a 
                      href="https://chat.whatsapp.com/GgJ2JNsPxQXAGgOaWyfQyp?mode=wwc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      Join on WhatsApp
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="w-full bg-[#f9f9fb] py-20">
        <div className="max-w-7xl mx-auto px-5">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#24242D] text-center mb-16 tracking-tight"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Our Team
          </motion.h2>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[20px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
              >
                {/* Member Image */}
                <div className="overflow-hidden rounded-t-[20px]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-[350px] object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                </div>

                {/* Member Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#24242D] mb-1.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-[#444] opacity-80" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
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
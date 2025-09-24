import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  BookOpen, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from course design to student support."
    },
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe in empowering individuals to reach their full potential and achieve their dreams."
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a supportive learning community where students and instructors thrive together."
    },
    {
      icon: BookOpen,
      title: "Innovation",
      description: "We continuously innovate our teaching methods and curriculum to stay ahead of industry trends."
    }
  ];

  const milestones = [
    { year: "2015", title: "Founded", description: "L2H was established with a vision to transform professional education" },
    { year: "2017", title: "10,000 Students", description: "Reached our first major milestone of training 10,000 professionals" },
    { year: "2019", title: "International Expansion", description: "Expanded our reach to serve students across 25 countries" },
    { year: "2021", title: "Industry Partnerships", description: "Formed strategic partnerships with leading companies" },
    { year: "2023", title: "50,000+ Graduates", description: "Celebrated training over 50,000 extraordinary professionals" }
  ];

  const team = [
    {
      name: "Dr. Rajesh Mehta",
      role: "Founder & CEO",
      description: "20+ years in education and professional development",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Priya Agarwal",
      role: "Head of Curriculum",
      description: "Expert in designing industry-relevant courses",
      image: "https://images.unsplash.com/photo-1494790108755-2616b5b8b37a?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Amit Sharma",
      role: "Director of Technology",
      description: "Leading our digital transformation initiatives",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-white py-8 relative overflow-hidden">
        <div className="relative h-[500px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center h-full w-full">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  About L2H
                </h1>
                
                {/* Feature List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">50,000+</span> Professionals trained
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">25+</span> Countries worldwide
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">8+ years</span> Of educational excellence
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                    Learn More
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200">
                    Contact Us
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format" 
                    alt="About L2H - Professional learning environment" 
                    className="w-[110%] h-[520px] object-cover image-edge-fade -ml-[5%] -mt-[10px]"
                  />
                  {/* Optimized gradient overlays for seamless blending with white background */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="shadow-card hover-lift">
              <CardHeader className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-primary" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To initiate, enable and empower individuals to grow up to be extraordinary 
                  professionals by providing world-class education, industry-relevant training, 
                  and continuous support throughout their career journey.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover-lift">
              <CardHeader className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 text-primary" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be India's premier institution for professional development, 
                  recognized globally for creating extraordinary professionals who 
                  drive innovation and success in their respective industries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and shape our commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-card hover-lift">
                <CardHeader>
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our mission to transform professional education
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-12`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="shadow-card hover-lift">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        <Badge className="gradient-primary text-primary-foreground">{milestone.year}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 gradient-primary rounded-full border-4 border-background"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The visionary leaders driving L2H's mission to create extraordinary professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center shadow-card hover-lift">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover hover-scale"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of the community that's shaping the future of professional excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
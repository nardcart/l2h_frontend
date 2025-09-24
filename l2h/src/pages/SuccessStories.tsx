import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { 
  Star,
  Quote,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  ArrowRight
} from 'lucide-react';

const SuccessStories = () => {
  const stats = [
    { icon: Users, label: "Lives Transformed", value: "50,000+" },
    { icon: TrendingUp, label: "Career Advancement", value: "95%" },
    { icon: Award, label: "Salary Increase", value: "150%" },
    { icon: Briefcase, label: "Job Placements", value: "12,000+" },
  ];

  const featuredStory = {
    name: "Priya Sharma",
    role: "Senior Software Engineer at Google",
    previousRole: "Junior Developer",
    image: "https://images.unsplash.com/photo-1494790108755-2616b5b8b37a?w=600&h=600&fit=crop&crop=face",
    story: "When I started my journey with L2H, I was a junior developer struggling to advance my career. The comprehensive courses and mentorship program not only enhanced my technical skills but also built my confidence as a professional. Today, I'm proud to be working at Google, leading innovative projects that impact millions of users worldwide.",
    course: "Full-Stack Development Mastery",
    duration: "6 months",
    salaryIncrease: "300%",
    timeToPromotion: "8 months"
  };

  const successStories = [
    {
      name: "Rajesh Kumar",
      role: "Product Manager at Microsoft",
      previousRole: "Business Analyst",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      story: "L2H's leadership program completely transformed my approach to team management and strategic thinking.",
      course: "Leadership Excellence Program",
      salaryIncrease: "180%",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Data Science Lead at Amazon",
      previousRole: "Data Analyst",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      story: "The hands-on approach and real-world projects prepared me for the challenges of leading a data science team.",
      course: "Advanced Data Science",
      salaryIncrease: "250%",
      rating: 5
    },
    {
      name: "Vikram Joshi",
      role: "Financial Director at HDFC Bank",
      previousRole: "Senior Analyst",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      story: "The financial planning and analysis course gave me the skills I needed to move into executive leadership.",
      course: "Financial Leadership Program",
      salaryIncrease: "220%",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      role: "Digital Marketing Head at Flipkart",
      previousRole: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      story: "From executing campaigns to strategizing for one of India's largest e-commerce platforms - L2H made it possible.",
      course: "Digital Marketing Mastery",
      salaryIncrease: "200%",
      rating: 5
    },
    {
      name: "Arjun Singh",
      role: "Cybersecurity Architect at TCS",
      previousRole: "Network Administrator",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      story: "The comprehensive cybersecurity program equipped me with cutting-edge skills in threat detection and prevention.",
      course: "Cybersecurity Professional",
      salaryIncrease: "280%",
      rating: 5
    },
    {
      name: "Kavya Nair",
      role: "UX Design Lead at Zomato",
      previousRole: "Graphic Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      story: "L2H's UX design program helped me transition from traditional design to creating user-centered digital experiences.",
      course: "UX/UI Design Mastery",
      salaryIncrease: "190%",
      rating: 5
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
                  Success Stories
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
                      <span className="font-semibold">50,000+</span> Lives transformed
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">150%</span> Average salary increase
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">95%</span> Career advancement rate
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                    Read Stories
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200">
                    Start Your Journey
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&auto=format" 
                    alt="Success Stories - Professional achievements and career growth" 
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Success Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Success Story</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how L2H transformed Priya's career from a junior developer to a senior engineer at Google
            </p>
          </div>

          <Card className="overflow-hidden shadow-elegant">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Quote className="w-12 h-12 text-primary mb-6" />
                <blockquote className="text-xl lg:text-2xl font-medium mb-8 leading-relaxed">
                  "{featuredStory.story}"
                </blockquote>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Course Completed:</span>
                    <Badge className="gradient-primary text-primary-foreground">{featuredStory.course}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{featuredStory.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Salary Increase:</span>
                    <span className="font-semibold text-success">{featuredStory.salaryIncrease}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Time to Promotion:</span>
                    <span className="font-semibold">{featuredStory.timeToPromotion}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={featuredStory.image} 
                      alt={featuredStory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{featuredStory.name}</div>
                    <div className="text-primary font-medium">{featuredStory.role}</div>
                    <div className="text-sm text-muted-foreground">Previously: {featuredStory.previousRole}</div>
                  </div>
                </div>
              </div>

              <div className="aspect-square lg:aspect-auto overflow-hidden">
                <img 
                  src={featuredStory.image} 
                  alt={featuredStory.name}
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">More Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be inspired by these amazing professionals who chose to invest in their growth with L2H
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover-lift shadow-card">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-full h-full object-cover hover-scale"
                    />
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <CardTitle className="text-xl">{story.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">{story.role}</CardDescription>
                  <div className="text-sm text-muted-foreground">Previously: {story.previousRole}</div>
                </CardHeader>

                <CardContent>
                  <blockquote className="text-muted-foreground mb-6 italic">
                    "{story.story}"
                  </blockquote>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Course:</span>
                      <Badge variant="secondary" className="text-xs">{story.course}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Salary Increase:</span>
                      <span className="font-semibold text-success">{story.salaryIncrease}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of professionals who have transformed their careers with L2H. 
            Your success story could be next!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;
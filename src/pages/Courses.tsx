import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Briefcase,
  Code,
  TrendingUp,
  Award
} from 'lucide-react';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: BookOpen },
    { name: 'Professional Development', icon: Briefcase },
    { name: 'Technical Skills', icon: Code },
    { name: 'Leadership', icon: TrendingUp },
    { name: 'Certification', icon: Award }
  ];

  const courses = [
    {
      id: 1,
      title: "Professional Communication Excellence",
      description: "Master the art of effective communication in professional settings",
      category: "Professional Development",
      level: "Intermediate",
      duration: "8 weeks",
      students: 1250,
      rating: 4.8,
      price: "₹12,999",
      instructor: "Dr. Priya Sharma",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
      features: ["Interactive sessions", "Real-world projects", "Certificate of completion"]
    },
    {
      id: 2,
      title: "Leadership in Digital Age",
      description: "Develop leadership skills for the modern digital workplace",
      category: "Leadership",
      level: "Advanced",
      duration: "12 weeks",
      students: 890,
      rating: 4.9,
      price: "₹18,999",
      instructor: "Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
      features: ["1-on-1 mentoring", "Live case studies", "Industry projects"]
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Learn the foundations of data science and analytics",
      category: "Technical Skills",
      level: "Beginner",
      duration: "16 weeks",
      students: 2100,
      rating: 4.7,
      price: "₹24,999",
      instructor: "Anita Patel",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      features: ["Hands-on coding", "Industry datasets", "Portfolio projects"]
    },
    {
      id: 4,
      title: "Project Management Professional",
      description: "Comprehensive project management certification program",
      category: "Certification",
      level: "Intermediate",
      duration: "10 weeks",
      students: 1450,
      rating: 4.8,
      price: "₹16,999",
      instructor: "Amit Singh",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      features: ["PMP certification prep", "Mock exams", "Expert guidance"]
    },
    {
      id: 5,
      title: "Digital Marketing Mastery",
      description: "Complete guide to digital marketing strategies and tools",
      category: "Professional Development",
      level: "Intermediate",
      duration: "6 weeks",
      students: 1680,
      rating: 4.6,
      price: "₹14,999",
      instructor: "Neha Gupta",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      features: ["Campaign creation", "Analytics tools", "Industry insights"]
    },
    {
      id: 6,
      title: "Financial Analysis & Planning",
      description: "Master financial analysis and strategic planning skills",
      category: "Professional Development",
      level: "Advanced",
      duration: "8 weeks",
      students: 920,
      rating: 4.9,
      price: "₹19,999",
      instructor: "Vikram Joshi",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      features: ["Excel mastery", "Financial modeling", "Case studies"]
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Courses</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover world-class courses designed to accelerate your professional growth 
              and transform your career trajectory.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover-lift shadow-card overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover hover-scale"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Course Meta */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Instructor: </span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-1">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-2xl font-bold text-primary">{course.price}</div>
                      <Button variant="gradient" size="sm">
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredCourses.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Contact our team to discuss custom training solutions tailored to your specific needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              Contact Us
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
              Request Custom Training
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
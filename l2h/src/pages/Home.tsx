import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Footer from '@/components/Footer';
import { HeroSection, radiusCalculators, HeroContentBuilder } from '@/components/hero';
import { 
  BookOpen, 
  Users, 
  Award, 
  Star, 
  TrendingUp,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Home = () => {
  // Carousel API state management
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Courses API state management
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const heroSlides = [
    {
      id: 1,
      title: "Get Certified. Get Ahead.",
      stats: [
        { number: "8,000,000", text: "Careers advanced" },
        { number: "1,500", text: "Live classes every month" },
        { number: "85%", text: "Report career success" }
      ],
      buttons: [
        { text: "Explore Programs", style: "primary" },
        { text: "Try Simplilearn for Business", style: "outline" }
      ],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format"
    },
    {
      id: 2,
      title: "Unlock Unlimited Live Classes for Your Workforce",
      stats: [
        { number: "700+", text: "Live classes monthly" },
        { number: "550+", text: "Learning solutions" },
        { number: "100+", text: "Hands-on projects with labs" }
      ],
      buttons: [
        { text: "Explore Learning Hub+", style: "primary" },
        { text: "Contact Sales", style: "outline" }
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format"
    },
    {
      id: 3,
      title: "Master In-Demand Skills with Expert Training",
      stats: [
        { number: "2,000+", text: "Industry experts" },
        { number: "500+", text: "Certification programs" },
        { number: "92%", text: "Job placement rate" }
      ],
      buttons: [
        { text: "Browse Courses", style: "primary" },
        { text: "Free Demo Class", style: "outline" }
      ],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format"
    }
  ];

  // Carousel API effect
  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState); // Clean up on unmount
    };
  }, [carouselApi]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!carouselApi) return;
    
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  // Dynamic course categories
  const [courseCategories, setCourseCategories] = useState<string[]>([]);

  // Manual categorization function
  const categorizeCourse = (courseName: string): string => {
    const name = courseName.toLowerCase();
    
    if (name.includes('soft skills') || name.includes('communication') || name.includes('leadership')) {
      return 'Soft Skills & Leadership';
    }
    if (name.includes('spanish') || name.includes('language') || name.includes('english')) {
      return 'Languages';
    }
    if (name.includes('instagram') || name.includes('social media') || name.includes('facebook') || name.includes('twitter')) {
      return 'Social Media Marketing';
    }
    if (name.includes('content') || name.includes('design') || name.includes('creative')) {
      return 'Content & Design';
    }
    if (name.includes('linkedin') || name.includes('job') || name.includes('career') || name.includes('networking')) {
      return 'Career Development';
    }
    if (name.includes('wellness') || name.includes('nutrition') || name.includes('health') || name.includes('fitness')) {
      return 'Health & Wellness';
    }
    if (name.includes('astrology') || name.includes('vedic') || name.includes('spiritual')) {
      return 'Astrology & Spirituality';
    }
    if (name.includes('bootcamp') || name.includes('coding') || name.includes('programming') || name.includes('development')) {
      return 'Technology & Programming';
    }
    if (name.includes('marketing') || name.includes('business') || name.includes('sales')) {
      return 'Marketing & Business';
    }
    
    return 'Other';
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://l2happapi.akamai.net.in/get/folder_courses?start=0&parent_id=-1', {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'auth-key': 'appxapi',
          'client-service': 'Appx',
          'device-type': '',
          'dnt': '1',
          'origin': 'https://l2h.akamai.net.in',
          'priority': 'u=1, i',
          'referer': 'https://l2h.akamai.net.in/',
          'sec-ch-ua': '"Not?A_Brand";v="99", "Chromium";v="130"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'sec-gpc': '1',
          'source': 'website',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const coursesData = data.data || [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        
        // Extract categories dynamically
        const categories = new Set<string>();
        coursesData.forEach((course: any) => {
          // Check if API provides categories field
          if (course.categories && course.categories.trim()) {
            categories.add(course.categories.trim());
          } else {
            // Use manual categorization
            const category = categorizeCourse(course.course_name);
            categories.add(category);
          }
        });
        
        // Convert Set to sorted array with "Other" at the end
        const categoriesArray = Array.from(categories);
        const otherIndex = categoriesArray.indexOf('Other');
        let sortedCategories;
        
        if (otherIndex !== -1) {
          // Remove "Other" from the array, sort the rest, then add "Other" at the end
          const withoutOther = categoriesArray.filter(cat => cat !== 'Other');
          sortedCategories = [...withoutOther.sort(), 'Other'];
        } else {
          // No "Other" category, just sort normally
          sortedCategories = categoriesArray.sort();
        }
        
        setCourseCategories(sortedCategories);
        
      } else {
        console.error('Failed to fetch courses');
        // Fallback to empty array
        setCourses([]);
        setFilteredCourses([]);
        setCourseCategories([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
      setFilteredCourses([]);
      setCourseCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by category
  const filterCourses = (category: string) => {
    if (category === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course: any) => {
        // Check if API provides categories field
        if (course.categories && course.categories.trim()) {
          return course.categories.trim() === category;
        } else {
          // Use manual categorization
          const courseCategory = categorizeCourse(course.course_name);
          return courseCategory === category;
        }
      });
      setFilteredCourses(filtered);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses when category changes
  useEffect(() => {
    filterCourses(selectedCategory);
  }, [selectedCategory, courses]);

  // Configuration using Builder Pattern - easily customizable
  const customHeroContent = new HeroContentBuilder()
    .setBadge("FROM LOW TO TOP 1%")
    .setTitle(["INDIA'S MOST", "AFFORDABLE LIVE", "SKILL TRAINING PLATFORM"])
    .setSubtitle("Transform your career with expert-led live training sessions, interactive workshops, and personalized mentorship programs.")
    .setCTA("LEARN ANYTHING FOR JUST RS 99/-")
    .build();

  // Event handler - Dependency Inversion
  const handleCtaClick = () => {
    // Could be injected as a dependency for better testability
    console.log('CTA clicked - redirect to courses');
    // navigate('/courses');
  };




  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at TCS",
      content: "L2H transformed my career. The courses are practical and industry-focused.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Project Manager at Infosys",
      content: "The leadership training helped me advance to a senior management role.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Data Scientist at Wipro",
      content: "Excellent instructors and comprehensive curriculum. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* COMMENTED OUT - Original Hero Section */}
      {/* <HeroSection
        heroContent={customHeroContent}
        radiusCalculator={radiusCalculators.linear}
        onCtaClick={handleCtaClick}
      /> */}

      {/* Hero Carousel Section */}
      <section className="bg-white py-8 relative overflow-hidden">
        <div className="relative h-[500px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel
            setApi={setCarouselApi}
            opts={{ loop: true }}
            className="w-full h-full z-10"
          >
            <CarouselContent>
              {heroSlides.map((slide, index) => (
                <CarouselItem key={slide.id}>
                  <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="flex items-center justify-center h-full p-6">
                      <div className="grid lg:grid-cols-2 gap-12 items-center h-full w-full">
                        {/* Left Content */}
                        <div className="space-y-8">
                          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {slide.title}
                          </h1>
                          
                          {/* Feature List */}
                          <div className="space-y-4">
                            {slide.stats.map((stat, statIndex) => (
                              <div key={statIndex} className="flex items-center space-x-3">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-lg text-gray-700">
                                  <span className="font-semibold">{stat.number}</span> {stat.text}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            {slide.buttons.map((button, buttonIndex) => (
                              <Button
                                key={buttonIndex}
                                className={
                                  button.style === 'primary'
                                    ? "bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                                    : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
                                }
                                variant={button.style === 'primary' ? 'default' : 'outline'}
                              >
                                {button.text}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                          <div className="relative overflow-hidden">
                            <img 
                              src={slide.image} 
                              alt={`Professional learning - ${slide.title}`} 
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
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Arrows */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-6 pointer-events-none">
            <Button
              onClick={() => scrollToIndex(currentIndex - 1)}
              className="pointer-events-auto rounded-full w-14 h-14 p-0 bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-7 h-7 text-gray-700" strokeWidth={1} />
            </Button>
            <Button
              onClick={() => scrollToIndex(currentIndex + 1)}
              className="pointer-events-auto rounded-full w-14 h-14 p-0 bg-white/80 hover:bg-white"
            >
              <ChevronRight className="w-7 h-7 text-gray-700" strokeWidth={1} />
            </Button>
          </div>

          {/* Navigation Dots - Moved to upper area */}
          <div className="absolute  left-0 right-0 flex justify-center space-x-2 z-20">
            {Array.from({ length: totalItems }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentIndex === index ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* <p className="text-lg text-gray-600">
              Partnering with the world's leading universities and companies
            </p> */}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-70">
            {/* <img src="/api/placeholder/150/60" alt="Microsoft" className="h-10" />
            <img src="/api/placeholder/150/60" alt="Purdue University" className="h-10" />
            <img src="/api/placeholder/150/60" alt="E&ICT Academy IIT Guwahati" className="h-10" />
            <img src="/api/placeholder/150/60" alt="Scaled Agile Gold SPCT Partner" className="h-10" />
            <img src="/api/placeholder/150/60" alt="UC San Diego Extended Studies" className="h-10" />
            <img src="/api/placeholder/150/60" alt="REA Premium Alliance" className="h-10" /> */}
          </div>
        </div>
      </section>

      {/* Explore Our Top Programs */}
      <section className="py-16 bg-[#e0f2fe] relative">
        {/* Gradient overlay for lighter effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/30"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left mb-11">
            <h2 className="text-5xl text-gray-900 mb-4 oswald-600">Explore Our Top Programs</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-4 sticky top-8" style={{ boxShadow: '0 10px 40px rgba(255, 255, 255, 0.3), 0 4px 15px rgba(255, 255, 255, 0.2)' }}>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)] transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#3b82f6] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                    } shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                  >
                    {/* Gradient Circle */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full transition-all duration-500 ${
                      selectedCategory === 'all' 
                        ? 'bg-gradient-to-br from-white/30 to-white/10 scale-100' 
                        : 'bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 scale-0 group-hover:scale-100'
                    }`}></div>
                    
                    <span className="font-medium text-sm relative z-10">Most Popular</span>
                  </button>
                  
                  {courseCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)] transform scale-[1.02]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#3b82f6] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                      } shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}
                    >
                      {/* Gradient Circle */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full transition-all duration-500 ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-br from-white/30 to-white/10 scale-100' 
                          : 'bg-gradient-to-br from-[#3b82f6]/20 to-[#3b82f6]/5 scale-0 group-hover:scale-100'
                      }`}></div>
                      
                      <span className="font-medium text-sm relative z-10">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.slice(0, 9).map((course) => (
                    <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm border border-white/50 shadow-xl" style={{ boxShadow: '0 8px 32px rgba(255, 255, 255, 0.25), 0 4px 12px rgba(255, 255, 255, 0.15)' }}>
                      <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                        <img 
                          src={course.course_thumbnail || '/api/placeholder/300/200'} 
                          alt={course.course_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.mrp && course.price && course.mrp !== course.price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                            {Math.round(((course.mrp - course.price) / course.mrp) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {course.validity} {course.validity_type?.toLowerCase() || 'months'}
                          </span>
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {course.course_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <span>Duration: {course.validity} {course.validity_type?.toLowerCase() || 'months'}</span>
                          </div>
                          {course.start_date && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span>Cohort Starts: {new Date(course.start_date).toLocaleDateString('en-US', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: '2-digit' 
                              })}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-3">
                            <div className="flex items-center space-x-2">
                              {course.mrp && course.price && course.mrp !== course.price && (
                                <>
                                  <span className="text-sm text-gray-400 line-through">₹{course.mrp}</span>
                                  <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                                </>
                              )}
                              {(!course.price || course.price === '0' || course.price === 0) && (
                                <span className="text-lg font-bold text-green-600">Free</span>
                              )}
                              {(course.price && course.price !== '0' && course.price !== 0 && (!course.mrp || course.mrp === course.price)) && (
                                <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => window.open(`https://l2h.akamai.net.in/new-courses/${course.id}-${course.course_slug}`, '_blank')}
                          >
                            View Program
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>







      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
        {/* Gradient overlay for lighter effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from professionals who transformed their careers with L2H
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-xl border border-white/50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] relative text-white">
        {/* Gradient overlay for lighter effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-white/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get the latest updates on new courses, industry insights, and success stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/30 text-white placeholder:text-white/70"
            />
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have already started their journey to excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              Start Learning Today <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Explore the CodeDamn Way Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
        {/* Gradient overlay for lighter effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/30"></div>
        {/* Background geometric elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-2xl opacity-60 float-slow" style={{'--rotate': '12deg'} as React.CSSProperties}></div>
          <div className="absolute top-20 right-10 w-32 h-32 bg-purple-50 rounded-xl opacity-40 float-reverse" style={{'--rotate': '-12deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-32 left-20 w-36 h-36 bg-indigo-50 rounded-2xl opacity-50 float-delayed" style={{'--rotate': '45deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-violet-50 rounded-lg opacity-30 float-slow" style={{'--rotate': '-6deg'} as React.CSSProperties}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-100 rounded-xl opacity-20 float-reverse" style={{'--rotate': '12deg'} as React.CSSProperties}></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-indigo-100 rounded-2xl opacity-15 float-delayed" style={{'--rotate': '45deg'} as React.CSSProperties}></div>
          <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-purple-100 rounded-lg opacity-25 float-fast" style={{'--rotate': '-30deg'} as React.CSSProperties}></div>
          <div className="absolute bottom-1/3 right-1/4 w-22 h-22 bg-violet-100 rounded-xl opacity-20 float-very-slow" style={{'--rotate': '60deg'} as React.CSSProperties}></div>
        </div>

        {/* Content with fade blend effect */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <div className="relative bg-white/95 backdrop-blur-sm border border-white/50 rounded-3xl p-12 shadow-xl">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-8">
              EXPLORE THE CODEDAMN WAY
            </p>
            
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full text-lg font-bold mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">LEARN</h3>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Instantly and Interactively
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Learn from carefully curated learning paths with up-to-date interactive courses, and 
                receive 24x7 AI assistance as you develop your coding skills.
              </p>
            </div>
          </div>
        </div>

        {/* Top fade blend effect */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-5"></div>
        {/* Bottom fade blend effect */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-5"></div>
      </section>

     

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
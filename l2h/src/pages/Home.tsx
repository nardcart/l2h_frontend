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
  TrendingUp,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // Carousel API state management
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // Courses API state management
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Email state for CTA section
  const [email, setEmail] = useState('');
  
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
        { text: "Explore Programs", style: "primary", url: "/courses", isExternal: false },
        { text: "Try L2H by Login", style: "outline", url: "https://l2h.akamai.net.in/my-zone-full", isExternal: true }
      ],
      image: "/images/1.jpg"
    },
    {
      id: 2,
      title: "Master In-Demand Skills with Expert Training",
      stats: [
        { number: "2,000+", text: "Industry experts" },
        { number: "500+", text: "Certification programs" },
        { number: "92%", text: "Job placement rate" }
      ],
      buttons: [
        { text: "Browse Courses", style: "primary", url: "/courses", isExternal: false },
        { text: "Free Demo Class", style: "outline", url: "https://l2h.akamai.net.in/test-series", isExternal: true }
      ],
      image: "/images/3.jpg"
    },
    {
      id: 3,
      title: "Transform Your Skills, Transform Your Life",
      stats: [
        { number: "50,000+", text: "Students enrolled" },
        { number: "₹99", text: "Starting price for live courses" },
        { number: "100%", text: "Practical learning approach" }
      ],
      buttons: [
        { text: "Get Started Now", style: "primary", url: "https://l2h.akamai.net.in/my-zone-full", isExternal: true },
        { text: "View Success Stories", style: "outline", url: "/success-stories", isExternal: false }
      ],
      image: "/images/4.jpg"
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
                                onClick={() => {
                                  if (button.isExternal) {
                                    window.open(button.url, '_blank');
                                  } else {
                                    navigate(button.url);
                                  }
                                }}
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

      {/* Success Story Video Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hear from Simplilearn Alumni at Top Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our learners transformed their careers and landed jobs at leading organizations
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Dfhb1Mtt_ok"
                title="Success Story - Simplilearn Alumni"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Optional: Add description or call to action below video */}
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of professionals who have successfully transitioned to their dream careers
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Start Your Journey Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from our community
            </p>
          </div>

          {/* Masonry Bento Grid for Images */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {/* Image 1 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/5.png"
                    alt="Success Story Testimonial"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 2 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/6.png"
                    alt="Success Story Review"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 3 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/7.png"
                    alt="Success Story Feedback"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 4 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/8.png"
                    alt="Success Story Certificate"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 5 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/9.png"
                    alt="Success Story Testimonial"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Image 6 */}
            <div className="break-inside-avoid mb-6">
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200">
                <div className="p-6">
                  <img
                    src="/images/10.png"
                    alt="Success Story Achievement"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">WHY US</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              The most affordable and flexible way to learn for real-world success. Start your journey today with live courses from just <span className="font-bold text-blue-600">₹99</span> — because your growth should never be limited by cost.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Learning by Doing Approach",
                description: "Learn by doing is like solving real-life problems and achieving success in everyday life.",
              },
              {
                title: "Learn from the best",
                description: "L2H coined the concept of easy/affordable programs and has helped many students to learn directly from industry experts.",
              },
              {
                title: "Become an instructor",
                description: "Instructors from all over India teach thousands of students on L2H Platform. We provide the tools and skills to teach what you love.",
              },
              {
                title: "Active, hands-on learning",
                description: "Every session or workshop is meticulously designed to assist you in applying what you have learned and pave the way for a prosperous career.",
              },
              {
                title: "Easily Affordable",
                description: "L2H caters primarily to individuals who face financial constraints preventing them from investing in costly courses, which subsequently hinders their ability to live a happy life.",
              },
              {
                title: "Learn anything and Everything",
                description: "What makes L2H remarkable is the extensive range of programs it offers. It goes beyond traditional educational options and encompasses a diverse array of skill-based programs that are not typically taught in schools or colleges.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card className="border-dashed border-2 border-blue-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full bg-white/80 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <HomeIcon className="text-blue-600 w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg px-6 py-6 h-auto"
            />
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6 whitespace-nowrap"
              onClick={() => window.open('https://l2h.akamai.net.in/my-zone-full', '_blank')}
            >
              Start Learning Today <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { 
  Filter, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Briefcase,
  Code,
  TrendingUp,
  Award,
  ArrowRight,
  Calendar,
  User,
  Mail
} from 'lucide-react';

const Courses = () => {
  const { category: urlCategory } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [email, setEmail] = useState('');
  
  // Courses API state management
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseCategories, setCourseCategories] = useState<string[]>([]);

  // URL category mapping
  const mapUrlCategoryToFilter = (urlCategory: string): string => {
    const categoryMap: { [key: string]: string } = {
      'professional': 'Marketing & Business',
      'technical': 'Technology & Programming',
      'leadership': 'Soft Skills & Leadership',
      'certification': 'Career Development'
    };
    return categoryMap[urlCategory] || 'all';
  };

  // Helper function to clean HTML from description
  const cleanDescription = (description: string): string => {
    if (!description) return "Enhance your skills with this comprehensive course designed to help you excel in your professional journey.";
    const cleaned = description.replace(/<[^>]*>/g, '').trim();
    return cleaned || "Enhance your skills with this comprehensive course designed to help you excel in your professional journey.";
  };

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
  const filterCourses = () => {
    let filtered = courses;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((course: any) => {
        // Check if API provides categories field
        if (course.categories && course.categories.trim()) {
          return course.categories.trim() === selectedCategory;
        } else {
          // Use manual categorization
          const courseCategory = categorizeCourse(course.course_name);
          return courseCategory === selectedCategory;
        }
      });
    }
    
    setFilteredCourses(filtered);
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses when category changes
  useEffect(() => {
    filterCourses();
  }, [selectedCategory, courses]);

  // Handle URL category changes
  useEffect(() => {
    if (urlCategory) {
      const mappedCategory = mapUrlCategoryToFilter(urlCategory);
      setSelectedCategory(mappedCategory);
    }
  }, [urlCategory]);

  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Store email in localStorage if needed for the destination page
      localStorage.setItem('userEmail', email.trim());
      // Redirect to the my-zone-full page
      window.open('https://l2h.akamai.net.in/my-zone-full', '_blank');
    }
  };


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
                  Our Courses
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
                      <span className="font-semibold">100+</span> Expert-designed courses
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">15,000+</span> Students enrolled
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Lifetime</span> Access & certification
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                    onClick={() => window.open('https://l2h.akamai.net.in/my-zone-full', '_blank')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
                    onClick={() => window.open('https://l2h.akamai.net.in/zero-price-courses', '_blank')}
                  >
                    Free Demo
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&auto=format" 
                    alt="Our Courses - Professional skill development" 
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

      {/* Category Filter */}
      <section className="py-4 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                All Courses
              </Button>
              {courseCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredCourses.map((course) => (
                 <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 shadow-none max-w-sm">
                   <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-semibold">
                     <div className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                       <BookOpen className="h-5 w-5" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight line-clamp-1">
                         {course.course_name}
                       </h3>
                       <div className="flex items-center gap-2 mt-1">
                         <div className="flex items-center text-xs text-gray-500">
                           <Calendar className="w-3 h-3 mr-1" />
                           {course.validity} {course.validity_type?.toLowerCase() || 'months'}
                         </div>
                         {course.mrp && course.price && course.mrp !== course.price && (
                           <Badge className="bg-red-500 text-white text-xs px-2 py-0">
                             {Math.round(((course.mrp - course.price) / course.mrp) * 100)}% OFF
                           </Badge>
                         )}
                       </div>
                     </div>
                   </CardHeader>
                   
                   <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
                     <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                       {cleanDescription(course.course_description)}
                     </p>
                     <div className="mt-5 w-full aspect-video bg-muted rounded-xl overflow-hidden">
                       <img 
                         src={course.course_thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&auto=format'} 
                         alt={course.course_name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&auto=format';
                         }}
                       />
                     </div>
                     
                     <div className="mt-4 space-y-2">
                       {course.start_date && (
                         <div className="flex items-center text-xs text-gray-600">
                           <User className="w-3 h-3 mr-1" />
                           <span>Starts: {new Date(course.start_date).toLocaleDateString('en-US', { 
                             day: 'numeric', 
                             month: 'short', 
                             year: '2-digit' 
                           })}</span>
                         </div>
                       )}
                       
                       <div className="flex items-center justify-between">
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
                     </div>
                   </CardContent>
                   
                   <CardFooter className="mt-6">
                     <Button 
                       className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                       onClick={() => window.open(`https://l2h.akamai.net.in/new-courses/${course.id}-${course.course_slug}`, '_blank')}
                     >
                       Enroll Now <ArrowRight className="h-4 w-4" />
                     </Button>
                   </CardFooter>
                 </Card>
               ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredCourses.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Email Subscription Section */}
      <section className="py-12 gradient-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated with Our Courses</h2>
          <p className="text-xl mb-8 text-blue-100">
            Enter your email to access your personalized learning dashboard and course recommendations
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-3 text-gray-900"
                required
              />
            </div>
            <Button 
              type="submit"
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 px-8 py-3 font-semibold whitespace-nowrap"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
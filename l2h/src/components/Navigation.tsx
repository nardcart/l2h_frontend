import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X, BookOpen, Users, Award, Briefcase, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Smart scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Throttle scroll events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        
        // Show navbar if at top of page
        if (currentScrollY < 10) {
          setIsVisible(true);
        } 
        // Show navbar when scrolling up (with minimum threshold to avoid jittery behavior)
        else if (currentScrollY < lastScrollY - 5) {
          setIsVisible(true);
        } 
        // Hide navbar when scrolling down (only if scrolled past initial section)
        else if (currentScrollY > lastScrollY + 5 && currentScrollY > 100) {
          setIsVisible(false);
          setIsCoursesOpen(false); // Close dropdown when hiding
          setIsMenuOpen(false); // Close mobile menu when hiding
        }
        
        setLastScrollY(currentScrollY);
      }, 10); // 10ms throttle
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const courseCategories = [
    { name: 'Professional Development', icon: Briefcase, path: '/courses/professional' },
    { name: 'Technical Skills', icon: BookOpen, path: '/courses/technical' },
    { name: 'Leadership Training', icon: Users, path: '/courses/leadership' },
    { name: 'Certification Programs', icon: Award, path: '/courses/certification' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-smooth ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </Link>


            {/* Courses Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className={`flex items-center space-x-1 font-medium transition-smooth ${
                  location.pathname.startsWith('/courses') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Courses</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCoursesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-card p-2 animate-scale-in">
                  {courseCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-smooth"
                      onClick={() => setIsCoursesOpen(false)}
                    >
                      <category.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/courses"
                    className="block p-3 mt-2 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth font-medium"
                    onClick={() => setIsCoursesOpen(false)}
                  >
                    View All Courses
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/blogs"
              className={`font-medium transition-smooth ${
                isActive('/blogs') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Blogs
            </Link>

            <Link
              to="/ebooks"
              className={`font-medium transition-smooth ${
                isActive('/ebooks') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Ebooks
            </Link>

            <Link
              to="/success-stories"
              className={`font-medium transition-smooth ${
                isActive('/success-stories') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Success Stories
            </Link>

            <Link
              to="/about-us"
              className={`font-medium transition-smooth ${
                isActive('/about-us') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About Us
            </Link>

            <Link
              to="/partnerships"
              className={`font-medium transition-smooth ${
                isActive('/partnerships') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Partnerships
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => window.open('https://l2h.akamai.net.in/new-courses', '_blank')}
            >
              Try Free Courses
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/courses" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Courses
              </Link>
              <Link to="/blogs" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Blogs
              </Link>
              <Link to="/ebooks" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Ebooks
              </Link>
              <Link to="/success-stories" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Success Stories
              </Link>
              <Link to="/about-us" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/partnerships" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Partnerships
              </Link>
              <Button 
                variant="hero" 
                size="lg" 
                className="mt-4"
                onClick={() => {
                  window.open('https://l2h.akamai.net.in/new-courses', '_blank');
                  setIsMenuOpen(false);
                }}
              >
                Try Free Courses
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
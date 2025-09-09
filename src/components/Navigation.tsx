import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X, BookOpen, Users, Award, Briefcase, Heart } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const courseCategories = [
    { name: 'Professional Development', icon: Briefcase, path: '/courses/professional' },
    { name: 'Technical Skills', icon: BookOpen, path: '/courses/technical' },
    { name: 'Leadership Training', icon: Users, path: '/courses/leadership' },
    { name: 'Certification Programs', icon: Award, path: '/courses/certification' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-scale">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              L2H
            </span>
          </Link>

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

            <Link
              to="/about"
              className={`font-medium transition-smooth ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About Us
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
              to="/jobs"
              className={`font-medium transition-smooth ${
                isActive('/jobs') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Jobs
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
            <Button variant="hero" size="lg">
              Get Started
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
              <Link to="/about" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                About Us
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
              <Link to="/jobs" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Jobs
              </Link>
              <Link to="/partnerships" className="font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                Partnerships
              </Link>
              <Button variant="hero" size="lg" className="mt-4">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
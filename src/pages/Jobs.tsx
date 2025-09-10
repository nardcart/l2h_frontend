import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Footer from '@/components/Footer';
import { MapPin, Clock, Briefcase, Users, Search, Building2, ArrowRight, Star } from 'lucide-react';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const jobCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'design', label: 'Design' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
    { value: 'remote', label: 'Remote' },
  ];

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹8-15 LPA',
      category: 'technology',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
      posted: '2 days ago',
      applications: 45,
      logo: '🚀'
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      company: 'Growth Labs',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹6-12 LPA',
      category: 'marketing',
      skills: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy'],
      posted: '1 day ago',
      applications: 32,
      logo: '📈'
    },
    {
      id: 3,
      title: 'Product Designer',
      company: 'Design Studio Pro',
      location: 'Remote',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '₹5-10 LPA',
      category: 'design',
      skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
      posted: '3 days ago',
      applications: 28,
      logo: '🎨'
    },
    {
      id: 4,
      title: 'Business Analyst',
      company: 'Analytics Hub',
      location: 'Delhi',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹7-13 LPA',
      category: 'operations',
      skills: ['SQL', 'Excel', 'Power BI', 'Data Analysis'],
      posted: '4 days ago',
      applications: 38,
      logo: '📊'
    },
    {
      id: 5,
      title: 'Sales Executive',
      company: 'SalesForce India',
      location: 'Hyderabad',
      type: 'Full-time',
      experience: '1-2 years',
      salary: '₹4-8 LPA',
      category: 'sales',
      skills: ['CRM', 'Lead Generation', 'B2B Sales', 'Communication'],
      posted: '5 days ago',
      applications: 52,
      logo: '💼'
    },
    {
      id: 6,
      title: 'Financial Analyst',
      company: 'FinTech Solutions',
      location: 'Pune',
      type: 'Full-time',
      experience: '2-3 years',
      salary: '₹6-11 LPA',
      category: 'finance',
      skills: ['Financial Modeling', 'Excel', 'PowerPoint', 'Analysis'],
      posted: '1 week ago',
      applications: 25,
      logo: '💰'
    },
  ];

  const hiringPartners = [
    { name: 'Google', logo: '🔍', positions: 120 },
    { name: 'Microsoft', logo: '💻', positions: 95 },
    { name: 'Amazon', logo: '📦', positions: 180 },
    { name: 'Flipkart', logo: '🛒', positions: 85 },
    { name: 'Zomato', logo: '🍕', positions: 65 },
    { name: 'Paytm', logo: '💳', positions: 75 },
    { name: 'Ola', logo: '🚗', positions: 55 },
    { name: 'Swiggy', logo: '🍔', positions: 70 },
  ];

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || job.location.toLowerCase() === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="gradient-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Your Dream Job Awaits
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 max-w-3xl mx-auto">
            Connect with top employers and build your career with L2H's exclusive job portal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="hover-scale">
              <Briefcase className="w-5 h-5 mr-2" />
              Browse Jobs
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Users className="w-5 h-5 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Job Search & Filters */}
      <section className="py-8 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Job Stats */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary">2,500+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Partner Companies</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary">15,000+</div>
              <div className="text-muted-foreground">Students Placed</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Showing {filteredJobs.length} jobs</p>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job, index) => (
              <Card key={job.id} className="hover:shadow-card transition-smooth hover-scale group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                        {job.logo}
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium text-foreground">
                          {job.company}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{job.salary}</div>
                      <div className="text-sm text-muted-foreground">{job.experience}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {job.applications} applications
                    </div>
                    <Button className="group-hover:bg-primary/90">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Partners */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Hiring Partners</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Top companies trust L2H graduates for their talent and expertise
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {hiringPartners.map((partner, index) => (
              <Card key={partner.name} className="text-center p-6 hover:shadow-card transition-smooth hover-scale group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-3">{partner.logo}</div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-smooth">
                  {partner.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {partner.positions} open positions
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-8 h-8 mr-3" />
            <Star className="w-8 h-8 mr-3" />
            <Star className="w-8 h-8 mr-3" />
            <Star className="w-8 h-8 mr-3" />
            <Star className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join thousands of L2H graduates who've landed their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="hover-scale">
              <Building2 className="w-5 h-5 mr-2" />
              For Employers
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Users className="w-5 h-5 mr-2" />
              Career Guidance
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Code
} from 'lucide-react';

const Blogs = () => {
  const categories = [
    { name: 'All', count: 24 },
    { name: 'Career Growth', count: 8 },
    { name: 'Industry Trends', count: 6 },
    { name: 'Learning Tips', count: 5 },
    { name: 'Success Stories', count: 5 }
  ];

  const featuredPost = {
    title: "The Future of Professional Development in 2024",
    excerpt: "Explore how emerging technologies and changing work dynamics are reshaping professional development strategies.",
    author: "Dr. Priya Sharma",
    date: "Dec 15, 2023",
    readTime: "8 min read",
    category: "Industry Trends",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  };

  const blogPosts = [
    {
      title: "5 Essential Skills Every Professional Needs in 2024",
      excerpt: "Discover the must-have skills that will set you apart in today's competitive job market.",
      author: "Rajesh Kumar",
      date: "Dec 12, 2023",
      readTime: "6 min read",
      category: "Career Growth",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
    },
    {
      title: "How to Build a Learning Habit That Sticks",
      excerpt: "Practical strategies to develop consistent learning habits that accelerate your professional growth.",
      author: "Anita Patel",
      date: "Dec 10, 2023",
      readTime: "5 min read",
      category: "Learning Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop"
    },
    {
      title: "From Intern to Team Lead: A Success Story",
      excerpt: "Follow Sarah's journey from a fresh graduate to a successful team lead at a Fortune 500 company.",
      author: "Success Team",
      date: "Dec 8, 2023",
      readTime: "7 min read",
      category: "Success Stories",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop"
    },
    {
      title: "The Rise of Remote Leadership",
      excerpt: "How leaders are adapting their management styles for the remote and hybrid work environment.",
      author: "Vikram Joshi",
      date: "Dec 5, 2023",
      readTime: "6 min read",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop"
    },
    {
      title: "Effective Communication in Virtual Teams",
      excerpt: "Best practices for maintaining clear communication and strong relationships in virtual teams.",
      author: "Neha Gupta",
      date: "Dec 3, 2023",
      readTime: "5 min read",
      category: "Learning Tips",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop"
    },
    {
      title: "Data-Driven Decision Making in Modern Business",
      excerpt: "Learn how professionals are leveraging data analytics to make informed business decisions.",
      author: "Amit Singh",
      date: "Dec 1, 2023",
      readTime: "8 min read",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Insights, tips, and stories to accelerate your professional journey 
              and stay ahead in your career.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                    {category.count}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Featured Article</h2>
            <p className="text-muted-foreground">Don't miss our latest insights</p>
          </div>

          <Card className="overflow-hidden shadow-card hover-lift">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <div className="p-8 lg:p-12">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button variant="gradient" size="lg">
                  Read Article <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Stay updated with our latest insights and tips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover-lift shadow-card overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
                
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl line-clamp-2 leading-tight">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button variant="ghost" size="sm">
                      Read More <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss an Update</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter and get the latest articles delivered to your inbox
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

      <Footer />
    </div>
  );
};

export default Blogs;
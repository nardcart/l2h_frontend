import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  excerpt: string;
  tags: string[];
  isVideo: boolean;
  videoType?: 'file' | 'embed';
  videoUrl?: string;
  status: string;
  publishedAt: string;
  viewCount: number;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  authorId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
        const result = await response.json();
        
        if (result.status && result.data) {
          setCategories(result.data);
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive'
        });
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          status: 'published',
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          sort: '-publishedAt'
        });

        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        // The API service returns the data directly, not the full response
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BLOGS}?${params.toString()}`);
        const result = await response.json();
        
        if (result.status && result.data) {
          setBlogs(result.data);
          if (result.pagination) {
            setPagination(result.pagination);
          }
        }
      } catch (error: any) {
        console.error('Error fetching blogs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blogs',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, searchTerm, pagination.page]);

  // Calculate read time from content
  const calculateReadTime = (description: string) => {
    const wordsPerMinute = 200;
    const wordCount = description.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Handle category filter
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setPagination(prev => ({ ...prev, page: 1 }));
    if (categorySlug !== 'all') {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Get total blogs count
  const totalBlogsCount = categories.reduce((sum, cat) => sum + cat.postCount, 0);

  // Get featured blog (first blog)
  const featuredPost = blogs[0];
  const blogPosts = blogs.slice(1);

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
                  Our Blog
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
                      <span className="font-semibold">200+</span> Career insights & tips
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Weekly</span> Industry updates
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg text-gray-700">
                      <span className="font-semibold">Expert</span> Success stories
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                    Read Latest
                  </Button>
                  <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative overflow-hidden">
                  <img 
                    src="/images/15.jpg" 
                    alt="Our Blog - Professional insights and career growth" 
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
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => handleCategoryChange('all')}
              >
                All
                <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                  {totalBlogsCount}
                </span>
              </Button>
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  {category.name}
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                    {category.postCount}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {loading ? (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </section>
      ) : featuredPost ? (
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
                    src={featuredPost.coverImage} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover-scale"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <Badge className="mb-4">{featuredPost.categoryId.name}</Badge>
                  <Link to={`/blogs/${featuredPost.slug}`}>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.authorId.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {featuredPost.publishedAt 
                          ? format(new Date(featuredPost.publishedAt), 'MMM dd, yyyy')
                          : format(new Date(featuredPost.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <span>{calculateReadTime(featuredPost.description)}</span>
                  </div>
                  <Link to={`/blogs/${featuredPost.slug}`}>
                    <Button variant="gradient" size="lg">
                      Read Article <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      ) : null}

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Stay updated with our latest insights and tips</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : blogPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post._id} className="hover-lift shadow-card overflow-hidden">
                    <Link to={`/blogs/${post.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover hover-scale"
                        />
                      </div>
                    </Link>
                    
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">{post.categoryId.name}</Badge>
                      <Link to={`/blogs/${post.slug}`}>
                        <CardTitle className="text-xl line-clamp-2 leading-tight hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.authorId.name}</span>
                        </div>
                        <span>{calculateReadTime(post.description)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {post.publishedAt 
                            ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
                            : format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <Link to={`/blogs/${post.slug}`}>
                          <Button variant="ghost" size="sm">
                            Read More <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {pagination.page < pagination.pages && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blogs found. Try adjusting your filters.</p>
            </div>
          )}
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
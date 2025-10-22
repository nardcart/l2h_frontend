import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
    bio?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  relatedBlogs?: Array<{
    _id: string;
    title: string;
    slug: string;
    coverImage: string;
    excerpt: string;
    publishedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  postCount: number;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost['relatedBlogs']>([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
    fetchCategories();
    fetchRecommendedBlogs();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const blog = await apiService.get<BlogPost>(API_ENDPOINTS.BLOG_BY_SLUG(slug!));
      setBlog(blog);
      
      // Fetch related blogs
      if (blog._id) {
        fetchRelatedBlogs(blog._id);
      }
    } catch (err: any) {
      console.error('Error fetching blog:', err);
      setError(err.message || 'Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedBlogs = async (blogId: string) => {
    try {
      const blogs = await apiService.get<BlogPost['relatedBlogs']>(
        `${API_ENDPOINTS.BLOG_RELATED(blogId)}?limit=3`
      );
      setRelatedBlogs(blogs);
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setCategories(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecommendedBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BLOGS}?status=published&limit=3&sort=-publishedAt`);
      const result = await response.json();
      
      if (result.status && result.data) {
        setRecommendedBlogs(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching recommended blogs:', error);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied!',
          description: 'Blog URL copied to clipboard',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/blogs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{blog.metaTitle || blog.title} | L2H</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        {blog.metaKeywords && <meta name="keywords" content={blog.metaKeywords} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.excerpt} />
        <meta property="og:image" content={blog.coverImage} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription || blog.excerpt} />
        <meta name="twitter:image" content={blog.coverImage} />
        
        {/* Article specific */}
        {blog.publishedAt && <meta property="article:published_time" content={blog.publishedAt} />}
        <meta property="article:author" content={blog.authorId.name} />
        <meta property="article:section" content={blog.categoryId.name} />
        {blog.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen pt-16 bg-gray-50">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/blogs')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Button>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Content */}
            <article className="min-w-0">
          {/* Category Badge */}
          <Link to={`/blogs?category=${blog.categoryId.slug}`}>
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
              {blog.categoryId.name}
            </Badge>
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{blog.authorId.name}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.publishedAt || blog.createdAt}>
                {blog.publishedAt 
                  ? format(new Date(blog.publishedAt), 'MMMM dd, yyyy')
                  : format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
              </time>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{calculateReadTime(blog.description)} min read</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Cover Image or Video */}
          {blog.isVideo && blog.videoUrl ? (
            <div className="mb-8 rounded-xl overflow-hidden aspect-video">
              {blog.videoType === 'embed' ? (
                <iframe
                  src={blog.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={blog.videoUrl} controls className="w-full h-full" />
              )}
            </div>
          ) : (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto rounded-xl mb-8 shadow-lg"
            />
          )}

          {/* Content */}
          <div
            className="prose prose-2xl max-w-none mb-12 blog-content-large"
            style={{ fontFamily: "'Manrope', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-12 pt-8 border-t">
              <Tag className="w-4 h-4 text-gray-600" />
              {blog.tags.map((tag) => (
                <Link key={tag} to={`/blogs?tag=${tag}`}>
                  <Badge variant="secondary" className="hover:bg-gray-300">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {blog.authorId.image && (
                  <img
                    src={blog.authorId.image}
                    alt={blog.authorId.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{blog.authorId.name}</h3>
                  {blog.authorId.bio && (
                    <p className="text-gray-600 mb-3">{blog.authorId.bio}</p>
                  )}
                  <div className="flex gap-2">
                    {blog.authorId.facebook && (
                      <a
                        href={blog.authorId.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {blog.authorId.twitter && (
                      <a
                        href={blog.authorId.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {blog.authorId.linkedin && (
                      <a
                        href={blog.authorId.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-700"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-20 self-start">
              {/* Categories */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Categories</h3>
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li key={category._id}>
                        <Link
                          to={`/blogs?category=${category.slug}`}
                          className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <span className="text-base">{category.name}</span>
                          <span className="text-sm text-gray-500">({category.postCount})</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedBlogs && relatedBlogs.length > 0 && (
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((relatedBlog) => (
                        <Link
                          key={relatedBlog._id}
                          to={`/blogs/${relatedBlog.slug}`}
                          className="group block"
                        >
                          <div className="relative mb-2">
                            <img
                              src={relatedBlog.coverImage}
                              alt={relatedBlog.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs">
                              TIPS
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedBlog.title}
                          </h4>
                          <time className="text-xs text-gray-500">
                            {relatedBlog.publishedAt 
                              ? format(new Date(relatedBlog.publishedAt), 'dd MMM yyyy')
                              : 'Draft'}
                          </time>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Posts */}
              {recommendedBlogs && recommendedBlogs.length > 0 && (
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Recommended for You</h3>
                    <div className="space-y-4">
                      {recommendedBlogs.map((recBlog) => (
                        <Link
                          key={recBlog._id}
                          to={`/blogs/${recBlog.slug}`}
                          className="group block"
                        >
                          <div className="relative mb-2">
                            <img
                              src={recBlog.coverImage}
                              alt={recBlog.title}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs">
                              TIPS
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {recBlog.title}
                          </h4>
                          <time className="text-xs text-gray-500">
                            {recBlog.publishedAt 
                              ? format(new Date(recBlog.publishedAt), 'dd MMM yyyy')
                              : 'Draft'}
                          </time>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}


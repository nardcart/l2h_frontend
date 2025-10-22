import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Upload,
  X,
  Plus,
} from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';
import PreviewModal from '@/components/blog-editor/PreviewModal';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api';

export default function BlogCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [isVideo, setIsVideo] = useState(false);
  const [videoType, setVideoType] = useState('embed');
  const [videoUrl, setVideoUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // Quick Add Category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch existing blog if editing
  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [isEditing, id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !isEditing) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  const fetchCategories = async () => {
    try {
      const data = await apiService.get<any[]>(API_ENDPOINTS.CATEGORIES);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const blog = await apiService.get<any>(API_ENDPOINTS.BLOG_BY_ID(id!), true);
      if (blog) {
        setTitle(blog.title);
        setSlug(blog.slug);
        setExcerpt(blog.excerpt || '');
        setContent(blog.description);
        setCategoryId(blog.categoryId?._id || '');
        setTags(blog.tags || []);
        setStatus(blog.status);
        setIsVideo(blog.isVideo || false);
        setVideoType(blog.videoType || 'embed');
        setVideoUrl(blog.videoUrl || '');
        setMetaTitle(blog.metaTitle || '');
        setMetaDescription(blog.metaDescription || '');
        setCoverImagePreview(blog.coverImage);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog post',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleQuickAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingCategory(true);

    try {
      const token = localStorage.getItem('token');
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const data = await apiService.post<any>(
        API_ENDPOINTS.CATEGORIES,
        {
          name: newCategoryName,
          slug,
          status: 'active',
        },
        true
      );

      if (data) {
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
        
        // Refresh categories and select the new one
        await fetchCategories();
        setCategoryId(data._id);
        
        // Reset form
        setNewCategoryName('');
        setShowAddCategory(false);
      } else {
        throw new Error(data.message || 'Failed to create category');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Required fields validation
    if (!title || !slug || !categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Meta fields validation
    if (metaTitle && metaTitle.length > 60) {
      toast({
        title: 'Validation Error',
        description: 'Meta title cannot exceed 60 characters',
        variant: 'destructive',
      });
      return;
    }

    if (metaDescription && metaDescription.length > 160) {
      toast({
        title: 'Validation Error',
        description: 'Meta description cannot exceed 160 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('excerpt', excerpt);
      formData.append('description', content);
      formData.append('categoryId', categoryId);
      formData.append('tags', JSON.stringify(tags));
      formData.append('status', status);
      formData.append('isVideo', isVideo.toString());
      
      if (isVideo) {
        formData.append('videoType', videoType);
        formData.append('videoUrl', videoUrl);
      }
      
      if (metaTitle) formData.append('metaTitle', metaTitle);
      if (metaDescription) formData.append('metaDescription', metaDescription);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      let data;
      if (isEditing) {
        data = await apiService.uploadFileSimple<any>(
          API_ENDPOINTS.BLOG_BY_ID(id!),
          formData,
          true,
          'PUT'
        );
      } else {
        data = await apiService.uploadFileSimple<any>(
          API_ENDPOINTS.BLOGS,
          formData,
          true,
          'POST'
        );
      }

      if (data) {
        toast({
          title: 'Success',
          description: `Blog post ${isEditing ? 'updated' : 'created'} successfully`,
        });
        navigate('/admin/blogs');
      } else {
        throw new Error(data.message || 'Failed to save post');
      }
    } catch (error: any) {
      // Extract detailed error message from API response
      let errorMessage = 'Failed to save blog post';
      
      if (error.data) {
        // Check for validation error details in error.data.error
        if (error.data.error) {
          errorMessage = error.data.error;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/blogs')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update your blog post' : 'Write and publish a new blog post'}
            </p>
            {lastSaved && (
              <p className="text-xs text-muted-foreground mt-1">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            onClick={handleSubmit}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update' : 'Save'} Post
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>The main content of your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="slug"
                    placeholder="url-friendly-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /blogs/{slug || 'your-post-slug'}
                  </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of your post..."
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {excerpt.length}/300 characters
                  </p>
                </div>

                {/* Rich Text Editor */}
                <div className="space-y-2">
                  <Label>
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Write your blog content here..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your post for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="SEO title..."
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    maxLength={60}
                    className={metaTitle.length > 60 ? 'border-destructive' : ''}
                  />
                  <p className={`text-xs ${
                    metaTitle.length > 60 
                      ? 'text-destructive font-medium' 
                      : metaTitle.length > 50 
                        ? 'text-orange-500' 
                        : 'text-muted-foreground'
                  }`}>
                    {metaTitle.length}/60 characters
                    {metaTitle.length > 60 && ' - Exceeds limit!'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="SEO description..."
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    maxLength={160}
                    className={metaDescription.length > 160 ? 'border-destructive' : ''}
                  />
                  <p className={`text-xs ${
                    metaDescription.length > 160 
                      ? 'text-destructive font-medium' 
                      : metaDescription.length > 140 
                        ? 'text-orange-500' 
                        : 'text-muted-foreground'
                  }`}>
                    {metaDescription.length}/160 characters
                    {metaDescription.length > 160 && ' - Exceeds limit!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>Main image for your post</CardDescription>
              </CardHeader>
              <CardContent>
                {coverImagePreview ? (
                  <div className="relative group">
                    <img
                      src={coverImagePreview}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverImagePreview('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="cover-image"
                    />
                    <label htmlFor="cover-image" className="cursor-pointer">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Category <span className="text-destructive">*</span></CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddCategory(true)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Add relevant tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  type="text"
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter to add tags
                </p>
              </CardContent>
            </Card>

            {/* Video Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Video Post</CardTitle>
                <CardDescription>Configure video settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isVideo">This is a video post</Label>
                  <Switch
                    id="isVideo"
                    checked={isVideo}
                    onCheckedChange={setIsVideo}
                  />
                </div>

                {isVideo && (
                  <>
                    <div className="space-y-2">
                      <Label>Video Type</Label>
                      <Select value={videoType} onValueChange={setVideoType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="embed">Embed (YouTube, Vimeo)</SelectItem>
                          <SelectItem value="file">Upload File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">Video URL</Label>
                      <Input
                        id="videoUrl"
                        placeholder="https://youtube.com/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Quick Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your blog posts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category-name"
                placeholder="e.g., Technology"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAddCategory()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleQuickAddCategory}
              disabled={isAddingCategory}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isAddingCategory ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title={title}
        content={content}
        coverImage={coverImagePreview}
        category={categories.find(cat => cat._id === categoryId)?.name}
        tags={tags}
        excerpt={excerpt}
      />
    </div>
  );
}


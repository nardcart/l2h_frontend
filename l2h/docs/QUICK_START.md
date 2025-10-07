# Blog System Quick Start Guide

**For:** React 18.3.1 + TypeScript + Vite  
**Time to Setup:** ~30 minutes

---

## 🚀 Super Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
# Core packages
npm install axios @tanstack/react-query react-router-dom

# UI & Forms
npm install react-hook-form zod @hookform/resolvers

# Rich Text (for admin)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image

# Utilities
npm install lucide-react date-fns html-react-parser

# Optional: State Management
npm install zustand
```

### 2. Create Environment Variables (1 minute)

Create `.env`:
```env
VITE_API_URL=http://localhost:8000
VITE_IMAGE_URL=https://your-s3-bucket.amazonaws.com
```

### 3. Copy Essential Files (5 minutes)

Copy these files from the full documentation (`docs/0001.md`):

**Priority 1 - Required:**
- ✅ `src/types/blog.ts` - TypeScript interfaces
- ✅ `src/lib/api.ts` - API client
- ✅ `src/lib/blogApi.ts` - Blog API methods
- ✅ `src/hooks/useBlogs.ts` - React hooks

**Priority 2 - Components:**
- ✅ `src/components/blog/BlogCard.tsx`
- ✅ `src/pages/BlogDetail.tsx`

### 4. Setup React Query (2 minutes)

Update `src/main.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 5. Add Routes (3 minutes)

Update `src/App.tsx`:
```typescript
import { Routes, Route } from 'react-router-dom';
import Blogs from './pages/Blogs';
import { BlogDetail } from './pages/BlogDetail';

function App() {
  return (
    <Routes>
      <Route path="/blog" element={<Blogs />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/blog/category/:categorySlug" element={<Blogs />} />
      {/* Other routes */}
    </Routes>
  );
}
```

### 6. Update Existing Blogs.tsx (5 minutes)

Modify your existing `src/pages/Blogs.tsx` to use real API data:

```typescript
import { useBlogs, useCategories } from '@/hooks/useBlogs';
import { BlogCard } from '@/components/blog/BlogCard';

export default function Blogs() {
  const { data: blogs, isLoading } = useBlogs();
  const { data: categories } = useCategories();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Use real data instead of mock data
  const featuredPost = blogs?.[0];
  const remainingBlogs = blogs?.slice(1);

  return (
    <div>
      {/* Keep your existing UI structure */}
      {/* Replace mock data with real data from API */}
      
      {/* Featured Post */}
      {featuredPost && <BlogCard blog={featuredPost} featured />}
      
      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingBlogs?.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 Architecture Overview

```
┌─────────────────┐
│   React App     │
│  (Vite + TS)    │
└────────┬────────┘
         │
         │ axios
         ▼
┌─────────────────┐
│   Laravel API   │
│  (Your Backend) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MySQL DB      │
│   4 Tables:     │
│   - blogs       │
│   - categories  │
│   - authors     │
│   - comments    │
└─────────────────┘
```

---

## 🗂️ Database Structure (Quick Reference)

### blogs table
```
id, catgeory_id, author_id, coverimage, 
title, slug, description, tags, 
published_date, status, isVideo, video
```

### blog_categories table
```
id, name, slug, status, position
```

### authors table
```
id, name, email, bio, image, 
facebook, twitter, linkedin
```

### blog_comments table
```
id, blog_id, name, email, mobile, 
comment, status
```

---

## 🔌 API Endpoints (Quick Reference)

### Frontend (Public)
```
GET  /api/blogs                    # List all blogs
GET  /api/blog/{slug}              # Get single blog
GET  /api/blogs/category/{slug}    # Filter by category
GET  /api/blog-categories          # List categories
POST /blog-search                  # Search blogs
POST /blog-comments                # Submit comment
POST /validate-otp-blog            # Verify OTP
```

### Admin (Protected)
```
POST   /api/admin/blogs            # Create blog
PUT    /api/admin/blogs/{id}       # Update blog
DELETE /api/admin/blogs/{id}       # Delete blog
POST   /api/admin/upload-image     # Upload image
```

---

## 💡 Common Use Cases

### 1. Display Blog List
```typescript
import { useBlogs } from '@/hooks/useBlogs';

function BlogList() {
  const { data: blogs, isLoading, error } = useBlogs();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading blogs</div>;
  
  return (
    <div>
      {blogs?.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
```

### 2. Filter by Category
```typescript
import { useBlogs } from '@/hooks/useBlogs';
import { useParams } from 'react-router-dom';

function BlogsByCategory() {
  const { categorySlug } = useParams();
  const { data: blogs } = useBlogs({ category: categorySlug });
  
  return <div>{/* Render filtered blogs */}</div>;
}
```

### 3. Search Blogs
```typescript
import { blogApi } from '@/lib/blogApi';
import { useState } from 'react';

function BlogSearch() {
  const [results, setResults] = useState([]);
  
  const handleSearch = async (keyword: string) => {
    const data = await blogApi.searchBlogs(keyword);
    setResults(data);
  };
  
  return <div>{/* Search UI */}</div>;
}
```

### 4. Display Single Blog
```typescript
import { useBlog } from '@/hooks/useBlogs';
import { useParams } from 'react-router-dom';

function BlogDetail() {
  const { slug } = useParams();
  const { data: blog } = useBlog(slug!);
  
  return (
    <article>
      <h1>{blog?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog?.description }} />
    </article>
  );
}
```

---

## 🎨 Styling Integration

Your existing `BLOG_PAGE_SETUP.md` already has great styling. Just ensure:

1. Keep all Tailwind classes
2. Use the custom CSS from `src/index.css`:
   - `.gradient-primary`
   - `.hover-lift`
   - `.hover-scale`
   - `.shadow-card`

3. Image URLs are handled by `getImageUrl()` helper

---

## 🔒 Admin Panel (Optional - 20 minutes)

For content management, see full documentation in `docs/0001.md` sections:
- Admin Dashboard Structure
- Rich Text Editor Setup
- Blog Create/Edit Forms
- Image Upload Component

---

## 🐛 Troubleshooting

### CORS Issues
Add to Laravel `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Image Not Loading
Check:
1. `VITE_IMAGE_URL` in `.env`
2. S3 bucket permissions
3. Image path format in database

### API 404 Errors
Verify:
1. Laravel routes are published
2. Backend is running on correct port
3. `VITE_API_URL` matches backend URL

---

## 📚 Full Documentation

For complete implementation details, see:
- **[docs/0001.md](./0001.md)** - Complete blog system documentation
- **[BLOG_PAGE_SETUP.md](../BLOG_PAGE_SETUP.md)** - Current UI documentation

---

## ✅ Checklist

Before going live:
- [ ] Install all dependencies
- [ ] Setup environment variables
- [ ] Configure API client
- [ ] Create type definitions
- [ ] Implement core hooks
- [ ] Build blog components
- [ ] Add routing
- [ ] Test blog listing
- [ ] Test blog detail page
- [ ] Test search functionality
- [ ] Test category filtering
- [ ] Configure CORS
- [ ] Build for production
- [ ] Deploy frontend
- [ ] Test on production

---

**Estimated Total Time:** 30-45 minutes for basic setup  
**For Admin Panel:** Add 1-2 hours

**Need Help?** See full documentation in `docs/0001.md`


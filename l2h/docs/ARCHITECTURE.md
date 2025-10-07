# Blog System Architecture

**Document:** System Architecture Overview  
**Version:** 1.0.0  
**Last Updated:** October 4, 2025

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React 18.3.1 + TypeScript)                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
        ┌───────────▼──────────┐  ┌──────────▼──────────┐
        │   PUBLIC FRONTEND    │  │   ADMIN PANEL       │
        │   - Blog Listing     │  │   - Create Posts    │
        │   - Blog Details     │  │   - Edit Posts      │
        │   - Search           │  │   - Manage Authors  │
        │   - Categories       │  │   - Moderate        │
        │   - Comments         │  │     Comments        │
        └──────────┬───────────┘  └──────────┬──────────┘
                   │                         │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │      API LAYER          │
                   │   (axios + React Query) │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   LARAVEL BACKEND       │
                   │   - Controllers         │
                   │   - Models              │
                   │   - Validation          │
                   │   - Authentication      │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   MYSQL DATABASE        │
                   │   - blogs               │
                   │   - blog_categories     │
                   │   - authors             │
                   │   - blog_comments       │
                   └────────────┬────────────┘
                                │
                   ┌────────────▼────────────┐
                   │   FILE STORAGE          │
                   │   - AWS S3 / Local      │
                   │   - Images              │
                   │   - Videos              │
                   └─────────────────────────┘
```

---

## Component Architecture

### Frontend Components

```
src/
│
├── pages/
│   ├── Blogs.tsx ──────────────┐
│   │   • Main blog listing     │
│   │   • Category filters      │
│   │   • Search bar            │
│   │                           │
│   ├── BlogDetail.tsx ─────────┤
│   │   • Full blog content     │
│   │   • Author info           │
│   │   • Related posts         │
│   │   • Comments section      │
│   │                           │
│   └── admin/                  │
│       ├── BlogCreate.tsx ─────┤
│       ├── BlogEdit.tsx        │
│       ├── CategoryList.tsx    │
│       └── CommentModeration   │
│                               │
├── components/                 │
│   ├── blog/                   │
│   │   ├── BlogCard ───────────┤
│   │   │   • Post preview      │
│   │   │   • Image/video       │
│   │   │   • Metadata          │
│   │   │                       │
│   │   ├── BlogGrid ───────────┤
│   │   │   • Responsive grid   │
│   │   │   • Pagination        │
│   │   │                       │
│   │   ├── CommentForm ────────┤
│   │   │   • Form validation   │
│   │   │   • OTP verification  │
│   │   │                       │
│   │   ├── RelatedPosts ───────┤
│   │   │   • Algorithm         │
│   │   │   • Recommendations   │
│   │   │                       │
│   │   └── AuthorInfo ─────────┤
│   │       • Bio               │
│   │       • Social links      │
│   │                           │
│   └── admin/                  │
│       ├── RichTextEditor ─────┤
│       │   • TipTap editor     │
│       │   • Image insertion   │
│       │   • Formatting        │
│       │                       │
│       └── ImageUpload ────────┤
│           • Drag & drop       │
│           • Preview           │
│           • Validation        │
│                               │
├── hooks/                      │
│   ├── useBlogs ───────────────┤
│   │   • Fetch blog list       │
│   │   • Filtering             │
│   │   • Pagination            │
│   │                           │
│   ├── useBlog ────────────────┤
│   │   • Single blog fetch     │
│   │   • By slug/ID            │
│   │                           │
│   └── useCategories ──────────┤
│       • Category list         │
│       • Post counts           │
│                               │
├── lib/                        │
│   ├── api.ts ─────────────────┤
│   │   • Axios config          │
│   │   • Interceptors          │
│   │   • Auth handling         │
│   │                           │
│   └── blogApi.ts ─────────────┤
│       • Blog CRUD             │
│       • Search                │
│       • Comments              │
│                               │
└── types/                      │
    └── blog.ts ────────────────┘
        • TypeScript interfaces
        • Type safety
        • API responses
```

---

## Data Flow

### 1. Blog Listing Flow

```
User visits /blog
       │
       ▼
┌──────────────┐
│ Blogs.tsx    │
└──────┬───────┘
       │ calls
       ▼
┌──────────────┐
│ useBlogs()   │ ────┐
└──────┬───────┘     │
       │ uses        │ React Query
       ▼             │ (caching)
┌──────────────┐     │
│ blogApi      │ ◄───┘
│ .getBlogs()  │
└──────┬───────┘
       │ HTTP GET /api/blogs
       ▼
┌──────────────────┐
│ Laravel API      │
│ MasterController │
└──────┬───────────┘
       │ queries
       ▼
┌──────────────────┐
│ Blog Model       │
│ ::with('authors')│
│ ::where(         │
│   'status', 1)   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ MySQL Database   │
│ SELECT * FROM    │
│ blogs JOIN       │
│ authors...       │
└──────┬───────────┘
       │ returns JSON
       ▼
┌──────────────────┐
│ Response         │
│ {                │
│   status: true,  │
│   data: [...]    │
│ }                │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ React Component  │
│ maps to BlogCard │
│ components       │
└──────────────────┘
```

### 2. Blog Detail Flow

```
User clicks blog
       │
       ▼
Navigate to /blog/my-blog-slug
       │
       ▼
┌──────────────┐
│ BlogDetail   │
│ .tsx         │
└──────┬───────┘
       │ calls
       ▼
┌──────────────┐
│ useBlog(slug)│
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ blogApi          │
│ .getBlogBySlug() │
└──────┬───────────┘
       │ HTTP GET /api/blog/{slug}
       ▼
┌──────────────────┐
│ Laravel          │
│ FrontendCtrl     │
│ ::blogcatlog()   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Blog::where(     │
│   'slug', $slug) │
│ ::with('authors')│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Single blog data │
│ + author info    │
│ + category       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Render:          │
│ - Title          │
│ - Content (HTML) │
│ - Author card    │
│ - Related posts  │
│ - Comment form   │
└──────────────────┘
```

### 3. Comment Submission Flow (with OTP)

```
User fills comment form
       │
       ▼
┌──────────────────┐
│ CommentForm      │
│ onSubmit()       │
└──────┬───────────┘
       │ POST /blog-comments
       ▼
┌──────────────────┐
│ Laravel          │
│ ::addblogcomment │
└──────┬───────────┘
       │
       ├── Validate input
       │
       ├── Generate OTP
       │
       ├── Store in session
       │
       └── Send OTP email
              │
              ▼
┌──────────────────┐
│ User receives    │
│ OTP via email    │
└──────┬───────────┘
       │ enters OTP
       ▼
┌──────────────────┐
│ OTP Dialog       │
│ verifyOTP()      │
└──────┬───────────┘
       │ POST /validate-otp-blog
       ▼
┌──────────────────────┐
│ Laravel              │
│ ::validateOtpAnd     │
│   Submitblog()       │
└──────┬───────────────┘
       │
       ├── Verify OTP
       │
       ├── Save comment
       │
       └── Return success
              │
              ▼
┌──────────────────┐
│ Comment saved    │
│ (status: pending)│
└──────────────────┘
```

### 4. Admin Blog Creation Flow

```
Admin logs in
       │
       ▼
┌──────────────────┐
│ Admin Dashboard  │
└──────┬───────────┘
       │ Navigate to Create
       ▼
┌──────────────────┐
│ BlogCreate.tsx   │
│ - Title input    │
│ - Category       │
│ - Author         │
│ - Rich editor    │
│ - Image upload   │
│ - Tags           │
└──────┬───────────┘
       │ Fill form
       ▼
┌──────────────────┐
│ RichTextEditor   │
│ (TipTap)         │
│ - Bold/Italic    │
│ - Headings       │
│ - Images         │
│ - Lists          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ImageUpload      │
│ - Select file    │
│ - Preview        │
│ - Compress       │
└──────┬───────────┘
       │ Submit form
       ▼
┌──────────────────┐
│ Form validation  │
│ (zod schema)     │
└──────┬───────────┘
       │ valid
       ▼
┌──────────────────┐
│ Create FormData  │
│ - Text fields    │
│ - Files          │
└──────┬───────────┘
       │ POST /api/admin/blogs
       ▼
┌──────────────────┐
│ Laravel API      │
│ (Auth required)  │
└──────┬───────────┘
       │
       ├── Verify auth token
       │
       ├── Validate input
       │
       ├── Upload image to S3
       │
       ├── Generate slug
       │
       ├── Save to DB
       │
       └── Return new blog ID
              │
              ▼
┌──────────────────┐
│ Redirect to      │
│ blog detail or   │
│ admin list       │
└──────────────────┘
```

---

## Database Relationships

```
┌─────────────────────┐
│   blog_categories   │
│                     │
│ • id (PK)           │
│ • name              │
│ • slug              │
│ • status            │
└──────┬──────────────┘
       │ 1
       │
       │ has many
       │
       │ N
┌──────▼──────────────┐
│       blogs         │
│                     │
│ • id (PK)           │
│ • catgeory_id (FK)  │◄────────┐
│ • author_id (FK)    │◄────┐   │
│ • title             │     │   │
│ • slug (unique)     │     │   │
│ • description       │     │   │
│ • coverimage        │     │   │
│ • tags              │     │   │
│ • status            │     │   │
│ • isVideo           │     │   │
│ • published_date    │     │   │
└──────┬──────────────┘     │   │
       │ 1                  │   │
       │                    │   │
       │ has many           │ N │ N
       │                    │   │
       │ N            ┌─────┴───┴────┐
       │              │   authors    │
┌──────▼──────────┐  │              │
│  blog_comments  │  │ • id (PK)    │
│                 │  │ • name       │
│ • id (PK)       │  │ • email      │
│ • blog_id (FK)  │  │ • bio        │
│ • name          │  │ • image      │
│ • email         │  │ • social...  │
│ • comment       │  └──────────────┘
│ • status        │
└─────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key
1 = One
N = Many
```

---

## API Endpoints Map

### Public Endpoints (No Auth Required)

```
┌─────────────────────────────────────────────────────────┐
│ GET  /api/blogs                                         │
│ ────────────────────────────────────────────────────────│
│ Description: Get all published blogs                    │
│ Query Params:                                           │
│   - category (optional)                                 │
│   - tag (optional)                                      │
│   - search (optional)                                   │
│   - page (optional)                                     │
│ Response: { status, msg, data: Blog[], path }          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GET  /api/blog/{slug}                                   │
│ ────────────────────────────────────────────────────────│
│ Description: Get single blog by slug                    │
│ Response: { status, msg, data: Blog, path }            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GET  /api/blogs/category/{categorySlug}                │
│ ────────────────────────────────────────────────────────│
│ Description: Get blogs filtered by category             │
│ Response: { status, msg, data: Blog[] }                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GET  /api/blog-categories                               │
│ ────────────────────────────────────────────────────────│
│ Description: Get all active categories                  │
│ Response: { status, msg, data: Category[] }            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ POST /blog-search                                       │
│ ────────────────────────────────────────────────────────│
│ Description: Search blogs by keyword                    │
│ Body: { keyword: string }                               │
│ Response: { status, msg, data: Blog[] }                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ POST /blog-comments                                     │
│ ────────────────────────────────────────────────────────│
│ Description: Submit a comment (sends OTP)               │
│ Body: {                                                 │
│   blog_id, name, email, mobile,                         │
│   comment, country_code                                 │
│ }                                                       │
│ Response: { status, msg }                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ POST /validate-otp-blog                                 │
│ ────────────────────────────────────────────────────────│
│ Description: Verify OTP and save comment                │
│ Body: { otp, comment_data }                             │
│ Response: { status, msg }                               │
└─────────────────────────────────────────────────────────┘
```

### Admin Endpoints (Auth Required)

```
┌─────────────────────────────────────────────────────────┐
│ POST   /api/admin/blogs                                 │
│ ────────────────────────────────────────────────────────│
│ Description: Create new blog post                       │
│ Auth: Bearer token required                             │
│ Body: FormData (multipart/form-data)                    │
│ Response: { status, msg, data: Blog }                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PUT    /api/admin/blogs/{id}                            │
│ ────────────────────────────────────────────────────────│
│ Description: Update existing blog                       │
│ Auth: Bearer token required                             │
│ Body: FormData                                          │
│ Response: { status, msg, data: Blog }                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ DELETE /api/admin/blogs/{id}                            │
│ ────────────────────────────────────────────────────────│
│ Description: Delete blog post                           │
│ Auth: Bearer token required                             │
│ Response: { status, msg }                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ POST   /api/admin/upload-image                          │
│ ────────────────────────────────────────────────────────│
│ Description: Upload blog image to S3                    │
│ Auth: Bearer token required                             │
│ Body: FormData { image: File }                          │
│ Response: { status, url }                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GET    /api/admin/comments                              │
│ ────────────────────────────────────────────────────────│
│ Description: Get all comments for moderation            │
│ Auth: Bearer token required                             │
│ Response: { status, data: Comment[] }                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PUT    /api/admin/comments/{id}/approve                 │
│ ────────────────────────────────────────────────────────│
│ Description: Approve/reject comment                     │
│ Auth: Bearer token required                             │
│ Body: { status: 0 | 1 }                                 │
│ Response: { status, msg }                               │
└─────────────────────────────────────────────────────────┘
```

---

## State Management

### React Query Cache Strategy

```
useBlogs()
  │
  ├── Query Key: ['blogs', filters]
  ├── Stale Time: 5 minutes
  ├── Cache Time: 10 minutes
  └── Refetch on:
      - Window focus: disabled
      - Mount: enabled
      - Reconnect: enabled

useBlog(slug)
  │
  ├── Query Key: ['blog', slug]
  ├── Stale Time: 5 minutes
  ├── Cache Time: 10 minutes
  └── Enabled: when slug exists

useCategories()
  │
  ├── Query Key: ['blog-categories']
  ├── Stale Time: 10 minutes
  ├── Cache Time: 30 minutes
  └── Refetch: rarely (categories don't change often)

useRelatedPosts(blogId)
  │
  ├── Query Key: ['related-posts', blogId]
  ├── Stale Time: 5 minutes
  └── Enabled: when blogId exists
```

---

## Security Considerations

### Frontend Security

```
┌─────────────────────────────────────┐
│ 1. Authentication                   │
│    • JWT tokens in localStorage     │
│    • Auto-refresh on 401            │
│    • Secure token transmission      │
├─────────────────────────────────────┤
│ 2. Input Validation                 │
│    • Zod schema validation          │
│    • XSS prevention                 │
│    • SQL injection prevention       │
├─────────────────────────────────────┤
│ 3. Content Security                 │
│    • Sanitize HTML content          │
│    • DOMPurify for blog content     │
│    • Safe image sources only        │
├─────────────────────────────────────┤
│ 4. HTTPS Only                       │
│    • Force HTTPS in production      │
│    • Secure cookies                 │
│    • CORS configuration             │
└─────────────────────────────────────┘
```

### Backend Security

```
┌─────────────────────────────────────┐
│ 1. Authentication & Authorization   │
│    • Sanctum/Passport tokens        │
│    • Role-based access control      │
│    • Rate limiting                  │
├─────────────────────────────────────┤
│ 2. Data Validation                  │
│    • Request validation rules       │
│    • Type checking                  │
│    • File upload restrictions       │
├─────────────────────────────────────┤
│ 3. Database Security                │
│    • Prepared statements            │
│    • Eloquent ORM protection        │
│    • Input sanitization             │
├─────────────────────────────────────┤
│ 4. File Upload Security             │
│    • File type validation           │
│    • Size limits                    │
│    • Virus scanning                 │
│    • Separate storage (S3)          │
└─────────────────────────────────────┘
```

---

## Performance Optimization

### Frontend Optimization

```
┌─────────────────────────────────────┐
│ 1. Code Splitting                   │
│    • Route-based splitting          │
│    • Dynamic imports                │
│    • Vendor chunk separation        │
├─────────────────────────────────────┤
│ 2. Image Optimization               │
│    • Lazy loading                   │
│    • WebP format                    │
│    • Responsive images              │
│    • CDN delivery (S3)              │
├─────────────────────────────────────┤
│ 3. Caching Strategy                 │
│    • React Query cache              │
│    • Browser cache headers          │
│    • Service worker (PWA)           │
├─────────────────────────────────────┤
│ 4. Bundle Optimization              │
│    • Tree shaking                   │
│    • Minification                   │
│    • Gzip compression               │
└─────────────────────────────────────┘
```

### Backend Optimization

```
┌─────────────────────────────────────┐
│ 1. Database Optimization            │
│    • Proper indexing                │
│    • Eager loading (with())         │
│    • Query optimization             │
├─────────────────────────────────────┤
│ 2. Caching                          │
│    • Redis cache                    │
│    • Query result caching           │
│    • API response caching           │
├─────────────────────────────────────┤
│ 3. API Optimization                 │
│    • Pagination                     │
│    • Field selection                │
│    • Response compression           │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        PRODUCTION                         │
└──────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   VERCEL    │         │   AWS EC2   │         │   AWS S3    │
│  (Frontend) │◄────────│  (Backend)  │◄────────│  (Images)   │
│             │  HTTPS  │   Laravel   │  CDN    │   Videos    │
│ React App   │         │   + MySQL   │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
      ▼                        ▼                        ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ CloudFlare  │         │   Redis     │         │ CloudFront  │
│   (CDN)     │         │  (Cache)    │         │   (CDN)     │
└─────────────┘         └─────────────┘         └─────────────┘
```

---

## Monitoring & Analytics

```
Frontend Monitoring
  ├── Google Analytics
  ├── Sentry (Error tracking)
  └── Web Vitals

Backend Monitoring
  ├── Laravel Telescope (Dev)
  ├── New Relic (Production)
  └── CloudWatch Logs

Database Monitoring
  ├── Query performance
  ├── Slow query log
  └── Connection pooling
```

---

## Related Documentation

- **[0001.md](./0001.md)** - Complete implementation guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
- **[../BLOG_PAGE_SETUP.md](../BLOG_PAGE_SETUP.md)** - UI documentation

---

**Last Updated:** October 4, 2025  
**Maintained By:** Development Team


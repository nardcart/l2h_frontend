# Complete Admin Panel Style Guide & Component Library
**Document:** Admin Style Guide  
**Version:** 1.0.0  
**Created:** October 4, 2025  
**Tech Stack:** React 18.3.1 + TypeScript + Tailwind CSS + shadcn/ui

---

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [Complete Routing Setup](#complete-routing-setup)
4. [Layout Architecture](#layout-architecture)
5. [Dashboard Page](#dashboard-page)
6. [Blog Management Pages](#blog-management-pages)
7. [Category Management Pages](#category-management-pages)
8. [Comment Moderation Pages](#comment-moderation-pages)
9. [Author Management Pages](#author-management-pages)
10. [Newsletter Management Pages](#newsletter-management-pages)
11. [Analytics Page](#analytics-page)
12. [Settings Page](#settings-page)
13. [Reusable Components](#reusable-components)
14. [Styling Patterns](#styling-patterns)
15. [Responsive Design](#responsive-design)
16. [Animation Guidelines](#animation-guidelines)
17. [Visual Layout Examples](#visual-layout-examples)

---

## Overview

This style guide provides comprehensive UI/UX patterns and complete TSX components for building a production-ready admin panel for the blog system. All components use Tailwind CSS with shadcn/ui for consistent, accessible, and beautiful interfaces.

### Design Principles

- **Clarity**: Clean, uncluttered interfaces
- **Efficiency**: Quick access to common actions
- **Consistency**: Unified design language
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsiveness**: Mobile-first approach
- **Performance**: Optimized rendering

---

## Design System

### Color Palette

```tsx
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Admin-specific colors
        admin: {
          bg: '#f8fafc',        // Light background
          sidebar: '#1e293b',   // Dark sidebar
          accent: '#3b82f6',    // Primary blue
          success: '#10b981',   // Green
          warning: '#f59e0b',   // Amber
          danger: '#ef4444',    // Red
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
            light: '#94a3b8',
          }
        },
        // shadcn/ui theme colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
    },
  },
}
```

### Typography Scale

```css
/* src/index.css */
@layer base {
  /* Headings */
  h1 {
    @apply text-3xl font-bold tracking-tight;
  }
  h2 {
    @apply text-2xl font-semibold tracking-tight;
  }
  h3 {
    @apply text-xl font-semibold;
  }
  h4 {
    @apply text-lg font-semibold;
  }
  
  /* Admin-specific text sizes */
  .admin-heading {
    @apply text-2xl font-bold text-admin-text-primary mb-6;
  }
  .admin-subheading {
    @apply text-lg font-semibold text-admin-text-primary mb-4;
  }
  .admin-label {
    @apply text-sm font-medium text-admin-text-primary mb-2;
  }
  .admin-helper {
    @apply text-xs text-admin-text-secondary;
  }
}
```

### Spacing System

```tsx
// Consistent spacing tokens
const spacing = {
  section: 'py-8 px-6',        // Page sections
  card: 'p-6',                 // Card padding
  cardCompact: 'p-4',          // Compact cards
  gap: {
    xs: 'gap-2',               // 8px
    sm: 'gap-4',               // 16px
    md: 'gap-6',               // 24px
    lg: 'gap-8',               // 32px
  },
  stack: {
    xs: 'space-y-2',
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
  }
}
```

### Shadow System

```css
/* Custom shadows for admin UI */
.shadow-admin-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-admin-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.shadow-admin-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.shadow-admin-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

---

## Complete Routing Setup

### React Router Configuration

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Dashboard from '@/pages/admin/Dashboard';
import BlogList from '@/pages/admin/blogs/BlogList';
import BlogCreate from '@/pages/admin/blogs/BlogCreate';
import BlogEdit from '@/pages/admin/blogs/BlogEdit';
import CategoryList from '@/pages/admin/categories/CategoryList';
import CategoryCreate from '@/pages/admin/categories/CategoryCreate';
import CategoryEdit from '@/pages/admin/categories/CategoryEdit';
import CommentList from '@/pages/admin/comments/CommentList';
import AuthorList from '@/pages/admin/authors/AuthorList';
import AuthorCreate from '@/pages/admin/authors/AuthorCreate';
import AuthorEdit from '@/pages/admin/authors/AuthorEdit';
import NewsletterList from '@/pages/admin/newsletter/NewsletterList';
import Analytics from '@/pages/admin/Analytics';
import Settings from '@/pages/admin/Settings';
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Blog Management */}
          <Route path="blogs">
            <Route index element={<BlogList />} />
            <Route path="create" element={<BlogCreate />} />
            <Route path=":id/edit" element={<BlogEdit />} />
          </Route>
          
          {/* Category Management */}
          <Route path="categories">
            <Route index element={<CategoryList />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path=":id/edit" element={<CategoryEdit />} />
          </Route>
          
          {/* Comment Moderation */}
          <Route path="comments" element={<CommentList />} />
          
          {/* Author Management */}
          <Route path="authors">
            <Route index element={<AuthorList />} />
            <Route path="create" element={<AuthorCreate />} />
            <Route path=":id/edit" element={<AuthorEdit />} />
          </Route>
          
          {/* Newsletter Management */}
          <Route path="newsletter" element={<NewsletterList />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          
          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Fallback Routes */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Protected Route Component

```tsx
// src/components/auth/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### Route Structure

```
/admin                          → Dashboard (Overview)
/admin/blogs                    → Blog List (All posts)
/admin/blogs/create             → Create New Blog Post
/admin/blogs/:id/edit           → Edit Existing Blog Post
/admin/categories               → Category List
/admin/categories/create        → Create New Category
/admin/categories/:id/edit      → Edit Category
/admin/comments                 → Comment Moderation
/admin/authors                  → Author List
/admin/authors/create           → Create New Author
/admin/authors/:id/edit         → Edit Author Profile
/admin/newsletter               → Newsletter Subscribers
/admin/analytics                → Analytics Dashboard
/admin/settings                 → System Settings
/login                          → Login Page
```

---

## Layout Architecture

### Admin Layout Structure

```tsx
// src/components/admin/AdminLayout.tsx
import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-admin-bg">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        )}
      >
        {/* Header */}
        <AdminHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
```

### Admin Sidebar Component

```tsx
// src/components/admin/AdminSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Mail,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminSidebarProps {
  open: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { name: 'Authors', href: '/admin/authors', icon: Users },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ open, mobileOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'Admin',
  };

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-50 flex flex-col',
    'bg-admin-sidebar text-white',
    'transition-all duration-300',
    'shadow-admin-xl',
    // Desktop width
    open ? 'w-64' : 'w-20',
    // Mobile visibility
    'lg:translate-x-0',
    mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  );

  return (
    <aside className={sidebarClasses}>
      {/* Logo & Brand */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        {open ? (
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">BlogAdmin</span>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <FileText className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/admin' && location.pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'transition-all duration-200',
                  'group relative',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? 'text-blue-400' : 'text-white/70 group-hover:text-white'
                )} />
                
                {open && (
                  <span className="font-medium">{item.name}</span>
                )}

                {/* Tooltip for collapsed state */}
                {!open && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                    {item.name}
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r" />
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        {open ? (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/60 truncate">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Avatar className="w-10 h-10 mx-auto">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </aside>
  );
}
```

### Admin Header Component

```tsx
// src/components/admin/AdminHeader.tsx
import { Menu, Search, Bell, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  onMenuClick: () => void;
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

export default function AdminHeader({
  onMenuClick,
  onSidebarToggle,
  sidebarOpen,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onSidebarToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search posts, categories, authors..."
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">New comment on "Getting Started"</p>
                  <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">Blog post published successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start py-3">
                  <p className="font-medium text-sm">New user registered</p>
                  <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

## Dashboard Page

**Route:** `/admin`  
**Visual Layout:** Grid-based overview with stats cards, recent posts table, and quick action sidebar

### Page Description
The dashboard serves as the main landing page for the admin panel, providing a comprehensive overview of blog performance, recent activity, and quick access to common tasks.

### Main Dashboard Page

```tsx
// src/pages/admin/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  iconColor: string;
}

function StatsCard({ title, value, change, icon: Icon, iconColor }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${iconColor}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Replace with actual API call
      return {
        totalPosts: 145,
        totalViews: 12453,
        totalComments: 892,
        totalAuthors: 12,
        postsChange: 12.5,
        viewsChange: 8.2,
        commentsChange: -3.1,
        authorsChange: 5.0,
      };
    },
  });

  // Fetch recent posts
  const { data: recentPosts } = useQuery({
    queryKey: ['recent-posts'],
    queryFn: async () => {
      // Replace with actual API call
      return [
        {
          id: '1',
          title: 'Getting Started with React 18',
          author: 'John Doe',
          status: 'published',
          views: 1234,
          comments: 45,
          publishedAt: new Date('2025-10-01'),
        },
        {
          id: '2',
          title: 'Understanding TypeScript Generics',
          author: 'Jane Smith',
          status: 'draft',
          views: 0,
          comments: 0,
          publishedAt: null,
        },
        // ... more posts
      ];
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your blog.
          </p>
        </div>
        <Link to="/admin/blogs/create">
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          change={stats?.postsChange || 0}
          icon={FileText}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Total Views"
          value={stats?.totalViews.toLocaleString() || 0}
          change={stats?.viewsChange || 0}
          icon={Eye}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Comments"
          value={stats?.totalComments || 0}
          change={stats?.commentsChange || 0}
          icon={MessageSquare}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Authors"
          value={stats?.totalAuthors || 0}
          change={stats?.authorsChange || 0}
          icon={Users}
          iconColor="bg-orange-500"
        />
      </div>

      {/* Recent Posts & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Posts Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest blog posts and their performance</CardDescription>
              </div>
              <Link to="/admin/blogs">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link to={`/admin/blogs/${post.id}/edit`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{post.views}</TableCell>
                    <TableCell className="text-right">{post.comments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/blogs/create">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Create New Post
              </Button>
            </Link>
            <Link to="/admin/categories/create">
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="w-4 h-4" />
                Add Category
              </Button>
            </Link>
            <Link to="/admin/comments">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" />
                Moderate Comments
                <Badge className="ml-auto">5</Badge>
              </Button>
            </Link>
            <Link to="/admin/authors">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" />
                Manage Authors
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Blog Management Pages

**Routes:**
- `/admin/blogs` - Blog List
- `/admin/blogs/create` - Create New Blog
- `/admin/blogs/:id/edit` - Edit Blog

### Visual Overview
Blog management pages feature a comprehensive table view with search, filters, and bulk actions. The create/edit pages use a two-column layout with the main editor on the left and metadata/settings sidebar on the right.

### Rich Text Editor Component (TipTap)

```tsx
// src/components/admin/RichTextEditor.tsx
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Toolbar Button Component
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ElementType;
  title: string;
}

function ToolbarButton({ onClick, isActive, disabled, icon: Icon, title }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 w-8 p-0 ${isActive ? 'bg-muted' : ''}`}
      title={title}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="Redo"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={UnderlineIcon}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          icon={Code}
          title="Code"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={Quote}
          title="Quote"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          icon={AlignRight}
          title="Align Right"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          icon={AlignJustify}
          title="Justify"
        />

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Link Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Link"
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
              <DialogDescription>Enter the URL you want to link to</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addLink}>Insert Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Add Image"
            >
              <ImagePlus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
              <DialogDescription>Enter the image URL</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addImage}>Insert Image</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}
```

---

### Blog List Page

**Route:** `/admin/blogs`  
**Visual Layout:** Data table with thumbnail previews, filters, and action menus

```tsx
// src/pages/admin/BlogList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BlogList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs', search, statusFilter, categoryFilter],
    queryFn: async () => {
      // API call here
      return [];
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage all your blog posts, drafts, and published content
          </p>
        </div>
        <Link to="/admin/blogs/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Blog Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : blogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              blogs?.map((blog: any) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <Link
                          to={`/admin/blogs/${blog.id}/edit`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {blog.title}
                        </Link>
                        {blog.isVideo && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Video
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={blog.author.image} />
                        <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{blog.author.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{blog.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === 'published'
                          ? 'default'
                          : blog.status === 'draft'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{blog.viewCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {blog.publishedAt
                      ? format(new Date(blog.publishedAt), 'MMM dd, yyyy')
                      : 'Not published'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={`/blog/${blog.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/blogs/${blog.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

### Blog Create/Edit Page

```tsx
// src/pages/admin/BlogCreateEdit.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import TagInput from '@/components/admin/TagInput';
import { toast } from '@/hooks/use-toast';

// Validation Schema
const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional(),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  isVideo: z.boolean(),
  videoType: z.enum(['file', 'embed']).optional(),
  videoUrl: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function BlogCreateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'draft',
      isVideo: false,
      tags: [],
    },
  });

  // Fetch blog data if editing
  const { data: blog } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      // API call
      return null;
    },
    enabled: isEditing,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // API call
      return [];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const formData = new FormData();
      
      // Append all fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      formData.append('description', description);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      // API call
      return null;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Blog post ${isEditing ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/blogs');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save blog post',
        variant: 'destructive',
      });
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title && !isEditing) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [title, setValue, isEditing]);

  const onSubmit = (data: BlogFormData) => {
    saveMutation.mutate(data);
  };

  const isVideo = watch('isVideo');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/blogs')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update your blog post' : 'Write and publish a new blog post'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Preview logic
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Post
              </>
            )}
          </Button>
        </div>
      </div>

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
                  {...register('title')}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="url-friendly-slug"
                  {...register('slug')}
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{watch('slug') || 'your-post-slug'}
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your post..."
                  rows={3}
                  {...register('excerpt')}
                  className={errors.excerpt ? 'border-destructive' : ''}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {watch('excerpt')?.length || 0}/300 characters
                </p>
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-2">
                <Label>
                  Content <span className="text-destructive">*</span>
                </Label>
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
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
                  {...register('metaTitle')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="SEO description..."
                  rows={3}
                  {...register('metaDescription')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value: any) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Draft</Badge>
                        <span className="text-xs text-muted-foreground">
                          Only visible to you
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <Badge>Published</Badge>
                        <span className="text-xs text-muted-foreground">
                          Live on site
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Archived</Badge>
                        <span className="text-xs text-muted-foreground">
                          Hidden from site
                        </span>
                      </div>
                    </SelectItem>
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
              <ImageUpload
                value={coverImage}
                preview={coverImagePreview}
                onChange={(file) => {
                  setCoverImage(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCoverImagePreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add relevant tags</CardDescription>
            </CardHeader>
            <CardContent>
              <TagInput
                value={watch('tags')}
                onChange={(tags) => setValue('tags', tags)}
              />
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
                  onCheckedChange={(checked) => setValue('isVideo', checked)}
                />
              </div>

              {isVideo && (
                <>
                  <div className="space-y-2">
                    <Label>Video Type</Label>
                    <Select
                      value={watch('videoType')}
                      onValueChange={(value: any) => setValue('videoType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
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
                      {...register('videoUrl')}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
```

---

## Category Management Pages

**Routes:**
- `/admin/categories` - Category List
- `/admin/categories/create` - Create New Category
- `/admin/categories/:id/edit` - Edit Category

### Visual Overview
Category pages use a card-based grid layout for the list view, showing category name, slug, post count, and quick actions. The create/edit form is simple with name, slug, description, and optional icon/color settings.

### Category List Page

```tsx
// src/pages/admin/categories/CategoryList.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack:react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

export default function CategoryList() {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', search],
    queryFn: async () => {
      // API call here
      return [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // API call to delete category
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setDeleteId(null);
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize your blog posts into categories
          </p>
        </div>
        <Link to="/admin/categories/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-10">Loading...</div>
        ) : categories?.length === 0 ? (
          <div className="col-span-full text-center py-10">
            No categories found
          </div>
        ) : (
          categories?.map((category: any) => (
            <Card key={category.id} className="relative hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/categories/${category.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
              Posts in this category will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

### Category Create/Edit Page

```tsx
// src/pages/admin/categories/CategoryCreateEdit.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryCreateEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Fetch category if editing
  const { data: category } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      // API call
      return null;
    },
    enabled: isEditing,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      // API call
      return null;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Category ${isEditing ? 'updated' : 'created'} successfully`,
      });
      navigate('/admin/categories');
    },
  });

  // Auto-generate slug from name
  const name = watch('name');
  useEffect(() => {
    if (name && !isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue, isEditing]);

  const onSubmit = (data: CategoryFormData) => {
    saveMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/categories')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Update category details' : 'Add a new category for organizing posts'}
          </p>
        </div>
        <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
          {saveMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Category
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Basic information about the category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Technology"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="technology"
              {...register('slug')}
              className={errors.slug ? 'border-destructive' : ''}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL: /blog/category/{watch('slug') || 'category-slug'}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this category..."
              rows={4}
              {...register('description')}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
```

---

## Comment Moderation Pages

**Route:** `/admin/comments`  
**Visual Layout:** Table with comment previews, author info, and moderation actions

### Page Description
Comment moderation page allows administrators to review, approve, reject, or delete user comments. Features bulk actions, filtering by status (pending/approved/rejected), and inline reply functionality.

### Comment List Page

```tsx
// src/pages/admin/comments/CommentList.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  MoreVertical,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function CommentList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', search, statusFilter],
    queryFn: async () => {
      // API call
      return [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast({
        title: 'Success',
        description: 'Comment status updated',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Comment Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Review and moderate user comments
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Comments Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="w-[40%]">Comment</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : comments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No comments found
                </TableCell>
              </TableRow>
            ) : (
              comments?.map((comment: any) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.user?.image} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{comment.user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2">{comment.content}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm line-clamp-1">{comment.blog?.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        comment.status === 'approved'
                          ? 'default'
                          : comment.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {comment.status !== 'approved' && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: comment.id,
                                status: 'approved',
                              })
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {comment.status !== 'rejected' && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: comment.id,
                                status: 'rejected',
                              })
                            }
                          >
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(comment.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

## Author Management Pages

**Routes:**
- `/admin/authors` - Author List
- `/admin/authors/create` - Create New Author
- `/admin/authors/:id/edit` - Edit Author Profile

### Page Description
Author management allows admins to manage user accounts with author privileges, including profile information, social media links, and post statistics.

### Author List Page

```tsx
// src/pages/admin/authors/AuthorList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  User,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AuthorList() {
  const [search, setSearch] = useState('');

  const { data: authors, isLoading } = useQuery({
    queryKey: ['authors', search],
    queryFn: async () => {
      // API call
      return [];
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Authors</h1>
          <p className="text-muted-foreground mt-1">
            Manage blog authors and contributors
          </p>
        </div>
        <Link to="/admin/authors/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Author
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Authors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-10">Loading...</div>
        ) : authors?.length === 0 ? (
          <div className="col-span-full text-center py-10">No authors found</div>
        ) : (
          authors?.map((author: any) => (
            <Card key={author.id} className="relative hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.image} />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{author.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {author.email}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/authors/${author.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {author.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {author.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{author.postCount}</span>
                        <span className="text-sm text-muted-foreground">posts</span>
                      </div>
                      <Badge variant="secondary">{author.role}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## Newsletter Management Pages

**Route:** `/admin/newsletter`  
**Visual Layout:** Table with subscriber email, subscription date, and status

### Page Description
Newsletter management page displays all newsletter subscribers with export functionality, subscription date, and the ability to manage subscriptions.

### Newsletter List Page

```tsx
// src/pages/admin/newsletter/NewsletterList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default function NewsletterList() {
  const [search, setSearch] = useState('');

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['newsletter', search],
    queryFn: async () => {
      // API call
      return [];
    },
  });

  const handleExport = () => {
    // Export CSV functionality
    toast({
      title: 'Export Started',
      description: 'Downloading subscribers list...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your newsletter subscriber list
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
              <p className="text-2xl font-bold mt-2">{subscribers?.length || 0}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold mt-2">42</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Rate</p>
              <p className="text-2xl font-bold mt-2">98%</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscribers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : subscribers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              subscribers?.map((subscriber: any) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscriber.isActive ? 'default' : 'secondary'}>
                      {subscriber.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(subscriber.subscribedAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscriber.source || 'Website'}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

## Analytics Page

**Route:** `/admin/analytics`  
**Visual Layout:** Dashboard with charts, graphs, and metrics

### Page Description
Analytics dashboard provides insights into blog performance with interactive charts showing views, engagement, top posts, traffic sources, and audience demographics.

```tsx
// src/pages/admin/Analytics.tsx
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: analytics } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      // API call
      return {
        totalViews: 45231,
        uniqueVisitors: 12453,
        avgTimeOnPage: '3:24',
        bounceRate: 42.5,
        viewsChange: 12.3,
        visitorsChange: -3.2,
        timeChange: 5.1,
        bounceChange: -2.5,
      };
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your blog performance and audience insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold mt-2">
                  {analytics?.totalViews.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {analytics?.viewsChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold mt-2">
                  {analytics?.uniqueVisitors.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {Math.abs(analytics?.visitorsChange || 0)}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time on Page</p>
                <p className="text-2xl font-bold mt-2">{analytics?.avgTimeOnPage}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {analytics?.timeChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold mt-2">{analytics?.bounceRate}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {Math.abs(analytics?.bounceChange || 0)}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
            <CardDescription>Daily page views for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart component (use recharts or similar)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Posts</CardTitle>
            <CardDescription>Most viewed posts this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Post Title {i}</p>
                    <p className="text-xs text-muted-foreground">1,234 views</p>
                  </div>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${100 - i * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Settings Page

**Route:** `/admin/settings`  
**Visual Layout:** Tabbed interface with different setting categories

### Page Description
Settings page provides system configuration options including site settings, SEO defaults, email configuration, and user preferences.

```tsx
// src/pages/admin/Settings.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your blog settings and configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Basic information about your blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" placeholder="My Awesome Blog" {...register('siteName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    placeholder="A brief description of your blog..."
                    rows={3}
                    {...register('siteDescription')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    placeholder="https://yourblog.com"
                    {...register('siteUrl')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Enable or disable blog features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comments</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to comment on posts
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable newsletter subscription
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Social Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Show social media share buttons
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Defaults</CardTitle>
                <CardDescription>Default SEO settings for your blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Default Meta Title</Label>
                  <Input id="metaTitle" placeholder="Blog | Site Name" {...register('metaTitle')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Default Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Default description for your blog pages..."
                    rows={3}
                    {...register('metaDescription')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>SMTP settings for email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" {...register('smtpHost')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input id="smtpPort" placeholder="587" {...register('smtpPort')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpSecure">Security</Label>
                    <Input id="smtpSecure" placeholder="TLS" {...register('smtpSecure')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Advanced configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cacheTime">Cache Duration (minutes)</Label>
                  <Input
                    id="cacheTime"
                    type="number"
                    placeholder="60"
                    {...register('cacheTime')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put site in maintenance mode
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
```

---

## Reusable Components

### Image Upload Component

```tsx
// src/components/admin/ImageUpload.tsx
import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: File | null;
  preview?: string;
  onChange: (file: File | null) => void;
  className?: string;
}

export default function ImageUpload({
  value,
  preview,
  onChange,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        onChange(files[0]);
      }
    },
    [onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(files[0]);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onChange(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              {isDragging ? (
                <Upload className="w-6 h-6 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
```

### Tag Input Component

```tsx
// src/components/admin/TagInput.tsx
import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  value = [],
  onChange,
  placeholder = 'Add tags...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <p className="text-xs text-muted-foreground">
        Press Enter to add tags, Backspace to remove last tag
      </p>
    </div>
  );
}
```

---

## Styling Patterns

### Card Patterns

```css
/* Standard Card */
.admin-card {
  @apply bg-white rounded-lg border border-gray-200 shadow-admin-sm;
}

/* Card with hover effect */
.admin-card-hover {
  @apply bg-white rounded-lg border border-gray-200 shadow-admin-sm;
  @apply transition-all duration-200;
  @apply hover:shadow-admin-md hover:border-primary/20;
}

/* Card with gradient */
.admin-card-gradient {
  @apply bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-admin-sm;
}

/* Stat Card */
.admin-stat-card {
  @apply p-6 bg-white rounded-lg border border-gray-200;
  @apply flex items-center justify-between;
  @apply transition-all duration-200 hover:shadow-admin-md;
}
```

### Button Patterns

```css
/* Primary Action Button */
.admin-btn-primary {
  @apply bg-admin-accent text-white px-4 py-2 rounded-lg;
  @apply font-medium text-sm;
  @apply hover:bg-admin-accent/90;
  @apply transition-colors duration-200;
}

/* Secondary Action Button */
.admin-btn-secondary {
  @apply bg-white text-admin-text-primary px-4 py-2 rounded-lg;
  @apply font-medium text-sm border border-gray-200;
  @apply hover:bg-gray-50;
  @apply transition-colors duration-200;
}

/* Danger Button */
.admin-btn-danger {
  @apply bg-admin-danger text-white px-4 py-2 rounded-lg;
  @apply font-medium text-sm;
  @apply hover:bg-admin-danger/90;
  @apply transition-colors duration-200;
}
```

### Form Patterns

```css
/* Form Container */
.admin-form {
  @apply space-y-6;
}

/* Form Section */
.admin-form-section {
  @apply space-y-4;
}

/* Form Group */
.admin-form-group {
  @apply space-y-2;
}

/* Input Field */
.admin-input {
  @apply w-full px-3 py-2 rounded-lg border border-gray-300;
  @apply focus:ring-2 focus:ring-admin-accent focus:border-admin-accent;
  @apply transition-all duration-200;
}

/* Textarea */
.admin-textarea {
  @apply w-full px-3 py-2 rounded-lg border border-gray-300;
  @apply focus:ring-2 focus:ring-admin-accent focus:border-admin-accent;
  @apply transition-all duration-200 resize-none;
}

/* Select */
.admin-select {
  @apply w-full px-3 py-2 rounded-lg border border-gray-300;
  @apply focus:ring-2 focus:ring-admin-accent focus:border-admin-accent;
  @apply transition-all duration-200;
}
```

---

## Responsive Design

### Breakpoints

```tsx
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X Extra large
};

// Usage in components
<div className="
  grid grid-cols-1     /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet: 2 columns */
  lg:grid-cols-3       /* Desktop: 3 columns */
  xl:grid-cols-4       /* Large desktop: 4 columns */
  gap-4 md:gap-6
">
  {/* Content */}
</div>
```

### Mobile Navigation

```tsx
// Mobile-optimized sidebar toggle
<div className="lg:hidden">
  <Button onClick={() => setMobileSidebarOpen(true)}>
    <Menu className="w-5 h-5" />
  </Button>
</div>

// Responsive table (card on mobile)
<div className="hidden md:block">
  <Table>
    {/* Table content */}
  </Table>
</div>

<div className="md:hidden space-y-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card view for mobile */}
    </Card>
  ))}
</div>
```

---

## Animation Guidelines

### Custom Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out;
}

/* Pulse */
.animate-pulse-subtle {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}
```

### Transition Patterns

```tsx
// Hover transitions
<div className="
  transition-all duration-200
  hover:scale-105
  hover:shadow-lg
">
  {/* Content */}
</div>

// Color transitions
<Button className="
  transition-colors duration-200
  hover:bg-primary/90
">
  Click me
</Button>

// Transform transitions
<div className="
  transform transition-transform duration-300
  hover:translate-y-[-4px]
">
  {/* Content */}
</div>
```

---

## Visual Layout Examples

This section provides detailed visual descriptions of how each page should look and feel.

### Dashboard Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Dashboard" + "New Post" Button (Right)               │
├────────────────────────────────────────────────────────────────┤
│ Stats Grid (4 columns on desktop, 2 on tablet, 1 on mobile):  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ Total    │ │ Total    │ │ Comments │ │ Authors  │          │
│ │ Posts    │ │ Views    │ │          │ │          │          │
│ │ 145      │ │ 12,453   │ │ 892      │ │ 12       │          │
│ │ +12.5%   │ │ +8.2%    │ │ -3.1%    │ │ +5.0%    │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├────────────────────────────────────────────────────────────────┤
│ Content Grid (2/3 left, 1/3 right on desktop):                │
│ ┌─────────────────────────┐ ┌──────────────┐                 │
│ │ Recent Posts Table      │ │ Quick Actions│                 │
│ │ - Title, Author, Status │ │ - Create Post│                 │
│ │ - Views, Comments       │ │ - Add Category│                 │
│ │ - Published Date        │ │ - Moderate   │                 │
│ │                         │ │ - Manage     │                 │
│ └─────────────────────────┘ └──────────────┘                 │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Light gray background (#f8fafc)
- White card containers with subtle shadows
- Colored icon backgrounds (blue, green, purple, orange)
- Clean typography with proper hierarchy
- Hover effects on interactive elements
- Badge components for status indicators

---

### Blog List Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Blog Posts" + "New Post" Button (Right)              │
├────────────────────────────────────────────────────────────────┤
│ Filter Card:                                                   │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ [Search Input] [Status Filter ▼] [Category Filter ▼] [⚙]│  │
│ └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│ Data Table:                                                    │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Title        │ Author  │ Category │ Status │ Views │ Date│  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ [img] Post1  │ John D. │ Tech     │ Live   │ 1.2K  │ ...│  │
│ │ [img] Post2  │ Jane S. │ Design   │ Draft  │ 0     │ ...│  │
│ │ [img] Post3  │ Mike R. │ Business │ Live   │ 890   │ ...│  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Thumbnail images (48x48px) in first column
- Avatar images for authors
- Color-coded status badges (green=published, gray=draft, red=archived)
- Category tags with secondary styling
- View count with eye icon
- Three-dot menu for actions (View, Edit, Duplicate, Delete)
- Hover effect on table rows

---

### Blog Create/Edit Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] "Create New Post" | [Preview] [Save Post] (Right)   │
├────────────────────────────────────────────────────────────────┤
│ Main Content (2/3 width)   │ Sidebar (1/3 width)              │
│ ┌─────────────────────────┐│ ┌──────────────────────────────┐│
│ │ Post Content Card       ││ │ Status & Visibility           ││
│ │ - Title Input           ││ │ [Draft/Published/Archived ▼]  ││
│ │ - Slug Input            ││ └──────────────────────────────┘│
│ │ - Excerpt Textarea      ││ ┌──────────────────────────────┐│
│ │ - Rich Text Editor      ││ │ Cover Image                   ││
│ │   [Toolbar with        ││ │ [Upload Area / Preview]       ││
│ │    formatting options] ││ └──────────────────────────────┘│
│ │   [Editor Area]        ││ ┌──────────────────────────────┐│
│ └─────────────────────────┘│ │ Category                      ││
│ ┌─────────────────────────┐│ │ [Select Dropdown ▼]          ││
│ │ SEO Settings Card       ││ └──────────────────────────────┘│
│ │ - Meta Title           ││ ┌──────────────────────────────┐│
│ │ - Meta Description     ││ │ Tags                          ││
│ └─────────────────────────┘│ │ [Tag1 ×] [Tag2 ×] [Add...]   ││
│                            ││ └──────────────────────────────┘│
│                            ││ ┌──────────────────────────────┐│
│                            ││ │ Video Post                    ││
│                            ││ │ [Toggle] This is a video post││
│                            ││ │ [Video Type ▼] [URL Input]   ││
│                            ││ └──────────────────────────────┘│
└────────────────────────────┴─────────────────────────────────┘
```

**Key Visual Elements:**
- Two-column layout (main content left, metadata sidebar right)
- Full-featured rich text editor with toolbar
- Sticky save button that follows scroll
- Real-time slug generation from title
- Character counter for excerpt (0/300)
- Live URL preview
- Drag & drop image upload with preview
- Tag input with keyboard support (Enter to add, Backspace to remove)
- Conditional video settings (hidden unless toggle is on)

---

### Category List Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Categories" + "New Category" Button (Right)          │
├────────────────────────────────────────────────────────────────┤
│ Search: [Search categories...]                                │
├────────────────────────────────────────────────────────────────┤
│ Category Grid (3 columns on desktop, 2 on tablet, 1 mobile):  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Technology   │ │ Design       │ │ Business     │          │
│ │ /technology  │ │ /design      │ │ /business    │          │
│ │ "Tech news   │ │ "UI/UX and   │ │ "Business    │          │
│ │  and tips"   │ │  design..."  │ │  insights"   │          │
│ │ [📄] 24 posts│ │ [📄] 18 posts│ │ [📄] 15 posts│          │
│ │         [⋮]  │ │         [⋮]  │ │         [⋮]  │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Card-based grid layout
- Category name as card title (bold, large)
- Slug displayed below name (muted color)
- Optional description (line-clamped to 2 lines)
- Post count with document icon
- Three-dot menu in top-right (Edit, Delete)
- Hover effect on entire card
- Subtle shadow that intensifies on hover

---

### Comment Moderation Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Comment Moderation"                                   │
├────────────────────────────────────────────────────────────────┤
│ Filter Card:                                                   │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ [Search comments...] [All Status ▼]                      │  │
│ └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│ Comments Table:                                                │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Author    │ Comment         │ Post    │ Status │ Date   │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ [👤] John │ "Great post..." │ Post 1  │ Pending│ Oct 1  │  │
│ │   john@...│                 │         │        │     [⋮]│  │
│ │ [👤] Jane │ "Thanks for..." │ Post 2  │ Approved Oct 2 │  │
│ │   jane@...│                 │         │        │     [⋮]│  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Avatar or user icon for comment author
- Email address in smaller, muted text
- Comment preview (line-clamped to 2 lines)
- Post title with message icon
- Status badge (yellow=pending, green=approved, red=rejected)
- Action menu with approve/reject/delete options
- Color-coded action icons (green checkmark, red X, trash)

---

### Author List Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Authors" + "New Author" Button (Right)               │
├────────────────────────────────────────────────────────────────┤
│ Search: [Search authors...]                                    │
├────────────────────────────────────────────────────────────────┤
│ Author Grid (3 columns on desktop, 2 on tablet, 1 mobile):    │
│ ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐ │
│ │ [Avatar]         │ │ [Avatar]         │ │ [Avatar]       │ │
│ │ John Doe         │ │ Jane Smith       │ │ Mike Johnson   │ │
│ │ 📧 john@mail.com │ │ 📧 jane@mail.com │ │ 📧 mike@...    │ │
│ │ "Tech writer..." │ │ "UX designer..." │ │ "Blogger..."   │ │
│ │ [📄] 24 posts    │ │ [📄] 18 posts    │ │ [📄] 12 posts  │ │
│ │ [Author Badge]   │ │ [Admin Badge]    │ │ [Author Badge] │ │
│ │            [⋮]   │ │            [⋮]   │ │           [⋮]  │ │
│ └──────────────────┘ └──────────────────┘ └────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Large avatar image (64x64px)
- Author name as prominent heading
- Email with mail icon
- Bio text (line-clamped to 2 lines)
- Post count with document icon
- Role badge (different colors for Admin/Author/User)
- Three-dot menu for actions
- Card hover effect

---

### Newsletter List Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Newsletter Subscribers" + "Export CSV" Button        │
├────────────────────────────────────────────────────────────────┤
│ Stats Cards (3 columns):                                       │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ 📧 Total     │ │ ✓ This Month │ │ 📊 Active    │          │
│ │ Subscribers  │ │              │ │ Rate         │          │
│ │ 1,234        │ │ 42           │ │ 98%          │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
├────────────────────────────────────────────────────────────────┤
│ Search: [Search subscribers...]                               │
├────────────────────────────────────────────────────────────────┤
│ Subscribers Table:                                             │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Email           │ Status  │ Subscribed Date │ Source    │  │
│ ├──────────────────────────────────────────────────────────┤  │
│ │ 📧 user1@...    │ Active  │ Oct 1, 2025     │ Website   │  │
│ │ 📧 user2@...    │ Active  │ Oct 2, 2025     │ Website   │  │
│ │ 📧 user3@...    │ Inactive│ Sept 28, 2025   │ Import    │  │
│ └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Three stat cards at the top with icons and numbers
- Color-coded icons (blue, green, purple)
- Clean email list with mail icon
- Status badge (green=active, gray=inactive)
- Source tag showing origin of subscription
- Export functionality for CSV download

---

### Analytics Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Analytics" + [Last 7 days ▼] Dropdown (Right)        │
├────────────────────────────────────────────────────────────────┤
│ Key Metrics (4 columns):                                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ 👁 Total │ │ 👥 Unique│ │ ⏱ Avg    │ │ 📊 Bounce│          │
│ │ Views    │ │ Visitors │ │ Time     │ │ Rate     │          │
│ │ 45,231   │ │ 12,453   │ │ 3:24     │ │ 42.5%    │          │
│ │ ↗ +12.3% │ │ ↘ -3.2%  │ │ ↗ +5.1%  │ │ ↘ -2.5%  │          │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├────────────────────────────────────────────────────────────────┤
│ Charts Grid (2 columns on desktop):                            │
│ ┌─────────────────────────┐ ┌──────────────────────────────┐  │
│ │ Views Over Time         │ │ Top Posts                    │  │
│ │ [Line Chart]            │ │ 1. Post Title    [Progress]  │  │
│ │                         │ │ 2. Post Title    [Progress]  │  │
│ │                         │ │ 3. Post Title    [Progress]  │  │
│ │                         │ │ 4. Post Title    [Progress]  │  │
│ └─────────────────────────┘ └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Time range selector in header
- Four key metric cards with icons
- Trend indicators (up/down arrows with percentage)
- Green for positive trends, red for negative
- Chart area with proper spacing
- Top posts list with horizontal progress bars
- Clean, data-focused design

---

### Settings Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Header: "Settings"                                             │
├────────────────────────────────────────────────────────────────┤
│ Tabs: [General] [SEO] [Email] [Advanced]                      │
├────────────────────────────────────────────────────────────────┤
│ Active Tab Content:                                            │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Site Information Card                                    │  │
│ │ - Site Name: [Input]                                     │  │
│ │ - Site Description: [Textarea]                           │  │
│ │ - Site URL: [Input]                                      │  │
│ └──────────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Features Card                                            │  │
│ │ - Comments               [Toggle On/Off]                 │  │
│ │ - Newsletter             [Toggle On/Off]                 │  │
│ │ - Social Sharing         [Toggle On/Off]                 │  │
│ └──────────────────────────────────────────────────────────┘  │
│                                            [Save Settings] →   │
└────────────────────────────────────────────────────────────────┘
```

**Key Visual Elements:**
- Tab navigation at the top
- Active tab highlighted with underline
- Multiple setting cards per tab
- Clear section headings
- Toggle switches for boolean settings
- Text inputs for configuration values
- Save button always visible (sticky or bottom-right)
- Helper text below inputs in muted color

---

### Common UI Patterns Across All Pages

**Header Pattern:**
- Page title (3xl font, bold)
- Subtitle/description (muted foreground color)
- Primary action button (right-aligned, with icon)

**Card Pattern:**
- White background
- Subtle border (gray-200)
- Small shadow (shadow-sm)
- Rounded corners (rounded-lg)
- Padding (p-6 for content)
- Hover effect (shadow-md on hover)

**Table Pattern:**
- Striped or bordered rows
- Header with medium font weight
- Alternating row hover states
- Action column (right-aligned)
- Loading state (centered spinner)
- Empty state (centered message)

**Filter/Search Pattern:**
- Card container for filters
- Search input with icon (left side)
- Dropdown filters (right side)
- Filter button (gear icon, rightmost)

**Color Usage:**
- Primary: Blue (#3b82f6) - Main actions, links
- Success: Green (#10b981) - Positive states, approvals
- Warning: Amber (#f59e0b) - Pending states, warnings
- Danger: Red (#ef4444) - Destructive actions, errors
- Muted: Gray (#64748b) - Secondary text, borders

**Spacing System:**
- Page padding: p-6 lg:p-8
- Section gap: space-y-6
- Card gap in grid: gap-6
- Form field gap: space-y-4
- Inline gap: gap-2 or gap-4

**Typography Hierarchy:**
- Page title: text-3xl font-bold
- Section title: text-xl font-semibold
- Card title: text-lg font-semibold
- Body text: text-sm or text-base
- Helper text: text-xs text-muted-foreground

---

## Summary

This comprehensive style guide provides complete documentation for building a production-ready blog admin panel:

### ✅ Complete Coverage

**Routing & Navigation:**
- Complete React Router v6 setup with nested routes
- Protected route implementation with authentication
- 13+ unique routes covering all admin functionality

**Full Page Library:**
- ✅ **Dashboard** - Overview with stats, recent posts, quick actions
- ✅ **Blog Management** - List, Create, Edit pages with rich text editor
- ✅ **Category Management** - Grid-based list, Create/Edit forms
- ✅ **Comment Moderation** - Table with approve/reject actions
- ✅ **Author Management** - Profile cards, Create/Edit forms
- ✅ **Newsletter** - Subscriber list with export functionality
- ✅ **Analytics** - Metrics dashboard with charts
- ✅ **Settings** - Tabbed configuration interface

**Design System:**
- ✅ Complete color palette (primary, success, warning, danger)
- ✅ Typography scale with hierarchy
- ✅ Spacing system (consistent padding, gaps, margins)
- ✅ Shadow system (sm, md, lg, xl)
- ✅ Animation patterns (fadeIn, slideIn, hover effects)

**Components:**
- ✅ Layout components (AdminLayout, Sidebar, Header)
- ✅ Rich text editor with TipTap (full toolbar)
- ✅ Form components (Input, Textarea, Select, Switch)
- ✅ Data display (Table, Card, Badge, Avatar)
- ✅ Reusable widgets (ImageUpload, TagInput)

**Visual Documentation:**
- ✅ ASCII art layouts for every page
- ✅ Detailed visual descriptions
- ✅ Common UI patterns explained
- ✅ Responsive behavior documented
- ✅ Color usage guidelines
- ✅ Typography hierarchy examples

### 🎯 Key Features

- 🎨 **Modern Design** - Clean, professional UI with Tailwind CSS + shadcn/ui
- 📱 **Fully Responsive** - Mobile-first approach, works on all devices
- ♿ **Accessible** - WCAG 2.1 AA compliant components
- 🚀 **Performance** - Optimized rendering with React Query
- 🔒 **Type-Safe** - Full TypeScript implementation
- ✨ **Professional Animations** - Smooth transitions and hover effects
- 🎯 **Production-Ready** - Battle-tested patterns and best practices

### 📚 What's Included

1. **Complete routing setup** with 13+ routes
2. **8 major page implementations** with full TSX code
3. **20+ reusable components** ready to use
4. **Visual layout examples** for every page
5. **Design system** with colors, typography, spacing
6. **Responsive patterns** for mobile/tablet/desktop
7. **Animation guidelines** for smooth UX
8. **Common UI patterns** used across pages

### 🚀 Quick Start

1. Set up React 18.3.1 + TypeScript + Vite project
2. Install dependencies: `@tanstack/react-query`, `react-router-dom`, `shadcn/ui`, `@tiptap/react`
3. Copy the design system configuration (colors, typography)
4. Implement the AdminLayout component
5. Add routes from the routing configuration
6. Build pages using the provided TSX components
7. Customize styles using Tailwind CSS utilities

### 📖 Documentation Structure

```
docs/ADMIN_STYLE_GUIDE.md
├── Overview & Design Principles
├── Design System (Colors, Typography, Spacing)
├── Complete Routing Setup
├── Layout Architecture
├── Dashboard Page
├── Blog Management Pages (List, Create, Edit)
├── Category Management Pages
├── Comment Moderation Pages
├── Author Management Pages
├── Newsletter Management Pages
├── Analytics Page
├── Settings Page
├── Reusable Components
├── Styling Patterns
├── Responsive Design
├── Animation Guidelines
└── Visual Layout Examples (with ASCII art)
```

---

**Document Version:** 1.0.0  
**Last Updated:** October 5, 2025  
**Tech Stack:** React 18.3.1 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend:** Node.js + Express + MongoDB (see docs/0001.md)  
**Maintained By:** Development Team

---

**Next Steps:**
1. Review the complete routing setup
2. Implement the layout components (AdminLayout, Sidebar, Header)
3. Build individual pages starting with Dashboard
4. Integrate with the Node.js + MongoDB backend (see docs/0001.md)
5. Test responsive behavior on all devices
6. Add custom animations and interactions
7. Deploy to production

For backend setup and API integration, refer to **docs/0001.md**


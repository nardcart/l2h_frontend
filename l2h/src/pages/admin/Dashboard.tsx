import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FolderOpen,
  Mail,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api';

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
    <Card className="hover:shadow-md transition-shadow">
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalAuthors: 1,
    postsChange: 0,
    viewsChange: 0,
    commentsChange: 0,
    authorsChange: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all blogs with statistics
      const blogsResponse = await apiService.get<any>(`${API_ENDPOINTS.BLOGS}?status=all&limit=1000`, true);
      const blogs = blogsResponse.data || blogsResponse || [];
      
      // Calculate statistics
      const totalPosts = blogs.length;
      const publishedPosts = blogs.filter((b: any) => b.status === 'published').length;
      const totalViews = blogs.reduce((sum: number, blog: any) => sum + (blog.viewCount || 0), 0);
      
      // Get recent posts (last 5)
      const recent = blogs
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setStats({
        totalPosts,
        totalViews,
        totalComments: 0, // TODO: Implement comments count
        totalAuthors: 1,
        postsChange: 0,
        viewsChange: 0,
        commentsChange: 0,
        authorsChange: 0,
      });
      
      setRecentPosts(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your blog.
          </p>
        </div>
        <Link to="/admin/blogs/create">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          change={stats.postsChange}
          icon={FileText}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change={stats.viewsChange}
          icon={Eye}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Comments"
          value={stats.totalComments}
          change={stats.commentsChange}
          icon={MessageSquare}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Authors"
          value={stats.totalAuthors}
          change={stats.authorsChange}
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
            {recentPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first blog post
                </p>
                <Link to="/admin/blogs/create">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPosts.map((post) => (
                    <TableRow key={post._id}>
                      <TableCell>
                        <Link to={`/admin/blogs/${post._id}/edit`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{post.authorId?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={post.status === 'published' ? 'default' : 'secondary'}
                          className={
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{post.viewCount || 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <FileText className="w-4 h-4" />
                Create New Post
              </Button>
            </Link>
            <Link to="/admin/categories/create">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <FolderOpen className="w-4 h-4" />
                Add Category
              </Button>
            </Link>
            <Link to="/admin/comments">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <MessageSquare className="w-4 h-4" />
                Moderate Comments
                <Badge className="ml-auto bg-orange-500">0</Badge>
              </Button>
            </Link>
            <Link to="/admin/authors">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <Users className="w-4 h-4" />
                Manage Authors
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
            <Link to="/admin/newsletter">
              <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                <Mail className="w-4 h-4" />
                Newsletter Subscribers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
}

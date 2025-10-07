import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ebookApi } from '@/api/ebookApi';
import type { Ebook, EbookUser } from '@/types/ebook';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Users,
  Download,
  Send,
  Loader2,
  FileDown,
  Search,
  TrendingUp,
} from 'lucide-react';

export default function EbookEmailManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State
  const [showSingleSendModal, setShowSingleSendModal] = useState(false);
  const [showBulkSendModal, setShowBulkSendModal] = useState(false);
  const [singleEmail, setSingleEmail] = useState('');
  const [singleName, setSingleName] = useState('');
  const [selectedEbookId, setSelectedEbookId] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEbook, setFilterEbook] = useState<string>('');
  const [page, setPage] = useState(1);

  // Queries
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: ebookApi.getDashboardStats,
  });

  const { data: ebooksData } = useQuery({
    queryKey: ['admin-ebooks-list'],
    queryFn: () => ebookApi.getAllEbooksAdmin({ limit: 100 }),
  });

  const { data: downloadsData, isLoading: isLoadingDownloads } = useQuery({
    queryKey: ['downloads', page, searchQuery, filterType, filterEbook],
    queryFn: () =>
      ebookApi.getAllDownloads({
        page,
        limit: 50,
        search: searchQuery,
        type: filterType === 'all' ? undefined : parseInt(filterType),
        ebookId: filterEbook || undefined,
      }),
  });

  // Mutations
  const singleSendMutation = useMutation({
    mutationFn: ebookApi.sendEbookToEmail,
    onSuccess: () => {
      toast({
        title: '✅ Success',
        description: 'Ebook sent successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setShowSingleSendModal(false);
      resetSingleForm();
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to send ebook',
        variant: 'destructive',
      });
    },
  });

  const bulkSendMutation = useMutation({
    mutationFn: ebookApi.bulkSendEbook,
    onSuccess: (data) => {
      toast({
        title: '✅ Bulk Send Complete',
        description: `Sent to ${data.data.totalSent} emails. ${data.data.totalFailed} failed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setShowBulkSendModal(false);
      resetBulkForm();
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to send bulk emails',
        variant: 'destructive',
      });
    },
  });

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const blob = await ebookApi.exportDownloadsCSV({
        type: filterType === 'all' ? undefined : parseInt(filterType),
        ebookId: filterEbook || undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ebook-downloads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: '✅ Success',
        description: 'CSV exported successfully',
      });
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to export CSV',
        variant: 'destructive',
      });
    }
  };

  const resetSingleForm = () => {
    setSingleEmail('');
    setSingleName('');
    setSelectedEbookId('');
  };

  const resetBulkForm = () => {
    setBulkEmails('');
    setSelectedEbookId('');
  };

  const handleSingleSend = () => {
    if (!singleEmail || !selectedEbookId) {
      toast({
        title: '❌ Error',
        description: 'Email and ebook are required',
        variant: 'destructive',
      });
      return;
    }

    singleSendMutation.mutate({
      email: singleEmail,
      name: singleName,
      ebookId: selectedEbookId,
    });
  };

  const handleBulkSend = () => {
    const emails = bulkEmails
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e && e.includes('@'));

    if (emails.length === 0 || !selectedEbookId) {
      toast({
        title: '❌ Error',
        description: 'Valid emails and ebook are required',
        variant: 'destructive',
      });
      return;
    }

    bulkSendMutation.mutate({
      emails,
      ebookId: selectedEbookId,
    });
  };

  const validBulkEmailCount = bulkEmails
    .split('\n')
    .filter((e) => e.trim() && e.includes('@')).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📧 Ebook Email Manager</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.data.totalDownloads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All email interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statsData?.data.userDownloads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Organic downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Sends</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statsData?.data.adminSends || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Manually sent by admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statsData?.data.uniqueUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique email addresses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setShowSingleSendModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send to Single Email
        </Button>
        <Button
          onClick={() => setShowBulkSendModal(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700"
        >
          <Send className="w-4 h-4 mr-2" />
          Bulk Send
        </Button>
        <Button onClick={handleExportCSV} variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>View and filter all email interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Search Email/Name</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="1">User Downloads</SelectItem>
                  <SelectItem value="2">Admin Sends</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filter by Ebook</Label>
              <Select value={filterEbook || 'all'} onValueChange={(value) => setFilterEbook(value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Ebooks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ebooks</SelectItem>
                  {ebooksData?.data.map((ebook) => (
                    <SelectItem key={ebook._id} value={ebook._id}>
                      {ebook.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email History Table */}
      {isLoadingDownloads ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ebook</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloadsData?.data.map((download) => (
                  <TableRow key={download._id}>
                    <TableCell>{download.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {download.email}
                    </TableCell>
                    <TableCell>{download.ebookName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={download.type === 1 ? 'default' : 'secondary'}
                      >
                        {download.type === 1 ? '👤 User' : '🔧 Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(download.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {downloadsData && downloadsData.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span>
                Page {page} of {downloadsData.pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page === downloadsData.pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Single Send Modal */}
      <Dialog open={showSingleSendModal} onOpenChange={setShowSingleSendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📧 Send Ebook to Single Email</DialogTitle>
            <DialogDescription>
              Enter email details to send an ebook instantly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="single-email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="single-email"
                type="email"
                placeholder="user@example.com"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="single-name">Name (Optional)</Label>
              <Input
                id="single-name"
                placeholder="User Name"
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="single-ebook">
                Select Ebook <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedEbookId} onValueChange={setSelectedEbookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an ebook" />
                </SelectTrigger>
                <SelectContent>
                  {ebooksData?.data
                    .filter((e) => e.status === 1)
                    .map((ebook) => (
                      <SelectItem key={ebook._id} value={ebook._id}>
                        {ebook.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSingleSendModal(false);
                resetSingleForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSingleSend}
              disabled={singleSendMutation.isPending}
            >
              {singleSendMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Ebook
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Send Modal */}
      <Dialog open={showBulkSendModal} onOpenChange={setShowBulkSendModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>📨 Bulk Send Ebook</DialogTitle>
            <DialogDescription>
              Send ebook to multiple emails at once (one email per line)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bulk-emails">
                Email Addresses (one per line) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bulk-emails"
                placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              {validBulkEmailCount > 0 && (
                <Badge className="mt-2" variant="secondary">
                  {validBulkEmailCount} valid email{validBulkEmailCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            <div>
              <Label htmlFor="bulk-ebook">
                Select Ebook <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedEbookId} onValueChange={setSelectedEbookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an ebook" />
                </SelectTrigger>
                <SelectContent>
                  {ebooksData?.data
                    .filter((e) => e.status === 1)
                    .map((ebook) => (
                      <SelectItem key={ebook._id} value={ebook._id}>
                        {ebook.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkSendModal(false);
                resetBulkForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkSend}
              disabled={bulkSendMutation.isPending || validBulkEmailCount === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {bulkSendMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send to {validBulkEmailCount} Email{validBulkEmailCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



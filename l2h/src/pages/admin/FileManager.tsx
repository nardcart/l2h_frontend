import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Image as ImageIcon,
  Video,
  File,
  Trash2,
  Search,
  FolderOpen,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api';
import { format } from 'date-fns';

interface FileItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [search, folderFilter, files]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.get<{ blobs: FileItem[]; cursor?: string; hasMore: boolean }>(
        API_ENDPOINTS.FILES,
        true
      );
      setFiles(data.blobs || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load files',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterFiles = () => {
    let filtered = files;

    // Filter by folder
    if (folderFilter !== 'all') {
      filtered = filtered.filter((file) => file.pathname.startsWith(folderFilter));
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter((file) =>
        file.pathname.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  };

  const handleDelete = async () => {
    if (!deleteUrl) return;

    try {
      await apiService.delete(`${API_ENDPOINTS.FILES}`, true);
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      fetchFiles();
      setSelectedFiles((prev) => {
        const next = new Set(prev);
        next.delete(deleteUrl);
        return next;
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setDeleteUrl(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;

    if (!confirm(`Delete ${selectedFiles.size} files?`)) return;

    try {
      await apiService.post(
        API_ENDPOINTS.FILES_BULK_DELETE,
        { urls: Array.from(selectedFiles) },
        true
      );
      toast({
        title: 'Success',
        description: `Deleted ${selectedFiles.size} files`,
      });
      fetchFiles();
      setSelectedFiles(new Set());
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete files',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast({
      title: 'Copied!',
      description: 'URL copied to clipboard',
    });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (pathname: string) => {
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (pathname.match(/\.(mp4|webm|ogg)$/i)) {
      return <Video className="w-5 h-5 text-purple-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const folders = [...new Set(files.map((f) => f.pathname.split('/')[0]))];

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const selectedSize = Array.from(selectedFiles).reduce((acc, url) => {
    const file = files.find((f) => f.url === url);
    return acc + (file?.size || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your uploaded files and media
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {files.length} files ({formatFileSize(totalSize)})
          </Badge>
          {selectedFiles.size > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete {selectedFiles.size} files
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={folderFilter} onValueChange={setFolderFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Folders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchFiles}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search || folderFilter !== 'all' ? 'No files found' : 'No files uploaded'}
            </h3>
            <p className="text-gray-600">
              {search || folderFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Upload files through blog posts or the editor'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => (
            <Card
              key={file.url}
              className={`overflow-hidden hover:shadow-md transition-shadow ${
                selectedFiles.has(file.url) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div
                className="relative aspect-video bg-gray-100 cursor-pointer"
                onClick={() => {
                  const next = new Set(selectedFiles);
                  if (next.has(file.url)) {
                    next.delete(file.url);
                  } else {
                    next.add(file.url);
                  }
                  setSelectedFiles(next);
                }}
              >
                {file.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={file.url}
                    alt={file.pathname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {getFileIcon(file.pathname)}
                  </div>
                )}
                {selectedFiles.has(file.url) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium truncate mb-2" title={file.pathname}>
                  {file.pathname.split('/').pop()}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{formatFileSize(file.size)}</span>
                  <span>
                    {file.uploadedAt 
                      ? format(new Date(file.uploadedAt), 'MMM dd, yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyToClipboard(file.url)}
                  >
                    {copiedUrl === file.url ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteUrl(file.url)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUrl} onOpenChange={() => setDeleteUrl(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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


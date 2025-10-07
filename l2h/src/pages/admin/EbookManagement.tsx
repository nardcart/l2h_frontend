import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ebookApi } from '@/api/ebookApi';
import type { Ebook } from '@/types/ebook';
import { API_BASE_URL } from '@/config/api';
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
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Loader2, Eye, Download, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker - use local worker file for Vite compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function EbookManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [extractingMetadata, setExtractingMetadata] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [emailsForEbook, setEmailsForEbook] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    brochure: '',
    category: '',
    tags: '',
    author: '',
    publishYear: '',
    bookLanguage: 'English',
    pageCount: '',
    status: 1,
    featured: false,
  });

  const { data: ebooksData, isLoading } = useQuery({
    queryKey: ['admin-ebooks', page, search],
    queryFn: () => ebookApi.getAllEbooksAdmin({ page, limit: 20, search }),
  });

  const createMutation = useMutation({
    mutationFn: ebookApi.createEbook,
    onSuccess: () => {
      toast({ title: '✅ Success', description: 'Ebook created successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
      setShowCreateModal(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to create ebook',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ebook> }) =>
      ebookApi.updateEbook(id, data),
    onSuccess: () => {
      toast({ title: '✅ Success', description: 'Ebook updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
      setShowEditModal(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to update ebook',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ebookApi.deleteEbook,
    onSuccess: () => {
      toast({ title: '✅ Success', description: 'Ebook deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin-ebooks'] });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.response?.data?.message || 'Failed to delete ebook',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      brochure: '',
      category: '',
      tags: '',
      author: '',
      publishYear: '',
      bookLanguage: 'English',
      pageCount: '',
      status: 1,
      featured: false,
    });
    setSelectedEbook(null);
    setImageFile(null);
    setPdfFile(null);
  };

  // Extract PDF metadata
  const extractPdfMetadata = async (file: File) => {
    setExtractingMetadata(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const metadata = await pdf.getMetadata();
      
      // Extract metadata
      const info = metadata.info;
      const pageCount = pdf.numPages;
      
      // Auto-fill form fields
      const updates: any = {
        pageCount: pageCount.toString(),
      };
      
      // Extract title/name
      if (info?.Title && info.Title.trim()) {
        updates.name = info.Title.trim();
      } else {
        // Use filename without extension as fallback
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        updates.name = fileName;
      }
      
      // Extract author
      if (info?.Author && info.Author.trim()) {
        updates.author = info.Author.trim();
      }
      
      // Extract language
      if (info?.Language && info.Language.trim()) {
        const lang = info.Language.toLowerCase();
        if (lang.includes('en') || lang.includes('english')) {
          updates.bookLanguage = 'English';
        } else if (lang.includes('hi') || lang.includes('hindi')) {
          updates.bookLanguage = 'Hindi';
        } else {
          updates.bookLanguage = 'Other';
        }
      }
      
      // Extract publish year from CreationDate or ModDate
      if (info?.CreationDate) {
        const yearMatch = info.CreationDate.match(/D:(\d{4})/);
        if (yearMatch) {
          updates.publishYear = yearMatch[1];
        }
      }
      
      // Extract keywords as tags
      if (info?.Keywords && info.Keywords.trim()) {
        updates.tags = info.Keywords.trim();
      }
      
      // Update form data
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
      
      toast({
        title: '✅ Metadata Extracted',
        description: `Extracted ${Object.keys(updates).length} fields from PDF`,
      });
    } catch (error: any) {
      console.error('Error extracting PDF metadata:', error);
      toast({
        title: '⚠️ Warning',
        description: 'Could not extract all metadata from PDF',
        variant: 'destructive',
      });
    } finally {
      setExtractingMetadata(false);
    }
  };

  // Upload image file
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/ebooks/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast({ title: '✅ Success', description: 'Image uploaded successfully' });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload PDF file
  const handlePdfUpload = async (file: File) => {
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/ebooks/upload/pdf`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        setFormData((prev) => ({ ...prev, brochure: data.data.url }));
        toast({ title: '✅ Success', description: 'PDF uploaded successfully' });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message || 'Failed to upload PDF',
        variant: 'destructive',
      });
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCreate = () => {
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
      status: formData.status as 0 | 1,
    };
    createMutation.mutate(payload);
  };

  const handleEdit = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setFormData({
      name: ebook.name,
      description: ebook.description || '',
      image: ebook.image,
      brochure: ebook.brochure,
      category: ebook.category || '',
      tags: ebook.tags.join(', '),
      author: ebook.author || '',
      publishYear: ebook.publishYear?.toString() || '',
      bookLanguage: ebook.bookLanguage || 'English',
      pageCount: ebook.pageCount?.toString() || '',
      status: ebook.status,
      featured: ebook.featured,
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!selectedEbook) return;
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : undefined,
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
      status: formData.status as 0 | 1,
    };
    updateMutation.mutate({ id: selectedEbook._id, data: payload });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this ebook?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewEmails = async (ebookId: string, ebookName: string) => {
    try {
      const response = await ebookApi.getAllDownloads({ ebookId, limit: 1000 });
      setEmailsForEbook(response.data);
      setSelectedEbook({ _id: ebookId, name: ebookName } as Ebook);
      setShowEmailsModal(true);
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Failed to fetch emails',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ebook Management</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Ebook
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search ebooks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isLoading ? (
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
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Emails</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ebooksData?.data.map((ebook) => (
                  <TableRow key={ebook._id}>
                    <TableCell className="font-medium">{ebook.name}</TableCell>
                    <TableCell>{ebook.category || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={ebook.status === 1 ? 'default' : 'secondary'}>
                        {ebook.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {ebook.downloadCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ebook.viewCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmails(ebook._id, ebook.name)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        View Emails
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ebook)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(ebook._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {ebooksData && ebooksData.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span>
                Page {page} of {ebooksData.pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page === ebooksData.pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={() => {
        setShowCreateModal(false);
        setShowEditModal(false);
        resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showCreateModal ? 'Create New Ebook' : 'Edit Ebook'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {showCreateModal ? 'create' : 'update'} the ebook
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ebook name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ebook description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="image">Cover Image *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="image-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        handleImageUpload(file);
                      }
                    }}
                    disabled={uploadingImage}
                    className="flex-1"
                  />
                  {uploadingImage && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or enter image URL manually"
                />
                {formData.image && (
                  <div className="text-xs text-green-600">✅ Image URL set</div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="brochure">PDF File *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="pdf-file"
                    type="file"
                    accept="application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPdfFile(file);
                        // Extract metadata first
                        await extractPdfMetadata(file);
                        // Then upload the file
                        handlePdfUpload(file);
                      }
                    }}
                    disabled={uploadingPdf || extractingMetadata}
                    className="flex-1"
                  />
                  {(uploadingPdf || extractingMetadata) && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                </div>
                {extractingMetadata && (
                  <div className="text-xs text-blue-600">🔍 Extracting metadata...</div>
                )}
                <Input
                  id="brochure"
                  value={formData.brochure}
                  onChange={(e) => setFormData({ ...formData, brochure: e.target.value })}
                  placeholder="Or enter PDF URL manually"
                />
                {formData.brochure && (
                  <div className="text-xs text-green-600">✅ PDF URL set</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Technology"
                />
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="publishYear">Publish Year</Label>
                <Input
                  id="publishYear"
                  type="number"
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                  placeholder="2024"
                />
              </div>

              <div>
                <Label htmlFor="pageCount">Page Count</Label>
                <Input
                  id="pageCount"
                  type="number"
                  value={formData.pageCount}
                  onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                  placeholder="100"
                />
              </div>

              <div>
                <Label htmlFor="bookLanguage">Language</Label>
                <Select
                  value={formData.bookLanguage}
                  onValueChange={(value) => setFormData({ ...formData, bookLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status.toString()}
                  onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) as 0 | 1 })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="featured">Featured Ebook</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={showCreateModal ? handleCreate : handleUpdate}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {showCreateModal ? 'Create' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emails Modal */}
      <Dialog open={showEmailsModal} onOpenChange={setShowEmailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📧 Emails for: {selectedEbook?.name}</DialogTitle>
            <DialogDescription>
              All users who downloaded this ebook ({emailsForEbook.length} total)
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {emailsForEbook.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No downloads yet for this ebook.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailsForEbook.map((download, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{download.name}</TableCell>
                        <TableCell className="font-mono text-sm">{download.email}</TableCell>
                        <TableCell>{download.mobile || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={download.type === 1 ? 'default' : 'secondary'}>
                            {download.type === 1 ? '👤 User' : '🔧 Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(download.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailsModal(false)}>
              Close
            </Button>
            <Button
              onClick={() => navigate('/admin/ebooks/emails')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Go to Email Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



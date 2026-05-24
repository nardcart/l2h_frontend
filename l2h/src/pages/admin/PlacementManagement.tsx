import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/hooks/use-toast';
import { companyService } from '@/services/company.service';
import type {
  CompanyApprovalStatus,
  CompanyRecord,
  CompanyUpdatePayload,
} from '@/types/company';
import { DEFAULT_COMPANY_FORM } from '@/types/company';

type StatusFilter = 'all' | CompanyApprovalStatus;

const getStatusBadge = (status: CompanyApprovalStatus) => {
  if (status === 'accepted') {
    return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100';
  }

  if (status === 'denied') {
    return 'bg-red-100 text-red-800 hover:bg-red-100';
  }

  return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
};

const getStatusLabel = (status: CompanyApprovalStatus) => {
  if (status === 'accepted') {
    return 'Accepted';
  }

  if (status === 'denied') {
    return 'Denied';
  }

  return 'Pending';
};

export default function PlacementManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(null);
  const [formData, setFormData] = useState<CompanyUpdatePayload>({
    ...DEFAULT_COMPANY_FORM,
  });

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['admin-companies', statusFilter],
    queryFn: () =>
      companyService.listAdmin(statusFilter === 'all' ? undefined : statusFilter),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CompanyUpdatePayload }) =>
      companyService.update(id, payload),
    onSuccess: () => {
      toast({
        title: 'Company updated',
        description: 'Placement company details were updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      queryClient.invalidateQueries({ queryKey: ['public-companies'] });
      setIsEditOpen(false);
      setSelectedCompany(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update placement company.',
        variant: 'destructive',
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: CompanyApprovalStatus;
    }) => companyService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      toast({
        title: 'Status updated',
        description:
          variables.status === 'accepted'
            ? 'Company accepted and now visible publicly.'
            : variables.status === 'denied'
              ? 'Company denied and hidden from public listing.'
              : 'Company moved back to pending review.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      queryClient.invalidateQueries({ queryKey: ['public-companies'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Status update failed',
        description: error.message || 'Failed to update company status.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => companyService.delete(id),
    onSuccess: () => {
      toast({
        title: 'Company deleted',
        description: 'Placement company record was deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      queryClient.invalidateQueries({ queryKey: ['public-companies'] });
      setIsDeleteOpen(false);
      setSelectedCompany(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete placement company.',
        variant: 'destructive',
      });
    },
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCompanies = companies.filter((company) => {
    if (!normalizedSearch) {
      return true;
    }

    return [
      company.company_name,
      company.email,
      company.unique_id,
      company.sector || '',
      company.city || '',
      company.contact_person_name,
    ].some((value) => value.toLowerCase().includes(normalizedSearch));
  });

  const totalCount = companies.length;
  const acceptedCount = companies.filter((company) => company.status === 'accepted').length;
  const pendingCount = companies.filter((company) => company.status === 'pending').length;
  const deniedCount = companies.filter((company) => company.status === 'denied').length;

  const openEditDialog = (company: CompanyRecord) => {
    setSelectedCompany(company);
    setFormData({
      company_name: company.company_name || '',
      company_website: company.company_website || '',
      established_year: company.established_year || '',
      no_of_employees: company.no_of_employees || '',
      sector: company.sector || '',
      business_entity_type: company.business_entity_type || '',
      category: company.category || '',
      organization_type: company.organization_type || '',
      company_logo_url: company.company_logo_url || '',
      company_logo_key: company.company_logo_key || '',
      contact_person_name: company.contact_person_name || '',
      contact_person_title: company.contact_person_title || '',
      phone_number: company.phone_number || '',
      address_line_1: company.address_line_1 || '',
      address_line_2: company.address_line_2 || '',
      landmark: company.landmark || '',
      area: company.area || '',
      zip_code: company.zip_code || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || 'India',
      email: company.email || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedCompany) {
      return;
    }

    updateMutation.mutate({
      id: selectedCompany.id,
      payload: {
        ...formData,
        established_year: formData.established_year
          ? Number(formData.established_year)
          : '',
      },
    });
  };

  const handleDelete = () => {
    if (!selectedCompany) {
      return;
    }

    deleteMutation.mutate(selectedCompany.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Placement Companies</h1>
          <p className="mt-1 text-muted-foreground">
            Review company registrations and control which companies appear on the public placement listing.
          </p>
        </div>
        <Button asChild className="bg-red-600 text-white hover:bg-red-700">
          <a href="/placement/company/registor" target="_blank" rel="noreferrer">
            Open Company Form
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Companies</CardDescription>
            <CardTitle className="text-3xl">{totalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-3xl">{acceptedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Denied</CardDescription>
            <CardTitle className="text-3xl">{deniedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company, email, ID, sector, city, or contact person..."
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value: StatusFilter) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Review Queue</CardTitle>
          <CardDescription>
            Only accepted companies are visible in the public placement API/page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No company registrations matched your filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell className="font-medium">#{company.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-slate-50">
                          {company.company_logo_url ? (
                            <img
                              src={company.company_logo_url}
                              alt={`${company.company_name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{company.company_name}</div>
                          <div className="text-sm text-muted-foreground">{company.email}</div>
                          <div className="text-xs text-slate-500">{company.unique_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{company.contact_person_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {company.phone_number || company.contact_person_title || 'Not shared'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{company.sector || 'Not selected'}</div>
                      <div className="text-sm text-muted-foreground">{company.category || ''}</div>
                    </TableCell>
                    <TableCell>
                      {[company.city, company.state].filter(Boolean).join(', ') || 'Not shared'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(company.status)}>
                        {getStatusLabel(company.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(company)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() =>
                            statusMutation.mutate({ id: company.id, status: 'accepted' })
                          }
                          disabled={statusMutation.isPending || company.status === 'accepted'}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() =>
                            statusMutation.mutate({ id: company.id, status: 'denied' })
                          }
                          disabled={statusMutation.isPending || company.status === 'denied'}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Deny
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="More actions">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                statusMutation.mutate({ id: company.id, status: 'pending' })
                              }
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Mark Pending
                            </DropdownMenuItem>
                            {company.company_website && (
                              <DropdownMenuItem asChild>
                                <a href={company.company_website} target="_blank" rel="noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Website
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedCompany(company);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setSelectedCompany(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Placement Company</DialogTitle>
            <DialogDescription>
              Update company details. Accept/deny visibility is managed from the table actions.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Generated Company ID</Label>
              <Input value={selectedCompany?.unique_id || ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label>Numeric Company ID</Label>
              <Input value={selectedCompany?.id ? `#${selectedCompany.id}` : ''} readOnly disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_website">Company Website</Label>
              <Input
                id="company_website"
                value={formData.company_website || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company_website: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established_year">Established Year</Label>
              <Input
                id="established_year"
                type="number"
                value={formData.established_year || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, established_year: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="no_of_employees">No. of Employees</Label>
              <Input
                id="no_of_employees"
                value={formData.no_of_employees || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, no_of_employees: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, sector: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_entity_type">Business Entity Type</Label>
              <Input
                id="business_entity_type"
                value={formData.business_entity_type || ''}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    business_entity_type: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, category: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization_type">Organization Type</Label>
              <Input
                id="organization_type"
                value={formData.organization_type || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, organization_type: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_logo_url">Company Logo URL</Label>
              <Input
                id="company_logo_url"
                value={formData.company_logo_url || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, company_logo_url: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_name">Contact Person</Label>
              <Input
                id="contact_person_name"
                value={formData.contact_person_name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, contact_person_name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person_title">Position/Title</Label>
              <Input
                id="contact_person_title"
                value={formData.contact_person_title || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, contact_person_title: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, phone_number: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address_line_1">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, address_line_1: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2 || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, address_line_2: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={formData.area || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, area: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={formData.landmark || ''}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, landmark: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, zip_code: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, city: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, state: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, country: event.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedCompany(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setSelectedCompany(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete company registration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              <strong>{selectedCompany?.company_name}</strong> from placement companies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { companyService } from '@/services/company.service';
import {
  DEFAULT_COMPANY_FORM,
  type CompanyRegistrationPayload,
  type CompanyRegistrationResponse,
} from '@/types/company';
import {
  CheckCircle2,
  ChevronLeft,
  Loader2,
  UploadCloud,
} from 'lucide-react';

const red = '#f73f46';
const MAX_LOGO_SIZE_MB = 10;
const MIN_ESTABLISHED_YEAR = 1000;
const MAX_ESTABLISHED_YEAR = new Date().getFullYear() + 1;

type CompanyRegistrationForm = CompanyRegistrationPayload & {
  confirm_password: string;
  declaration: boolean;
};

const defaultForm: CompanyRegistrationForm = {
  ...DEFAULT_COMPANY_FORM,
  confirm_password: '',
  declaration: false,
};

const employeeOptions = ['0-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const sectorOptions = [
  'Agriculture',
  'Education',
  'Healthcare',
  'Information Technology',
  'Manufacturing',
  'Retail',
  'Finance',
  'Hospitality',
  'Real Estate',
  'Other',
];
const businessEntityOptions = [
  'Private Limited',
  'Limited Liability Partnership',
  'Partnership',
  'Proprietorship',
  'Public Limited',
  'Trust',
  'Other',
];
const categoryOptions = ['Service based', 'Product based', 'Product and service', 'Non-profit', 'Other'];
const organizationOptions = ['MNC', 'Normal', 'Startup', 'MSME', 'Government'];

const steps = [
  {
    id: 1,
    title: 'Company Basic Information',
    description: "Please provide your company's basic details and information",
  },
  {
    id: 2,
    title: 'Company Contact Details',
    description: 'Please provide the main contact person details for your company',
  },
  {
    id: 3,
    title: 'Company Address',
    description: "Please provide your company's complete address details",
  },
  {
    id: 4,
    title: 'Account Setup',
    description: 'Create your login credentials for the portal',
  },
];

const fieldClass =
  'h-10 rounded-xl border-[#c7d4e7] bg-white px-4 text-sm text-slate-700 shadow-none placeholder:text-[#bcc9da] focus-visible:ring-1 focus-visible:ring-[#f73f46] focus-visible:ring-offset-0';
const labelClass = 'text-sm font-semibold text-[#92a0bd]';

const validateLogoFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Company logo must be a JPG, PNG, or WebP image.');
  }

  if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
    throw new Error(`Company logo must be ${MAX_LOGO_SIZE_MB}MB or smaller.`);
  }
};

const isValidEstablishedYear = (value: CompanyRegistrationForm['established_year']) => {
  if (!value) {
    return true;
  }

  const year = Number(value);
  return (
    Number.isInteger(year) &&
    year >= MIN_ESTABLISHED_YEAR &&
    year <= MAX_ESTABLISHED_YEAR
  );
};

export default function CompanyRegistration() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyRegistrationForm>(defaultForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState('');
  const [submittedCompany, setSubmittedCompany] = useState<CompanyRegistrationResponse | null>(null);

  const updateField = <K extends keyof CompanyRegistrationForm>(
    field: K,
    value: CompanyRegistrationForm[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const showValidationToast = (message: string) => {
    toast({
      title: 'Please check the form',
      description: message,
      variant: 'destructive',
    });
  };

  const validateStep = (step: number) => {
    if (step === 1 && !formData.company_name.trim()) {
      showValidationToast('Company name is required.');
      return false;
    }

    if (step === 1 && !isValidEstablishedYear(formData.established_year)) {
      showValidationToast(
        `Established year must be between ${MIN_ESTABLISHED_YEAR} and ${MAX_ESTABLISHED_YEAR}.`
      );
      return false;
    }

    if (step === 2 && !formData.contact_person_name.trim()) {
      showValidationToast('Full name of contact person is required.');
      return false;
    }

    if (step === 3) {
      if (!formData.address_line_1.trim()) {
        showValidationToast('Address line 1 is required.');
        return false;
      }

      if (!formData.zip_code.trim() || !formData.city.trim() || !formData.state.trim()) {
        showValidationToast('Zip code, city, and state are required.');
        return false;
      }
    }

    if (step === 4) {
      if (!formData.email.trim()) {
        showValidationToast('Email address is required.');
        return false;
      }

      if (formData.password.length < 6) {
        showValidationToast('Password must be at least 6 characters.');
        return false;
      }

      if (formData.password !== formData.confirm_password) {
        showValidationToast('Password and retype password do not match.');
        return false;
      }

      if (!formData.declaration) {
        showValidationToast('Please confirm the declaration before signing up.');
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length));
  };

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const createMutation = useMutation({
    mutationFn: async (): Promise<CompanyRegistrationResponse> => {
      let logoUrl = formData.company_logo_url?.trim() || '';
      let logoKey = formData.company_logo_key?.trim() || '';

      if (logoFile) {
        validateLogoFile(logoFile);
        const uploadedLogo = await companyService.uploadLogo(logoFile);
        logoUrl = uploadedLogo.url;
        logoKey = uploadedLogo.key;
      }

      const payload: CompanyRegistrationPayload = {
        company_name: formData.company_name.trim(),
        company_website: formData.company_website?.trim() || '',
        established_year: formData.established_year
          ? Number(formData.established_year)
          : '',
        no_of_employees: formData.no_of_employees || '',
        sector: formData.sector || '',
        business_entity_type: formData.business_entity_type || '',
        category: formData.category || '',
        organization_type: formData.organization_type || '',
        company_logo_url: logoUrl,
        company_logo_key: logoKey,
        contact_person_name: formData.contact_person_name.trim(),
        contact_person_title: formData.contact_person_title?.trim() || '',
        phone_number: formData.phone_number?.trim() || '',
        address_line_1: formData.address_line_1.trim(),
        address_line_2: formData.address_line_2?.trim() || '',
        landmark: formData.landmark?.trim() || '',
        area: formData.area?.trim() || '',
        zip_code: formData.zip_code.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || 'India',
        email: formData.email.trim(),
        password: formData.password,
      };

      return companyService.register(payload);
    },
    onSuccess: (data) => {
      setSubmittedCompany(data);
      setFormData(defaultForm);
      setLogoFile(null);
      setLogoFileName('');
      setCurrentStep(1);
      toast({
        title: 'Company registered',
        description: 'Your company profile is waiting for admin approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Unable to register company right now.',
        variant: 'destructive',
      });
    },
  });

  const handleLogoChange = (file: File | undefined) => {
    if (!file) {
      return;
    }

    try {
      validateLogoFile(file);
      setLogoFile(file);
      setLogoFileName(file.name);
    } catch (error: any) {
      showValidationToast(error.message || 'Invalid logo file.');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    createMutation.mutate();
  };

  if (submittedCompany) {
    return (
      <div className="min-h-screen bg-[#eef3f8] px-4 pb-16 pt-24">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200">
          <img
            src="/images/logo.png"
            alt="Red and White Skill Education"
            className="mx-auto h-auto w-56 object-contain"
          />
          <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-9 w-9 text-emerald-500" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Company registration submitted</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {submittedCompany.company.company_name} is now waiting for admin approval. It will show on the public
            company API only after the admin accepts it.
          </p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            Company ID: {submittedCompany.company.unique_id}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSubmittedCompany(null)}
            >
              Register another
            </Button>
            <Button asChild className="bg-[#f73f46] text-white hover:bg-[#e7333a]">
              <Link to="/">Go home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 pb-16 pt-24">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#f73f46]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to website
        </Link>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white px-6 py-8 shadow-xl shadow-slate-200 sm:px-9">
          <div className="text-center">
            <img
              src="/images/logo.png"
              alt="Red and White Skill Education"
              className="mx-auto h-auto w-56 object-contain"
            />
            <p className="mt-4 text-base text-slate-900">company registration</p>
          </div>

          <div className="relative mt-7 flex items-center justify-between px-1">
            <div className="absolute left-5 right-5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#e8edf4]" />
            <div
              className="absolute left-5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#f73f46] transition-all duration-300"
              style={{
                width: `calc((100% - 2.5rem) * ${(currentStep - 1) / (steps.length - 1)})`,
              }}
            />
            {steps.map((step) => (
              <div
                key={step.id}
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold shadow-lg transition-all ${
                  currentStep >= step.id
                    ? 'bg-[#f73f46] text-white shadow-red-100'
                    : 'bg-white text-slate-500 shadow-slate-200'
                }`}
              >
                {step.id}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h1 className="text-lg font-bold text-[#ef171d]">{steps[currentStep - 1].title}</h1>
            <p className="mt-1 text-sm leading-5 text-[#1f3351]">{steps[currentStep - 1].description}</p>
            <div className="mt-3 h-px w-full bg-[#dbe3ef]" />
          </div>

          {currentStep === 1 && (
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className={labelClass}>
                  Company Name
                </Label>
                <Input
                  id="company_name"
                  required
                  className={fieldClass}
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={(event) => updateField('company_name', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website" className={labelClass}>
                  Company Website
                </Label>
                <Input
                  id="company_website"
                  className={fieldClass}
                  placeholder="https://"
                  value={formData.company_website || ''}
                  onChange={(event) => updateField('company_website', event.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="established_year" className={labelClass}>
                    Established year
                  </Label>
                  <Input
                    id="established_year"
                    type="number"
                    min={MIN_ESTABLISHED_YEAR}
                    max={MAX_ESTABLISHED_YEAR}
                    className={fieldClass}
                    placeholder="2025"
                    value={formData.established_year}
                    onChange={(event) => updateField('established_year', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>No. of Employees</Label>
                  <Select
                    value={formData.no_of_employees || undefined}
                    onValueChange={(value) => updateField('no_of_employees', value)}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="No. of Employees" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Sector</Label>
                <Select
                  value={formData.sector || undefined}
                  onValueChange={(value) => updateField('sector', value)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="Search and select sector..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={labelClass}>Type of Business Entity</Label>
                  <Select
                    value={formData.business_entity_type || undefined}
                    onValueChange={(value) => updateField('business_entity_type', value)}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Type of Business Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessEntityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Category</Label>
                  <Select
                    value={formData.category || undefined}
                    onValueChange={(value) => updateField('category', value)}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Organization type</Label>
                <Select
                  value={formData.organization_type || undefined}
                  onValueChange={(value) => updateField('organization_type', value)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="MNC or Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_logo" className={labelClass}>
                  Company logo
                </Label>
                <label
                  htmlFor="company_logo"
                  className="flex h-10 cursor-pointer items-center overflow-hidden rounded-xl border border-[#c7d4e7] bg-white text-sm text-slate-700"
                >
                  <span className="flex h-full items-center border-r border-[#c7d4e7] px-4 text-xs text-slate-500">
                    Choose
                  </span>
                  <span className="min-w-0 flex-1 truncate px-3">
                    {logoFileName || 'No file chosen'}
                  </span>
                  <UploadCloud className="mr-3 h-4 w-4 shrink-0 text-slate-400" />
                </label>
                <input
                  id="company_logo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => handleLogoChange(event.target.files?.[0])}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="contact_person_name" className={labelClass}>
                  Full Name of Contact Person
                </Label>
                <Input
                  id="contact_person_name"
                  required
                  className={fieldClass}
                  placeholder="Full Name of Contact Person"
                  value={formData.contact_person_name}
                  onChange={(event) => updateField('contact_person_name', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person_title" className={labelClass}>
                  Position/Title
                </Label>
                <Input
                  id="contact_person_title"
                  className={fieldClass}
                  placeholder="Position/Title"
                  value={formData.contact_person_title || ''}
                  onChange={(event) => updateField('contact_person_title', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number" className={labelClass}>
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  className={fieldClass}
                  placeholder="Phone Number"
                  value={formData.phone_number || ''}
                  onChange={(event) => updateField('phone_number', event.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_line_1" className={labelClass}>
                  Address Line 1
                </Label>
                <Input
                  id="address_line_1"
                  required
                  className={fieldClass}
                  placeholder="Start typing your address..."
                  value={formData.address_line_1}
                  onChange={(event) => updateField('address_line_1', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line_2" className={labelClass}>
                  Address Line 2 (optional)
                </Label>
                <Input
                  id="address_line_2"
                  className={fieldClass}
                  placeholder="Start typing additional address details..."
                  value={formData.address_line_2 || ''}
                  onChange={(event) => updateField('address_line_2', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark" className={labelClass}>
                  Landmark (Optional)
                </Label>
                <Input
                  id="landmark"
                  className={fieldClass}
                  placeholder="Enter a landmark"
                  value={formData.landmark || ''}
                  onChange={(event) => updateField('landmark', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area" className={labelClass}>
                  Area
                </Label>
                <Input
                  id="area"
                  className={fieldClass}
                  placeholder="Enter area (e.g., Andheri, Koramangala, Bandra)"
                  value={formData.area || ''}
                  onChange={(event) => updateField('area', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip_code" className={labelClass}>
                    Zip code
                  </Label>
                  <Input
                    id="zip_code"
                    required
                    className={fieldClass}
                    placeholder="Zip code"
                    value={formData.zip_code}
                    onChange={(event) => updateField('zip_code', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className={labelClass}>
                    City
                  </Label>
                  <Input
                    id="city"
                    required
                    className={fieldClass}
                    placeholder="City"
                    value={formData.city}
                    onChange={(event) => updateField('city', event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className={labelClass}>
                    state
                  </Label>
                  <Input
                    id="state"
                    required
                    className={fieldClass}
                    placeholder="state"
                    value={formData.state}
                    onChange={(event) => updateField('state', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className={labelClass}>
                    country
                  </Label>
                  <Input
                    id="country"
                    required
                    className={fieldClass}
                    placeholder="india"
                    value={formData.country}
                    onChange={(event) => updateField('country', event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClass}>
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className={fieldClass}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={labelClass}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className={fieldClass}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password" className={labelClass}>
                  Retype Password
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  required
                  className={fieldClass}
                  placeholder="Retype Password"
                  value={formData.confirm_password}
                  onChange={(event) => updateField('confirm_password', event.target.value)}
                />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="declaration"
                  checked={formData.declaration}
                  onCheckedChange={(checked) => updateField('declaration', checked === true)}
                  className="mt-1 border-[#8ca0c0] data-[state=checked]:border-[#f73f46] data-[state=checked]:bg-[#f73f46]"
                />
                <Label htmlFor="declaration" className="text-sm leading-6 text-[#8593b0]">
                  I hereby declare that all the details mentioned above are correct and true to the best of my
                  knowledge. <span className="font-bold text-[#f73f46]">(Read Terms & Conditions)</span>
                </Label>
              </div>
            </div>
          )}

          <div className={`mt-8 grid gap-2 ${currentStep === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={goPrevious}
                className="h-11 rounded bg-[#f73f46] text-white hover:bg-[#e7333a]"
                disabled={createMutation.isPending}
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={goNext}
                className="h-11 rounded bg-[#f73f46] text-white hover:bg-[#e7333a]"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="h-11 rounded bg-[#f73f46] text-white hover:bg-[#e7333a]"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign up
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

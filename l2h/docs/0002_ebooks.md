# Complete Ebook Management System

**Document ID:** 0002  
**Created:** October 7, 2025  
**Version:** 1.0.0  
**Tech Stack:** React 18.3.1 + TypeScript + Vite + Node.js + MongoDB

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Admin Dashboard](#admin-dashboard)
8. [User Flow & Features](#user-flow--features)
9. [API Documentation](#api-documentation)
10. [Style Guide](#style-guide)
11. [Component Specifications](#component-specifications)
12. [Deployment Guide](#deployment-guide)

---

## Overview

The Ebook Management System is a comprehensive digital library platform that allows administrators to manage, publish, and distribute ebooks while tracking user downloads and engagement. The system features a modern, animated frontend with OTP-verified downloads, lead capture, and CRM integration.

### Key Features

- 📚 **Ebook Library** - Display and manage digital ebooks
- 🎨 **Animated UI** - Beautiful gradient background with animated circles
- ⚡ **Instant Download** - Simple email collection, no OTP needed
- 📊 **Download Tracking** - Track user downloads and engagement
- 🎯 **Lead Capture** - Collect user information for marketing
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔍 **Search & Filter** - Easy ebook discovery
- 🏷️ **Categorization** - Organize ebooks by category/topic
- 📧 **Email Integration** - Instant PDF delivery to email
- 🔄 **CRM Integration** - Sync leads to external CRM systems
- 👨‍💼 **Admin Email Manager** - Send PDFs to single or multiple emails
- 📈 **Email Count Tracking** - Track total emails and sends

---

## Tech Stack

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom CSS
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod
- **Router:** React Router v6
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui

### Backend
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB 6+ with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** AWS S3 or Local Storage
- **Email:** Nodemailer
- **OTP:** Custom OTP generation
- **Validation:** Zod

### DevOps
- **Containerization:** Docker + Docker Compose
- **Cloud Storage:** AWS S3
- **Email Service:** SMTP (Gmail/SendGrid)
- **Hosting:** Vercel (Frontend) + Railway/Render (Backend)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   EBOOK MANAGEMENT SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │────────▶│   Backend    │                 │
│  │  React + TS  │  API    │  Express.js  │                 │
│  └──────┬───────┘         └──────┬───────┘                 │
│         │                         │                          │
│         │                         ▼                          │
│         │                 ┌──────────────┐                  │
│         │                 │   MongoDB    │                  │
│         │                 └──────────────┘                  │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────┐                  │
│  │          User Experience              │                  │
│  │  - Ebook Listing                      │                  │
│  │  - Download Modal                     │                  │
│  │  - OTP Verification                   │                  │
│  │  - Email Delivery                     │                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │        Admin Dashboard                │                  │
│  │  - Create Ebook                       │                  │
│  │  - Upload Files                       │                  │
│  │  - Manage Categories                  │                  │
│  │  - Track Downloads                    │                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
│  ┌──────────────────────────────────────┐                  │
│  │      External Integrations            │                  │
│  │  - AWS S3 (File Storage)              │                  │
│  │  - SMTP (Email)                       │                  │
│  │  - CRM (Lead Sync)                    │                  │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### User Flow Diagram

```
User visits /ebook
       │
       ▼
┌──────────────────┐
│  Ebook Gallery   │
│  (Animated BG)   │
└────────┬─────────┘
         │ Clicks "Download Now"
         ▼
┌──────────────────┐
│  Download Modal  │
│  (Simple Form)   │
│  - Name          │
│  - Email         │
│  - Mobile        │
└────────┬─────────┘
         │ Submit
         ▼
┌──────────────────┐
│  Send PDF Link   │
│  to Email        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Thank You Page  │
│  + Download Link │
│  + Email Sent    │
└──────────────────┘
```

### Admin Flow Diagram

```
Admin Dashboard
       │
       ▼
┌──────────────────┐
│  View Downloads  │
│  Statistics      │
└────────┬─────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│ Single Email     │  │ Bulk Email       │
│ Send             │  │ Send             │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         │ Enter Email        │ Paste Multiple
         │ Select Ebook       │ Emails (one per line)
         │                    │ Select Ebook
         ▼                    ▼
┌──────────────────┐  ┌──────────────────┐
│ Send PDF         │  │ Send to All      │
│ Instantly        │  │ Emails           │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
         ┌──────────────────┐
         │ Track in         │
         │ Download History │
         │ Count: X emails  │
         └──────────────────┘
```

---

## Database Design

### MongoDB Collections

#### 1. Ebooks Collection

```typescript
interface IEbook extends Document {
  name: string;              // Ebook title
  slug: string;              // URL-friendly slug
  description?: string;      // Ebook description
  image: string;             // Cover image URL/path
  brochure: string;          // PDF file URL/path
  category?: string;         // Category name
  categoryId?: Types.ObjectId; // Category reference
  tags: string[];            // Tags for search
  fileSize?: number;         // File size in bytes
  pageCount?: number;        // Number of pages
  author?: string;           // Author name
  publishYear?: number;      // Publication year
  language?: string;         // Language (English, Hindi, etc.)
  status: 0 | 1;            // 0=inactive, 1=active
  position: number;          // Display order
  downloadCount: number;     // Total downloads
  viewCount: number;         // Total views
  featured: boolean;         // Featured ebook
  createdAt: Date;
  updatedAt: Date;
}

const ebookSchema = new Schema<IEbook>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    image: {
      type: String,
      required: true,
    },
    brochure: {
      type: String,
      required: true,
    },
    category: String,
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'EbookCategory',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    fileSize: Number,
    pageCount: Number,
    author: String,
    publishYear: Number,
    language: {
      type: String,
      default: 'English',
    },
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
      index: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
ebookSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IEbook>('Ebook', ebookSchema);
```

#### 2. EbookUser Collection (Download Tracking)

```typescript
interface IEbookUser extends Document {
  name: string;
  email: string;
  mobile: string;
  countryCode: string;
  stateId?: number;
  cityId?: number;
  ebookName: string;
  ebookId: Types.ObjectId;
  productId?: number;        // For courses/products
  type?: number;             // 1=ebook, 2=course brochure
  typeDescription?: string;  // 'brochure', 'sc_scheme', etc.
  hearAbout?: string;        // How they found us
  ipAddress?: string;        // User IP
  userAgent?: string;        // Browser info
  downloadedAt: Date;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ebookUserSchema = new Schema<IEbookUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    stateId: Number,
    cityId: Number,
    ebookName: {
      type: String,
      required: true,
    },
    ebookId: {
      type: Schema.Types.ObjectId,
      ref: 'Ebook',
      required: true,
      index: true,
    },
    productId: Number,
    type: {
      type: Number,
      default: 1,
    },
    typeDescription: String,
    hearAbout: String,
    ipAddress: String,
    userAgent: String,
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for analytics
ebookUserSchema.index({ ebookId: 1, createdAt: -1 });
ebookUserSchema.index({ email: 1, ebookId: 1 });

export default mongoose.model<IEbookUser>('EbookUser', ebookUserSchema);
```

#### 3. EbookCategory Collection

```typescript
interface IEbookCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 0 | 1;
  position: number;
  ebookCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ebookCategorySchema = new Schema<IEbookCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: String,
    image: String,
    status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    position: {
      type: Number,
      default: 0,
    },
    ebookCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEbookCategory>('EbookCategory', ebookCategorySchema);
```

#### 4. Email Send Log Collection (Optional - for tracking admin sends)

```typescript
interface IEmailLog extends Document {
  email: string;
  ebookId: Types.ObjectId;
  ebookName: string;
  sentBy: 'user' | 'admin';
  sentByUserId?: Types.ObjectId;
  status: 'sent' | 'failed' | 'bounced';
  errorMessage?: string;
  createdAt: Date;
}

const emailLogSchema = new Schema<IEmailLog>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    ebookId: {
      type: Schema.Types.ObjectId,
      ref: 'Ebook',
      required: true,
    },
    ebookName: String,
    sentBy: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    sentByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'bounced'],
      default: 'sent',
    },
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmailLog>('EmailLog', emailLogSchema);
```

---

## Backend Implementation

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── email.ts
│   │   └── s3.ts
│   ├── models/
│   │   ├── Ebook.ts
│   │   ├── EbookUser.ts
│   │   ├── EbookCategory.ts
│   │   └── OTP.ts
│   ├── controllers/
│   │   ├── ebookController.ts
│   │   ├── ebookAdminController.ts
│   │   └── ebookCategoryController.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── ebook.ts
│   │   ├── ebookAdmin.ts
│   │   └── ebookCategory.ts
│   ├── utils/
│   │   ├── emailService.ts
│   │   ├── otpService.ts
│   │   ├── s3Service.ts
│   │   └── crmService.ts
│   ├── app.ts
│   └── server.ts
├── uploads/
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Controller Implementation

**Ebook Controller** (`src/controllers/ebookController.ts`):

```typescript
import { Request, Response } from 'express';
import Ebook from '../models/Ebook';
import EbookUser from '../models/EbookUser';
import OTP from '../models/OTP';
import { sendOTPEmail } from '../utils/emailService';
import { generateOTP } from '../utils/otpService';
import { sendToCRM } from '../utils/crmService';

// Get all active ebooks (Public)
export const getEbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query: any = { status: 1 };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const ebooks = await Ebook.find(query)
      .sort({ position: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    const total = await Ebook.countDocuments(query);

    res.json({
      status: true,
      data: ebooks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch ebooks',
      error: error.message,
    });
  }
};

// Get single ebook by ID or slug (Public)
export const getEbookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ebook = await Ebook.findOne({
      $or: [{ _id: id }, { slug: id }],
      status: 1,
    });

    if (!ebook) {
      res.status(404).json({
        status: false,
        message: 'Ebook not found',
      });
      return;
    }

    // Increment view count
    ebook.viewCount += 1;
    await ebook.save();

    res.json({
      status: true,
      data: ebook,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch ebook',
      error: error.message,
    });
  }
};

// Request and Send Ebook Download (No OTP - Direct)
export const downloadEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      mobile,
      countryCode = '+91',
      ebookId,
      stateId,
      cityId,
      hearAbout,
    } = req.body;

    // Validate ebook exists
    const ebook = await Ebook.findById(ebookId);
    if (!ebook || ebook.status !== 1) {
      res.status(404).json({
        status: false,
        message: 'Ebook not found',
      });
      return;
    }

    // Get user IP and user agent
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save download record
    await EbookUser.create({
      name,
      email,
      mobile,
      countryCode,
      stateId,
      cityId,
      ebookName: ebook.name,
      ebookId: ebook._id,
      hearAbout,
      ipAddress,
      userAgent,
      emailSent: true,
      type: 1, // User download
      typeDescription: 'user-direct-download',
    });

    // Increment download count
    ebook.downloadCount += 1;
    await ebook.save();

    // Construct download URL
    const downloadUrl = ebook.brochure.startsWith('http')
      ? ebook.brochure
      : `${process.env.S3_URL}/ebook/${ebook.brochure}`;

    // Send download email
    try {
      await sendDownloadEmail(email, name, ebook.name, downloadUrl);
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Continue even if email fails
    }

    // Send to CRM (optional)
    try {
      await sendToCRM({
        name,
        email,
        mobile,
        countryCode,
        stateId,
        cityId,
        leadSource: 'Ebook Download',
        ebookName: ebook.name,
      });
    } catch (crmError) {
      console.error('CRM sync failed:', crmError);
      // Don't fail the request if CRM fails
    }

    res.json({
      status: true,
      message: 'Ebook sent to your email successfully!',
      data: {
        downloadUrl,
        ebookName: ebook.name,
        fileName: ebook.brochure,
        email,
      },
    });
  } catch (error) {
    console.error('Error downloading ebook:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to send ebook',
      error: error.message,
    });
  }
};

// Get popular ebooks
export const getPopularEbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 6;

    const ebooks = await Ebook.find({ status: 1 })
      .sort({ downloadCount: -1 })
      .limit(limit)
      .select('-__v');

    res.json({
      status: true,
      data: ebooks,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch popular ebooks',
      error: error.message,
    });
  }
};
```

### Routes

**Ebook Routes** (`src/routes/ebook.ts`):

```typescript
import express from 'express';
import * as ebookController from '../controllers/ebookController';

const router = express.Router();

// Public routes
router.get('/', ebookController.getEbooks);
router.get('/popular', ebookController.getPopularEbooks);
router.get('/:id', ebookController.getEbookById);

// Download flow (No OTP - Direct)
router.post('/download', ebookController.downloadEbook);

export default router;
```

### Utility Services

**Email Service** (`src/utils/emailService.ts`):

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendDownloadEmail(
  email: string,
  name: string,
  ebookName: string,
  downloadUrl: string
): Promise<void> {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .download-btn { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Ebook is Ready!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for downloading <strong>${ebookName}</strong>!</p>
          <p>Click the button below to download your ebook:</p>
          
          <div style="text-align: center;">
            <a href="${downloadUrl}" class="download-btn">Download Now</a>
          </div>
          
          <p>Or copy this link: <a href="${downloadUrl}">${downloadUrl}</a></p>
          
          <p>Best regards,<br>The CounselIndia Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@counselindia.com',
    to: email,
    subject: `Download ${ebookName} - CounselIndia`,
    html: htmlContent,
  });
}
```

---

## Frontend Implementation

### TypeScript Types

**Types** (`src/types/ebook.ts`):

```typescript
export interface Ebook {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  brochure: string;
  category?: string;
  categoryId?: string;
  tags: string[];
  fileSize?: number;
  pageCount?: number;
  author?: string;
  publishYear?: number;
  language?: string;
  status: 0 | 1;
  position: number;
  downloadCount: number;
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EbookDownloadRequest {
  name: string;
  email: string;
  mobile?: string;
  countryCode?: string;
  ebookId: string;
  stateId?: number;
  cityId?: number;
  hearAbout?: string;
}

export interface DownloadResponse {
  status: boolean;
  message: string;
  data: {
    downloadUrl: string;
    ebookName: string;
    fileName: string;
    email: string;
  };
}
```

### Project Structure

```
src/
├── pages/
│   ├── Ebooks.tsx              # Main ebook listing page
│   └── EbookDownload.tsx       # Download confirmation page
├── components/
│   └── ebook/
│       ├── EbookCard.tsx       # Ebook card component
│       ├── EbookGrid.tsx       # Grid layout
│       ├── EbookHero.tsx       # Hero section
│       ├── AnimatedBackground.tsx  # Animated circles background
│       ├── DownloadModal.tsx   # Download form modal
│       ├── OTPModal.tsx        # OTP verification modal
│       └── EbookFilter.tsx     # Filter sidebar
├── hooks/
│   └── useEbook.ts             # Custom hook for ebook operations
├── api/
│   └── ebookApi.ts             # API client functions
└── styles/
    └── ebook.css               # Ebook-specific styles
```

### Main Ebook Page

**Ebooks Page** (`src/pages/Ebooks.tsx`):

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AnimatedBackground from '@/components/ebook/AnimatedBackground';
import EbookGrid from '@/components/ebook/EbookGrid';
import EbookFilter from '@/components/ebook/EbookFilter';
import DownloadModal from '@/components/ebook/DownloadModal';
import { ebookApi } from '@/api/ebookApi';
import type { Ebook } from '@/types/ebook';

export default function Ebooks() {
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    featured: false,
  });

  const { data: ebooks, isLoading } = useQuery({
    queryKey: ['ebooks', filters],
    queryFn: () => ebookApi.getEbooks(filters),
  });

  const handleDownloadClick = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowDownloadModal(true);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Page Banner */}
      <div className="relative z-10 py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Free Ebooks</h1>
          <p className="text-xl opacity-90">
            Download instantly - Just enter your email, no OTP required!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64">
            <EbookFilter
              filters={filters}
              onFilterChange={setFilters}
            />
          </aside>

          {/* Ebook Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <EbookGrid
                ebooks={ebooks?.data || []}
                onDownloadClick={handleDownloadClick}
              />
            )}
          </main>
        </div>
      </div>

      {/* Download Modal - Simple, No OTP */}
      {selectedEbook && (
        <DownloadModal
          open={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          ebook={selectedEbook}
        />
      )}
    </div>
  );
}
```

### Animated Background Component

**AnimatedBackground** (`src/components/ebook/AnimatedBackground.tsx`):

```typescript
export default function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>

      {/* Animated Circles */}
      <div className="circles absolute inset-0 overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <li
            key={i}
            className="absolute block list-none bg-green-400/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 130}px`,
              height: `${20 + Math.random() * 130}px`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 30}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### Ebook Card Component

**EbookCard** (`src/components/ebook/EbookCard.tsx`):

```typescript
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText } from 'lucide-react';
import type { Ebook } from '@/types/ebook';

interface EbookCardProps {
  ebook: Ebook;
  onDownloadClick: (ebook: Ebook) => void;
}

export default function EbookCard({ ebook, onDownloadClick }: EbookCardProps) {
  const imageUrl = ebook.image.startsWith('http')
    ? ebook.image
    : `${import.meta.env.VITE_S3_URL}/ebook/${ebook.image}`;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={ebook.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {ebook.featured && (
          <Badge className="absolute top-2 right-2 bg-yellow-500">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
          {ebook.name}
        </h3>

        {ebook.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {ebook.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {ebook.pageCount && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {ebook.pageCount} pages
            </div>
          )}
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {ebook.downloadCount || 0}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {ebook.viewCount || 0}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={() => onDownloadClick(ebook)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Download Now
          <Download className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Download Modal Component

**DownloadModal** (`src/components/ebook/DownloadModal.tsx`):

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ebookApi } from '@/api/ebookApi';
import OTPModal from './OTPModal';
import type { Ebook } from '@/types/ebook';

const downloadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  hearAbout: z.string().optional(),
});

type DownloadFormData = z.infer<typeof downloadSchema>;

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  ebook: Ebook;
}

export default function DownloadModal({ open, onClose, ebook }: DownloadModalProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const onSubmit = async (data: DownloadFormData) => {
    setIsSubmitting(true);
    try {
      const response = await ebookApi.downloadEbook({
        ...data,
        ebookId: ebook._id,
      });

      // Show success toast
      toast({
        title: 'Success!',
        description: 'Ebook sent to your email. Check your inbox!',
      });

      // Start download
      window.open(response.data.downloadUrl, '_blank');

      // Redirect to thank you page
      setTimeout(() => {
        navigate('/thank-you-for-ebook');
        onClose();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send ebook',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-2 border-purple-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Download {ebook.name}</DialogTitle>
          <DialogDescription>
            Enter your email and we'll send you the PDF instantly!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span>Instant download - No OTP verification needed!</span>
            </p>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile (Optional) */}
          <div>
            <Label htmlFor="mobile">Mobile Number (Optional)</Label>
            <Input
              id="mobile"
              placeholder="1234567890"
              {...register('mobile')}
            />
          </div>

          {/* How did you hear about us */}
          <div>
            <Label htmlFor="hearAbout">How did you hear about us?</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="friend">Friend/Colleague</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-lg py-6"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending to your email...
              </>
            ) : (
              <>
                📧 Get PDF Instantly
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            PDF will be sent to your email immediately!
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### API Client

**Ebook API** (`src/api/ebookApi.ts`):

```typescript
import axios from 'axios';
import type {
  Ebook,
  EbookDownloadRequest,
  DownloadResponse,
} from '@/types/ebook';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/ebooks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ebookApi = {
  // Get all ebooks
  getEbooks: async (filters?: any): Promise<{ data: Ebook[] }> => {
    const response = await apiClient.get('/', { params: filters });
    return response.data;
  },

  // Get single ebook
  getEbook: async (id: string): Promise<{ data: Ebook }> => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Get popular ebooks
  getPopularEbooks: async (limit = 6): Promise<{ data: Ebook[] }> => {
    const response = await apiClient.get('/popular', { params: { limit } });
    return response.data;
  },

  // Download ebook (Direct - No OTP)
  downloadEbook: async (data: EbookDownloadRequest): Promise<DownloadResponse> => {
    const response = await apiClient.post('/download', data);
    return response.data;
  },
};
```

---

## Admin Dashboard

### Admin Ebook Management

**Admin Controller** (`src/controllers/ebookAdminController.ts`):

```typescript
import { Request, Response } from 'express';
import Ebook from '../models/Ebook';
import { uploadToS3, deleteFromS3 } from '../utils/s3Service';
import { generateSlug } from '../utils/helpers';

// Create ebook
export const createEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      tags,
      author,
      publishYear,
      language,
      pageCount,
      status,
      position,
      featured,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Generate slug
    const slug = generateSlug(name);

    // Upload image to S3
    let imageUrl = '';
    if (files.image && files.image[0]) {
      imageUrl = await uploadToS3(files.image[0], 'ebook/images');
    }

    // Upload brochure to S3
    let brochureUrl = '';
    if (files.brochure && files.brochure[0]) {
      brochureUrl = await uploadToS3(files.brochure[0], 'ebook/files');
    }

    const ebook = await Ebook.create({
      name,
      slug,
      description,
      image: imageUrl,
      brochure: brochureUrl,
      category,
      tags: Array.isArray(tags) ? tags : JSON.parse(tags || '[]'),
      author,
      publishYear,
      language,
      pageCount,
      fileSize: files.brochure?.[0]?.size,
      status: status || 1,
      position: position || 0,
      featured: featured || false,
    });

    res.status(201).json({
      status: true,
      message: 'Ebook created successfully',
      data: ebook,
    });
  } catch (error) {
    console.error('Error creating ebook:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to create ebook',
      error: error.message,
    });
  }
};

// Update ebook
export const updateEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const ebook = await Ebook.findById(id);
    if (!ebook) {
      res.status(404).json({
        status: false,
        message: 'Ebook not found',
      });
      return;
    }

    // Update image if provided
    if (files.image && files.image[0]) {
      // Delete old image
      if (ebook.image) {
        await deleteFromS3(ebook.image);
      }
      updateData.image = await uploadToS3(files.image[0], 'ebook/images');
    }

    // Update brochure if provided
    if (files.brochure && files.brochure[0]) {
      // Delete old brochure
      if (ebook.brochure) {
        await deleteFromS3(ebook.brochure);
      }
      updateData.brochure = await uploadToS3(files.brochure[0], 'ebook/files');
      updateData.fileSize = files.brochure[0].size;
    }

    // Update slug if name changed
    if (updateData.name && updateData.name !== ebook.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    Object.assign(ebook, updateData);
    await ebook.save();

    res.json({
      status: true,
      message: 'Ebook updated successfully',
      data: ebook,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to update ebook',
      error: error.message,
    });
  }
};

// Delete ebook
export const deleteEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ebook = await Ebook.findById(id);
    if (!ebook) {
      res.status(404).json({
        status: false,
        message: 'Ebook not found',
      });
      return;
    }

    // Delete files from S3
    if (ebook.image) {
      await deleteFromS3(ebook.image);
    }
    if (ebook.brochure) {
      await deleteFromS3(ebook.brochure);
    }

    await ebook.deleteOne();

    res.json({
      status: true,
      message: 'Ebook deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to delete ebook',
      error: error.message,
    });
  }
};

// Get download analytics
export const getDownloadAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query: any = { ebookId: id };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const downloads = await EbookUser.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    const totalDownloads = await EbookUser.countDocuments({ ebookId: id });
    const uniqueUsers = await EbookUser.distinct('email', { ebookId: id });

    res.json({
      status: true,
      data: {
        totalDownloads,
        uniqueUsers: uniqueUsers.length,
        recentDownloads: downloads,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch analytics',
      error: error.message,
    });
  }
};
```

---

## Style Guide

### CSS for Animated Background

```css
/* Animated background circles */
.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(105, 216, 68, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

/* Tailwind animation class */
.animate-float {
  animation: animate 25s linear infinite;
}

/* Card hover effects */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Tailwind Configuration

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1',
            borderRadius: '0',
          },
          '100%': {
            transform: 'translateY(-1000px) rotate(720deg)',
            opacity: '0',
            borderRadius: '50%',
          },
        },
      },
      animation: {
        float: 'float 25s linear infinite',
      },
    },
  },
};
```

---

## Summary

This comprehensive ebook system provides:

✅ **Complete Frontend** - React + TypeScript with animated UI  
✅ **Full Backend** - Node.js + Express + MongoDB  
✅ **Instant Download** - No OTP verification, simple email entry  
✅ **Admin Dashboard** - Full CRUD operations with email management  
✅ **Download Tracking** - Analytics and reporting  
✅ **Email Count Display** - See total emails per ebook  
✅ **Admin Email Manager** - Send to single or multiple emails instantly  
✅ **Bulk Email Send** - Send PDFs to hundreds of emails at once  
✅ **Email Integration** - Automated instant PDF delivery  
✅ **CRM Integration** - Lead management  
✅ **File Management** - AWS S3 storage  
✅ **Responsive Design** - Mobile-first approach  
✅ **SEO Optimized** - Proper meta tags and slugs  

### Simplified User Flow:
1. 👤 User enters name & email → 2. 📧 System sends PDF link instantly → 3. ⬇️ User downloads (no OTP)

### Admin Email Features:
- 📊 **View Email Count** - Total emails entered for each ebook
- 📤 **Single Send** - Send PDF to one email address
- 📨 **Bulk Send** - Send to multiple emails (paste list)
- 📜 **Email History** - Track all sends (user + admin)
- 💾 **Export CSV** - Download complete email database
- 📈 **Real-time Stats** - Dashboard with email metrics

---

**Version:** 1.0.0  
**Last Updated:** October 7, 2025  
**Maintained By:** Development Team  
**Related Documentation:** docs/0001.md, docs/ADMIN_STYLE_GUIDE.md


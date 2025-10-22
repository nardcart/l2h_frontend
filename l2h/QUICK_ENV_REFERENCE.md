# Quick Environment Reference

## ✅ What Was Changed

All hardcoded `http://localhost:5000` fallbacks have been removed from:
- `src/pages/admin/EbookManagement.tsx` (2 locations)
- `src/api/ebookApi.ts` (1 location)
- `src/components/ebook/EbookCard.tsx` (1 location)

## 🚀 Quick Start

1. **Create `.env` file** in project root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Files Using API_BASE_URL

All API calls now go through centralized configuration:
- ✅ `src/config/api.ts` - Centralized config (only place accessing `import.meta.env`)
- ✅ `src/services/api.service.ts` - API service layer
- ✅ `src/pages/admin/EbookManagement.tsx` - Admin ebook management
- ✅ `src/pages/Blogs.tsx` - Blog listing
- ✅ `src/api/ebookApi.ts` - Ebook API client
- ✅ `src/components/ebook/EbookCard.tsx` - Ebook card component

## ⚠️ Important

- **No fallbacks**: App will fail if environment variable is not set
- **Must restart**: Changes to `.env` require restarting dev server
- **Production**: Set `VITE_API_BASE_URL` in your deployment platform

## 📚 Full Documentation

- [Environment Setup Guide](./ENV_SETUP_GUIDE.md) - Detailed setup instructions
- [Migration Summary](./API_ENV_MIGRATION_SUMMARY.md) - Complete change log









# L2H Blog Deployment Guide

## Overview
This guide covers deploying your full-stack blog application:
- **Frontend (React + Vite)** → Vercel
- **Backend (Node.js + Express)** → Railway
- **Database** → MongoDB Atlas
- **File Storage** → Vercel Blob (Already configured)

---

## Prerequisites

- GitHub account
- Railway account (railway.app)
- MongoDB Atlas account (mongodb.com/atlas)
- Vercel account (vercel.com)

---

## Part 1: Database Setup (MongoDB Atlas)

### 1. Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Login
3. Create a **FREE** M0 cluster
4. Choose a region (closest to your users)
5. Click "Create Cluster"

### 2. Setup Database Access

1. In Atlas Dashboard → **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `l2h-admin`
5. Password: Generate strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 3. Setup Network Access

1. In Atlas Dashboard → **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: For production, you can restrict to Railway's IPs later
4. Click **"Confirm"**

### 4. Get Connection String

1. In Atlas Dashboard → **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://l2h-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://...mongodb.net/l2h-blog?retryWrites=true&w=majority`

---

## Part 2: Backend Deployment (Railway)

### 1. Prepare Backend for Deployment

First, ensure your backend is ready:

```bash
cd backend
```

#### Update `package.json`:
Make sure you have these scripts:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "npm run build"
  }
}
```

#### Create `.railwayignore`:
```bash
cat > .railwayignore << EOF
node_modules
.env
.env.local
*.log
.DS_Store
src
tsconfig.json
EOF
```

#### Update `src/server.ts` for production:
Ensure your server listens on the PORT environment variable:
```typescript
const PORT = process.env.PORT || 5000;
```

### 2. Deploy to Railway

#### Option A: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to project (if already created)
# railway link

# Deploy
railway up
```

#### Option B: Using Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Select your repository
6. Railway will auto-detect Node.js

### 3. Configure Environment Variables

In Railway Dashboard → Your Project → Variables:

Add these environment variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://l2h-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/l2h-blog?retryWrites=true&w=majority

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Server
PORT=5000
NODE_ENV=production

# CORS Origin (add your Vercel frontend URL later)
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Email Configuration (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Vercel Blob (Already configured)
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Get Railway URL

After deployment, Railway will give you a URL:
```
https://your-app-name.up.railway.app
```

Save this URL - you'll need it for the frontend!

### 5. Test Backend

```bash
# Test health endpoint
curl https://your-app-name.up.railway.app/api/health

# Should return:
# {"status":true,"message":"L2H Blog API is running","timestamp":"..."}
```

---

## Part 3: Frontend Deployment (Vercel)

### 1. Update Frontend API Configuration

Update `src/config/api.ts` or create `.env`:

```bash
# Create .env.production
cat > .env.production << EOF
VITE_API_BASE_URL=https://your-app-name.up.railway.app/api
EOF
```

Or update directly in `src/config/api.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://your-app-name.up.railway.app/api';
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-app-name.up.railway.app/api
   ```
7. Click **"Deploy"**

### 3. Update CORS in Backend

After getting your Vercel URL, update Railway environment variables:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

Or for multiple origins:
```env
CORS_ORIGIN=https://your-frontend.vercel.app,https://www.yourdomain.com
```

---

## Part 4: Post-Deployment Setup

### 1. Create Admin User

Use Railway CLI or API client to create admin user:

```bash
# Using curl
curl -X POST https://your-app-name.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@l2h.com",
    "password": "Admin123!",
    "name": "Admin User",
    "role": "admin"
  }'
```

### 2. Test Full Stack

1. Visit your Vercel frontend URL
2. Navigate to `/admin/login`
3. Login with admin credentials
4. Test creating a blog post
5. Verify file uploads work (Vercel Blob)

### 3. Setup Custom Domain (Optional)

#### For Frontend (Vercel):
1. Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

#### For Backend (Railway):
1. Railway Dashboard → Project → Settings → Domains
2. Add custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records

---

## Part 5: Monitoring & Maintenance

### Railway Monitoring

- View logs: Railway Dashboard → Deployments → Logs
- Monitor usage: Dashboard → Usage
- Set up alerts for errors

### Database Monitoring

- MongoDB Atlas Dashboard → Metrics
- Check connection count
- Monitor storage usage

### Automatic Deployments

Both Railway and Vercel support auto-deploy:
- Push to `main` branch → auto-deploy to production
- Push to `dev` branch → auto-deploy to preview (optional)

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| MongoDB Atlas | 512 MB storage | From $9/month |
| Railway | $5 credit/month | $5/month usage-based |
| Vercel | 100 GB bandwidth | $20/month (Pro) |
| Vercel Blob | 500 MB | Usage-based |

**Estimated Monthly Cost (Free Tier):** $0-5/month
**Estimated Monthly Cost (Paid):** $15-30/month

---

## Troubleshooting

### Backend Won't Start
```bash
# Check Railway logs
railway logs

# Common issues:
# - Missing environment variables
# - MongoDB connection string incorrect
# - Build failed (check package.json scripts)
```

### CORS Errors
```typescript
// Update backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
```

### Database Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check username/password
- Ensure database user has correct permissions

### Frontend Can't Connect to Backend
- Verify API_BASE_URL in frontend
- Check Railway deployment status
- Test backend health endpoint directly
- Check CORS configuration

---

## Alternative: Deploy Everything to Render.com

If you prefer a single platform:

### 1. Backend (Web Service)
- Runtime: Node
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`

### 2. Frontend (Static Site)
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### 3. MongoDB
- Use Render's managed PostgreSQL, OR
- Continue using MongoDB Atlas

---

## Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS only (both platforms do this automatically)
- [ ] Restrict MongoDB IP access (optional)
- [ ] Set up rate limiting (already configured)
- [ ] Enable environment variable encryption
- [ ] Regular security updates (`npm audit fix`)
- [ ] Set up monitoring and alerts

---

## Backup Strategy

### Database Backups
- MongoDB Atlas: Automatic backups on all plans
- Manual backup: Use `mongodump` command

### Code Backups
- GitHub repository (primary)
- Regular commits and tags for versions

---

## Next Steps

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test all functionality
4. Create admin user
5. Add custom domain (optional)
6. Set up monitoring
7. Create first blog post!

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Express.js Docs: https://expressjs.com

---

## Useful Commands

```bash
# Backend Development
cd backend
npm run dev

# Frontend Development
npm run dev

# Build Frontend
npm run build

# Preview Production Build
npm run preview

# Railway Commands
railway login
railway logs
railway up
railway open

# Vercel Commands
vercel
vercel --prod
vercel logs
vercel domains
```

---

## Need Help?

Common issues and solutions are in the Troubleshooting section above. For specific errors, check:
1. Railway/Vercel deployment logs
2. Browser console (frontend errors)
3. MongoDB Atlas logs (database issues)







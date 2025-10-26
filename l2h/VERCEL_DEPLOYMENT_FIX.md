# Vercel Deployment Fix Guide

## 🔴 Issues Identified

1. **CORS Error** - Backend configured for localhost, needs to allow Vercel domain
2. **404 on Images** - Missing images in public folder ✅ **FIXED**
3. **Environment Variables** - Not set in Vercel

---

## ✅ Step 1: Fix Missing Images (COMPLETED)

The missing images (5.png - 10.png) have been copied to `public/images/`. 
Commit and push these changes:

```bash
git add public/images/
git commit -m "fix: Add missing images to public folder for deployment"
git push
```

---

## 🔧 Step 2: Set Environment Variables in Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/your-username/l2h-frontend
2. Click **Settings** → **Environment Variables**
3. Add the following variable:

   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | `https://l2h-backend.onrender.com/api` |

4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**
6. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Add environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://l2h-backend.onrender.com/api

vercel env add VITE_API_BASE_URL preview
# Enter: https://l2h-backend.onrender.com/api

# Redeploy
vercel --prod
```

---

## 🚨 Step 3: Fix CORS on Backend (CRITICAL)

The backend is returning `Access-Control-Allow-Origin: http://localhost:8080` but needs to allow `https://l2h-frontend.vercel.app`.

### Backend Configuration Needed

Find your backend CORS configuration (usually in `server.js`, `app.js`, or `index.js`) and update it:

#### If using Express with `cors` package:

```javascript
const cors = require('cors');

// BEFORE (Wrong):
app.use(cors({
  origin: 'http://localhost:8080'
}));

// AFTER (Correct):
const allowedOrigins = [
  'http://localhost:8080',           // Local development
  'https://l2h-frontend.vercel.app', // Production
  /\.vercel\.app$/                    // All Vercel preview deployments
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### Or use environment variable (Better approach):

```javascript
const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

Then set in your Render dashboard:
```
ALLOWED_ORIGINS=http://localhost:8080,https://l2h-frontend.vercel.app
```

### Update Backend on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your `l2h-backend` service
3. Go to **Environment** tab
4. Add environment variable:
   - Key: `ALLOWED_ORIGINS`
   - Value: `http://localhost:8080,https://l2h-frontend.vercel.app`
5. **Save Changes** (this will trigger a redeploy)

---

## 🔍 Step 4: Verify Deployment

After completing all steps:

### Test Environment Variables
```bash
# Open browser console on your Vercel site
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

### Test API Connectivity
1. Open DevTools Network tab
2. Navigate to your Blogs page
3. Check the API requests:
   - Should show `https://l2h-backend.onrender.com/api/categories`
   - Should return **200 OK** (not CORS error)

### Test Images
1. Navigate to homepage
2. Scroll to companies section
3. All logos (5.png - 10.png) should load without 404 errors

---

## 📝 Checklist

- [ ] Copy missing images to public folder
- [ ] Commit and push changes
- [ ] Set `VITE_API_BASE_URL` in Vercel
- [ ] Redeploy Vercel app
- [ ] Update CORS configuration in backend code
- [ ] Set `ALLOWED_ORIGINS` in Render
- [ ] Verify API calls work (no CORS errors)
- [ ] Verify images load correctly
- [ ] Test all pages on production site

---

## 🐛 Troubleshooting

### CORS errors persist
- Check backend logs in Render dashboard
- Verify the backend actually redeployed after CORS changes
- Test backend directly: `curl https://l2h-backend.onrender.com/api/health`

### Environment variables not working
- Ensure you redeployed after adding variables
- Check build logs in Vercel for any errors
- Environment variables are baked into the build, not runtime

### Images still 404
- Clear browser cache (Ctrl+Shift+R)
- Check Vercel build logs to ensure images were included
- Verify files exist in your repository under `public/images/`

---

## 📞 Quick Fixes

### Force Fresh Deployment

```bash
git add .
git commit -m "fix: Configure for production deployment"
git push

# Then in Vercel dashboard, manually redeploy
```

### Test Locally First

```bash
# Create .env file
echo "VITE_API_BASE_URL=https://l2h-backend.onrender.com/api" > .env

# Build and preview
npm run build
npm run preview

# Visit http://localhost:4173 and test
```

---

## 🎯 Expected Result

After completing all steps:
- ✅ No CORS errors in console
- ✅ API calls return data successfully  
- ✅ All images load correctly
- ✅ No 404 errors
- ✅ Application works on https://l2h-frontend.vercel.app














# Environment Variables Setup Guide

## Overview
This application now requires environment variables to be set. All hardcoded fallbacks to `http://localhost:5000` have been removed.

## Quick Setup

### Step 1: Create Environment File

Create a `.env` file in the project root directory:

```bash
# For Windows (PowerShell)
New-Item -Path ".env" -ItemType File

# For Linux/Mac
touch .env
```

### Step 2: Add Configuration

Add the following content to your `.env` file:

#### For Development (Local Backend)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### For Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Step 3: Verify Setup

Start the development server:

```bash
npm run dev
```

If you see errors about undefined API URLs, ensure your `.env` file is:
1. Located in the project root (same directory as `package.json`)
2. Named exactly `.env` (not `.env.txt` or any other extension)
3. Contains the correct environment variable

## Important Notes

### Environment Variable Format
- ✅ Correct: `VITE_API_BASE_URL=http://localhost:5000/api` (includes `/api`)
- ❌ Wrong: `VITE_API_BASE_URL=http://localhost:5000` (missing `/api`)
- ❌ Wrong: `VITE_API_BASE_URL="http://localhost:5000/api"` (no quotes needed)

### Security
- Never commit `.env` files to version control
- Use different values for development and production
- In production, set environment variables through your hosting platform's dashboard

### Vite Environment Variables
- All Vite environment variables must be prefixed with `VITE_`
- Environment variables are only loaded on server start
- Restart the dev server after changing `.env` file

## Deployment

### Vercel
```bash
vercel env add VITE_API_BASE_URL
# Enter your production API URL when prompted
```

### Netlify
Add to `netlify.toml`:
```toml
[build.environment]
  VITE_API_BASE_URL = "https://api.yourdomain.com/api"
```

Or set in Netlify Dashboard:
- Go to Site settings → Build & deploy → Environment
- Add variable: `VITE_API_BASE_URL`

### Docker
Add to `docker-compose.yml`:
```yaml
services:
  web:
    environment:
      - VITE_API_BASE_URL=http://api:5000/api
```

Or pass at runtime:
```bash
docker run -e VITE_API_BASE_URL=http://localhost:5000/api myapp
```

## Troubleshooting

### Error: "API_BASE_URL is undefined"
**Solution**: Create `.env` file with `VITE_API_BASE_URL` variable

### Changes to .env not taking effect
**Solution**: Restart the development server (`npm run dev`)

### CORS errors in browser
**Solution**: Ensure your backend API allows requests from your frontend origin

### Build fails with environment variable errors
**Solution**: Ensure environment variables are set in your build environment

## Testing

You can test your environment setup with:

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [API Configuration](./src/config/api.ts)
- [Migration Summary](./API_ENV_MIGRATION_SUMMARY.md)


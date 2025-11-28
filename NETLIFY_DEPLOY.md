# Netlify Deployment Instructions

## Method 1: Connect GitHub Repository (Recommended)

1. **Login to Netlify**: Go to [netlify.com](https://netlify.com) and sign in
2. **New Site from Git**: Click "New site from Git"
3. **Choose GitHub**: Select GitHub as your Git provider
4. **Authorize**: Give Netlify access to your GitHub account
5. **Select Repository**: Choose `JacquelineWorsleyMinistriesJoyfullyLivingFollowingGod`
6. **Deploy Settings**:
   - **Branch to deploy**: `main`
   - **Build command**: Leave empty (or use `echo "Static site"`)
   - **Publish directory**: `.` (root directory)
   - **Site name**: `jlymoure25` (optional custom name)
7. **Deploy Site**: Click "Deploy site"

## Method 2: Manual Drag & Drop

1. **Create ZIP**: Download repository as ZIP from GitHub
2. **Netlify Drop**: Go to [netlify.com/drop](https://netlify.com/drop)
3. **Drag Files**: Drop the extracted folder onto the deploy area

## Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from repository root
netlify deploy --prod --dir .
```

## Custom Domain Setup (Optional)

After deployment:
1. Go to **Site settings** > **Domain management**
2. Add custom domain: `jacquelineworsleyministries.com`
3. Configure DNS records as instructed
4. SSL certificate auto-provisions

## Site URLs After Deployment

- **Auto-generated**: `https://[random-name].netlify.app`
- **Custom subdomain**: `https://jlymoure25.netlify.app`
- **Custom domain**: `https://yourdomain.com`

## Environment Variables (if needed)

In Netlify dashboard:
1. Go to **Site settings** > **Environment variables**
2. Add any required variables

## Troubleshooting 404 Errors

The `netlify.toml` and `_redirects` files are configured to:
- Serve `index.html` for all routes
- Set proper headers for security and caching
- Handle SPA-style routing

## Build Settings Already Configured

- ✅ `netlify.toml` with proper headers
- ✅ `_redirects` file for fallback routing  
- ✅ Static site optimization
- ✅ Cache headers for performance
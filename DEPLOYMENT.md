# Deployment Guide

## Netlify Deployment

### Quick Deploy
1. Fork this repository
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your forked repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

### Custom Domain Setup
1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `yourdomain.com`
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

## GitHub Pages Alternative

### Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select source: "Deploy from a branch"
4. Choose branch: `main`
5. Folder: `/ (root)`
6. Save

Your site will be available at: `https://yourusername.github.io/JacquelineWorsleyMinistriesJoyfullyLivingFollowingGod`

## Environment Variables (Optional)

For production deployments, you can add:
- `SOUNDCLOUD_CLIENT_ID`: Your SoundCloud app client ID
- `GA_TRACKING_ID`: Google Analytics tracking ID

## Performance Tips

- Enable Netlify's "Asset Optimization"
- Use Netlify's "Form Handling" for contact forms
- Enable "Branch deploys" for testing
- Set up "Deploy notifications" for monitoring

## Monitoring

### Netlify Analytics
- Enable analytics in site settings
- Track page views and performance
- Monitor form submissions

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Test on various devices and networks
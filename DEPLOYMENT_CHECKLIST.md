# AgroMoz Deployment Checklist ✅

## Pre-Deployment Review

### Code Quality
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or API keys
- [ ] All imports are used
- [ ] No unused variables
- [ ] Code follows ESLint rules
- [ ] TypeScript has no errors

### Security
- [ ] Environment variables are set in .env.local
- [ ] Firebase credentials are secure and not exposed
- [ ] CORS is properly configured
- [ ] Security headers are enabled
- [ ] Input sanitization is in place
- [ ] SQL injection risks are mitigated (if applicable)
- [ ] XSS protection is enabled

### Performance
- [ ] Images are optimized (WebP format where possible)
- [ ] Code splitting is implemented
- [ ] Lazy loading is working for images
- [ ] Bundle size is reasonable (<1MB)
- [ ] Lighthouse score is >90

### Accessibility
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators are visible

### Testing
- [ ] Homepage loads without errors
- [ ] Product cards display correctly
- [ ] Search functionality works
- [ ] Category filters work
- [ ] Admin login works
- [ ] Admin product CRUD works
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] All links are working
- [ ] Forms validate properly

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

### Content Review
- [ ] All product descriptions are accurate
- [ ] Prices are correct
- [ ] Images load properly
- [ ] No broken links
- [ ] Contact information is correct
- [ ] UI text is in Portuguese

### Deployment
- [ ] .env.local is NOT committed to git
- [ ] .gitignore includes sensitive files
- [ ] Build command runs without errors: `npm run build`
- [ ] Start command works: `npm start`
- [ ] Environment variables are set in deployment platform
- [ ] Database/localStorage is initialized

### Post-Deployment
- [ ] Verify all pages load on production URL
- [ ] Test admin functionality on production
- [ ] Verify images load correctly
- [ ] Check console for errors
- [ ] Monitor error logs
- [ ] Set up analytics (if needed)
- [ ] Update DNS if needed

## Deployment Commands

### Local Testing
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Check ESLint
npm run test       # Run tests (if configured)
```

### Deployment to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel              # Interactive deployment
vercel --prod       # Deploy to production
```

### Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all variables from .env.local

## Security Checklist

### Headers to Set
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security: max-age=31536000

### API Security
- Rate limiting enabled
- CORS properly configured
- Input validation on all endpoints
- Output encoding enabled

### Database Security
- localStorage is used (no sensitive data stored)
- SessionStorage for temporary data
- No unencrypted passwords

## Monitoring

### Before Going Live
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Set up uptime monitoring
- [ ] Configure email alerts

### Regular Maintenance
- [ ] Review error logs weekly
- [ ] Check broken links monthly
- [ ] Update dependencies monthly
- [ ] Review security vulnerabilities

## Rollback Plan

If something goes wrong:
1. Check error logs
2. Identify the issue
3. Fix the code
4. Test locally
5. Commit and push
6. Vercel automatically redeploys
7. Monitor for 30 minutes

## Production URLs

- Main Site: https://agromoz.com
- Admin Panel: https://agromoz.com/admin
- API: https://api.agromoz.com (if applicable)

## Support Contacts

- Admin Email: admin@agromoz.com
- Support Email: support@agromoz.com
- Technical Issues: development@agromoz.com

---

**Last Updated:** May 16, 2026
**Prepared by:** Development Team
**Status:** Ready for Deployment ✅

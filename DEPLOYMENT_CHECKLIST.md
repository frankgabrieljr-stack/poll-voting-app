# 🚀 Deployment Checklist

Quick reference checklist for deploying Poll Voting App to production.

## Pre-Deployment

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` successfully (no errors)
- [ ] Test app locally with `npm run preview`
- [ ] Verify all features work:
  - [ ] User registration
  - [ ] User login
  - [ ] Poll creation
  - [ ] Poll voting
  - [ ] Poll results
  - [ ] Poll sharing
  - [ ] Workspace/dashboard
- [ ] Check browser console for errors
- [ ] Test on mobile device/responsive design

## Firebase Setup

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firestore security rules configured
- [ ] Authorized domains updated (add production URL)
- [ ] Email templates customized (optional)

## GitHub Repository

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] `.gitignore` includes `.env` files
- [ ] README.md updated (optional)

## Vercel Deployment

- [ ] Account created at vercel.com
- [ ] Project imported from GitHub
- [ ] Build settings configured:
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Environment variables added (if using .env)
- [ ] Domain added to Firebase authorized domains
- [ ] Deployment successful
- [ ] Production URL tested

## Netlify Deployment (Alternative)

- [ ] Account created at netlify.com
- [ ] Site created from GitHub
- [ ] Build settings configured:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Environment variables added (if using .env)
- [ ] Domain added to Firebase authorized domains
- [ ] Deployment successful
- [ ] Production URL tested

## Post-Deployment Testing

- [ ] Homepage loads
- [ ] User can register
- [ ] Email verification works
- [ ] User can login
- [ ] Poll creation works
- [ ] Poll voting works
- [ ] Poll results display
- [ ] Poll sharing works
- [ ] Workspace loads
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Fast load times

## Custom Domain (Optional)

- [ ] Domain purchased
- [ ] DNS records configured
- [ ] Domain added to Vercel/Netlify
- [ ] SSL certificate provisioned (automatic)
- [ ] Domain tested and working
- [ ] Domain added to Firebase authorized domains

## Security

- [ ] HTTPS enabled (automatic)
- [ ] Firestore security rules active
- [ ] Firebase authorized domains configured
- [ ] No sensitive data in client code
- [ ] Environment variables secured

## Monitoring

- [ ] Analytics enabled (optional)
- [ ] Error tracking set up (optional)
- [ ] Performance monitoring (optional)

## Final Steps

- [ ] Share URL with friends
- [ ] Get feedback
- [ ] Monitor usage
- [ ] Plan improvements

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete


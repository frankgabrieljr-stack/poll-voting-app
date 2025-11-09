# 🚀 Quick Start: Deploy Your Poll Voting App

**Fastest way to get your app live in 5 minutes!**

---

## Option 1: Deploy with Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub
```bash
cd poll-voting-app
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/poll-voting-app.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `poll-voting-app` repository
4. Vercel auto-detects Vite settings ✅
5. Click **"Deploy"**

**Done!** Your app is live at `https://your-project.vercel.app`

### Step 3: Add Firebase Domain
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Authentication → Settings → Authorized domains
3. Add: `your-project.vercel.app`

---

## Option 2: Deploy with Netlify (5 minutes)

### Step 1: Push to GitHub
(Same as above)

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your repository
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy site"**

**Done!** Your app is live at `https://your-project.netlify.app`

### Step 3: Add Firebase Domain
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add: `your-project.netlify.app`

---

## ✅ Test Your Deployment

1. Visit your production URL
2. Try registering a new account
3. Create a poll
4. Share with friends!

---

## 🔧 Troubleshooting

**Build fails?**
- Check that `npm run build` works locally first
- Ensure all dependencies are in `package.json`

**Firebase errors?**
- Add your production domain to Firebase Authorized Domains
- Check Firestore security rules are published

**404 on page refresh?**
- Vercel: Already handled by `vercel.json`
- Netlify: Already handled by `netlify.toml`

---

## 📚 Full Guide

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Need help?** Check the full deployment guide or troubleshooting section.


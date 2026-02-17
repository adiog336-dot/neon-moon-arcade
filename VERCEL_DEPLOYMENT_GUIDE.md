# Vercel Deployment Guide - Supabase Environment Variables

## 🚀 Environment Variables to Add in Vercel

When deploying to Vercel, you need to add the following environment variables to maintain your Supabase connection:

### Required Environment Variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://kyhcqkvtikxzawlanssr.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5aGNxa3Z0aWt4emF3bGFuc3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzIzMzMsImV4cCI6MjA4NjMwODMzM30.LzyJO6jaAFE_r0OUIA8KR1Hnw_AnmfyhOuQ5Co1W_lU` | Your Supabase anonymous/public key |

---

## 📋 Step-by-Step Instructions

### Method 1: Using Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (or import it from GitHub if you haven't yet)

2. **Access Environment Variables**
   - Click on **"Settings"** tab
   - Click on **"Environment Variables"** in the left sidebar

3. **Add Each Variable**
   
   **First Variable:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://kyhcqkvtikxzawlanssr.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

   **Second Variable:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5aGNxa3Z0aWt4emF3bGFuc3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzIzMzMsImV4cCI6MjA4NjMwODMzM30.LzyJO6jaAFE_r0OUIA8KR1Hnw_AnmfyhOuQ5Co1W_lU`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

4. **Redeploy**
   - Go to **"Deployments"** tab
   - Click the **three dots** (•••) on the latest deployment
   - Click **"Redeploy"**
   - Or simply push a new commit to trigger automatic deployment

---

### Method 2: Using Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
# When prompted, paste: https://kyhcqkvtikxzawlanssr.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# When prompted, paste your anon key
# Select: Production, Preview, Development

# Deploy
vercel --prod
```

---

## ✅ Verification Checklist

After adding environment variables and deploying:

- [ ] Both environment variables are added in Vercel dashboard
- [ ] Variables are enabled for Production, Preview, and Development
- [ ] Project has been redeployed after adding variables
- [ ] Visit your deployed site and test authentication
- [ ] Check browser console for any Supabase connection errors
- [ ] Test sign-up/login functionality

---

## 🔒 Security Notes

### ✅ Safe to Expose (Already Public)
- `VITE_SUPABASE_URL` - This is your public Supabase URL
- `VITE_SUPABASE_ANON_KEY` - This is the **anonymous/public** key (safe for client-side)

### ⚠️ NEVER Expose These (If You Have Them)
- `SUPABASE_SERVICE_ROLE_KEY` - This is a **secret** key with admin privileges
- Database passwords
- Any other secret keys

The `VITE_` prefix means these variables are exposed to the client-side code, which is correct for Supabase's anon key.

---

## 🐛 Troubleshooting

### Issue: "Supabase client not initialized"
**Solution**: Make sure both environment variables are set and the deployment was triggered **after** adding them.

### Issue: "Invalid API key"
**Solution**: Double-check that you copied the entire anon key without any extra spaces or line breaks.

### Issue: Environment variables not working
**Solution**: 
1. Verify variables are set for the correct environment (Production/Preview)
2. Redeploy the project
3. Clear browser cache and try again

### Issue: Authentication not working on Vercel
**Solution**:
1. Check Supabase dashboard → Authentication → URL Configuration
2. Add your Vercel domain to "Site URL" and "Redirect URLs"
   - Example: `https://your-app.vercel.app`
   - Example: `https://your-app.vercel.app/**`

---

## 📱 Supabase Dashboard Configuration

Don't forget to update your Supabase settings:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `kyhcqkvtikxzawlanssr`
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URLs:
   - **Site URL**: `https://your-project-name.vercel.app`
   - **Redirect URLs**: Add:
     - `https://your-project-name.vercel.app/**`
     - `http://localhost:5173/**` (for local development)

---

## 🎉 You're All Set!

Once you've added these environment variables and redeployed, your Supabase authentication will work perfectly on Vercel!

### Quick Deploy Checklist:
1. ✅ Push code to GitHub (Already done!)
2. ✅ Add environment variables in Vercel
3. ✅ Deploy/Redeploy on Vercel
4. ✅ Update Supabase redirect URLs
5. ✅ Test authentication on live site

---

**Need Help?** 
- Vercel Docs: https://vercel.com/docs/environment-variables
- Supabase Docs: https://supabase.com/docs/guides/auth

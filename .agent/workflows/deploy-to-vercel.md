---
description: how to deploy the application to Vercel
---

# Deploying to Vercel

Follow these steps to deploy your REQUIEM project to Vercel.

## Option 1: Vercel Dashboard (Recommended)

This is the easiest way to keep your site updated automatically when you push to GitHub.

1. **Push your code to GitHub**: ensure your latest changes are committed and pushed.
2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Connect your GitHub account and select the `neon-moon-arcade` repository.
3. **Configure Project**:
   - **Framework Preset**: select **Vite**.
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
4. **Add Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add your Supabase credentials from your `.env` file:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**: click the **Deploy** button.

## Option 2: Vercel CLI

Use this if you prefer deploying directly from your terminal.

1. **Install Vercel CLI**:
   ```sh
   npm i -g vercel
   ```
2. **Login**:
   ```sh
   vercel login
   ```
3. **Initialize Deployment**:
   ```sh
   vercel
   ```
   - Follow the prompts to link the project.
   - When asked for build settings, Vercel should detect Vite automatically.
4. **Add Env Vars**:
   - You can add them during the prompt or via the Vercel dashboard after linking.
5. **Deploy to Production**:
   ```sh
   vercel --prod
   ```

## Important Notes
- **Supabase Callbacks**: remember to update your Supabase Auth redirect URLs in the Supabase Dashboard (`Authentication` -> `URL Configuration`) to include your new Vercel domain.

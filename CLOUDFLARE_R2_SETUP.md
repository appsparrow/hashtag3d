# Cloudflare R2 Setup Guide

This guide will help you set up Cloudflare R2 for storing product images instead of Supabase Storage.

## Step 1: Create Cloudflare R2 Bucket

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Log in with your Cloudflare account

2. **Navigate to R2**
   - In the left sidebar, click on **"R2"** (under "Workers & Pages")
   - If you don't see R2, you may need to enable it first

3. **Create a New Bucket**
   - Click **"Create bucket"** button
   - Enter bucket name: `hashtag3d-product-images` (or your preferred name)
   - Choose a location (closest to your users)
   - Click **"Create bucket"**

## Step 2: Get R2 API Credentials

1. **Go to R2 API Tokens**
   - In the R2 dashboard, click on **"Manage R2 API Tokens"** (or go to https://dash.cloudflare.com/profile/api-tokens)
   - Click **"Create API token"**

2. **Configure the Token**
   - **Token name**: `hashtag3d-r2-upload` (or any name you prefer)
   - **Permissions**: 
     - Select **"Object Read and Write"**
   - **Account Resources**:
     - Select **"Include"** → **"All accounts"** (or select your specific account)
   - **Zone Resources**: Leave as default
   - Click **"Continue to summary"**
   - Click **"Create Token"**

3. **Save Your Credentials**
   - **Access Key ID**: Copy this immediately (you won't see it again!)
   - **Secret Access Key**: Copy this immediately (you won't see it again!)
   - ⚠️ **IMPORTANT**: Save these in a secure place. You'll need them for the next step.

## Step 3: Set Up R2 Public Access (Optional - for direct image URLs)

If you want to serve images directly from R2 URLs:

1. **Go to your bucket settings**
   - Click on your bucket name
   - Go to **"Settings"** tab

2. **Enable Public Access**
   - Under **"Public Access"**, you can either:
     - Use **Custom Domain** (recommended for production)
     - Use **R2.dev subdomain** (for testing/development)

3. **For Custom Domain (Recommended)**
   - Click **"Connect Domain"**
   - Enter your domain (e.g., `cdn.yourdomain.com`)
   - Follow Cloudflare's DNS setup instructions
   - This gives you clean URLs like: `https://cdn.yourdomain.com/image.jpg`

4. **For R2.dev Subdomain (Quick Setup)**
   - Cloudflare will provide a URL like: `https://pub-xxxxx.r2.dev`
   - This works immediately but URLs are less clean

## Step 4: Create Environment Variables

Add these to your `.env` file (and Cloudflare Pages environment variables):

```env
# Cloudflare R2 Configuration
VITE_R2_ACCOUNT_ID=c2085e0298d9caae9fc9fcaf0cfc9bc9
VITE_R2_ACCESS_KEY_ID=https://c2085e0298d9caae9fc9fcaf0cfc9bc9.r2.cloudflarestorage.com
VITE_R2_SECRET_ACCESS_KEY=RSsbt5TQXmz-gzoBGBt4ETTFkQefzJL3k2YLeApc
VITE_R2_BUCKET_NAME=hashtag3d-product-images
VITE_R2_PUBLIC_URL=https://cdn.hashtag3d.com
# OR for R2.dev subdomain:
# VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

## Step 5: Get Your Account ID

1. In Cloudflare Dashboard, go to any page
2. Your **Account ID** is shown in the right sidebar (under "Account ID")
3. Copy this and add it to your `.env` file

## Step 6: Install Required Package

We'll need the AWS SDK (R2 is S3-compatible):

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Summary of What You Need to Provide

Once you complete the steps above, provide me with:

1. ✅ **Bucket Name**: `hashtag3d-product-images` (or your chosen name)
2. ✅ **Account ID**: Found in Cloudflare dashboard sidebar
3. ✅ **Access Key ID**: From the API token you created
4. ✅ **Secret Access Key**: From the API token you created
5. ✅ **Public URL**: Either your custom domain or R2.dev subdomain

## Security Notes

- ⚠️ **Never commit** your `VITE_R2_SECRET_ACCESS_KEY` to git
- ⚠️ Add `.env` to `.gitignore` if not already there
- ⚠️ Set these as **environment variables** in Cloudflare Pages (not in code)
- ⚠️ The `VITE_R2_SECRET_ACCESS_KEY` will be exposed in the frontend bundle (this is normal for Vite env vars starting with `VITE_`). For better security, consider using a backend API endpoint for uploads.

## Next Steps

Once you provide the information above, I'll:
1. Create an R2 upload utility
2. Update the ProductForm to use R2 instead of Supabase Storage
3. Update image URLs to use R2 public URLs
4. Test the upload functionality


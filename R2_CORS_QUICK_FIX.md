# 🔧 Quick Fix: R2 CORS Configuration

## The Issue
Browser uploads are blocked by CORS. You need to configure CORS on your R2 bucket.

## Quick Steps (2 minutes)

### 1. Go to R2 Bucket Settings
- Cloudflare Dashboard → **R2** → **hashtag3d-product-images** bucket
- Click **"Settings"** tab
- Scroll to **"CORS Policy"** section

### 2. Add This CORS Configuration

Click **"Edit CORS Policy"** and paste this JSON:

**For Development (Allow localhost):**
```json
[
  {
    "AllowedOrigins": [
      "http://localhost:8080",
      "http://localhost:8081",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:8081"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**For Production (Add your domain):**
```json
[
  {
    "AllowedOrigins": [
      "http://localhost:8080",
      "http://localhost:8081",
      "https://hashtag3d.com",
      "https://www.hashtag3d.com"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Save and Test
- Click **"Save"**
- Wait 10-20 seconds for propagation
- Try uploading an image again

## Visual Guide

1. **R2 Dashboard** → Your bucket → **Settings** tab
2. Find **"CORS Policy"** section
3. Click **"Edit"** or **"Add CORS Policy"**
4. Paste the JSON above
5. **Save**

## Still Not Working?

1. **Check the exact origin** in the error message
2. **Add that exact origin** to AllowedOrigins (including port number)
3. **Clear browser cache** and try again
4. **Check browser console** for the exact CORS error

## Alternative: Use Presigned URLs (More Secure)

If CORS continues to be an issue, we can switch to presigned URLs which are more secure and don't require CORS configuration. Let me know if you want to implement that instead.


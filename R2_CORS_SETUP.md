# R2 CORS Configuration Guide

## The Problem

Browser uploads to R2 require CORS (Cross-Origin Resource Sharing) to be configured on the bucket. Without CORS, the browser blocks the upload request.

## Solution 1: Configure CORS in R2 Bucket (Quick Fix)

### Steps:

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com/
   - Go to **R2** → Your bucket (`hashtag3d-product-images`)

2. **Open Bucket Settings**
   - Click on your bucket name
   - Go to **"Settings"** tab
   - Scroll down to **"CORS Policy"** section

3. **Add CORS Configuration**
   - Click **"Edit CORS Policy"** or **"Add CORS Policy"**
   - Paste the following JSON configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:8080",
      "http://localhost:8081",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

4. **Replace with Your Domains**
   - Replace `http://localhost:8080` and `http://localhost:8081` with your actual local dev URLs
   - Replace `https://your-production-domain.com` with your production domain (e.g., `https://hashtag3d.com`)

5. **Save the CORS Policy**

### For Development (Allow All Origins - NOT for Production):

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

⚠️ **Warning**: Using `"*"` for AllowedOrigins is only for development. Use specific domains in production.

## Solution 2: Use Backend API (More Secure - Recommended)

Instead of uploading directly from the browser, create a backend API endpoint that handles the upload. This:
- ✅ Keeps credentials secure (not exposed in frontend)
- ✅ No CORS issues
- ✅ Better security

We can implement this if you prefer.

## After Configuring CORS

1. **Save the CORS policy** in R2
2. **Wait a few seconds** for it to propagate
3. **Try uploading again** - it should work!

## Troubleshooting

### Still getting CORS errors?
1. Make sure your origin (localhost:8081) is in the AllowedOrigins list
2. Check that AllowedMethods includes "PUT"
3. Verify AllowedHeaders includes "*" or the specific headers needed
4. Clear browser cache and try again
5. Check browser console for the exact CORS error message

### Testing CORS
You can test if CORS is working by running this in browser console:
```javascript
fetch('https://hashtag3d-product-images.c2085e0298d9caae9fc9fcaf0cfc9bc9.r2.cloudflarestorage.com/', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:8081'
  }
}).then(r => console.log('CORS OK', r)).catch(e => console.error('CORS Error', e));
```


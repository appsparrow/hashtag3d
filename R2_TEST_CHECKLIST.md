# ✅ R2 Upload Test Checklist

## Pre-Flight Check

Before testing, verify you have:

- [x] ✅ R2 bucket created (`hashtag3d-product-images`)
- [x] ✅ CORS policy configured in R2 bucket settings
- [x] ✅ Environment variables set in `.env`:
  - `VITE_R2_ACCOUNT_ID`
  - `VITE_R2_ACCESS_KEY_ID`
  - `VITE_R2_SECRET_ACCESS_KEY`
  - `VITE_R2_BUCKET_NAME`
  - `VITE_R2_PUBLIC_URL`
- [x] ✅ Public access enabled on R2 bucket
- [x] ✅ Custom domain connected (if using custom domain)

## Test Upload

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Go to Admin Panel**:
   - Navigate to `/admin/products/new` or edit an existing product

3. **Upload an Image**:
   - Click "Upload Images"
   - Select an image file
   - Wait for upload to complete

4. **Check Results**:
   - ✅ Success toast appears: "Upload successful"
   - ✅ Image preview appears in the form
   - ✅ No CORS errors in browser console
   - ✅ Image URL starts with your `VITE_R2_PUBLIC_URL`

## Expected Behavior

### ✅ Success:
- Toast: "Upload successful - X image(s) uploaded to R2"
- Image preview shows in the form
- Image URL format: `https://cdn.hashtag3d.com/products/1234567890-abc123.jpg`
- No errors in console

### ❌ If Still Failing:

**CORS Error:**
- Double-check CORS policy includes `http://localhost:8081` (or your exact dev URL)
- Make sure `PUT` method is in AllowedMethods
- Wait 30 seconds after saving CORS policy

**Credentials Error:**
- Verify all env vars are set correctly
- Check Access Key ID is not a URL (should be a string like `abc123...`)
- Restart dev server after changing `.env`

**Network Error:**
- Check R2 bucket name matches `VITE_R2_BUCKET_NAME`
- Verify public URL is correct
- Check browser network tab for detailed error

## Quick Test Command

You can also test CORS directly in browser console:
```javascript
// Test CORS
fetch('https://hashtag3d-product-images.c2085e0298d9caae9fc9fcaf0cfc9bc9.r2.cloudflarestorage.com/', {
  method: 'OPTIONS',
  headers: { 'Origin': 'http://localhost:8081' }
}).then(r => console.log('✅ CORS OK', r)).catch(e => console.error('❌ CORS Error', e));
```

## Next Steps After Successful Upload

1. ✅ Save the product with uploaded images
2. ✅ View product on home page - images should load from R2
3. ✅ Test image carousel (if multiple images)
4. ✅ Verify images are accessible at the public URL

---

**Ready to test?** Go ahead and try uploading an image! 🚀


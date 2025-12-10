# Cloudflare Pages Configuration

## Build Settings

To fix deployment issues, configure Cloudflare Pages to use **npm** instead of bun:

### In Cloudflare Dashboard:
1. Go to your Pages project settings
2. Navigate to **Builds & deployments** → **Build configuration**
3. Set the following:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)
   - **Node version**: `22.16.0` (or use `.nvmrc`)

### Environment Variables (if needed):
- `NODE_VERSION=22.16.0`
- `NPM_FLAGS=--legacy-peer-deps` (if peer dependency issues occur)

### Alternative: Use npm by default
If bun continues to cause issues, you can temporarily remove `bun.lockb` from the repository (add to `.gitignore`) to force Cloudflare to use npm.

## Current Setup
- ✅ `package-lock.json` - Present for npm fallback
- ✅ `bun.lockb` - Regenerated and up-to-date
- ✅ `.nvmrc` - Specifies Node 22.16.0
- ✅ `.npmrc` - npm configuration


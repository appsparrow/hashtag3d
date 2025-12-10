#!/bin/bash
# Cloudflare Pages build script
# Force npm usage if bun fails

set -e

echo "Installing dependencies with npm..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

echo "Building application..."
npm run build

echo "Build completed successfully!"


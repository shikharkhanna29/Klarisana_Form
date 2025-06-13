#!/bin/bash

# Get the backend URL from Render
BACKEND_URL="https://klarisana-form-backend.onrender.com"

# Replace the backend URL in app.js
sed -i '' "s|const BACKEND_URL = 'http://localhost:3001'|const BACKEND_URL = '${BACKEND_URL}'|g" app.js

# Create a new branch for deployment
git checkout -b gh-pages

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "Deployment complete! Your site will be available at https://shikharkhanna29.github.io/KlarisanaDemo/" 
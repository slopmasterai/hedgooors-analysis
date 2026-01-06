#!/bin/bash

echo "🚀 Hedgooors Analysis - Deployment Helper"
echo "=========================================="
echo ""
echo "This script will help you deploy your app!"
echo ""

# Check if GitHub remote exists
if git remote get-url origin &> /dev/null; then
    echo "✅ GitHub remote already configured!"
    echo "Remote URL: $(git remote get-url origin)"
    echo ""
    echo "Ready to push? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "Pushing to GitHub..."
        git push -u origin main
        echo ""
        echo "✅ Pushed to GitHub!"
        echo ""
        echo "Next steps:"
        echo "1. Go to https://vercel.com"
        echo "2. Click 'Add New Project'"
        echo "3. Import your GitHub repository"
        echo "4. Click Deploy"
        echo "5. Share the URL with your friends!"
    fi
else
    echo "⚠️  No GitHub remote found."
    echo ""
    echo "To deploy, you need to:"
    echo ""
    echo "1. Create a new repository on GitHub.com"
    echo "   - Go to https://github.com/new"
    echo "   - Name it: hedgooors-analysis"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Then run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR-USERNAME/hedgooors-analysis.git"
    echo "   git push -u origin main"
    echo ""
    echo "3. Then go to https://vercel.com and import your GitHub repo"
    echo ""
fi

echo ""
echo "📖 Full deployment instructions: See DEPLOYMENT.md"
echo "🌐 Local preview: http://localhost:5173"

#!/bin/bash

# 🚀 Quick Fix Script - Run all fixes in sequence

echo "=========================================="
echo "🔧 Vibe Coding Platform - Quick Fix"
echo "=========================================="
echo ""

# Step 1: Clean up caches
echo "Step 1️⃣: Cleaning caches..."
rm -rf .next
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -f yarn.lock
rm -f package-lock.json
echo "✓ Caches cleaned"
echo ""

# Step 2: Reinstall dependencies
echo "Step 2️⃣: Installing dependencies..."
if command -v pnpm &> /dev/null; then
  echo "Using pnpm..."
  pnpm install
elif command -v npm &> /dev/null; then
  echo "Using npm..."
  npm install
elif command -v yarn &> /dev/null; then
  echo "Using yarn..."
  yarn install
else
  echo "❌ No package manager found. Please install pnpm, npm, or yarn."
  exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Step 3: Verify Shiki version
echo "Step 3️⃣: Verifying Shiki version..."
if pnpm list shiki 2>/dev/null | grep -q "shiki@3"; then
  echo "✓ Shiki version 3.x installed (correct)"
elif npm list shiki 2>/dev/null | grep -q "shiki@3"; then
  echo "✓ Shiki version 3.x installed (correct)"
else
  echo "⚠️ Shiki version might be incorrect. Check with: npm ls shiki"
fi
echo ""

# Step 4: Type check
echo "Step 4️⃣: Running type check..."
pnpm type-check || npm run type-check
if [ $? -eq 0 ]; then
  echo "✓ Type check passed"
else
  echo "⚠️ Type check found issues. Review above."
fi
echo ""

# Step 5: Build verification
echo "Step 5️⃣: Building project..."
pnpm build || npm run build
if [ $? -eq 0 ]; then
  echo "✓ Build successful"
else
  echo "❌ Build failed. Check errors above."
  exit 1
fi
echo ""

# Step 6: Ready to start
echo "=========================================="
echo "✅ All fixes applied successfully!"
echo "=========================================="
echo ""
echo "🚀 Next: Start development server"
echo "   Command: pnpm dev"
echo "   URL: http://localhost:3000"
echo ""
echo "📍 Test MCP Interface"
echo "   URL: http://localhost:3000/mcp"
echo ""
echo "=========================================="

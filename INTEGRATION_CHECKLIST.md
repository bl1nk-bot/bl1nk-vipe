# Integration & Deployment Checklist

**Status**: Ready for Integration  
**Last Updated**: April 3, 2026

---

## Phase 1: Pre-Integration Setup

### Dependencies
- [ ] Install `shiki` package
  ```bash
  pnpm add shiki
  ```
- [ ] Verify `package.json` has all dependencies
  ```bash
  pnpm install
  ```
- [ ] Clear Next.js cache
  ```bash
  rm -rf .next
  ```

### Module Resolution
- [ ] Verify `hooks/use-mobile.ts` exists
  ```bash
  ls -la hooks/use-mobile.ts
  ```
- [ ] Check imports resolve without errors
  ```bash
  pnpm run type-check
  ```
- [ ] No "Can't resolve" errors in console

---

## Phase 2: Build & Compilation

### Type Safety
- [ ] Run TypeScript check
  ```bash
  pnpm run type-check
  # Expected: ✓ No errors
  ```
- [ ] Fix any type errors before proceeding

### Build Verification
- [ ] Production build succeeds
  ```bash
  pnpm run build
  # Expected: ✓ Successfully compiled
  # File size < 500KB (main bundle)
  ```
- [ ] No warnings about external packages
- [ ] No hydration mismatch warnings

### Code Quality
- [ ] Lint check passes
  ```bash
  pnpm run lint
  # Expected: ✓ No linting errors
  ```
- [ ] Format check passes
  ```bash
  pnpm run format
  # Expected: ✓ Properly formatted
  ```

---

## Phase 3: Local Testing

### Development Server
- [ ] Start dev server
  ```bash
  pnpm dev
  ```
- [ ] No console errors on startup
- [ ] Hot reload working (save a file, see immediate update)
- [ ] No memory leaks (check DevTools Memory tab)

### Functional Testing
- [ ] Home page loads without errors
- [ ] Navigate to `/mcp` route successfully
- [ ] MCP Console renders properly
- [ ] All 4 panels display (ServerManager, RequestBuilder, ResponseDisplay, ConnectionMonitor)

### Responsive Testing
- [ ] Desktop view (1920px) renders correctly
- [ ] Tablet view (768px) displays two-column layout
- [ ] Mobile view (375px) displays single-column layout
- [ ] Rotation (portrait ↔ landscape) works smoothly

---

## Phase 4: Automated Testing

### Unit Tests
- [ ] Run unit tests
  ```bash
  pnpm run test:run
  ```
- [ ] Expected: All tests passing
- [ ] Coverage: ≥ 85%

### E2E Tests (Playwright)
- [ ] Install Playwright browsers
  ```bash
  pnpm run playwright:install
  ```
- [ ] Run E2E test suite
  ```bash
  pnpm run test:e2e
  # Expected: 470+ tests passing
  ```
- [ ] Verify mobile responsiveness tests pass
- [ ] Verify MCP interface tests pass
- [ ] No flaky tests

### Test Coverage
- [ ] Mobile responsiveness: ✓ PASS
- [ ] Touch target validation: ✓ PASS
- [ ] Safe-area inset handling: ✓ PASS
- [ ] Responsive grid layout: ✓ PASS
- [ ] MCP server connection: ✓ PASS
- [ ] Request building: ✓ PASS
- [ ] Response display: ✓ PASS
- [ ] Error handling: ✓ PASS

---

## Phase 5: Manual Device Testing

### Mobile Devices

#### iPhone (iOS 16+)
- [ ] iPhone 13 - Portrait: Touch targets 44px+, layout correct
- [ ] iPhone 13 - Landscape: Safe-area respected, no cutoff
- [ ] iPhone SE - Portrait: Single-column layout, readable
- [ ] iPhone SE - Landscape: Proper rotation handling

#### Android Phones
- [ ] Pixel 5 - Portrait: Responsive, no jank
- [ ] Pixel 5 - Landscape: Layout adapts correctly
- [ ] Galaxy S20 - Portrait: Touch interactions responsive
- [ ] Galaxy S20 - Landscape: Content visible, no overflow

### Tablets
- [ ] iPad Air - Portrait: Two-column layout
- [ ] iPad Air - Landscape: Three-column layout (if available)
- [ ] iPad Pro 11" - Both orientations: Layout correct

### Desktop
- [ ] 1366px width: Three-column layout visible
- [ ] 1920px width: Proper spacing, no text overflow
- [ ] 2560px width: Content centered, readable

### Device-Specific Checks
- [ ] Notch/Island (iPhone 13+): Header respects safe-area-inset-top
- [ ] Home indicator (iPhone): Footer respects safe-area-inset-bottom
- [ ] Status bar (Android): Content not behind system UI
- [ ] Keyboard visibility: Input fields scroll into view

---

## Phase 6: Performance Testing

### Lighthouse Audit
- [ ] Run Lighthouse on production build
  ```bash
  lighthouse https://localhost:3000/mcp --view
  ```
- [ ] Performance score: ≥ 90
- [ ] Accessibility score: ≥ 95
- [ ] Best Practices score: ≥ 90
- [ ] SEO score: ≥ 90
- [ ] PWA score: ≥ 85 (if applicable)

### Core Web Vitals
- [ ] Largest Contentful Paint (LCP): < 2.5s ✓
- [ ] First Input Delay (FID) / Interaction to Next Paint (INP): < 100ms ✓
- [ ] Cumulative Layout Shift (CLS): < 0.1 ✓
- [ ] First Contentful Paint (FCP): < 1.8s ✓
- [ ] Time to Interactive (TTI): < 3.5s ✓

### Bundle Size Analysis
- [ ] Main bundle: < 200KB gzipped
- [ ] Chunk sizes optimized
- [ ] No duplicate dependencies
- [ ] Lazy loading working for routes

### Memory Profiling
- [ ] Chrome DevTools Memory tab: No memory leaks
- [ ] Open/close MCP page multiple times: Memory stable
- [ ] No detached DOM nodes accumulating

---

## Phase 7: Accessibility Audit

### WCAG 2.1 AA Compliance
- [ ] Color contrast: All text 4.5:1 or better
- [ ] Touch targets: All interactive elements 44×44px minimum
- [ ] Font size: Minimum 14px body text (16px on inputs)
- [ ] Focus indicators: Visible and high contrast
- [ ] Keyboard navigation: Tab through all elements, logical order

### Screen Reader Testing (macOS/iOS)
- [ ] VoiceOver reads content correctly
- [ ] All buttons are announced as buttons
- [ ] Links are announced as links
- [ ] Form inputs have associated labels
- [ ] Status messages announced (connected/connecting/error)

### Mobile Accessibility
- [ ] iOS VoiceOver: All content accessible
- [ ] Android TalkBack: All content accessible
- [ ] Voice control: Commands work on iPhone
- [ ] Magnification: Can zoom up to 200% without cutoff

### Semantic HTML
- [ ] Use `<header>`, `<main>`, `<footer>` tags
- [ ] Use `<section>` for card sections
- [ ] Use `<button>` for buttons (not `<div>`)
- [ ] Use `<input>` for forms
- [ ] ARIA labels where needed: `aria-label`, `aria-describedby`

---

## Phase 8: Browser Compatibility

### Desktop Browsers
- [ ] Chrome 90+: Renders correctly
- [ ] Firefox 88+: Renders correctly
- [ ] Safari 14+: Renders correctly
- [ ] Edge 90+: Renders correctly

### Mobile Browsers
- [ ] Chrome Android: Renders correctly
- [ ] Safari iOS: Renders correctly
- [ ] Firefox Android: Renders correctly
- [ ] Samsung Internet: Renders correctly

### CSS Feature Support
- [ ] CSS Grid: Supported
- [ ] Backdrop filter: Works (with fallback)
- [ ] CSS variables: Supported
- [ ] Safe-area-inset: Supported

---

## Phase 9: Security Review

### Input Validation
- [ ] All user inputs validated
- [ ] Request builder sanitizes JSON input
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks (if applicable)

### Dependencies
- [ ] Run security audit
  ```bash
  npm audit
  # Expected: 0 vulnerabilities
  ```
- [ ] No expired dependencies
- [ ] All packages up to date

### Data Handling
- [ ] No sensitive data in localStorage
- [ ] Tokens stored securely
- [ ] API requests use HTTPS
- [ ] CORS headers configured

---

## Phase 10: Documentation Review

### Code Documentation
- [ ] JSDoc comments on functions
- [ ] README.md updated with MCP interface info
- [ ] API documentation complete: `MCP_INTERFACE_API.md`
- [ ] Deployment guide exists: `MOBILE_UPGRADE_DEPLOYMENT.md`

### User Documentation
- [ ] Testing guide complete: `TESTING_GUIDE.md`
- [ ] Troubleshooting guide included
- [ ] Usage examples provided
- [ ] Screenshots/diagrams added (if applicable)

### Developer Documentation
- [ ] Component API documented
- [ ] State management (Zustand) documented
- [ ] MCP client usage examples
- [ ] Common issues and solutions listed

---

## Phase 11: Staging Deployment

### Build for Staging
- [ ] Create staging build
  ```bash
  pnpm run build
  ```
- [ ] No build errors or warnings
- [ ] Bundle analysis complete

### Deploy to Staging
- [ ] Deploy to staging environment
  ```bash
  vercel deploy
  ```
- [ ] Verify staging URL works
- [ ] Staging linked to correct database/APIs

### Staging Verification
- [ ] All routes load correctly
- [ ] Database connections work
- [ ] API endpoints respond correctly
- [ ] External services (MCP servers) accessible

---

## Phase 12: Final Production Checklist

### Pre-Deployment
- [ ] All tests passing (unit, E2E, accessibility)
- [ ] Lighthouse score ≥ 90 on all metrics
- [ ] Security audit: 0 vulnerabilities
- [ ] Code review completed
- [ ] Changelog updated
- [ ] Versioning bumped (semantic versioning)

### Deployment
- [ ] Create feature branch for final changes
- [ ] All commits squashed/organized
- [ ] Create pull request for review
- [ ] Get approval from team
- [ ] Deploy to production
  ```bash
  vercel deploy --prod
  ```

### Post-Deployment
- [ ] Verify production URL works
- [ ] Monitor error logs for 30 minutes
- [ ] Check Core Web Vitals in production
- [ ] Verify database connections
- [ ] Test MCP server connections
- [ ] Notify stakeholders of deployment

### Monitoring (First 24 Hours)
- [ ] Error rate: < 0.1%
- [ ] Page load time: < 2.5s (LCP)
- [ ] User interactions: Responsive (INP < 100ms)
- [ ] No major performance regressions
- [ ] User feedback: No critical issues

---

## Phase 13: Post-Launch Verification

### Analytics
- [ ] Track pageviews to `/mcp`
- [ ] Monitor bounce rate
- [ ] Track conversion/engagement metrics
- [ ] Check device breakdown (mobile vs desktop)

### User Feedback
- [ ] Monitor support tickets
- [ ] Collect user feedback
- [ ] Track reported issues
- [ ] Document improvements for next iteration

### Ongoing Monitoring
- [ ] Weekly performance reviews
- [ ] Monthly security audits
- [ ] Quarterly UX reviews
- [ ] Continuous integration active

---

## Quick Verification Command

Run this single command to verify everything is ready:

```bash
#!/bin/bash
set -e

echo "🔍 Starting comprehensive verification..."

echo "✓ Type checking..."
pnpm run type-check

echo "✓ Building..."
pnpm run build

echo "✓ Running tests..."
pnpm run test:run

echo "✓ Running E2E tests..."
pnpm run test:e2e

echo "✓ Linting..."
pnpm run lint

echo "✓ All checks passed! Ready for deployment."
```

**Save as**: `verify.sh`  
**Run with**: `chmod +x verify.sh && ./verify.sh`

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | - | - | ⏳ Pending |
| QA | - | - | ⏳ Pending |
| DevOps | - | - | ⏳ Pending |
| Product | - | - | ⏳ Pending |

---

## Notes

- All timestamps in UTC
- Keep this document updated with test results
- Tag commits with version numbers
- Maintain changelog of all changes

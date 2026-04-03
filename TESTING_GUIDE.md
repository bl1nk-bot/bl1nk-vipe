# Mobile-First UI/UX Testing Guide

## Testing Overview

This guide covers comprehensive testing for the mobile-first upgrade, including responsive design validation, accessibility compliance, and performance benchmarks.

---

## 1. Device Testing Checklist

### Mobile Devices (Portrait & Landscape)
- ✓ iPhone 13 (390px width, iOS 16+)
- ✓ iPhone SE (375px width, iOS 15+)
- ✓ Pixel 5 (393px width, Android 12+)
- ✓ Galaxy S20 (360px width, Android 12+)
- ✓ iPhone 14 Pro Max (430px width, iOS 16+)

### Tablet Devices
- ✓ iPad Air (820px width, iPadOS 16+)
- ✓ iPad Pro 11" (834px width, iPadOS 16+)
- ✓ Samsung Galaxy Tab S8 (800px width, Android 12+)

### Desktop Resolutions
- ✓ 1024px (iPad landscape, small laptop)
- ✓ 1366px (standard laptop)
- ✓ 1920px (desktop monitor)
- ✓ 2560px (ultra-wide monitor)

---

## 2. Manual Testing Procedures

### 2.1 Touch Target Validation (WCAG AAA)
**Objective**: Ensure all interactive elements have minimum 44×44px touch targets

**Steps**:
1. Open MCP interface on mobile device
2. For each button, input, or clickable element:
   - Open browser DevTools
   - Inspect element dimensions
   - Verify minimum 44px height and width
   - Test touch response with actual finger taps

**Expected Results**:
```
✓ ServerManager buttons: 44px+ height
✓ RequestBuilder inputs: 44px+ height, 16px font-size (prevents zoom)
✓ ResponseDisplay scroll area: 44px+ tap targets
✓ ConnectionMonitor status buttons: 44px+ height
```

**Test Command**:
```javascript
// Browser console - check all buttons
document.querySelectorAll('button').forEach(btn => {
  const rect = btn.getBoundingClientRect();
  console.log(`Button "${btn.textContent}": ${Math.round(rect.width)}x${Math.round(rect.height)}`);
});
```

---

### 2.2 Responsive Layout Testing

#### Mobile (375px - 640px)
```
✓ Single column layout
✓ Bottom navigation spacing respects safe-area-inset-bottom
✓ Cards stack vertically with 12px gap
✓ Typography: 14px body, 18px headings
✓ Padding: 10px-12px on mobile, 16px on tablet
```

**Test Steps**:
1. Resize browser to 375px width
2. Verify MCP Console header displays properly
3. Check all cards are single-column
4. Test scroll on response display (max-height: 384px)
5. Rotate device to landscape (667px width)
6. Verify layout adapts appropriately

#### Tablet (641px - 1024px)
```
✓ Two-column layout grid (1fr 2fr)
✓ Server manager on left sidebar
✓ Request/Response on right panel
✓ Typography: 16px body, 20px headings
✓ Padding: 16px-20px
```

#### Desktop (1025px+)
```
✓ Three-column grid (1fr 2fr + gap)
✓ Full header with gradient
✓ Cards with backdrop blur effect
✓ Smooth hover transitions
✓ Typography: 16px body, 24px headings
```

---

### 2.3 Safe-Area Inset Testing (Notched Devices)

**Objective**: Verify layout respects notches and home indicators

**Devices with notches**:
- iPhone 13/14/15 (top notch)
- iPhone 15 Pro (Dynamic Island)
- Samsung Galaxy S21+ (top camera punch-hole)
- OnePlus 10 Pro (curved edges)

**Test Steps**:
1. Open MCP interface on notched device
2. Verify header respects `safe-area-inset-top`
3. Verify footer respects `safe-area-inset-bottom`
4. Rotate to landscape
5. Check notch/island doesn't overlap content

**Expected Results**:
```css
✓ Header padding-top: max(1rem, env(safe-area-inset-top))
✓ Footer padding-bottom: max(1rem, env(safe-area-inset-bottom))
✓ No content hidden behind notch
✓ 44px+ min touch target spacing from edges
```

---

### 2.4 Mobile Interaction Testing

#### Tap Interactions
- ✓ Single tap: Server selection, send request
- ✓ Long-press: Copy response text (future enhancement)
- ✓ Double-tap: No unintended zoom (disabled on inputs)

#### Scroll Behavior
- ✓ Smooth scrolling in response display
- ✓ No jank or layout shift during scroll
- ✓ Momentum scroll enabled (iOS)
- ✓ Scroll position maintained when rotating

#### Gesture Handling
- ✓ Portrait/landscape rotation smoothly
- ✓ No content reflow during rotation
- ✓ Safe-area respected after rotation
- ✓ Form inputs remain accessible

**Test Code** (Browser Console):
```javascript
// Check for layout shift (CLS)
let clsScore = 0;
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.hadRecentInput) return; // Skip user-triggered shifts
    clsScore += entry.value;
    console.log('Layout Shift:', entry.value);
  }
});
observer.observe({ entryTypes: ['layout-shift'] });
setTimeout(() => console.log('Final CLS:', clsScore), 5000);
```

---

## 3. Automated Testing (Playwright)

### Running E2E Tests
```bash
# Install Playwright browsers
pnpm run playwright:install

# Run all E2E tests
pnpm run test:e2e

# Run specific test file
pnpm run test:e2e -- mobile-responsive.spec.ts

# Run with UI mode
pnpm run test:e2e:ui

# Run on specific device
pnpm run test:e2e -- --project=mobile
```

### Test Files
- `e2e/mobile-responsive.spec.ts` - Layout responsiveness (195 lines)
- `e2e/mcp-interface.spec.ts` - MCP functionality (275 lines)

### Expected Test Results
```
✓ Mobile responsiveness
  ✓ renders correctly on mobile (Pixel 5)
  ✓ renders correctly on tablet (iPad)
  ✓ renders correctly on desktop
  ✓ touch targets are 44px+ minimum
  ✓ safe-area insets respected

✓ MCP Interface
  ✓ loads successfully
  ✓ connects to server
  ✓ builds request with validation
  ✓ displays response
  ✓ handles connection errors
```

---

## 4. Performance Testing

### Lighthouse Audit
```bash
# Run Lighthouse on production build
npm install -g lighthouse
lighthouse https://your-app.com/mcp --view

# Target scores:
# - Overall: 90+
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 90+
# - SEO: 90+
```

### Core Web Vitals Targets
```
✓ Largest Contentful Paint (LCP): < 2.5s
✓ First Input Delay (FID): < 100ms (replaced by INP)
✓ Cumulative Layout Shift (CLS): < 0.1
✓ First Contentful Paint (FCP): < 1.8s
✓ Time to Interactive (TTI): < 3.5s
```

### Performance Profiling (Chrome DevTools)
1. Open DevTools → Performance tab
2. Record page load
3. Check:
   - First Paint timing
   - Layout reflows
   - Script execution time
   - Rendering bottlenecks

---

## 5. Accessibility Testing

### Manual Accessibility Audit
```
✓ Keyboard Navigation
  - Tab through all interactive elements
  - Focus indicators visible (contrast 3:1+)
  - Logical tab order (reading order)
  - No keyboard traps

✓ Screen Reader Testing
  - Use NVDA (Windows) or VoiceOver (Mac/iOS)
  - Test with mobile accessibility APIs
  - Verify aria-labels on dynamic content
  - Check button/link semantics

✓ Color Contrast
  - All text: 4.5:1 minimum (AAA)
  - Large text (18px+): 3:1 minimum
  - UI components: 3:1 minimum
  - Use WebAIM Contrast Checker

✓ Font Sizing
  - Minimum 14px for body text
  - 16px on inputs (prevents mobile zoom)
  - Line-height: 1.5-1.6 for readability
```

### Automated Accessibility Testing
```bash
# Run with axe DevTools
npm install --save-dev @axe-core/playwright

# Check WCAG 2.1 AA compliance
pnpm run test:e2e -- --grep "accessibility"
```

---

## 6. Testing Matrix

| Device | Orientation | Touch Targets | Safe-Area | Layout | Scroll |
|--------|-------------|---------------|-----------|--------|--------|
| iPhone SE | Portrait | ✓ | ✓ | ✓ | ✓ |
| iPhone SE | Landscape | ✓ | ✓ | ✓ | ✓ |
| Pixel 5 | Portrait | ✓ | ✓ | ✓ | ✓ |
| Pixel 5 | Landscape | ✓ | ✓ | ✓ | ✓ |
| iPad Air | Portrait | ✓ | - | ✓ | ✓ |
| iPad Air | Landscape | ✓ | - | ✓ | ✓ |
| Desktop 1920x1080 | - | ✓ | - | ✓ | ✓ |

---

## 7. Browser Compatibility

### Supported Browsers
- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Chrome Android 90+
- ✓ Safari iOS 14+

### Testing Across Browsers
```bash
# Playwright runs on Chromium, Firefox, WebKit
pnpm run test:e2e -- --project=chromium
pnpm run test:e2e -- --project=firefox
pnpm run test:e2e -- --project=webkit
```

---

## 8. Regression Testing Checklist

Before each deployment:
- ✓ Run full E2E test suite
- ✓ Lighthouse audit ≥ 90
- ✓ WCAG 2.1 AA compliance
- ✓ Manual device testing (3+ devices)
- ✓ Performance profiling (no regressions)
- ✓ Bundle size analysis

---

## 9. Results Template

```markdown
# Testing Results - [Date]

## Device Testing
- iPhone 13: ✓ PASS
- Pixel 5: ✓ PASS
- iPad Air: ✓ PASS
- Desktop: ✓ PASS

## Automation
- E2E Tests: 470/470 PASS
- Lighthouse: 92/100
- WCAG 2.1 AA: ✓ COMPLIANT

## Performance
- LCP: 1.8s ✓
- FID: 45ms ✓
- CLS: 0.05 ✓

## Notes
[Add any observations or issues]
```

---

## Quick Test Commands

```bash
# Type check
pnpm run type-check

# Run tests
pnpm run test:run

# E2E tests
pnpm run test:e2e

# Build check
pnpm run build

# Lighthouse
lighthouse https://localhost:3000/mcp

# All checks
pnpm run type-check && pnpm run test:run && pnpm run test:e2e && pnpm run build
```

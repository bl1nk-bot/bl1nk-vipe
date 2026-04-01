# Web Templates Documentation

## Overview

The `@qwen-code/web-templates` package provides a comprehensive set of web templates and UI generators for rapidly building modern web applications. It integrates seamlessly with the Qwen Code ecosystem to enable AI-powered web development.

## Key Features

### Template Generators

- **React Component Templates**: Pre-built templates for common React patterns
- **Page Layouts**: Ready-to-use page structures (landing, dashboard, auth, etc.)
- **UI Component Library**: Interactive components (forms, dialogs, navigation)
- **API Integration**: Built-in patterns for data fetching and state management
- **Responsive Design**: Mobile-first templates with CSS Grid and Flexbox
- **Accessibility**: A11Y-compliant templates with screen reader support

### Theme Management

```javascript
// Automatic theme generation
const theme = webTemplates.generateTheme({
  primary: '#007bff',
  secondary: '#6c757d',
  mode: 'auto' // light/dark/auto
})
```

### Component Variants

```javascript
// Template-based component generation
const { Button } = webTemplates.useTemplate('button', {
  variants: ['primary', 'secondary', 'danger'],
  sizes: ['sm', 'md', 'lg'],
  states: ['hover', 'focus', 'disabled']
})
```

## Usage Examples

### Basic Component Generation

```javascript
import { webTemplates } from '@qwen-code/web-templates'

// Generate a complete dashboard layout
const dashboard = webTemplates.generate('dashboard', {
  title: 'Vibe Coding Agent',
  navigation: ['chat', 'files', 'settings', 'analytics'],
  metrics: ['users', 'sessions', 'trials', 'revenue']
})

// Generate responsive card grid
const cardGrid = webTemplates.generate('card-grid', {
  items: agentMetrics,
  columns: { sm: 1, md: 2, lg: 3 },
  gap: 'lg'
})

// Generate form with validation
const agentForm = webTemplates.generate('form', {
  schema: agentCreationSchema,
  submitText: 'Create Agent',
  validation: 'zod'
})
```

### Theme Customization

```javascript
// Custom branding theme
const customTheme = webTemplates.customizeTheme({
  name: 'vibe-theme',
  colors: {
    primary: '#8b5cf6',    // Violet
    secondary: '#06b6d4',  // Cyan
    success: '#10b981',    // Emerald
    warning: '#f59e0b',    // Amber
    error: '#ef4444'        // Red
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  spacing: {
    unit: 8, // 8px base unit
    scale: [0, 4, 8, 16, 24, 32, 48, 64, 96, 128]
  }
})
```

### Interactive Templates

```javascript
// Carbon calculator interactive component
const carbonCalculator = webTemplates.interactive('carbon-calculator', {
  type: 'modal',
  size: 'md',
  inputs: [
    { name: 'energyUsage', type: 'number', unit: 'kWh/month' },
    { name: 'transportType', type: 'select', options: ['car', 'public', 'bike'] }
  ],
  calculations: [
    { name: 'monthlyFootprint', unit: 'CO₂ tons' },
    { name: 'annualSavings', unit: '$' }
  ]
})

// Agent activity heatmap
const activityHeatmap = webTemplates.interactive('activity-heatmap', {
  data: agentActivityData,
  timeRange: '30d',
  metrics: ['commands', 'tokens', 'errors'],
  thresholds: {
    high: 100,   // requests per hour
    medium: 50,
    low: 10
  }
})
```

## Integration with AI Agents

### Template Suggestion API

```javascript
// Get AI-powered template suggestions
const suggestions = await webTemplates.suggestTemplates({
  requirements: agentRequirements,
  context: 'dashboard',
  userPreferences: {
    framework: 'react',
    styling: 'tailwind',
    accessibility: true,
    responsive: true
  }
})

// Suggested templates:
// - 'agent-dashboard' (95% match)
// - 'activity-widget' (87% match)
// - 'agent-onboarding' (82% match)
```

### Component Auto-optimization

```javascript
// Automatically optimize components based on usage analytics
const optimizedDashboard = await webTemplates.optimize(dashboard, {
  analytics: {
    clicks: pageAnalytics.clicks,
    views: pageAnalytics.views,
    conversions: pageAnalytics.conversions
  },
  optimization: {
    loadTime: '< 500ms',
    bundleSize: '< 200KB',
    paintTime: '< 100ms'
  }
})
```

## Pre-built Templates

### Dashboard Templates

- **Agent Dashboard**: Session monitoring, activity logs, metrics
- **Developer Dashboard**: Code stats, repository analytics, CI/CD status
- **Analytics Dashboard**: Customizable charts, filters, data exports
- **Control Panel**: Settings, user management, permissions

### Page Templates

- **Landing Page**: Hero section, features, testimonials, CTA
- **Authentication**: Login, register, password reset, MFA
- **Onboarding**: Step-by-step wizard, tutorials, progress tracking
- **Documentation**: Searchable docs, code samples, navigation

### Component Templates

- **Data Visualization**: Charts, graphs, maps, heatmaps
- **Forms**: Input validation, wizards, file uploads, surveys
- **Navigation**: Sidebars, breadcrumbs, tabs, menus
- **Feedback**: Modals, notifications, progress bars, tooltips

## Styling Integration

### Tailwind CSS Integration

```javascript
const tailwindConfig = webTemplates.generateTailwindConfig({
  templates: ['dashboard', 'forms', 'navigation'],
  customColors: {
    'agent-primary': '#8b5cf6',
    'agent-secondary': '#06b6d4'
  },
  utilities: [
    'animate-pulse-agent',
    'bg-gradient-vibe'
  ]
})
```

### CSS Modules Support

```javascript
// Generated CSS modules
import styles from './dashboard.module.css'

// Usage in components
<div className={styles.agentCard}>
  <img src={agent.avatar} alt={agent.name} />
  <div className={styles.agentInfo}>
    <h3>{agent.name}</h3>
    <p>{agent.status}</p>
  </div>
</div>
```

## Performance Features

### Lazy Loading

```javascript
// Automatic code splitting and lazy loading
const lazyComponents = webTemplates.lazy({
  'AgentChart': () => import('./charts/AgentChart'),
  'ActivityTimeline': () => import('./components/ActivityTimeline'),
  'CommandLog': () => import('./logs/CommandLog')
})

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <lazyComponents.AgentChart data={agentData} />
</Suspense>
```

### Bundle Optimization

```javascript
// Automatic bundle splitting based on usage
const { dashboardBundle, adminPanel } = webTemplates.optimizeBundle({
  entryPoints: ['dashboard', 'admin'],
  vendorChunks: ['react', 'chart-js', 'date-fns'],
  dynamicImports: ['heavy-analytics', 'complex-forms'],
  compression: ['gzip', 'brotli']
})
```

## Accessibility Features

### A11Y Compliance

```javascript
// Generate accessible components
const accessibleButton = webTemplates.accessible('button', {
  label: 'Start Agent Session',
  type: 'primary',
  aria: {
    describedby: 'session-help',
    expanded: false,
    controls: 'session-modal'
  },
  keyboard: {
    shortcut: 'Ctrl+Enter'
  }
})
```

### Screen Reader Support

```javascript
const screenReaderUpdates = webTemplates.srUpdates('status', {
  message: 'Agent session started successfully',
  priority: 'polite',
  live: true  // aria-live region
})
```

## API Integration

### RESTful API Patterns

```javascript
// Generated API client
const agentApi = webTemplates.generateApiClient('agent', {
  baseURL: process.env.AGENT_API_URL,
  endpoints: {
    'sessions': { method: 'GET', auth: true },
    'start': { method: 'POST', auth: true, body: 'sessionData' },
    'stop': { method: 'DELETE', auth: true, params: 'sessionId' },
    'logs': { method: 'GET', auth: true, query: 'pagination' }
  },
  errorHandling: 'toast',
  retry: { attempts: 3, backoff: 'exponential' }
})
```

### GraphQL Integration

```javascript
const agentGraphQL = webTemplates.generateGraphQLClient({
  endpoint: '/api/graphql',
  queries: {
    'agentActivity': gql`
      query AgentActivity($agentId: ID!, $timeframe: String!) {
        agent(id: $agentId) {
          activity(timeframe: $timeframe) {
            commands { timestamp, command, duration }
            sessions { startedAt, endedAt, status }
            errors { count, messages }
          }
        }
      }
    `
  },
  subscriptions: {
    'activityUpdates': gql`
      subscription ActivityUpdates($agentId: ID!) {
        activityUpdated(agentId: $agentId) {
          type
          data
        }
      }
    `
  }
})
```

## Testing Utilities

### Component Testing Helpers

```javascript
// Auto-generated test utilities
const { renderAgentCard, mockAgentData } = webTemplates.testing('agent-card', {
  mocks: ['apiResponses', 'userEvents'],
  assertions: ['renders correctly', 'handles loading', 'displays errors'],
  interactions: ['click start', 'view details', 'stop session']
})
```

### End-to-End Test Scenarios

```javascript
const e2eScenarios = webTemplates.e2eTests('agent-dashboard', {
  scenarios: [
    'create new agent',
    'monitor agent activity',
    'handle connection loss',
    'export activity data'
  ]
})
```

## Deployment Ready

### Build Optimization

```javascript
// Production-optimized builds
const productionBuild = webTemplates.build('agent-app', {
  optimization: {
    minify: 'terser',
    splitChunks: 'all',
    compress: 'gzip',
    cdn: 'https://cdn.vibe-coding-agent.com'
  },
  monitoring: {
    analytics: 'plausible',
    errorReporting: 'sentry',
    performance: 'web-vitals'
  },
  seo: {
    prerender: '/dashboard',
    sitemap: true,
    metaTags: {
      'twitter:card': 'summary_large_image',
      'og:image': 'preview.jpg'
    }
  }
})
```

### CDN Integration

```javascript
// Automatic CDN deployment
await webTemplates.deploy(build, {
  provider: 'vercel',
  environment: 'production',
  cdn: {
    assets: ['/static/*', '/images/*'],
    caching: {
      '/*': 'max-age=31536000',
      '/api/*': 'no-cache',
      '/dashboard/*': 'private,no-cache'
    }
  },
  domains: ['vibe-coding-agent.com', 'app.vibe-coding-agent.com']
})
```

## Advanced Usage

### Custom Template Creation

```javascript
// Create custom templates
const agentCustomTemplates = webTemplates.defineTemplates({
  'agent-chat-bubble': {
    component: ({ message, type }) => `
      <div class="chat-bubble chat-bubble--${type}">
        <div class="bubble-content">${message.text}</div>
        <time class="bubble-timestamp">${message.timestamp}</time>
      </div>
    `,
    styles: `
      .chat-bubble--agent { float: left; margin-right: 50%; }
      .chat-bubble--user { float: right; margin-left: 50%; }
      .bubble-content { padding: 12px; border-radius: 18px; }
      .bubble-timestamp { font-size: 11px; color: #666; margin-top: 4px; }
    `,
    variants: ['success', 'error', 'thinking']
  }
})
```

### AI-Enhanced Generation

```javascript
// Let AI generate templates based on requirements
const result = await webTemplates.ai.generate({
  description: 'Dashboard for monitoring AI agent activity',
  requirements: [
    'Real-time activity feed',
    'Resource utilization charts',
    'Error rate monitoring',
    'Command execution history'
  ],
  styling: {
    colorScheme: 'dark-theme',
    componentLibrary: 'shadcn/ui',
    responsiveness: 'mobile-first'
  },
  integrations: [
    'WebSocket for live updates',
    'Charts.js for data visualization',
    'React Query for state management'
  ]
})
```
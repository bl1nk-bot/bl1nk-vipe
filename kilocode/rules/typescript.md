# KiloCode Rules for TypeScript

## General Principles

- **Type Safety First**: Prefer strict typing over `any`. Use union types, discriminated unions, and branded types where appropriate.
- **Explicit is Better Than Implicit**: Avoid implicit `any`, unused variables, and unclear variable names.
- **Performance Matters**: Use `const` assertions, avoid unnecessary object creation, and prefer inline array methods over loops.
- **Null Safety**: Use strict null checks (`!== null`), optional chaining (`?.`), and nullish coalescing (`??`) consistently.

## File Organization

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── forms/       # Form components
├── lib/
│   ├── utils/       # Utility functions
│   ├── types/       # TypeScript type definitions
│   └── constants/   # Application constants
├── hooks/           # Custom React hooks
├── services/        # External API integrations
├── stores/          # State management
└── pages/           # Page components (if using Next.js pages router)
```

## Naming Conventions

- **Variables**: camelCase (`userName`, `isActive`)
- **Functions**: camelCase (`getUserData()`, `formatDate()`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Components**: PascalCase (`UserProfile`)
- **Custom Hooks**: `use*` pattern (`useAuth()`, `useLocalStorage()`)

## TypeScript Best Practices

### 1. Type Definitions
```typescript
// ✅ Good: Explicit types
interface User {
  readonly id: string
  name: string
  email: string
  createdAt: Date
  preferences?: UserPreferences
}

// ❌ Bad: Implicit types or any
function createUser(data: any) { /* ... */ }
```

### 2. Union Types and Type Guards
```typescript
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse

function isSuccess<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return 'data' in response
}

const result = await apiCall()
if (isSuccess(result)) {
  console.log(result.data) // TypeScript knows this is SuccessResponse
}
```

### 3. Discriminated Unions
```typescript
type WorkflowType = 'issue' | 'pr' | 'notebook'

type WorkflowParams =
  | { type: 'issue'; repo: string; issueNumber: number }
  | { type: 'pr'; repo: string; prNumber: number }
  | { type: 'notebook'; notebookPath: string }
```

### 4. Generic Constraints
```typescript
function processItems<T extends { id: string; name: string }>(
  items: T[],
  processor: (item: T) => Promise<void>
): Promise<void> {
  return Promise.all(items.map(processor)).then(() => void 0)
}
```

## React Component Patterns

### Function Components with Hooks
```typescript
interface Props {
  user: User
  onUpdate: (user: User) => void
}

export function UserCard({ user, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  // ... component logic
}
```

### Custom Hooks Pattern
```typescript
export function useUserProfile(userId: string) {
  return useSWR(['/api/user', userId], fetcher, {
    refreshInterval: 30000,
  })
}
```

## Error Handling

### Async Operations
```typescript
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    // Use rich error types for better debugging
    throw new TechnicalError({
      cause: error,
      domain: 'user-service',
      message: `Failed to fetch user ${userId}`,
    })
  }
}
```

### Error Boundaries
```typescript
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to external service
    errorReporting.captureException(error, { extra: errorInfo })
  }
}
```

## Testing Guidelines

- **Unit Tests**: Business logic, utility functions, custom hooks
- **Integration Tests**: API calls, database operations
- **End-to-End Tests**: Critical user flows
- **Test Naming**: `describe('ComponentName', () => { it('should do X when Y', () => {}) })`

## Performance Considerations

- **React Memoization**: Use `React.memo()`, `useMemo()`, `useCallback()` strategically
- **Bundle Analysis**: Regularly analyze bundle size and splitting
- **Image Optimization**: Use Next.js `Image` component or similar optimization
- **Data Fetching**: Implement proper caching and suspense patterns

## Code Quality Tools

- **Biome**: Linting and formatting
- **TypeScript Strict Mode**: Enable all strict settings
- **ESLint**: For additional React-specific rules
- **Playwright**: E2E testing
- **Knip**: Unused dependency detection

## Continuous Integration

- **Pre-commit Hooks**: Run linting and formatting
- **CI Pipeline**: Type checking, tests, bundle analysis
- **Code Review**: Require at least 1 approval with critical path review
- **Automated Checks**: Security scanning, dependency updates

## Documentation

- **Inline Comments**: For complex logic only
- **JSDoc**: For public APIs and interfaces
- **README**: Per package/feature directory
- **Architecture Docs**: System design and data flow diagrams
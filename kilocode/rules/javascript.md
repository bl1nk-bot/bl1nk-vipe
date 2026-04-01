# KiloCode Rules for JavaScript

## Language Fundamentals

- **Modern JavaScript**: Use ES2022+ features where appropriate (optional chaining, nullish coalescing, logical assignment)
- **Functional Programming**: Prefer functional patterns over imperative code where it improves clarity
- **Immutability**: Avoid mutations when possible, use spread/rest operators
- **Explicit Intent**: Make code intentions clear through naming and structure

## Project Structure

```
src/
├── components/
├── utils/
├── services/
├── constants/
├── types/          # JSDoc or TypeScript types
├── hooks/          # React hooks
└── index.js
```

## Naming Conventions

- **Variables/Functions**: camelCase (`userName`, `getUserData()`)
- **Classes**: PascalCase (`UserService`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Private Members**: leading underscore (`_privateMethod()`)
- **File Names**: kebab-case (`user-service.js`, `user-utils.js`)

## Code Patterns

### Arrow Functions vs Function Declarations

```javascript
// ✅ Preferred: consistent arrow functions
const getUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ✅ Acceptable: function declarations for hoisting
function createUser(data) {
  return fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

### Object Destructuring

```javascript
// ✅ Good: destructuring for clarity
const { name, email, ...rest } = user
const result = await processUser({ name, email })

// ❌ Bad: unnecessary destructuring
const userName = user.name
const userEmail = user.email
```

### Array Methods

```javascript
// ✅ Prefer: functional array methods
const activeUsers = users.filter(user => user.isActive)
const userNames = users.map(user => user.name)
const totalAge = users.reduce((sum, user) => sum + user.age, 0)

// ✅ Avoid: unnecessary mutations
const newArray = [...originalArray] // Copy instead of splice
```

## Async Programming

### Async/Await Pattern

```javascript
// ✅ Good: explicit error handling
const fetchUserData = async (userId) => {
  try {
    const [user, posts] = await Promise.all([
      fetch(`/api/users/${userId}`),
      fetch(`/api/users/${userId}/posts`)
    ])

    return {
      user: await user.json(),
      posts: await posts.json()
    }
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`)
  }
}

// ✅ Good: graceful error handling
const fetchUserSafely = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('User fetch failed:', error)
    return null
  }
}
```

### Promise Patterns

```javascript
// ✅ Good: Promise.all for parallel operations
const fetchMultipleUsers = async (userIds) => {
  const promises = userIds.map(id => fetchUser(id))
  return Promise.all(promises)
}

// ✅ Good: Promise.allSettled for mixed success/failure
const fetchWithPartial = async (userIds) => {
  const results = await Promise.allSettled(userIds.map(id => fetchUser(id)))
  return results.filter(result => result.status === 'fulfilled').map(r => r.value)
}
```

## Data Structures

### Objects and Immutability

```javascript
// ✅ Good: immutable updates
const updateUser = (user, updates) => ({
  ...user,
  ...updates,
  updatedAt: new Date()
})

// ✅ Good: computed properties
const userView = (user) => ({
  ...user,
  displayName: `${user.firstName} ${user.lastName}`,
  isActive: user.status === 'active'
})
```

### Arrays and Mutations

```javascript
// ✅ Good: functional approach
const addItem = (array, item) => [...array, item]
const removeItem = (array, index) => array.filter((_, i) => i !== index)
const updateItem = (array, index, newItem) =>
  array.map((item, i) => i === index ? newItem : item)
```

## Error Handling

### Try-Catch Blocks

```javascript
const processData = async (data) => {
  try {
    const validated = validateData(data)
    const result = await processValidatedData(validated)
    return { success: true, result }
  } catch (error) {
    return handleError(error)
  }
}

const handleError = (error) => {
  // Centralized error handling
  if (error.name === 'ValidationError') {
    return { success: false, type: 'validation', message: error.message }
  }

  if (error.name === 'NetworkError') {
    return { success: false, type: 'network', message: 'Network request failed' }
  }

  return {
    success: false,
    type: 'unknown',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An unknown error occurred'
  }
}
```

### Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field, value) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.value = value
  }
}

class NetworkError extends Error {
  constructor(message, status, url) {
    super(message)
    this.name = 'NetworkError'
    this.status = status
    this.url = url
  }
}
```

## Functional Programming

### Pure Functions

```javascript
// ✅ Good: pure functions
const calculateTotal = (items, taxRate) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return subtotal * (1 + taxRate)
}

// ✅ Good: immutability maintained
const addTax = (item, taxRate) => ({
  ...item,
  price: item.price * (1 + taxRate)
})
```

### Higher-Order Functions

```javascript
// ✅ Good: reusable data processing
const processUsers = (users, predicate = () => true) => {
  return users
    .filter(predicate)
    .map(user => ({ ...user, displayName: formatUserName(user) }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}

const activeUsers = processUsers(users, user => user.isActive)
const adminUsers = processUsers(users, user => user.role === 'admin')
```

## Module System

### ES Modules

```javascript
// userService.js
export const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  return response.json()
}

export const getUser = async (userId) => {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) throw new Error('User not found')
  return response.json()
}

export default { createUser, getUser }

// Usage in other files
import { createUser, getUser } from './userService.js'
import userService from './userService.js'  // default import
```

## Performance Considerations

### Memory Management

```javascript
// ✅ Good: memory-efficient processing
const processLargeArray = (array) => {
  // Use for...of instead of forEach for better performance
  for (const item of array) {
    processItem(item)  // Process synchronously to avoid memory buildup
  }
}

// ✅ Good: generator functions for large datasets
function* getLargeDataset() {
  let page = 1
  const pageSize = 100

  while (true) {
    const pageData = await fetchPage(page, pageSize)
async function* getLargeDataset() {

    for (const item of pageData) {
      yield item
    }
    page++
  }
}
```

### Debouncing and Throttling

```javascript
// ✅ Good: debounce for search inputs
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const searchUsers = debounce(async (query) => {
  const results = await searchAPI(query)
  displayResults(results)
}, 300)
```

## Security Best Practices

### Input Sanitization

```javascript
// ✅ Good: validate and sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') throw new Error('Input must be a string')
  return input.trim().replace(/[<>]/g, '')
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }
  return email.toLowerCase()
}
```

### Secure HTTP Requests

```javascript
// ✅ Good: secure defaults
const secureFetch = async (url, options = {}) => {
  const secureOptions = {
    credentials: 'same-origin',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    },
    ...options
  }

  const response = await fetch(url, secureOptions)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response
}
```

## Testing Guidelines

### Unit Tests

```javascript
// user.utils.test.js
describe('User Utilities', () => {
  describe('formatUserName', () => {
    test('formats full name correctly', () => {
      const user = { firstName: 'John', lastName: 'Doe' }
      expect(formatUserName(user)).toBe('John Doe')
    })

    test('handles missing names gracefully', () => {
      const user = { firstName: 'John' }
      expect(formatUserName(user)).toBe('John')
    })
  })
})
```

### Integration Tests

```javascript
// user.api.test.js
describe('User API', () => {
  beforeEach(() => {
    // Reset mocks, setup test database, etc.
  })

  test('creates user successfully', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' }

    // Mock API response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '123', ...userData })
    })

    const result = await createUser(userData)

    expect(result.id).toBeDefined()
    expect(result.name).toBe(userData.name)
  })
})
```

## Documentation

### JSDoc Comments

```javascript
/**
 * Creates a new user with the provided data.
 *
 * @param {Object} userData - User creation data
 * @param {string} userData.name - Full name of the user
 * @param {string} userData.email - Email address
 * @param {string} [userData.role='user'] - User role
 * @returns {Promise<Object>} Created user object with ID
 * @throws {ValidationError} When user data is invalid
 * @throws {NetworkError} When API request fails
 *
 * @example
 * const user = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 */
const createUser = async (userData) => {
  // Implementation
}
```

## Code Quality Tools

- **Biome**: Linting and formatting
- **Jest**: Unit and integration testing
- **Playwright**: E2E testing
- **Knip**: Unused dependency detection
- **Bundle Analyzer**: Bundle size analysis

## Deployment

- **Version Management**: Use semantic versioning
- **Environment Configuration**: Maintain separate configs for dev/staging/prod
- **Monitoring**: Implement error tracking and performance monitoring
- **Feature Flags**: Use for gradual rollouts and A/B testing
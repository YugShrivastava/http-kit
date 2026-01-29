# Testing Guide

This project uses Vitest for comprehensive unit and integration testing.

## Test Structure

```
tests/
├── setup.ts                          # Global test setup and mocks
├── factories.ts                      # Test data factories
├── unit/                             # Unit tests
│   ├── api-actions.test.ts          # API server actions tests
│   ├── bin-actions.test.ts          # Bin server actions tests
│   └── edge-cases.test.ts           # Comprehensive edge case tests
└── integration/                      # Integration tests
    ├── api-routes.test.ts           # /api/mock route tests
    ├── mock-api-routes.test.ts      # /api/mock/[id] route tests
    └── bin-routes.test.ts           # Bin route tests
```

## Running Tests

### Run all tests
```bash
npm run test
```

## Test Coverage

The test suite covers:

### Unit Tests
- **API Actions** (`api-actions.test.ts`)
  - Creating APIs with valid/invalid data
  - Updating API data
  - Deleting APIs
  - User validation
  - Error handling

- **Bin Actions** (`bin-actions.test.ts`)
  - Creating request bins
  - Deleting bins and cascade deletion of logs
  - Deleting individual request logs
  - Authorization checks
  - Error handling

- **Edge Cases** (`edge-cases.test.ts`)
  - Boundary conditions (max length inputs, empty strings)
  - Special characters and Unicode
  - Concurrent operations
  - Database constraints
  - Malformed input handling
  - Deep nesting and circular references
  - Race conditions
  - Memory/performance scenarios

### Integration Tests
- **API Routes** (`api-routes.test.ts`)
  - GET /api/mock - Fetching user APIs
  - Authorization via userid header
  - Empty states
  - Error responses

- **Mock API Routes** (`mock-api-routes.test.ts`)
  - GET/POST/PUT/PATCH/DELETE /api/mock/[id]
  - Token-based authentication
  - API data retrieval
  - Invalid token/API ID handling
  - All HTTP methods support
  - JSON and text data handling

- **Bin Routes** (`bin-routes.test.ts`)
  - GET /api/bin - Fetching user bins
  - ALL /api/bin/[id] - Request capture
  - Capturing all HTTP methods
  - Headers, query params, and body parsing
  - Concurrent request handling
  - Malformed data handling

## Mocking Strategy

### Prisma Client
All database operations are mocked using `vitest-mock-extended`. This allows us to:
- Test without a real database
- Control exact responses for each scenario
- Test error conditions easily

### Clerk Authentication
The `auth()` function from Clerk is mocked to return controlled user IDs for testing.

### Next.js APIs
NextRequest and NextResponse are mocked to simulate HTTP requests and responses.

## Writing New Tests

### Using Factories
```typescript
import { userFactory, apiFactory, binFactory, requestLogFactory } from '../factories';

// Create a test user
const user = userFactory();

// Create with overrides
const api = apiFactory({ userId: user.id, data: JSON.stringify({ custom: 'data' }) });
```

### Mocking Prisma Calls
```typescript
import { prismaMock } from '../setup';

prismaMock.user.findUnique.mockResolvedValue(user);
prismaMock.api.create.mockResolvedValue(api);
```

### Testing Server Actions
```typescript
const formData = new FormData();
formData.append('returnData', JSON.stringify({ test: 'data' }));

const result = await createMockApi(userId, formData);
expect(result).toEqual({ error: false });
```

### Testing API Routes
```typescript
const request = new NextRequest('http://localhost:3000/api/mock', {
  headers: { userid: user.id }
});

const response = await GET(request);
const data = await response.json();

expect(response.status).toBe(200);
expect(data.message).toBe('success');
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clear Mocks**: Always clear mocks in `beforeEach`
3. **Descriptive Names**: Test names should describe the scenario
4. **Edge Cases**: Always test happy path, error cases, and edge cases
5. **Factory Usage**: Use factories for consistent test data
6. **Async/Await**: Properly handle all async operations

## Debugging Tests

### Run a single test
```bash
npm test -- -t "should create a new API successfully"
```

### Enable verbose output
```bash
npm test -- --reporter=verbose
```

### Debug in VS Code
Add this to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 80%
- **Functions**: > 80%
- **Lines**: > 80%

View coverage report after running:
```bash
npm run test:coverage
open coverage/index.html
```
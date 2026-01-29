import { Api, Bin, RequestLog, User } from "@/generated/prisma/client";

export const userFactory = (overrides?: Partial<User>): User => ({
  id: 'user_test123',
  token: 'test_token_abc123xyz',
  ...overrides,
});

export const apiFactory = (overrides?: Partial<Api>): Api => ({
  id: 'api_test123',
  userId: 'user_test123',
  apiId: 'abc123',
  data: JSON.stringify({ feature: true, version: '1.0' }),
  ...overrides,
});

export const binFactory = (overrides?: Partial<Bin>): Bin => ({
  id: 'bin_test123',
  userId: 'user_test123',
  binId: 'xyz789',
  ...overrides,
});

export const requestLogFactory = (overrides?: Partial<RequestLog>): RequestLog => ({
  id: 'log_test123',
  binId: 'xyz789',
  method: 'POST',
  timestamp: new Date('2024-01-01T12:00:00Z'),
  headers: JSON.stringify({ 'content-type': 'application/json' }),
  body: JSON.stringify({ test: 'data' }),
  query: JSON.stringify({ param: 'value' }),
  ...overrides,
});

// Factory function to create multiple items
export const createMultiple = <T>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overrides?: Partial<T>
): T[] => {
  return Array.from({ length: count }, (_, i) => 
    factory({ ...overrides, id: `${overrides?.id || 'test'}_${i}` } as Partial<T>)
  );
};
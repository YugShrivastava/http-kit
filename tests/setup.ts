import { PrismaClient } from '@/generated/prisma/client';
import { beforeAll, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>();

vi.mock('@/lib/db', () => ({
  default: prismaMock,
}));

// Mock Clerk
export const mockAuth = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
  clerkMiddleware: vi.fn(),
  createRouteMatcher: vi.fn(),
}));

// Mock Next.js
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, init) => ({
        json: async () => data,
        status: init?.status || 200,
        headers: new Map(Object.entries(init?.headers || {})),
      })),
      next: vi.fn((init) => ({
        status: 200,
        ...init,
      })),
    },
    NextRequest: vi.fn(),
  };
});

beforeAll(() => {
  // Reset mocks before each test file
  mockReset(prismaMock);
});
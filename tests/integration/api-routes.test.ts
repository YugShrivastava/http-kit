import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import { GET } from '@/app/api/mock/route';
import { userFactory, apiFactory } from '../factories';
import { NextRequest } from 'next/server';

describe('API Routes - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/mock', () => {
    it('should return all user APIs successfully', async () => {
      const user = userFactory();
      const apis = [
        apiFactory({ userId: user.id, apiId: 'api1' }),
        apiFactory({ userId: user.id, apiId: 'api2' }),
        apiFactory({ userId: user.id, apiId: 'api3' }),
      ];

      const request = new NextRequest('http://localhost:3000/api/mock', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.api.findMany.mockResolvedValue(apis);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: 'success',
        apis,
      });
      expect(prismaMock.api.findMany).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
    });

    it('should return 401 when userid header is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/mock');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'unauthorized' });
      expect(prismaMock.api.findMany).not.toHaveBeenCalled();
    });

    it('should return 400 when user has no APIs', async () => {
      const user = userFactory();
      const request = new NextRequest('http://localhost:3000/api/mock', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.api.findMany.mockResolvedValue([]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        message: 'unauthorized or no mock apis found',
      });
    });

    it('should return 500 when database error occurs', async () => {
      const user = userFactory();
      const request = new NextRequest('http://localhost:3000/api/mock', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.api.findMany.mockRejectedValue(new Error('Database error'));

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'server error' });
    });

    it('should handle empty userid header', async () => {
      const request = new NextRequest('http://localhost:3000/api/mock', {
        headers: {
          userid: '',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'unauthorized' });
    });

    it('should return APIs with correct data format', async () => {
      const user = userFactory();
      const complexData = {
        nested: { key: 'value' },
        array: [1, 2, 3],
        boolean: true,
      };
      const api = apiFactory({
        userId: user.id,
        data: JSON.stringify(complexData),
      });

      const request = new NextRequest('http://localhost:3000/api/mock', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.api.findMany.mockResolvedValue([api]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.apis[0].data).toBe(JSON.stringify(complexData));
    });
  });
});
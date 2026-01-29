import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import { GET, POST, PUT, PATCH, DELETE } from '@/app/api/mock/[id]/route';
import { userFactory, apiFactory } from '../factories';
import { NextRequest } from 'next/server';

describe('Mock API [id] Routes - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (apiId: string, token: string, method: string = 'GET') => {
    return new NextRequest(`http://localhost:3000/api/mock/${apiId}`, {
      method,
      headers: {
        token,
      },
    });
  };

  describe('GET /api/mock/[id]', () => {
    it('should return API data with valid token', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id, apiId: 'test123' });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe(api.data);
    });

    it('should return 401 when token is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/mock/test123');

      const response = await GET(request, { params: { id: 'test123' } } as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'token not found' });
    });

    it('should return 401 when token is invalid', async () => {
      const request = createRequest('test123', 'invalid_token');

      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await GET(request, { params: { id: 'test123' } } as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'invalid token' });
    });

    it('should return 400 when apiId is invalid', async () => {
      const user = userFactory();
      const request = createRequest('', user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [],
      } as any);

      const response = await GET(request, { params: { id: '' } } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'invalid api id' });
    });

    it('should return 400 when API does not belong to user', async () => {
      const user = userFactory();
      const otherApi = apiFactory({ userId: 'other_user', apiId: 'other123' });
      const request = createRequest('test123', user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [otherApi],
      } as any);

      const response = await GET(request, { params: { id: 'test123' } } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'invalid api id' });
    });

    it('should handle JSON data correctly', async () => {
      const user = userFactory();
      const jsonData = { feature: true, config: { theme: 'dark' } };
      const api = apiFactory({
        userId: user.id,
        data: JSON.stringify(jsonData),
      });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(jsonData);
    });

    it('should handle text data correctly', async () => {
      const user = userFactory();
      const api = apiFactory({
        userId: user.id,
        data: '"plain text response"',
      });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe('plain text response');
    });
  });

  describe('POST /api/mock/[id]', () => {
    it('should return API data for POST request', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const request = createRequest(api.apiId, user.token, 'POST');

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await POST(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe(api.data);
    });

    it('should reject POST with invalid token', async () => {
      const request = createRequest('test123', 'invalid', 'POST');

      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await POST(request, { params: { id: 'test123' } } as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'invalid token' });
    });
  });

  describe('PUT /api/mock/[id]', () => {
    it('should return API data for PUT request', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const request = createRequest(api.apiId, user.token, 'PUT');

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await PUT(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe(api.data);
    });
  });

  describe('PATCH /api/mock/[id]', () => {
    it('should return API data for PATCH request', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const request = createRequest(api.apiId, user.token, 'PATCH');

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await PATCH(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe(api.data);
    });
  });

  describe('DELETE /api/mock/[id]', () => {
    it('should return API data for DELETE request', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const request = createRequest(api.apiId, user.token, 'DELETE');

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await DELETE(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe(api.data);
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long API IDs', async () => {
      const user = userFactory();
      const longApiId = 'a'.repeat(1000);
      const request = createRequest(longApiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [],
      } as any);

      const response = await GET(request, { params: { id: longApiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'invalid api id' });
    });

    it('should handle special characters in API ID', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id, apiId: 'test-123_abc' });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
    });

    it('should handle empty data field', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id, data: '' });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBe('');
    });

    it('should handle malformed JSON gracefully', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id, data: '{invalid json}' });
      const request = createRequest(api.apiId, user.token);

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const response = await GET(request, { params: { id: api.apiId } } as any);
      
      expect(response.status).toBe(200);
      // Should return raw data even if not valid JSON
    });

    it('should handle concurrent requests to same API', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });

      prismaMock.user.findUnique.mockResolvedValue({
        ...user,
        apis: [api],
      } as any);

      const requests = Array(10)
        .fill(null)
        .map(() => createRequest(api.apiId, user.token));

      const responses = await Promise.all(
        requests.map((req) => GET(req, { params: { id: api.apiId } } as any))
      );

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });
});
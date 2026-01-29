import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import { GET } from '@/app/api/bin/route';
import { ALL as BinHandler } from '@/app/api/bin/[id]/route';
import { userFactory, binFactory, requestLogFactory } from '../factories';
import { NextRequest } from 'next/server';

describe('Bin Routes - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/bin', () => {
    it('should return all user bins with logs', async () => {
      const user = userFactory();
      const bins = [
        binFactory({ userId: user.id, binId: 'bin1' }),
        binFactory({ userId: user.id, binId: 'bin2' }),
      ];
      const logs = [
        requestLogFactory({ binId: 'bin1' }),
        requestLogFactory({ binId: 'bin2' }),
      ];

      const request = new NextRequest('http://localhost:3000/api/bin', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.bin.findMany.mockResolvedValue(
        bins.map((bin, i) => ({
          ...bin,
          logs: [logs[i]],
        })) as any
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('success');
      expect(data.bins).toHaveLength(2);
      expect(data.bins[0].logs).toBeDefined();
    });

    it('should return 401 when userid header is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/bin');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'unauthorized' });
    });

    it('should return 400 when user has no bins', async () => {
      const user = userFactory();
      const request = new NextRequest('http://localhost:3000/api/bin', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.bin.findMany.mockResolvedValue([]);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        message: 'unauthorized or no mock bins found',
      });
    });

    it('should return 500 on database error', async () => {
      const user = userFactory();
      const request = new NextRequest('http://localhost:3000/api/bin', {
        headers: {
          userid: user.id,
        },
      });

      prismaMock.bin.findMany.mockRejectedValue(new Error('Database error'));

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'server error' });
    });
  });

  describe('ALL /api/bin/[id]', () => {
    const createBinRequest = (binId: string, method: string, body?: any) => {
      const url = `http://localhost:3000/api/bin/${binId}?param1=value1&param2=value2`;
      return new NextRequest(url, {
        method,
        headers: {
          'content-type': 'application/json',
          'user-agent': 'test-agent',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    it('should capture GET request', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'GET');

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId, method: 'GET' })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          binId: bin.binId,
          method: 'GET',
          headers: expect.any(String),
          query: expect.any(String),
          body: expect.any(String),
        }),
      });
    });

    it('should capture POST request with body', async () => {
      const bin = binFactory();
      const requestBody = { test: 'data', nested: { key: 'value' } };
      const request = createBinRequest(bin.binId, 'POST', requestBody);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId, method: 'POST' })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody),
        }),
      });
    });

    it('should capture PUT request', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'PUT', { update: true });

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId, method: 'PUT' })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          method: 'PUT',
        }),
      });
    });

    it('should capture PATCH request', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'PATCH', { partial: 'update' });

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId, method: 'PATCH' })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          method: 'PATCH',
        }),
      });
    });

    it('should capture DELETE request', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'DELETE');

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId, method: 'DELETE' })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          method: 'DELETE',
        }),
      });
    });

    it('should return 400 when binId is invalid', async () => {
      const request = createBinRequest('', 'GET');

      const response = await BinHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid bin id' });
    });

    it('should return 404 when bin does not exist', async () => {
      const request = createBinRequest('nonexistent', 'GET');

      prismaMock.bin.findUnique.mockResolvedValue(null);

      const response = await BinHandler(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Bin not found' });
    });

    it('should capture all headers correctly', async () => {
      const bin = binFactory();
      const request = new NextRequest(
        `http://localhost:3000/api/bin/${bin.binId}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer token123',
            'custom-header': 'custom-value',
          },
        }
      );

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      await BinHandler(request);

      const createCall = prismaMock.requestLog.create.mock.calls[0][0];
      const headers = JSON.parse(createCall.data.headers);

      expect(headers['content-type']).toBe('application/json');
      expect(headers['authorization']).toBe('Bearer token123');
      expect(headers['custom-header']).toBe('custom-value');
    });

    it('should capture query parameters correctly', async () => {
      const bin = binFactory();
      const request = new NextRequest(
        `http://localhost:3000/api/bin/${bin.binId}?foo=bar&baz=qux&array=1&array=2`,
        { method: 'GET' }
      );

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      await BinHandler(request);

      const createCall = prismaMock.requestLog.create.mock.calls[0][0];
      const query = JSON.parse(createCall.data.query);

      expect(query.foo).toBe('bar');
      expect(query.baz).toBe('qux');
    });

    it('should handle empty request body', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'POST');

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          body: expect.any(String),
        }),
      });
    });

    it('should handle large request body', async () => {
      const bin = binFactory();
      const largeBody = {
        data: 'x'.repeat(10000),
        array: Array(1000).fill({ nested: 'data' }),
      };
      const request = createBinRequest(bin.binId, 'POST', largeBody);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
    });

    it('should handle non-JSON request body', async () => {
      const bin = binFactory();
      const request = new NextRequest(
        `http://localhost:3000/api/bin/${bin.binId}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'text/plain',
          },
          body: 'plain text body',
        }
      );

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      expect(prismaMock.requestLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          body: 'plain text body',
        }),
      });
    });

    it('should return 500 on database error', async () => {
      const bin = binFactory();
      const request = createBinRequest(bin.binId, 'POST', { test: 'data' });

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockRejectedValue(new Error('Database error'));

      const response = await BinHandler(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Internal server error' });
    });

    it('should handle concurrent requests to same bin', async () => {
      const bin = binFactory();

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const requests = Array(20)
        .fill(null)
        .map((_, i) => createBinRequest(bin.binId, 'POST', { request: i }));

      const responses = await Promise.all(requests.map((req) => BinHandler(req)));

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });

      expect(prismaMock.requestLog.create).toHaveBeenCalledTimes(20);
    });

    it('should handle malformed JSON in body gracefully', async () => {
      const bin = binFactory();
      const request = new NextRequest(
        `http://localhost:3000/api/bin/${bin.binId}`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: '{invalid json}',
        }
      );

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
      // Should still capture the request even with malformed JSON
    });

    it('should handle special characters in binId', async () => {
      const bin = binFactory({ binId: 'test-123_abc' });
      const request = createBinRequest(bin.binId, 'GET');

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.create.mockResolvedValue(
        requestLogFactory({ binId: bin.binId })
      );

      const response = await BinHandler(request);

      expect(response.status).toBe(200);
    });
  });
});
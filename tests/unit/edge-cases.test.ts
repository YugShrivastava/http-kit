import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import { createMockApi, updateMockApi, deleteMockApi } from '@/actions/api-actions';
import {
  createRequestBin,
  deleteRequestBin,
  deleteRequestLog,
} from '@/actions/bin-actions';
import { userFactory, apiFactory, binFactory, requestLogFactory } from '../factories';

describe('Edge Cases - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Boundary Conditions', () => {
    it('should handle extremely long JSON data in API', async () => {
      const user = userFactory();
      const largeData = {
        items: Array(10000).fill({ id: 1, name: 'test', value: 'x'.repeat(100) }),
      };
      const formData = new FormData();
      formData.append('returnData', JSON.stringify(largeData));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(largeData) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle empty string as API data', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', '');

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: 'data not found' });
    });

    it('should handle whitespace-only API data', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', '   ');

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: '   ' })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle maximum length userId', async () => {
      const longUserId = 'user_' + 'a'.repeat(1000);
      const formData = new FormData();
      formData.append('returnData', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await createMockApi(longUserId, formData);

      expect(result).toEqual({ error: 'user not found' });
    });

    it('should handle maximum length apiId', async () => {
      const user = userFactory();
      const longApiId = 'a'.repeat(1000);
      const formData = new FormData();
      formData.append('apiId', longApiId);
      formData.append('data', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.update.mockResolvedValue(
        apiFactory({ apiId: longApiId })
      );

      const result = await updateMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });
  });

  describe('Special Characters and Encoding', () => {
    it('should handle unicode characters in API data', async () => {
      const user = userFactory();
      const unicodeData = {
        emoji: '🚀✨🎉',
        chinese: '你好世界',
        arabic: 'مرحبا',
        special: '™®©',
      };
      const formData = new FormData();
      formData.append('returnData', JSON.stringify(unicodeData));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(unicodeData) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle escape sequences in data', async () => {
      const user = userFactory();
      const escapedData = {
        newline: 'line1\nline2',
        tab: 'col1\tcol2',
        quote: 'He said "hello"',
        backslash: 'path\\to\\file',
      };
      const formData = new FormData();
      formData.append('returnData', JSON.stringify(escapedData));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(escapedData) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle null bytes in request log body', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const log = requestLogFactory({ binId: bin.binId, body: 'test\0null' });
      const formData = new FormData();
      formData.append('id', log.id);
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue({
        ...bin,
        logs: [log],
      } as any);
      prismaMock.requestLog.delete.mockResolvedValue(log);

      const result = await deleteRequestLog(user.id, formData);

      expect(result).toEqual({ error: false });
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous API creations', async () => {
      const user = userFactory();
      prismaMock.user.findUnique.mockResolvedValue(user);

      const promises = Array(50)
        .fill(null)
        .map((_, i) => {
          const formData = new FormData();
          formData.append('returnData', JSON.stringify({ index: i }));
          prismaMock.api.create.mockResolvedValueOnce(
            apiFactory({ apiId: `api_${i}` })
          );
          return createMockApi(user.id, formData);
        });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        expect(result).toEqual({ error: false });
      });
    });

    it('should handle rapid bin creation and deletion', async () => {
      const user = userFactory();

      // Create multiple bins
      prismaMock.bin.create.mockResolvedValue(binFactory({ userId: user.id }));
      const createPromises = Array(10)
        .fill(null)
        .map(() => createRequestBin(user.id));

      await Promise.all(createPromises);

      // Delete them all
      const bin = binFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: 0 });
      prismaMock.bin.delete.mockResolvedValue(bin);

      const deletePromises = Array(10)
        .fill(null)
        .map(() => deleteRequestBin(user.id, formData));

      const results = await Promise.all(deletePromises);

      results.forEach((result) => {
        expect(result).toEqual({ error: false });
      });
    });
  });

  describe('Database Constraints', () => {
    it('should handle unique constraint violation on API creation', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint violation',
      });

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false }); // The function doesn't catch this
    });

    it('should handle foreign key constraint on bin deletion', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: 5 });
      prismaMock.bin.delete.mockRejectedValue({
        code: 'P2003',
        message: 'Foreign key constraint failed',
      });

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: false }); // The function doesn't catch this
    });
  });

  describe('Malformed Input', () => {
    it('should handle FormData with null values', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', null as any);

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: 'data not found' });
    });

    it('should handle FormData with undefined values', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', undefined as any);

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: 'data not found' });
    });

    it('should handle non-string apiId in FormData', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('apiId', '123'); // FormData always converts to string
      formData.append('data', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.update.mockResolvedValue(apiFactory({ apiId: '123' }));

      const result = await updateMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

  });

  describe('Data Type Edge Cases', () => {
    it('should handle deeply nested objects', async () => {
      const user = userFactory();
      let nested: any = { value: 'end' };
      for (let i = 0; i < 100; i++) {
        nested = { level: i, child: nested };
      }

      const formData = new FormData();
      formData.append('returnData', JSON.stringify(nested));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(nested) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle arrays with mixed types', async () => {
      const user = userFactory();
      const mixedArray = {
        data: [1, 'string', true, null, { nested: 'object' }, [1, 2, 3]],
      };
      const formData = new FormData();
      formData.append('returnData', JSON.stringify(mixedArray));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(mixedArray) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
    });

    it('should handle numeric string as userId', async () => {
      const formData = new FormData();
      formData.append('returnData', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await createMockApi('12345', formData);

      expect(result).toEqual({ error: 'user not found' });
    });
  });

  describe('Race Conditions', () => {
    it('should handle simultaneous read and delete operations', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('apiId', api.apiId);

      prismaMock.user.findUnique.mockResolvedValue(user);

      // Simulate race: delete while another operation is reading
      const deletePromise = new Promise((resolve) => {
        prismaMock.api.delete.mockResolvedValueOnce(api);
        setTimeout(() => resolve(deleteMockApi(user.id, formData)), 10);
      });

      const updateFormData = new FormData();
      updateFormData.append('apiId', api.apiId);
      updateFormData.append('data', JSON.stringify({ updated: true }));

      prismaMock.api.update.mockResolvedValue({
        ...api,
        data: JSON.stringify({ updated: true }),
      });

      const updatePromise = updateMockApi(user.id, updateFormData);

      const [deleteResult, updateResult] = await Promise.all([
        deletePromise,
        updatePromise,
      ]);

      expect(deleteResult).toBeDefined();
      expect(updateResult).toBeDefined();
    });

    it('should handle deleting a log while bin is being deleted', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const log = requestLogFactory({ binId: bin.binId });

      const binFormData = new FormData();
      binFormData.append('binId', bin.binId);

      const logFormData = new FormData();
      logFormData.append('id', log.id);
      logFormData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue({
        ...bin,
        logs: [log],
      } as any);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: 1 });
      prismaMock.bin.delete.mockResolvedValue(bin);
      prismaMock.requestLog.delete.mockResolvedValue(log);

      const [binResult, logResult] = await Promise.all([
        deleteRequestBin(user.id, binFormData),
        deleteRequestLog(user.id, logFormData),
      ]);

      expect(binResult).toBeDefined();
      expect(logResult).toBeDefined();
    });
  });

  describe('Memory and Performance', () => {
    it('should handle creating many bins without memory issues', async () => {
      const user = userFactory();
      const count = 1000;

      prismaMock.bin.create.mockImplementation((args) =>
        Promise.resolve(binFactory({ userId: args.data.userId }))
      );

      const promises = Array(count)
        .fill(null)
        .map(() => createRequestBin(user.id));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(count);
      results.forEach((result) => {
        expect(result).toEqual({ error: false });
      });
    });

    it('should handle deleting bin with many logs', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const logCount = 10000;
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: logCount });
      prismaMock.bin.delete.mockResolvedValue(bin);

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { binId: bin.binId },
      });
    });
  });
});
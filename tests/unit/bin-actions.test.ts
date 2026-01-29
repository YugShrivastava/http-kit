import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import {
  createRequestBin,
  deleteRequestBin,
  deleteRequestLog,
} from '@/actions/bin-actions';
import { userFactory, binFactory, requestLogFactory } from '../factories';

describe('Bin Actions - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createRequestBin', () => {
    it('should create a new bin successfully', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });

      prismaMock.bin.create.mockResolvedValue(bin);

      const result = await createRequestBin(user.id);

      expect(result).toEqual({ error: false });
      expect(prismaMock.bin.create).toHaveBeenCalledWith({
        data: { userId: user.id },
      });
    });

    it('should return error when userId is missing', async () => {
      const result = await createRequestBin('');

      expect(result).toEqual({ error: 'invalid user' });
      expect(prismaMock.bin.create).not.toHaveBeenCalled();
    });

    it('should return error when userId is empty string', async () => {
      const result = await createRequestBin("");

      expect(result).toEqual({ error: 'invalid user' });
      expect(prismaMock.bin.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteRequestBin', () => {
    it('should delete a bin and its logs successfully', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: 5 });
      prismaMock.bin.delete.mockResolvedValue(bin);

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.bin.findUnique).toHaveBeenCalledWith({
        where: { binId: bin.binId, userId: user.id },
      });
      expect(prismaMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { binId: bin.binId },
      });
      expect(prismaMock.bin.delete).toHaveBeenCalledWith({
        where: { id: bin.id },
      });
    });

    it('should return error when binId is invalid type', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('binId', JSON.stringify({ invalid: 'object' }));

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: 'invalid bin id' });
      expect(prismaMock.bin.findUnique).not.toHaveBeenCalled();
    });

    it('should return error when binId is missing', async () => {
      const user = userFactory();
      const formData = new FormData();

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: 'invalid bin id' });
      expect(prismaMock.bin.findUnique).not.toHaveBeenCalled();
    });

    it('should return error when bin does not exist', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('binId', 'nonexistent_bin');

      prismaMock.bin.findUnique.mockResolvedValue(null);

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: 'bin not found or unauthorized' });
      expect(prismaMock.requestLog.deleteMany).not.toHaveBeenCalled();
      expect(prismaMock.bin.delete).not.toHaveBeenCalled();
    });

    it('should return error when user is unauthorized', async () => {
      const bin = binFactory({ userId: 'other_user' });
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(null);

      const result = await deleteRequestBin('unauthorized_user', formData);

      expect(result).toEqual({ error: 'bin not found or unauthorized' });
    });

    it('should handle cascade delete of logs', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(bin);
      prismaMock.requestLog.deleteMany.mockResolvedValue({ count: 100 });
      prismaMock.bin.delete.mockResolvedValue(bin);

      const result = await deleteRequestBin(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.requestLog.deleteMany).toHaveBeenCalledWith({
        where: { binId: bin.binId },
      });
    });
  });

  describe('deleteRequestLog', () => {
    it('should delete a request log successfully', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const log = requestLogFactory({ binId: bin.binId });
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
      expect(prismaMock.requestLog.delete).toHaveBeenCalledWith({
        where: { id: log.id },
      });
    });

    it('should return error when log id is missing', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('binId', 'bin123');

      const result = await deleteRequestLog(user.id, formData);

      expect(result).toEqual({ error: 'log id not found' });
      expect(prismaMock.bin.findUnique).not.toHaveBeenCalled();
    });

    it('should return error when bin does not exist', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('id', 'log123');
      formData.append('binId', 'nonexistent_bin');

      prismaMock.bin.findUnique.mockResolvedValue(null);

      const result = await deleteRequestLog(user.id, formData);

      expect(result).toEqual({ error: 'not authorized or bin not found' });
      expect(prismaMock.requestLog.delete).not.toHaveBeenCalled();
    });

    it('should return error when user is unauthorized', async () => {
      const bin = binFactory({ userId: 'other_user' });
      const log = requestLogFactory({ binId: bin.binId });
      const formData = new FormData();
      formData.append('id', log.id);
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue(null);

      const result = await deleteRequestLog('unauthorized_user', formData);

      expect(result).toEqual({ error: 'not authorized or bin not found' });
    });

    it('should return server error when delete fails', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const log = requestLogFactory({ binId: bin.binId });
      const formData = new FormData();
      formData.append('id', log.id);
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue({
        ...bin,
        logs: [log],
      } as any);
      prismaMock.requestLog.delete.mockRejectedValue(new Error('Database error'));

      const result = await deleteRequestLog(user.id, formData);

      expect(result).toEqual({ error: 'server error' });
    });

    it('should handle deletion from bin with multiple logs', async () => {
      const user = userFactory();
      const bin = binFactory({ userId: user.id });
      const logs = [
        requestLogFactory({ id: 'log1', binId: bin.binId }),
        requestLogFactory({ id: 'log2', binId: bin.binId }),
        requestLogFactory({ id: 'log3', binId: bin.binId }),
      ];
      const formData = new FormData();
      formData.append('id', 'log2');
      formData.append('binId', bin.binId);

      prismaMock.bin.findUnique.mockResolvedValue({
        ...bin,
        logs,
      } as any);
      prismaMock.requestLog.delete.mockResolvedValue(logs[1]);

      const result = await deleteRequestLog(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.requestLog.delete).toHaveBeenCalledWith({
        where: { id: 'log2' },
      });
    });
  });
});
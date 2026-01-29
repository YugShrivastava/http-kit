import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock } from '../setup';
import { createMockApi, updateMockApi, deleteMockApi } from '@/actions/api-actions';
import { userFactory, apiFactory } from '../factories';

describe('API Actions - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMockApi', () => {
    it('should create a new API successfully', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('returnData', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({
          userId: user.id,
          data: JSON.stringify({ test: 'data' }),
        })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(prismaMock.api.create).toHaveBeenCalledWith({
        data: {
          data: JSON.stringify({ test: 'data' }),
          userId: user.id,
        },
      });
    });

    it('should return error when data is missing', async () => {
      const user = userFactory();
      const formData = new FormData();

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: 'data not found' });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.api.create).not.toHaveBeenCalled();
    });

    it('should return error when user does not exist', async () => {
      const formData = new FormData();
      formData.append('returnData', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await createMockApi('nonexistent_user', formData);

      expect(result).toEqual({ error: 'user not found' });
      expect(prismaMock.api.create).not.toHaveBeenCalled();
    });

    it('should handle JSON stringification correctly', async () => {
      const user = userFactory();
      const complexData = {
        nested: { value: true },
        array: [1, 2, 3],
        string: 'test',
      };
      const formData = new FormData();
      formData.append('returnData', JSON.stringify(complexData));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.create.mockResolvedValue(
        apiFactory({ data: JSON.stringify(complexData) })
      );

      const result = await createMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.api.create).toHaveBeenCalledWith({
        data: {
          data: JSON.stringify(complexData),
          userId: user.id,
        },
      });
    });
  });

  describe('updateMockApi', () => {
    it('should update an API successfully', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('apiId', api.apiId);
      formData.append('data', JSON.stringify({ updated: true }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.update.mockResolvedValue({
        ...api,
        data: JSON.stringify({ updated: true }),
      });

      const result = await updateMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.api.update).toHaveBeenCalledWith({
        where: { apiId: api.apiId },
        data: { data: JSON.stringify({ updated: true }) },
      });
    });

    it('should return error when apiId is missing', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('data', JSON.stringify({ test: 'data' }));

      const result = await updateMockApi(user.id, formData);

      expect(result).toEqual({ error: 'api id required' });
      expect(prismaMock.api.update).not.toHaveBeenCalled();
    });

    it('should return error when user does not exist', async () => {
      const formData = new FormData();
      formData.append('apiId', 'api123');
      formData.append('data', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await updateMockApi('nonexistent_user', formData);

      expect(result).toEqual({ error: 'user not found' });
      expect(prismaMock.api.update).not.toHaveBeenCalled();
    });

    it('should return server error when update fails', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('apiId', 'api123');
      formData.append('data', JSON.stringify({ test: 'data' }));

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.update.mockRejectedValue(new Error('Database error'));

      const result = await updateMockApi(user.id, formData);

      expect(result).toEqual({ error: 'server error' });
    });
  });

  describe('deleteMockApi', () => {
    it('should delete an API successfully', async () => {
      const user = userFactory();
      const api = apiFactory({ userId: user.id });
      const formData = new FormData();
      formData.append('apiId', api.apiId);

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.delete.mockResolvedValue(api);

      const result = await deleteMockApi(user.id, formData);

      expect(result).toEqual({ error: false });
      expect(prismaMock.api.delete).toHaveBeenCalledWith({
        where: { apiId: api.apiId },
      });
    });

    it('should return error when apiId is missing', async () => {
      const user = userFactory();
      const formData = new FormData();

      const result = await deleteMockApi(user.id, formData);

      expect(result).toEqual({ error: 'api id required' });
      expect(prismaMock.api.delete).not.toHaveBeenCalled();
    });

    it('should return error when user does not exist', async () => {
      const formData = new FormData();
      formData.append('apiId', 'api123');

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await deleteMockApi('nonexistent_user', formData);

      expect(result).toEqual({ error: 'user not found' });
      expect(prismaMock.api.delete).not.toHaveBeenCalled();
    });

    it('should return server error when delete fails', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('apiId', 'api123');

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.delete.mockRejectedValue(new Error('Database error'));

      const result = await deleteMockApi(user.id, formData);

      expect(result).toEqual({ error: 'server error' });
    });

    it('should handle deletion of non-existent API', async () => {
      const user = userFactory();
      const formData = new FormData();
      formData.append('apiId', 'nonexistent_api');

      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.api.delete.mockRejectedValue(new Error('Record not found'));

      const result = await deleteMockApi(user.id, formData);

      expect(result).toEqual({ error: 'server error' });
    });
  });
});
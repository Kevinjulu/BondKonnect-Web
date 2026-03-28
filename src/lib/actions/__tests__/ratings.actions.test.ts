import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitRating, getUserCredibility } from '../ratings.actions';
import api from '@/lib/api';

// Mock the api module
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock auth.actions
vi.mock('../auth.actions', () => ({
  getHeaders: vi.fn(() => Promise.resolve({ Authorization: 'Bearer mock-token' })),
}));

describe('ratings.actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitRating', () => {
    it('calls api.post with correct parameters and returns data', async () => {
      const mockData = { rater_id: 1, ratee_id: 2, overall_rating: 5 };
      const mockResponse = { data: { success: true, message: 'Rating submitted' } };
      (api.post as any).mockResolvedValue(mockResponse);

      const result = await submitRating(mockData as any);

      expect(api.post).toHaveBeenCalledWith('/V1/ratings/submit-rating', mockData, expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });

    it('handles errors and returns failure message', async () => {
      (api.post as any).mockRejectedValue(new Error('Network error'));

      const result = await submitRating({} as any);

      expect(result).toEqual({ success: false, message: 'Failed to submit rating' });
    });
  });

  describe('getUserCredibility', () => {
    it('calls api.get with correct userId', async () => {
      const mockResponse = { data: { success: true, data: { credibility_index: 90 } } };
      (api.get as any).mockResolvedValue(mockResponse);

      const result = await getUserCredibility(123);

      expect(api.get).toHaveBeenCalledWith('/V1/ratings/user-credibility/123', expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });

    it('handles errors gracefully', async () => {
      (api.get as any).mockRejectedValue(new Error('404 Not Found'));

      const result = await getUserCredibility(123);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to fetch credibility');
    });
  });
});

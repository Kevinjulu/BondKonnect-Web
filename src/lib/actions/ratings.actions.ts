/**
 * Rating API Actions
 */

import api from '@/lib/api';
import { getHeaders } from './auth.actions';
import {
  UserRating,
  UserCredibilityScore,
  RatingDispute,
  CreateRatingRequest,
  UpdateRatingRequest,
  FileDisputeRequest,
  RatingStatistics,
  PaginatedResponse,
} from '@/lib/types/ratings';

/**
 * Submit a new rating
 */
export async function submitRating(data: CreateRatingRequest) {
  try {
    const response = await api.post('/V1/ratings/submit-rating', data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    return { success: false, message: 'Failed to submit rating' };
  }
}

/**
 * Update an existing rating
 */
export async function updateRating(ratingId: number, data: UpdateRatingRequest) {
  try {
    const response = await api.put(`/V1/ratings/${ratingId}/edit`, data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating rating:', error);
    return { success: false, message: 'Failed to update rating' };
  }
}

/**
 * Get user credibility profile and reputation
 */
export async function getUserCredibility(userId: number) {
  try {
    const response = await api.get(`/V1/ratings/user-credibility/${userId}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user credibility:', error);
    return {
      success: false,
      message: 'Failed to fetch credibility',
      data: null,
    };
  }
}

/**
 * Get published ratings for a user
 */
export async function getUserRatings(
  userId: number,
  filters?: {
    min_rating?: number;
    sort_by?: 'recent' | 'highest_rated' | 'lowest_rated';
    per_page?: number;
  }
) {
  try {
    const params = new URLSearchParams();
    if (filters?.min_rating) params.append('min_rating', String(filters.min_rating));
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.per_page) params.append('per_page', String(filters.per_page));

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/V1/ratings/user-ratings/${userId}${queryString}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return { success: false, data: [] };
  }
}

/**
 * Get rating statistics for a user
 */
export async function getUserRatingStats(userId: number) {
  try {
    const response = await api.get(`/V1/ratings/user-stats/${userId}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return { success: false, data: null };
  }
}

/**
 * File a dispute on a rating
 */
export async function disputeRating(ratingId: number, data: FileDisputeRequest) {
  try {
    const response = await api.post(`/V1/ratings/${ratingId}/dispute`, data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error filing dispute:', error);
    return { success: false, message: 'Failed to file dispute' };
  }
}

/**
 * Get all disputes (admin)
 */
export async function getAllDisputes(filters?: {
  status?: 'open' | 'upheld' | 'reversed';
  user_id?: number;
  per_page?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.user_id) params.append('user_id', String(filters.user_id));
    if (filters?.per_page) params.append('per_page', String(filters.per_page));

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/V1/ratings/admin/disputes${queryString}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return { success: false, data: { data: [], total: 0 } };
  }
}

/**
 * Get dispute details (admin)
 */
export async function getDisputeDetails(disputeId: number) {
  try {
    const response = await api.get(`/V1/ratings/admin/disputes/${disputeId}`, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dispute details:', error);
    return { success: false, data: null };
  }
}

/**
 * Uphold a rating in dispute (admin)
 */
export async function upholdRating(disputeId: number, data: { resolved_by: number; notes?: string }) {
  try {
    const response = await api.post(`/V1/ratings/admin/disputes/${disputeId}/uphold`, data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error upholding rating:', error);
    return { success: false, message: 'Failed to uphold rating' };
  }
}

/**
 * Reverse/remove a rating (admin)
 */
export async function reverseRating(disputeId: number, data: { resolved_by: number; notes?: string }) {
  try {
    const response = await api.post(`/V1/ratings/admin/disputes/${disputeId}/reverse`, data, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error reversing rating:', error);
    return { success: false, message: 'Failed to reverse rating' };
  }
}

/**
 * Get dispute statistics (admin)
 */
export async function getDisputeStats() {
  try {
    const response = await api.get('/V1/ratings/admin/dispute-stats', {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dispute stats:', error);
    return { success: false, data: null };
  }
}

/**
 * Publish pending ratings (admin)
 */
export async function publishPendingRatings() {
  try {
    const response = await api.post('/V1/ratings/admin/publish-pending', {}, {
      headers: await getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error publishing pending ratings:', error);
    return { success: false, message: 'Failed to publish pending ratings' };
  }
}


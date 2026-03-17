/**
 * Rating API Actions
 */

import { getBaseApiUrl } from '../utils/url-resolver';
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

const BASE_URL = getBaseApiUrl();

/**
 * Submit a new rating
 */
export async function submitRating(data: CreateRatingRequest) {
  try {
    const response = await fetch(`${BASE_URL}/V1/ratings/submit-rating`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/${ratingId}/edit`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/user-credibility/${userId}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    const result = await response.json();
    return result;
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
    const response = await fetch(`${BASE_URL}/V1/ratings/user-ratings/${userId}${queryString}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/user-stats/${userId}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/${ratingId}/dispute`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/disputes${queryString}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/disputes/${disputeId}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/disputes/${disputeId}/uphold`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/disputes/${disputeId}/reverse`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/dispute-stats`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return await response.json();
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
    const response = await fetch(`${BASE_URL}/V1/ratings/admin/publish-pending`, {
      method: 'POST',
      headers: await getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error publishing pending ratings:', error);
    return { success: false, message: 'Failed to publish pending ratings' };
  }
}

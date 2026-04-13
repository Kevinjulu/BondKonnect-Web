import { http, HttpResponse } from 'msw'

// Define the base URL pattern to match
// Note: vitest.config.ts sets NEXT_PUBLIC_API_URL without the /api prefix
const BASE_URL = '*/V1'

export const handlers = [
  // Authentication
  http.post(`${BASE_URL}/login`, () => {
    return HttpResponse.json({
      success: true,
      token: 'mock-token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    })
  }),

  // User details
  http.get(`${BASE_URL}/user-details`, () => {
    return HttpResponse.json({
      success: true,
      user: { id: 1, email: 'test@example.com', name: 'Test User' }
    })
  }),

  // Subscriptions
  http.get(`${BASE_URL}/financials/get-all-sub-plans`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 1, name: 'Basic Plan', price: 1000, duration: '1 month' },
        { id: 2, name: 'Premium Plan', price: 2500, duration: '3 months' }
      ]
    })
  }),

  // M-Pesa Payment
  http.post(`${BASE_URL}/payments/mpesa/stk-push`, () => {
    return HttpResponse.json({
      success: true,
      checkout_id: 'ws_CO_mock_id',
      message: 'STK push initiated'
    })
  }),

  // AI Chat
  http.post(`${BASE_URL}/ai/chat`, async ({ request }) => {
    const { prompt } = await request.json() as { prompt: string };
    
    if (prompt === 'Error test') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({
      success: true,
      data: prompt.includes('YTM') 
        ? 'YTM stands for Yield to Maturity.' 
        : 'I am your AI Concierge.'
    })
  })
]

import { describe, it, expect } from 'vitest';
import paymentReducer, { 
  startPayment, 
  paymentSuccess, 
  paymentFailure, 
  resetPaymentState 
} from './PaymentSlice';

describe('PaymentSlice Reducer', () => {
  const initialState = {
    isProcessing: false,
    mpesaCheckoutRequestID: null,
    paypalOrderId: null,
    transactionStatus: 'idle',
    error: null,
  };

  it('should handle startPayment', () => {
    const state = paymentReducer(initialState as any, startPayment());
    expect(state.isProcessing).toBe(true);
    expect(state.transactionStatus).toBe('pending');
    expect(state.error).toBeNull();
  });

  it('should handle paymentSuccess', () => {
    const processingState = {
      ...initialState,
      isProcessing: true,
      transactionStatus: 'pending',
    };
    const state = paymentReducer(processingState as any, paymentSuccess());
    expect(state.isProcessing).toBe(false);
    expect(state.transactionStatus).toBe('success');
  });

  it('should handle paymentFailure', () => {
    const processingState = {
      ...initialState,
      isProcessing: true,
      transactionStatus: 'pending',
    };
    const errorMessage = 'Payment cancelled by user';
    const state = paymentReducer(processingState as any, paymentFailure(errorMessage));
    expect(state.isProcessing).toBe(false);
    expect(state.transactionStatus).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });

  it('should handle resetPaymentState', () => {
    const dirtyState = {
      isProcessing: true,
      transactionStatus: 'failed',
      error: 'Some error',
      mpesaCheckoutRequestID: '123',
      paypalOrderId: '456',
    };
    const state = paymentReducer(dirtyState as any, resetPaymentState());
    expect(state).toEqual(initialState);
  });
});

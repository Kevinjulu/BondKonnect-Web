import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  isProcessing: boolean;
  mpesaCheckoutRequestID: string | null;
  paypalOrderId: string | null;
  transactionStatus: 'idle' | 'pending' | 'success' | 'failed';
  error: string | null;
}

const initialState: PaymentState = {
  isProcessing: false,
  mpesaCheckoutRequestID: null,
  paypalOrderId: null,
  transactionStatus: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    startPayment: (state) => {
      state.isProcessing = true;
      state.transactionStatus = 'pending';
      state.error = null;
    },
    setMpesaCheckoutRequestID: (state, action: PayloadAction<string>) => {
      state.mpesaCheckoutRequestID = action.payload;
    },
    setPaypalOrderId: (state, action: PayloadAction<string>) => {
      state.paypalOrderId = action.payload;
    },
    paymentSuccess: (state) => {
      state.isProcessing = false;
      state.transactionStatus = 'success';
      state.mpesaCheckoutRequestID = null;
      state.paypalOrderId = null;
    },
    paymentFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.transactionStatus = 'failed';
      state.error = action.payload;
    },
    resetPaymentState: (state) => {
      state.isProcessing = false;
      state.transactionStatus = 'idle';
      state.error = null;
      state.mpesaCheckoutRequestID = null;
      state.paypalOrderId = null;
    },
  },
});

export const { 
    startPayment, 
    setMpesaCheckoutRequestID, 
    setPaypalOrderId, 
    paymentSuccess, 
    paymentFailure, 
    resetPaymentState 
} = paymentSlice.actions;

export default paymentSlice.reducer;

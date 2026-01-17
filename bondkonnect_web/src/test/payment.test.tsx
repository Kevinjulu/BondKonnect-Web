import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MpesaForm from '@/app/components/payment/MpesaForm';
import PaypalForm from '@/app/components/payment/PaypalForm';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '@/app/store/apps/payment/PaymentSlice';
import * as paymentActions from '@/app/lib/actions/payment.actions';

// Mock the payment actions
vi.mock('@/app/lib/actions/payment.actions', () => ({
  initiateMpesaPayment: vi.fn(),
  createPaypalOrder: vi.fn(),
  capturePaypalOrder: vi.fn(),
}));

// Helper to render with Redux
const renderWithRedux = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      payment: paymentReducer,
    },
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe('Payment Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MpesaForm', () => {
    it('renders correctly', () => {
      renderWithRedux(<MpesaForm />);
      expect(screen.getByText('M-Pesa Payment')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    });

    it('validates input', async () => {
      renderWithRedux(<MpesaForm />);
      fireEvent.click(screen.getByText('Pay with M-Pesa'));
      // Expect toast or error message (hard to test toast without mocking it, but we can check if action was NOT called)
      expect(paymentActions.initiateMpesaPayment).not.toHaveBeenCalled();
    });

    it('initiates payment on valid input', async () => {
      (paymentActions.initiateMpesaPayment as any).mockResolvedValue({ CheckoutRequestID: '123' });
      renderWithRedux(<MpesaForm />);

      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '254712345678' } });
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Account Reference'), { target: { value: 'REF1' } });

      fireEvent.click(screen.getByText('Pay with M-Pesa'));

      await waitFor(() => {
        expect(paymentActions.initiateMpesaPayment).toHaveBeenCalledWith({
          phone_number: '254712345678',
          amount: 100,
          reference: 'REF1',
          description: 'Payment for REF1',
        });
      });
    });
  });

  describe('PaypalForm', () => {
     it('renders correctly', () => {
      renderWithRedux(<PaypalForm />);
      expect(screen.getByText('PayPal Payment')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount (USD)')).toBeInTheDocument();
    });

    it('creates order on valid input', async () => {
        (paymentActions.createPaypalOrder as any).mockResolvedValue({ id: 'ORDER-123' });
        renderWithRedux(<PaypalForm />);

        fireEvent.change(screen.getByLabelText('Amount (USD)'), { target: { value: '50' } });
        fireEvent.click(screen.getByText('Pay with PayPal'));

        await waitFor(() => {
            expect(paymentActions.createPaypalOrder).toHaveBeenCalledWith({
                amount: 50,
                currency: 'USD'
            });
        });
    });
  });
});

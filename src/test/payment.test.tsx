import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MpesaForm from '@/components/payment/MpesaForm';
import PaypalForm from '@/components/payment/PaypalForm';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer from '@/store/apps/payment/PaymentSlice';
import * as paymentActions from '@/lib/actions/payment.actions';

// Mock the payment actions
vi.mock('@/lib/actions/payment.actions', () => ({
  initiateMpesaPayment: vi.fn(),
  createPaypalOrder: vi.fn(),
  capturePaypalOrder: vi.fn(),
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
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
      expect(screen.getByLabelText('Amount (KES)')).toBeInTheDocument();
    });

    it('validates input', async () => {
      renderWithRedux(<MpesaForm />);
      fireEvent.click(screen.getByText('Pay with M-Pesa'));
      expect(paymentActions.initiateMpesaPayment).not.toHaveBeenCalled();
    });

    it('initiates payment on valid input', async () => {
      (paymentActions.initiateMpesaPayment as any).mockResolvedValue({ success: true, checkout_id: '123' });
      renderWithRedux(<MpesaForm />);

      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '254712345678' } });
      fireEvent.change(screen.getByLabelText('Amount (KES)'), { target: { value: '100' } });

      fireEvent.click(screen.getByText('Pay with M-Pesa'));

      await waitFor(() => {
        expect(paymentActions.initiateMpesaPayment).toHaveBeenCalledWith({
          phone: '254712345678',
          amount: 100,
          plan_id: 1,
          user_email: 'test@example.com'
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
        (paymentActions.createPaypalOrder as any).mockResolvedValue({ success: true, order_id: 'ORDER-123' });
        renderWithRedux(<PaypalForm />);

        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Amount (USD)'), { target: { value: '50' } });
        fireEvent.click(screen.getByText('Pay with PayPal'));

        await waitFor(() => {
            expect(paymentActions.createPaypalOrder).toHaveBeenCalledWith({
                amount: 50,
                plan_id: 1
            });
        });
    });
  });
});

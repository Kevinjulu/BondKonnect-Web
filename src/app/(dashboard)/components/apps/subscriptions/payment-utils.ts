import { checkMpesaStatus } from "@/lib/actions/api.actions";

/**
 * Polls for M-Pesa transaction status
 * @param checkoutId The M-Pesa CheckoutRequestID
 * @param onStatusUpdate Callback for status changes
 * @param timeout Maximum polling time in milliseconds (default 60s)
 */
export const pollMpesaStatus = (
  checkoutId: string,
  onStatusUpdate: (status: 'completed' | 'failed' | 'pending' | 'timeout') => void,
  timeout: number = 60000
) => {
  const interval = setInterval(async () => {
    try {
      const statusRes = await checkMpesaStatus(checkoutId);
      const currentStatus = statusRes?.status;

      if (currentStatus === 'completed' || currentStatus === 'failed') {
        clearInterval(interval);
        onStatusUpdate(currentStatus);
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, 3000);

  // Safety timeout
  const timeoutId = setTimeout(() => {
    clearInterval(interval);
    onStatusUpdate('timeout');
  }, timeout);

  return () => {
    clearInterval(interval);
    clearTimeout(timeoutId);
  };
};

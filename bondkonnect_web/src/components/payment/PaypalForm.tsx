"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { startPayment, paymentSuccess, paymentFailure } from "@/store/apps/payment/PaymentSlice";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/actions/payment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

export default function PaypalForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isProcessing } = useSelector((state: RootState) => state.payment);
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");

  const handlePaypal = async () => {
      if (!amount || !email) {
          toast({ title: "Error", description: "Please enter amount and email", variant: "destructive" });
          return;
      }

      dispatch(startPayment());
      try {
          // 1. Create Order
          const orderResponse = await createPaypalOrder({
              amount: Number(amount),
              plan_id: 1 // Hardcoded for demo
          });

          if (!orderResponse.success || !orderResponse.order_id) {
             throw new Error("Failed to create PayPal order");
          }

          const orderId = orderResponse.order_id;
          
          toast({ title: "Order Created", description: "Redirecting to PayPal..." });

          // In a real app, we would redirect here.
          // For this prototype, we simulate user approval delay.
          
          setTimeout(async () => {
               try {
                   // 2. Capture Order
                   const captureResponse = await capturePaypalOrder({ 
                       order_id: orderId,
                       user_email: email,
                       plan_id: 1
                   });

                   if (captureResponse.success) {
                       dispatch(paymentSuccess());
                       toast({ title: "Success", description: "PayPal payment completed." });
                   } else {
                       throw new Error(captureResponse.message || "Capture failed");
                   }
               } catch (capError: any) {
                   dispatch(paymentFailure(capError.message));
                   toast({ title: "Capture Failed", description: capError.message, variant: "destructive" });
               }
          }, 3000);

      } catch (error: any) {
          dispatch(paymentFailure(error.message));
          toast({ title: "PayPal Failed", description: error.message, variant: "destructive" });
      }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>PayPal Payment</CardTitle>
            <CardDescription>Pay securely with PayPal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="pp-email">Email Address</Label>
                <Input 
                    id="pp-email" 
                    type="email" 
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="pp-amount">Amount (USD)</Label>
                <Input 
                    id="pp-amount" 
                    type="number" 
                    placeholder="10.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
             </div>
        </CardContent>
        <CardFooter>
            <Button 
                className="w-full flex items-center justify-center gap-2 bg-[#0070ba] hover:bg-[#005ea6]" 
                onClick={handlePaypal}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                    <Icons.paypal className="h-5 w-5" />
                )}
                {isProcessing ? "Processing..." : "Pay with PayPal"}
            </Button>
        </CardFooter>
    </Card>
  );
}

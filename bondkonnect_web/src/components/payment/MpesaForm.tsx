"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { startPayment, paymentSuccess, paymentFailure, setMpesaCheckoutRequestID } from "@/store/apps/payment/PaymentSlice";
import { initiateMpesaPayment } from "@/lib/actions/api.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

export default function MpesaForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isProcessing } = useSelector((state: RootState) => state.payment);
  const { toast } = useToast();
  
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  
  const handlePay = async () => {
    if (!phone || !amount || !email) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    dispatch(startPayment());

    try {
      const response = await initiateMpesaPayment({
        phone: phone,
        amount: Number(amount),
        plan_id: 1, // Hardcoded for demo/MVP
        user_email: email
      });

      if (response && response.success) {
         if (response.checkout_id) {
            dispatch(setMpesaCheckoutRequestID(response.checkout_id));
         }
         
         toast({ title: "Request Sent", description: "Check your phone to enter PIN." });
         
         // Mocking polling success for UI demo since we don't have real webhooks
         setTimeout(async () => {
             dispatch(paymentSuccess());
             toast({ title: "Success", description: "Payment processed successfully." });
         }, 5000);

      } else {
          throw new Error(response.message || "Invalid response from server");
      }

    } catch (error: any) {
      dispatch(paymentFailure(error.message));
      toast({ title: "Payment Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>M-Pesa Payment</CardTitle>
        <CardDescription>Enter your details to pay with M-Pesa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="user@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            placeholder="2547..." 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (KES)</Label>
          <Input 
            id="amount" 
            type="number" 
            placeholder="1000" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full flex items-center justify-center gap-2 bg-[#4EB525] hover:bg-[#3e8e1d]" 
            onClick={handlePay} 
            disabled={isProcessing}
        >
          {isProcessing ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.mpesa className="h-5 w-5" />
          )}
          {isProcessing ? "Processing..." : "Pay with M-Pesa"}
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import MpesaForm from "@/app/components/payment/MpesaForm";
import PaypalForm from "@/app/components/payment/PaypalForm";

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Tabs defaultValue="mpesa" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
        </TabsList>
        <TabsContent value="mpesa">
          <MpesaForm />
        </TabsContent>
        <TabsContent value="paypal">
          <PaypalForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

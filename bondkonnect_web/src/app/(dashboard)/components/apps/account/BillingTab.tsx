import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

export function BillingTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiration-date">Expiration Date</Label>
            <Input id="expiration-date" placeholder="MM/YY" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input id="cardholder-name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="billing-address">Billing Address</Label>
          <Input id="billing-address" placeholder="123 Main St, City, Country" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan">Current Plan</Label>
          <Select>
            <SelectTrigger id="plan">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Plan</SelectItem>
              <SelectItem value="pro">Pro Plan</SelectItem>
              <SelectItem value="enterprise">Enterprise Plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button>Update Billing Information</Button>
    </div>
  )
}


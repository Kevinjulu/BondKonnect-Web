"use client"
import { useRouter } from "next/navigation"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Calendar, CreditCard, Plus, ArrowLeft } from "lucide-react"
import { Label } from "@/app/components/ui/label"

export default function CreateInvoicePage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Invoices</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <Input defaultValue="INV/12/2023/LP018" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Issue Date</label>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      12 December 2023
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      12 January 2024
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Bill From</h3>
                <div>
                  <Input defaultValue="Acme Inc." className="mb-2" />
                  <Input defaultValue="123 Elm Street" className="mb-2" />
                  <Input defaultValue="Cityville, Stateville 98765" className="mb-2" />
                  <Input defaultValue="United States" className="mb-2" />
                  <Input defaultValue="(555)123-4567" className="mb-2" />
                  <Input defaultValue="acme.inc@example.com" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Bill To</h3>
                  <Button variant="link" size="sm" className="text-purple-600">
                    Edit
                  </Button>
                </div>
                <div>
                  <Input defaultValue="GalactiCode" className="mb-2" />
                  <Input defaultValue="1901 Thornridge Cir." className="mb-2" />
                  <Input defaultValue="Shiloh, Hawaii 81063" className="mb-2" />
                  <Input defaultValue="United States" className="mb-2" />
                  <Input defaultValue="(555)1314-9684" className="mb-2" />
                  <Input defaultValue="mail@galacticode.com" />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-black text-white p-4 rounded-t-lg">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Rate</div>
                  <div className="col-span-3 text-right">Total Price</div>
                </div>
              </div>

              <div className="border border-t-0 rounded-b-lg p-4 space-y-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Input defaultValue="Book" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" defaultValue="12" className="text-center" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" defaultValue="50" className="text-center" />
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="mr-2">$</span>
                    <span>600</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <Input defaultValue="Cover Illustration" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" defaultValue="1" className="text-center" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" defaultValue="100" className="text-center" />
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="mr-2">$</span>
                    <span>100</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a line item
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select defaultValue="paypal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Paypal
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Terms & Condition</label>
                <Input />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-right">
                  <div className="mb-2">Sub total</div>
                  <div className="mb-2">
                    Tax <span className="text-muted-foreground">(10%)</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center">
                    <span className="mr-2">$</span>
                    <Input defaultValue="700" />
                  </div>
                  <div className="mb-2 flex items-center">
                    <span className="mr-2">$</span>
                    <Input defaultValue="70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Language</h3>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center">
                    <span className="mr-2">🇺🇸</span>
                    English
                  </div>
                </SelectItem>
                <SelectItem value="es">
                  <div className="flex items-center">
                    <span className="mr-2">🇪🇸</span>
                    Spanish
                  </div>
                </SelectItem>
                <SelectItem value="fr">
                  <div className="flex items-center">
                    <span className="mr-2">🇫🇷</span>
                    French
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Currency</h3>
            <Select defaultValue="usd">
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">
                  <div className="flex items-center">
                    <span className="mr-2">🇺🇸</span>$ USD
                  </div>
                </SelectItem>
                <SelectItem value="eur">
                  <div className="flex items-center">
                    <span className="mr-2">🇪🇺</span>€ EUR
                  </div>
                </SelectItem>
                <SelectItem value="gbp">
                  <div className="flex items-center">
                    <span className="mr-2">🇬🇧</span>£ GBP
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Color</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className="w-8 h-8 rounded-full bg-red-500"
                aria-label="Red color"
                title="Red"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-orange-500"
                aria-label="Orange color"
                title="Orange"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-yellow-500"
                aria-label="Yellow color"
                title="Yellow"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-green-500"
                aria-label="Green color"
                title="Green"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-blue-500"
                aria-label="Blue color"
                title="Blue"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-purple-500"
                aria-label="Purple color"
                title="Purple"
              ></button>
              <button 
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                aria-label="Add custom color"
                title="Add custom color"
              >+</button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Template</h3>
            <div className="border rounded-lg p-4 bg-orange-500">
              <div className="bg-white rounded-lg p-4 flex flex-col space-y-2">
                <div className="h-4 w-16 bg-purple-500 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
                <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-purple-500 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
                <div className="h-2 w-full bg-gray-200 rounded"></div>
                <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Change Template</Button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Email Options</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input type="checkbox" id="sendCopy" className="rounded border-gray-300" />
                <Label htmlFor="sendCopy">Send a copy to myself</Label>
              </div>
              <div>
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input id="emailSubject" placeholder="Invoice #INV/12/2023/LP018 from Acme Inc." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emailMessage">Email Message</Label>
                <textarea
                  id="emailMessage"
                  className="w-full border rounded-md p-2 min-h-[100px] mt-1"
                  placeholder="Thank you for your business. Please find the attached invoice."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Save as Draft</Button>
          <Button variant="outline">Preview</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">Download Invoice</Button>
        </div>
      </div>
    </div>
  )
}

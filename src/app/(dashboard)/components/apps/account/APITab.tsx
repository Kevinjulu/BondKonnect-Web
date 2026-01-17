import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ApiTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">API Access</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex items-center space-x-2">
            <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly />
            <Button variant="outline">Regenerate</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input id="webhook-url" placeholder="https://your-webhook-url.com" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API Documentation</h3>
        <p className="text-muted-foreground">
          Learn how to integrate our API into your applications. Visit our comprehensive API documentation for detailed
          information on endpoints, authentication, and example requests.
        </p>
        <Button variant="outline">View API Documentation</Button>
      </div>
    </div>
  )
}


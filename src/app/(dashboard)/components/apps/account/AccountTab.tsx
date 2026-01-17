import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Slider } from "@/app/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"

export function AccountTab() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <Button>Edit photo</Button>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground">Set your account details</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname">Surname</Label>
            <Input id="surname" placeholder="Doe" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.doe@example.com" />
        </div>
      </div>
      {/* <div className="space-y-2">
        <h2 className="text-2xl font-bold">Timezone & preferences</h2>
        <p className="text-muted-foreground">Let us know your time zone and format</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="New York" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                <SelectItem value="utc-6">UTC-6 (Central Time)</SelectItem>
                <SelectItem value="utc-7">UTC-7 (Mountain Time)</SelectItem>
                <SelectItem value="utc-8">UTC-8 (Pacific Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-format">Date & Time format</Label>
            <Select>
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div> */}
      {/* <div className="space-y-4">
        <h2 className="text-2xl font-bold">Motivation & Performance setup</h2>
        <p className="text-muted-foreground">Calibrate your desired activity levels</p>
        <div className="space-y-8">
          <div className="space-y-2">
            <Label>Desired daily time utilization: 7 hrs</Label>
            <Slider defaultValue={[7]} max={12} step={0.5} />
          </div>
          <div className="space-y-2">
            <Label>Desired daily core work range: 3-6 hrs</Label>
            <Slider defaultValue={[3, 6]} max={12} step={0.5} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your work</h2>
        <p className="text-muted-foreground">Add info about your position</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="function">Function</Label>
            <Input id="function" placeholder="Design" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input id="job-title" placeholder="Team Lead designer" />
          </div>
        </div>
      </div> */}
      <Button>Save changes</Button>
    </div>
  )
}


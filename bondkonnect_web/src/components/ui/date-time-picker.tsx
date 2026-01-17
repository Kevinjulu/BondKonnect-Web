"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(date ? format(date, "HH:mm") : "12:00")

  const handleTimeChange = React.useCallback(
    (time: string) => {
      setSelectedTime(time)

      if (date) {
        const [hours, minutes] = time.split(":").map(Number)
        const newDate = new Date(date)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        setDate(newDate)
      }
    },
    [date, setDate],
  )

  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      if (newDate) {
        const [hours, minutes] = selectedTime.split(":").map(Number)
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
      }
      setDate(newDate)
    },
    [selectedTime, setDate],
  )

  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
        </PopoverContent>
      </Popover>
      <Select value={selectedTime} onValueChange={handleTimeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }).map((_, hour) => (
            <React.Fragment key={hour}>
              <SelectItem value={`${hour.toString().padStart(2, "0")}:00`}>
                {hour.toString().padStart(2, "0")}:00
              </SelectItem>
              <SelectItem value={`${hour.toString().padStart(2, "0")}:30`}>
                {hour.toString().padStart(2, "0")}:30
              </SelectItem>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

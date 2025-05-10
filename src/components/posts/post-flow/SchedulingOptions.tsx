import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { format, addDays, isToday, isAfter, isBefore } from "date-fns";
import {
  Clock,
  Calendar as CalendarIcon,
  CalendarCheck,
  Rocket,
  RotateCw,
} from "lucide-react";

interface SchedulingOptionsProps {
  isScheduled: boolean;
  scheduledDate: Date | null;
  onSchedulingChange: (isScheduled: boolean, date: Date | null) => void;
}

// Get AM/PM time options
const getTimeOptions = () => {
  const options = [];

  for (let hour = 0; hour < 24; hour++) {
    const isPM = hour >= 12;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = displayHour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const period = isPM ? "PM" : "AM";

      options.push({
        value: `${hour.toString().padStart(2, "0")}:${formattedMinute}`,
        label: `${formattedHour}:${formattedMinute} ${period}`,
      });
    }
  }

  return options;
};

export default function SchedulingOptions({
  isScheduled,
  scheduledDate,
  onSchedulingChange,
}: Readonly<SchedulingOptionsProps>) {
  const [date, setDate] = useState<Date | null>(scheduledDate || new Date());
  const [time, setTime] = useState<string>(
    scheduledDate ? format(scheduledDate, "HH:mm") : format(new Date(), "HH:mm")
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const timeOptions = getTimeOptions();

  // Update scheduled date when component inputs change
  useEffect(() => {
    if (scheduledDate) {
      setDate(scheduledDate);
      setTime(format(scheduledDate, "HH:mm"));
    } else {
      setDate(new Date());
      setTime(format(new Date(), "HH:mm"));
    }
  }, [scheduledDate]);

  // Combine date and time for the full scheduled date
  const getFullScheduledDate = () => {
    if (!date) return null;

    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    return newDate;
  };

  // Update scheduling state
  const updateScheduling = (scheduleEnabled: boolean) => {
    if (scheduleEnabled) {
      const scheduledDateTime = getFullScheduledDate();

      // Validate date is in the future
      if (scheduledDateTime && isBefore(scheduledDateTime, new Date())) {
        // Set to 15 minutes from now
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 15);
        setDate(futureDate);
        setTime(format(futureDate, "HH:mm"));
        onSchedulingChange(scheduleEnabled, futureDate);
      } else {
        onSchedulingChange(scheduleEnabled, scheduledDateTime);
      }
    } else {
      onSchedulingChange(scheduleEnabled, null);
    }
  };

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const fullDate = new Date(newDate);
      const [hours, minutes] = time.split(":").map(Number);
      fullDate.setHours(hours, minutes, 0, 0);

      // Validate date is in the future
      if (isBefore(fullDate, new Date())) {
        // If it's today but time is in the past, adjust the time
        if (isToday(newDate)) {
          const futureDate = new Date();
          futureDate.setMinutes(futureDate.getMinutes() + 15);
          setTime(format(futureDate, "HH:mm"));
          onSchedulingChange(isScheduled, futureDate);
        } else {
          onSchedulingChange(isScheduled, fullDate);
        }
      } else {
        onSchedulingChange(isScheduled, fullDate);
      }

      setIsDatePickerOpen(false);
    }
  };

  // Handle time change
  const handleTimeChange = (newTime: string) => {
    setTime(newTime);

    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);

      // Validate date is in the future
      if (isBefore(newDate, new Date())) {
        // If it's today but time is in the past, adjust to tomorrow
        if (isToday(date)) {
          const tomorrow = addDays(new Date(), 1);
          tomorrow.setHours(hours, minutes, 0, 0);
          setDate(tomorrow);
          onSchedulingChange(isScheduled, tomorrow);
        } else {
          onSchedulingChange(isScheduled, newDate);
        }
      } else {
        onSchedulingChange(isScheduled, newDate);
      }
    }

    setIsTimePickerOpen(false);
  };

  // Quick buttons for common scheduling options
  const quickSchedule = (option: "now" | "later" | "tomorrow" | "weekend") => {
    const now = new Date();
    let newDate: Date;

    switch (option) {
      case "now":
        newDate = now;
        break;

      case "later":
        // 3 hours from now
        newDate = new Date(now);
        newDate.setHours(now.getHours() + 3);
        break;

      case "tomorrow":
        // 10 AM tomorrow
        newDate = addDays(now, 1);
        newDate.setHours(10, 0, 0, 0);
        break;

      case "weekend":
        // Next Saturday at noon
        const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
        const daysUntilSaturday = dayOfWeek === 6 ? 7 : 6 - dayOfWeek;
        newDate = addDays(now, daysUntilSaturday);
        newDate.setHours(12, 0, 0, 0);
        break;

      default:
        newDate = now;
    }

    setDate(newDate);
    setTime(format(newDate, "HH:mm"));
    onSchedulingChange(true, newDate);

    // Close any open pickers
    setIsDatePickerOpen(false);
    setIsTimePickerOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Schedule Post</CardTitle>
            <CardDescription>Choose when to publish your post</CardDescription>
          </div>
          <Switch
            checked={isScheduled}
            onCheckedChange={updateScheduling}
            id="schedule-toggle"
          />
        </div>
      </CardHeader>

      {isScheduled && (
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="scheduled-date">Date</Label>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !date ? "text-muted-foreground" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date || undefined}
                      onSelect={handleDateChange}
                      disabled={(dateObj) =>
                        isBefore(dateObj, new Date()) && !isToday(dateObj)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="scheduled-time">Time</Label>
                <Popover
                  open={isTimePickerOpen}
                  onOpenChange={setIsTimePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {time
                        ? format(getFullScheduledDate() || new Date(), "h:mm a")
                        : "Select time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="h-[300px] overflow-y-auto p-2">
                      {timeOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          onClick={() => handleTimeChange(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Schedule</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => quickSchedule("now")}
                >
                  <Rocket className="mr-1 h-3.5 w-3.5" />
                  Post Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => quickSchedule("later")}
                >
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  Later Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => quickSchedule("tomorrow")}
                >
                  <CalendarCheck className="mr-1 h-3.5 w-3.5" />
                  Tomorrow
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => quickSchedule("weekend")}
                >
                  <RotateCw className="mr-1 h-3.5 w-3.5" />
                  Weekend
                </Button>
              </div>
            </div>

            {date && time && (
              <div className="bg-muted/40 p-3 rounded-md text-center">
                {scheduledDate &&
                isAfter(getFullScheduledDate() || new Date(), new Date()) ? (
                  <p className="text-sm">
                    Your post will be published on{" "}
                    <span className="font-medium">
                      {format(getFullScheduledDate() || new Date(), "PPPP")}
                    </span>{" "}
                    at{" "}
                    <span className="font-medium">
                      {format(getFullScheduledDate() || new Date(), "h:mm a")}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Please select a future date and time
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

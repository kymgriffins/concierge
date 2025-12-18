"use client";

import * as React from "react";
import { Input } from "./input";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  date: string | null;
  time: string | null;
  onChange: (date: string | null, time: string | null) => void;
  className?: string;
  placeholder?: string;
  stepMinutes?: number;
};

function generateTimes(step = 15) {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}

export function DateTimePicker({
  date,
  time,
  onChange,
  className,
  placeholder = "Select date & time",
  stepMinutes = 15,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const times = React.useMemo(() => generateTimes(stepMinutes), [stepMinutes]);

  const display = date ? `${date}${time ? ` ${time}` : ""}` : "";

  const handleDate = (d?: Date) => {
    if (!d) return onChange(null, time);
    const isoDate = d.toISOString().split("T")[0];
    onChange(isoDate, time);
  };

  const handleTime = (t: string) => {
    onChange(date, t);
    setOpen(false);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="flex items-center gap-2">
        <Input
          value={display}
          placeholder={placeholder}
          readOnly
          onClick={() => setOpen((v) => !v)}
        />
        <button
          type="button"
          className="p-2 rounded-md hover:bg-muted/40"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle date-time picker"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 rounded-md hover:bg-muted/40"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle time picker"
        >
          <Clock className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-card text-card-foreground ring-1 ring-border rounded-md shadow-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <DayPicker
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={handleDate}
            />
          </div>
          <div className="min-w-[180px]">
            <div className="grid grid-cols-3 gap-1 max-h-52 overflow-auto p-1">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`text-sm p-2 text-left rounded ${t === time ? "bg-muted/30" : "hover:bg-muted/40"}`}
                  onClick={() => handleTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="text-sm px-2 py-1"
                onClick={() =>
                  onChange(
                    new Date().toISOString().split("T")[0],
                    new Date().toTimeString().slice(0, 5),
                  )
                }
              >
                Now
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-sm px-2 py-1"
                  onClick={() => {
                    onChange(null, null);
                    setOpen(false);
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="text-sm px-2 py-1"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;

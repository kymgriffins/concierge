"use client";

import * as React from "react";
import { Input } from "./input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  className?: string;
  placeholder?: string;
};

export function DatePicker({ value, onChange, className, placeholder }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    setOpen(false);
    if (!date) return onChange(null);
    const iso = date.toISOString().split("T")[0];
    onChange(iso);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className="flex items-center gap-2">
        <Input
          value={value || ""}
          placeholder={placeholder}
          readOnly
          onClick={() => setOpen(v => !v)}
        />
        <button type="button" className="p-2 rounded-md hover:bg-muted/40" onClick={() => setOpen(v => !v)} aria-label="Toggle calendar">
          <CalendarIcon className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-card text-card-foreground ring-1 ring-border rounded-md shadow-lg p-2">
          <DayPicker mode="single" selected={value ? new Date(value) : undefined} onSelect={handleSelect} />
          <div className="flex justify-end mt-2">
            <button className="text-sm text-muted-foreground px-2 py-1" onClick={() => { setOpen(false); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;

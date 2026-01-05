"use client";

import * as React from "react";
import { Input } from "./input";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";

type DateRange = {
  from: string | null;
  to: string | null;
};

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  placeholder?: string;
  // Enhanced props for more advanced functionality
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  onUpdate?: (values: { range: DateRange }) => void;
  showPresets?: boolean;
  presets?: Array<{ name: string; label: string; getRange: () => DateRange }>;
};

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder,
  showPresets = true,
  onUpdate
}: Props) {
  const [open, setOpen] = React.useState(false);

  // Default presets
  const defaultPresets = [
    { name: 'today', label: 'Today', getRange: () => {
      const today = new Date();
      return { from: today.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
    }},
    { name: 'yesterday', label: 'Yesterday', getRange: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday.toISOString().split("T")[0], to: yesterday.toISOString().split("T")[0] };
    }},
    { name: 'last7', label: 'Last 7 days', getRange: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 6);
      return { from: lastWeek.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
    }},
    { name: 'last30', label: 'Last 30 days', getRange: () => {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 29);
      return { from: lastMonth.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
    }},
    { name: 'thisMonth', label: 'This Month', getRange: () => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: firstDay.toISOString().split("T")[0], to: today.toISOString().split("T")[0] };
    }},
  ];

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range || (!range.from && !range.to)) {
      onChange({ from: null, to: null });
      return;
    }

    const from = range.from ? range.from.toISOString().split("T")[0] : null;
    const to = range.to ? range.to.toISOString().split("T")[0] : null;

    onChange({ from, to });
  };

  const handlePresetSelect = (preset: { name: string; label: string; getRange: () => DateRange }) => {
    const range = preset.getRange();
    onChange(range);
    if (onUpdate) {
      onUpdate({ range });
    }
  };

  const formatRange = () => {
    if (!value.from && !value.to) return "";
    if (value.from && !value.to) return value.from;
    if (!value.from && value.to) return `to ${value.to}`;
    return `${value.from} - ${value.to}`;
  };

  const selectedRange = value.from && value.to ? {
    from: new Date(value.from),
    to: new Date(value.to),
  } : value.from ? {
    from: new Date(value.from),
    to: undefined,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative inline-block", className)}>
          <div className="flex items-center gap-2">
            <Input
              value={formatRange()}
              placeholder={placeholder || "Select date range"}
              readOnly
              className="cursor-pointer"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Toggle calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1000px] p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold">Select Date Range</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Calendar Section */}
            <div className="flex-1">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="rounded-md border-0 [&_.rdp-months]:flex [&_.rdp-months]:gap-4 [&_.rdp-months]:justify-center"
              />
            </div>

            {/* Presets Section */}
            {showPresets && (
              <div className="w-48 flex-shrink-0">
                <div className="text-sm font-medium mb-3 text-muted-foreground">Quick Select</div>
                <div className="space-y-2">
                  {defaultPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {formatRange() || "No range selected"}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onChange({ from: null, to: null });
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  if (onUpdate) {
                    onUpdate({ range: value });
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DateRangePicker;

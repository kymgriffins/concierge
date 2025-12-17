"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  className?: string;
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

export function TimePicker({ value, onChange, className, stepMinutes = 15 }: Props) {
  const [open, setOpen] = React.useState(false);
  const times = React.useMemo(() => generateTimes(stepMinutes), [stepMinutes]);

  return (
    <div className={cn("relative inline-block", className)}>
      <Input value={value || ""} placeholder="Select time" readOnly onClick={() => setOpen(v => !v)} />
      {open && (
        <div className="absolute z-50 mt-2 bg-card text-card-foreground ring-1 ring-border rounded-md shadow-lg p-2 max-h-60 overflow-auto">
          <div className="grid grid-cols-3 gap-1">
            {times.map(t => (
              <button key={t} type="button" className="text-sm p-2 text-left rounded hover:bg-muted/40" onClick={() => { onChange(t); setOpen(false); }}>{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;

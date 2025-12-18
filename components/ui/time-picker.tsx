"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  className?: string;
  placeholder?: string;
};

export function TimePicker({ value, onChange, className, placeholder }: Props) {
  return (
    <Input
      type="time"
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={cn(
        "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
        className,
      )}
      placeholder={placeholder}
    />
  );
}

export default TimePicker;

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, defaultChecked = false, checked, onCheckedChange, onClick, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = checked ?? internalChecked;

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-[var(--em-green)] data-[state=unchecked]:bg-[var(--em-bg-alt)]",
          className,
        )}
        onClick={(event) => {
          if (checked === undefined) setInternalChecked(!isChecked);
          onCheckedChange?.(!isChecked);
          onClick?.(event);
        }}
        {...props}
      >
        <span
          data-state={isChecked ? "checked" : "unchecked"}
          className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1"
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";

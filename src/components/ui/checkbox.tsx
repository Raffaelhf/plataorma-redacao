"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  onCheckedChange?: (checked: boolean) => void;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, onCheckedChange, readOnly, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
    const isControlled = checked !== undefined;
    const isChecked = Boolean(isControlled ? checked : internalChecked);

    return (
      <input
        ref={ref}
        type="checkbox"
        checked={isControlled ? isChecked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        readOnly={readOnly ?? (isControlled && !onChange && !onCheckedChange)}
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "h-4 w-4 shrink-0 cursor-pointer accent-[var(--em-ink)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onChange={(event) => {
          if (!isControlled) setInternalChecked(event.currentTarget.checked);
          onCheckedChange?.(event.currentTarget.checked);
          onChange?.(event);
        }}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };

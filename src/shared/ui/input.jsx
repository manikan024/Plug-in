import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, rowIndex, parentSectionRowIndex, attribute, ...props }, ref) => {
  // Filter out non-DOM props that React doesn't recognize
  // These are React-specific props that shouldn't be passed to DOM elements
  const {
    rowIndex: _rowIndex,
    parentSectionRowIndex: _parentSectionRowIndex,
    attribute: _attribute,
    ...domProps
  } = props;

  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-base-border bg-base-input px-3 py-1 text-sm text-base-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-base-foreground placeholder:text-base-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-focus focus-visible:border-base-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-base-muted",
        className
      )}
      ref={ref}
      {...domProps}
    />
  );
});
Input.displayName = "Input";

export { Input };


import * as React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef(({ className, children, rowIndex, parentSectionRowIndex, attribute, ...props }, ref) => {
  // Filter out non-DOM props that React doesn't recognize
  const {
    rowIndex: _rowIndex,
    parentSectionRowIndex: _parentSectionRowIndex,
    attribute: _attribute,
    ...domProps
  } = props;

  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-base-border bg-base-input px-3 py-1 text-sm text-base-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-focus focus-visible:border-base-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-base-muted",
        className
      )}
      ref={ref}
      {...domProps}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

const SelectOption = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <option
      ref={ref}
      className={cn("text-base-foreground", className)}
      {...props}
    >
      {children}
    </option>
  );
});
SelectOption.displayName = "SelectOption";

export { Select, SelectOption };


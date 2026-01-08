import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-focus disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-base-primary text-base-primaryForeground hover:bg-base-primary-hover",
      secondary: "bg-base-secondary text-base-secondaryForeground hover:bg-base-secondary-hover",
      outline: "border border-base-border bg-transparent hover:bg-base-muted",
      ghost: "hover:bg-base-muted",
      destructive: "bg-semantic-destructive text-white hover:bg-red-600",
    };
    
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };


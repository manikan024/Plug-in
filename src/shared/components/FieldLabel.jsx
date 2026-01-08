import React, { useState, useRef } from 'react';
import { Label } from '../ui/label';

/**
 * FieldLabel - Shared label component with required indicator and help text
 * Matches React-plugin FieldLabel pattern
 */
function FieldLabel({
  id,
  label,
  required = false,
  showLabel = true,
  isHelpTextEnabled = false,
  helpMessage = '',
}) {
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef(null);

  if (!showLabel || !label) {
    return null;
  }

  const handleMouseEnter = () => {
    setShowHelp(true);
  };

  const handleMouseLeave = () => {
    setShowHelp(false);
  };

  return (
    <div className="label-with-help flex items-center gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-base-foreground">
        {label}
        {required && (
          <span className="text-semantic-destructive ml-1">*</span>
        )}
      </Label>
      {isHelpTextEnabled && helpMessage && (
        <div
          className="help-text-wrapper relative"
          ref={helpRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className="help-icon-btn w-4 h-4 rounded-full border border-base-border bg-base-muted text-base-foreground text-xs flex items-center justify-center hover:bg-base-accent transition-colors"
            aria-label="Show help"
          >
            <span className="help-icon-text">?</span>
          </button>
          {showHelp && (
            <div className="help-popover absolute z-10 mt-1 p-2 bg-base-popover border border-base-border rounded-md shadow-lg min-w-[200px] max-w-[300px]">
              <div className="help-popover-title text-sm font-semibold mb-1 text-base-popoverForeground">Help</div>
              <p className="help-popover-message text-xs text-base-popoverForeground">{helpMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FieldLabel;


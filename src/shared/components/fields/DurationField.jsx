import React, { useState } from 'react';

/**
 * DurationField - Duration input (from/to dates or duration value)
 */
function DurationField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  durationType,
  onDurationTypeChange,
  className = '',
  ...props 
}) {
  const [fromDate, setFromDate] = useState(value?.from || '');
  const [toDate, setToDate] = useState(value?.to || '');
  const [duration, setDuration] = useState(value?.duration || '');

  const durationTypes = attribute?.durationTypes || [
    { id: 'd', name: 'Day(s)' },
    { id: 'w', name: 'Week(s)' },
    { id: 'm', name: 'Month(s)' },
    { id: 'y', name: 'Year(s)' },
  ];

  const handleFromDateChange = (e) => {
    const newFrom = e.target.value;
    setFromDate(newFrom);
    if (onChange) {
      onChange({ ...value, from: newFrom, to: toDate }, attribute);
    }
  };

  const handleToDateChange = (e) => {
    const newTo = e.target.value;
    setToDate(newTo);
    if (onChange) {
      onChange({ ...value, from: fromDate, to: newTo }, attribute);
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setDuration(newDuration);
    if (onChange) {
      onChange({ ...value, duration: newDuration, durationType }, attribute);
    }
  };

  const handleDurationTypeChange = (e) => {
    const newType = e.target.value;
    if (onDurationTypeChange) {
      onDurationTypeChange(newType, attribute);
    }
    if (onChange) {
      onChange({ ...value, duration, durationType: newType }, attribute);
    }
  };

  if (mode === 'view') {
    if (value?.from && value?.to) {
      return (
        <div className={`text-base-foreground ${className}`}>
          {value.from} to {value.to}
        </div>
      );
    }
    if (value?.duration) {
      const type = durationTypes.find(t => t.id === value.durationType);
      return (
        <div className={`text-base-foreground ${className}`}>
          {value.duration} {type?.name || value.durationType}
        </div>
      );
    }
    return <span className="text-base-muted-foreground">—</span>;
  }

  // Check if it's a date range or duration value
  const isDateRange = attribute?.dateType === 'range' || (fromDate || toDate);

  if (isDateRange) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            placeholder="From"
            disabled={disabled}
            className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
              disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
            }`}
          />
          <input
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            placeholder="To"
            disabled={disabled}
            className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
              disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="number"
        value={duration}
        onChange={handleDurationChange}
        placeholder="Duration"
        disabled={disabled}
        min={0}
        className={`flex-1 px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        }`}
        {...props}
      />
      <select
        value={durationType || durationTypes[0]?.id}
        onChange={handleDurationTypeChange}
        disabled={disabled}
        className={`px-3 py-2 border border-base-border rounded-md focus:outline-none focus:ring-2 focus:ring-base-focus ${
          disabled ? 'bg-base-muted cursor-not-allowed' : 'bg-base-input'
        }`}
      >
        {durationTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DurationField;


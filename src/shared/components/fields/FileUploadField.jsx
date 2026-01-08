import React, { useState, useRef } from 'react';

/**
 * FileUploadField - File upload with preview
 */
function FileUploadField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  multiple = false,
  accept,
  className = '',
  ...props 
}) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(value || []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles;
    setFiles(newFiles);
    
    if (onChange) {
      onChange(newFiles, attribute);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onChange) {
      onChange(newFiles, attribute);
    }
  };

  if (mode === 'view') {
    if (!files || files.length === 0) {
      return <span className="text-base-muted-foreground">—</span>;
    }
    return (
      <div className={`space-y-2 ${className}`}>
        {files.map((file, index) => {
          const fileName = typeof file === 'string' ? file : file.name;
          const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
          return (
            <div key={index} className="flex items-center gap-2">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base-primary hover:underline"
              >
                {fileName}
              </a>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        multiple={multiple}
        accept={accept || attribute?.accept}
        className="hidden"
        {...props}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`px-4 py-2 border border-base-border rounded-md hover:bg-base-muted ${
          disabled ? 'bg-base-muted cursor-not-allowed opacity-50' : 'bg-base-input'
        }`}
      >
        {multiple ? 'Choose Files' : 'Choose File'}
      </button>
      {files && files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => {
            const fileName = typeof file === 'string' ? file : file.name;
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-base-muted rounded">
                <span className="text-sm text-base-foreground">{fileName}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-semantic-destructive hover:text-semantic-destructiveHover"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUploadField;


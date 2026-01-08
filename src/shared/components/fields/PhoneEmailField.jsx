import React, { useState } from 'react';
import PhoneField from './PhoneField';
import EmailField from './EmailField';

/**
 * PhoneEmailField - Combined phone and email fields
 */
function PhoneEmailField({ 
  attribute, 
  value, 
  onChange, 
  mode = 'create',
  disabled = false,
  className = '',
  ...props 
}) {
  const [phoneNumbers, setPhoneNumbers] = useState(value?.phoneNumbers || []);
  const [emailAddresses, setEmailAddresses] = useState(value?.emailAddresses || []);

  const handlePhoneChange = (phoneValue, phoneIndex, phoneType) => {
    const newPhones = [...phoneNumbers];
    if (!newPhones[phoneIndex]) {
      newPhones[phoneIndex] = {};
    }
    newPhones[phoneIndex].phoneNumber = phoneValue;
    newPhones[phoneIndex].phoneType = phoneType;
    setPhoneNumbers(newPhones);
    if (onChange) {
      onChange({ phoneNumbers: newPhones, emailAddresses }, attribute);
    }
  };

  const handleEmailChange = (emailValue, emailIndex) => {
    const newEmails = [...emailAddresses];
    if (!newEmails[emailIndex]) {
      newEmails[emailIndex] = {};
    }
    newEmails[emailIndex].emailAddress = emailValue;
    setEmailAddresses(newEmails);
    if (onChange) {
      onChange({ phoneNumbers, emailAddresses: newEmails }, attribute);
    }
  };

  const addPhone = () => {
    const newPhones = [...phoneNumbers, { phoneNumber: '', phoneType: 'mobile' }];
    setPhoneNumbers(newPhones);
    if (onChange) {
      onChange({ phoneNumbers: newPhones, emailAddresses }, attribute);
    }
  };

  const addEmail = () => {
    const newEmails = [...emailAddresses, { emailAddress: '' }];
    setEmailAddresses(newEmails);
    if (onChange) {
      onChange({ phoneNumbers, emailAddresses: newEmails }, attribute);
    }
  };

  const removePhone = (index) => {
    const newPhones = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newPhones);
    if (onChange) {
      onChange({ phoneNumbers: newPhones, emailAddresses }, attribute);
    }
  };

  const removeEmail = (index) => {
    const newEmails = emailAddresses.filter((_, i) => i !== index);
    setEmailAddresses(newEmails);
    if (onChange) {
      onChange({ phoneNumbers, emailAddresses: newEmails }, attribute);
    }
  };

  if (mode === 'view') {
    return (
      <div className={`space-y-4 ${className}`}>
        {phoneNumbers.length > 0 && (
          <div>
            <div className="font-medium mb-2">Phone Numbers</div>
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="text-base-foreground">
                {phone.phoneType}: <a href={`tel:${phone.phoneNumber}`} className="text-base-primary">{phone.phoneNumber}</a>
              </div>
            ))}
          </div>
        )}
        {emailAddresses.length > 0 && (
          <div>
            <div className="font-medium mb-2">Email Addresses</div>
            {emailAddresses.map((email, index) => (
              <div key={index} className="text-base-foreground">
                <a href={`mailto:${email.emailAddress}`} className="text-base-primary">{email.emailAddress}</a>
              </div>
            ))}
          </div>
        )}
        {phoneNumbers.length === 0 && emailAddresses.length === 0 && (
          <span className="text-base-muted-foreground">—</span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Phone Numbers</label>
          {!disabled && (
            <button
              type="button"
              onClick={addPhone}
              className="text-sm text-base-primary hover:underline"
            >
              + Add Phone
            </button>
          )}
        </div>
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <PhoneField
              attribute={attribute}
              value={phone.phoneNumber}
              onChange={(val) => handlePhoneChange(val, index, phone.phoneType)}
              phoneType={phone.phoneType}
              onPhoneTypeChange={(type) => handlePhoneChange(phone.phoneNumber, index, type)}
              mode={mode}
              disabled={disabled}
              className="flex-1"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removePhone(index)}
                className="px-2 text-semantic-destructive"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="font-medium">Email Addresses</label>
          {!disabled && (
            <button
              type="button"
              onClick={addEmail}
              className="text-sm text-base-primary hover:underline"
            >
              + Add Email
            </button>
          )}
        </div>
        {emailAddresses.map((email, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <EmailField
              attribute={attribute}
              value={email.emailAddress}
              onChange={(val) => handleEmailChange(val, index)}
              mode={mode}
              disabled={disabled}
              className="flex-1"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="px-2 text-semantic-destructive"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhoneEmailField;


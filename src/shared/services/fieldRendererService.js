import React from 'react';
import {
  TextField,
  SelectField,
  DateField,
  TextAreaField,
  CheckboxField,
  NumberField,
  CurrencyField,
  LinkField,
  EmailField,
  PhoneField,
  RadioField,
  ToggleField,
  TagsField,
  DateTimeField,
  TimeField,
  SalutationField,
  MultiSelectField,
  PercentageField,
  DurationField,
  FileUploadField,
  PhoneEmailField,
  AddressField,
  ReferenceField,
  FormulaField,
} from '../components/fields';

/**
 * Field Renderer Service - Maps attribute types to React components
 * Similar to RendererTemplateService in AngularJS app-ui-renderer
 */
class FieldRendererService {
  constructor() {
    // Map of attribute tags/types to React components
    // This matches the createTemplates mapping from AppUiRendererApi.js
    this.fieldComponentMap = {
      // Basic input fields
      input: TextField,
      text: TextField,
      label: TextField,
      number: NumberField,
      currency: CurrencyField,
      link: LinkField,
      email: EmailField,
      phone: PhoneField,
      fax: PhoneField,
      
      // Select fields
      select: SelectField,
      select_dropdown: SelectField,
      select_search: TagsField,
      tags: TagsField,
      multiSelect: MultiSelectField,
      multiObjectList: MultiSelectField,
      
      // Date/Time fields
      date: DateField,
      dateTime: DateTimeField,
      time: TimeField,
      
      // Text areas
      textarea: TextAreaField,
      simpleTextarea: TextAreaField,
      
      // Checkbox/Radio/Toggle
      check: CheckboxField,
      checkbox: CheckboxField,
      radio: RadioField,
      toggle: ToggleField,
      on_off: ToggleField,
      
      // Special fields
      salutation: SalutationField,
      phoneEmail: PhoneEmailField,
      address: AddressField,
      reference: ReferenceField,
      finkey: ReferenceField,
      account: ReferenceField,
      conKey: ReferenceField,
      referenceField: ReferenceField,
      formula: FormulaField,
      
      // Other fields
      duration: DurationField,
      fileUpload: FileUploadField,
      upload: FileUploadField,
      imageUpload: FileUploadField,
      percentage: PercentageField,
      numberwithlabel: NumberField,
      counter: NumberField,
      emailAutoComplete: EmailField,
      app_select: SelectField,
      combo: SelectField,
      button: TextField, // Button is typically handled separately
      image: FileUploadField,
      term: TextField,
      qr: TextField,
      textLink: TextField,
    };
  }

  /**
   * Get the appropriate React component for an attribute
   * @param {Object} attribute - The attribute object
   * @param {string} mode - 'create', 'view', or 'search'
   * @returns {React.Component} The React component to render
   */
  getFieldComponent(attribute, mode = 'create') {
    if (!attribute) {
      return null;
    }

    // Check for custom field type mapping
    const tag = attribute.attributeTag || attribute.tag || attribute.type;
    const displayType = attribute.displayType?.typeName;
    const rightTag = attribute.right?.[0]?.tag;

    // Handle display type overrides
    if (displayType === 'Currency') {
      return CurrencyField;
    }

    // Check right[0].tag for nested attribute definitions
    if (rightTag && this.fieldComponentMap[rightTag]) {
      return this.fieldComponentMap[rightTag];
    }

    // Check main tag
    if (tag && this.fieldComponentMap[tag]) {
      return this.fieldComponentMap[tag];
    }

    // Handle formula fields
    if (tag === 'formula' || attribute.formulaType) {
      return FormulaField;
    }

    // Default to TextField
    return TextField;
  }

  /**
   * Render a field component
   * @param {Object} attribute - The attribute object
   * @param {*} value - The current value
   * @param {Function} onChange - Change handler
   * @param {string} mode - 'create', 'view', or 'search'
   * @param {Object} options - Additional options (options list, disabled, etc.)
   * @returns {React.Element} The rendered component
   */
  renderField(attribute, value, onChange, mode = 'create', options = {}) {
    const FieldComponent = this.getFieldComponent(attribute, mode);
    
    if (!FieldComponent) {
      console.warn(`No component found for attribute type: ${attribute?.attributeTag || attribute?.tag}`);
      return null;
    }

    const fieldProps = {
      attribute,
      value,
      onChange,
      mode,
      disabled: options.disabled || attribute?.disableField || false,
      className: options.className || '',
      ...options,
    };

    // Add options for select/checkbox/radio fields
    if ([SelectField, CheckboxField, RadioField, MultiSelectField, TagsField].includes(FieldComponent)) {
      fieldProps.options = options.options || attribute?.options || attribute?.right?.[0]?.options || [];
    }

    // Add special props for specific field types
    if (FieldComponent === CurrencyField) {
      fieldProps.currencyCode = options.currencyCode || attribute?.currencyCode;
      fieldProps.availableCurrencies = options.availableCurrencies || attribute?.availableCurrencies;
      fieldProps.onCurrencyChange = options.onCurrencyChange;
    }

    if (FieldComponent === PhoneField) {
      fieldProps.phoneType = options.phoneType || attribute?.phoneType;
      fieldProps.onPhoneTypeChange = options.onPhoneTypeChange;
    }

    if (FieldComponent === SalutationField) {
      fieldProps.firstName = options.firstName;
      fieldProps.lastName = options.lastName;
      fieldProps.onFirstNameChange = options.onFirstNameChange;
      fieldProps.onLastNameChange = options.onLastNameChange;
    }

    if (FieldComponent === AddressField) {
      fieldProps.countries = options.countries || attribute?.countries;
      fieldProps.states = options.states || attribute?.states;
      fieldProps.onCountryChange = options.onCountryChange;
    }

    if (FieldComponent === ReferenceField) {
      fieldProps.referenceObject = options.referenceObject || attribute?.referenceObject;
      fieldProps.onSearch = options.onSearch || attribute?.onSearch;
      fieldProps.onSelect = options.onSelect || attribute?.onSelect;
    }

    if (FieldComponent === FormulaField) {
      fieldProps.formula = options.formula || attribute?.formula;
    }

    if (FieldComponent === DurationField) {
      fieldProps.durationType = options.durationType || attribute?.durationType;
      fieldProps.onDurationTypeChange = options.onDurationTypeChange;
    }

    if (FieldComponent === FileUploadField) {
      fieldProps.multiple = options.multiple || attribute?.multiple || false;
      fieldProps.accept = options.accept || attribute?.accept;
    }

    return React.createElement(FieldComponent, fieldProps);
  }
}

// Export singleton instance
export default new FieldRendererService();


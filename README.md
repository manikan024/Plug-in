# Zinnect UI Renderer

React-based UI renderer components similar to AngularJS `app-ui-renderer` and `app-ui-advsearch` modules, with reusable and common logic.

## Overview

This project provides React components for rendering dynamic forms and advanced search interfaces, based on the AngularJS implementations in `apptivo-ng-ui`. The components are designed to be:

- **Reusable**: Common field components can be shared between UIRenderer and AdvancedSearchRenderer
- **Modular**: Clear separation of concerns with shared services and utilities
- **Flexible**: Supports create, view, edit, and search modes

## Project Structure

```
zinnect-ng-ui/
├── src/
│   ├── components/
│   │   ├── UIRenderer/          # Main form renderer (similar to app-ui-renderer)
│   │   └── AdvancedSearchRenderer/ # Advanced search renderer (similar to app-ui-advsearch)
│   ├── shared/
│   │   ├── components/
│   │   │   ├── fields/           # Reusable field components
│   │   │   │   ├── TextField.jsx
│   │   │   │   ├── SelectField.jsx
│   │   │   │   ├── DateField.jsx
│   │   │   │   ├── TextAreaField.jsx
│   │   │   │   └── CheckboxField.jsx
│   │   │   ├── AttributeContainer.jsx
│   │   │   └── Section.jsx
│   │   ├── services/
│   │   │   └── fieldRendererService.js  # Maps attribute types to components
│   │   └── utils/
│   │       └── attributeUtils.js        # Utility functions for attributes
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Key Components

### UIRenderer

Main component for rendering forms in create/view/edit modes. Similar to the `uiRenderer` directive in AngularJS.

**Props:**
- `uiOptions`: Configuration object containing WEB_LAYOUT, sections, etc.
- `mode`: 'create', 'view', or 'edit'
- `formData`: Initial form data
- `onFormDataChange`: Callback when form data changes
- `onSave`: Callback when form is submitted
- `onCancel`: Callback when form is cancelled

**Example:**
```jsx
<UIRenderer
  uiOptions={uiOptions}
  mode="create"
  formData={formData}
  onFormDataChange={(newData) => setFormData(newData)}
  onSave={(data) => console.log('Save:', data)}
  onCancel={() => console.log('Cancelled')}
/>
```

### AdvancedSearchRenderer

Component for rendering advanced search forms. Similar to the `uiAdvSearchRenderer` directive in AngularJS.

**Props:**
- `uiOptions`: Configuration object containing WEB_LAYOUT, sections, etc.
- `formData`: Initial search criteria
- `onFormDataChange`: Callback when search criteria changes
- `onSearch`: Callback when search is triggered
- `onReset`: Callback when search is reset

**Example:**
```jsx
<AdvancedSearchRenderer
  uiOptions={uiOptions}
  formData={searchData}
  onFormDataChange={(newData) => setSearchData(newData)}
  onSearch={(criteria) => performSearch(criteria)}
  onReset={() => setSearchData({})}
/>
```

### Shared Field Components

All field components are located in `src/shared/components/fields/` and can be reused by both renderers:

- **TextField**: Text input fields
- **SelectField**: Dropdown/select fields
- **DateField**: Date picker fields
- **TextAreaField**: Multi-line text fields
- **CheckboxField**: Checkbox fields (single or multi-select)

### FieldRendererService

Service that maps attribute types to React components. Similar to `RendererTemplateService` in AngularJS.

**Usage:**
```javascript
import fieldRendererService from './shared/services/fieldRendererService';

const component = fieldRendererService.getFieldComponent(attribute, 'create');
const rendered = fieldRendererService.renderField(attribute, value, onChange, 'create');
```

## Common Logic & Reusability

### Shared Utilities (`attributeUtils.js`)

- `getAttributeValue()`: Get attribute value from form data
- `setAttributeValue()`: Set attribute value in form data
- `isMandatory()`: Check if attribute is mandatory
- `isDisabled()`: Check if attribute is disabled
- `getAttributeLabel()`: Get attribute label
- `getValidSections()`: Filter sections based on mode and configuration
- `isAttributeVisible()`: Check attribute visibility based on rules

### Shared Components

- **AttributeContainer**: Wraps fields with labels, validation, and layout
- **Section**: Renders sections with their attributes (supports collapsible sections and table sections)

## Usage Example

```jsx
import React, { useState } from 'react';
import UIRenderer from './components/UIRenderer';
import AdvancedSearchRenderer from './components/AdvancedSearchRenderer';

function MyApp() {
  const [formData, setFormData] = useState({});
  const [searchData, setSearchData] = useState({});

  const uiOptions = {
    WEB_LAYOUT: {
      sections: [
        {
          sectionId: 'section1',
          sectionName: 'Basic Information',
          attributes: [
            {
              attributeId: 'name_attr',
              tagName: 'name',
              attributeTag: 'input',
              label: { modifiedLabel: 'Name' },
              isMandatory: true
            },
            {
              attributeId: 'email_attr',
              tagName: 'email',
              attributeTag: 'input',
              label: { modifiedLabel: 'Email' }
            }
          ]
        }
      ]
    },
    objectIdx: {}
  };

  return (
    <div>
      <UIRenderer
        uiOptions={uiOptions}
        mode="create"
        formData={formData}
        onFormDataChange={setFormData}
        onSave={(data) => console.log('Save:', data)}
      />
      
      <AdvancedSearchRenderer
        uiOptions={uiOptions}
        formData={searchData}
        onFormDataChange={setSearchData}
        onSearch={(criteria) => console.log('Search:', criteria)}
      />
    </div>
  );
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Architecture Notes

### Similarities to AngularJS Implementation

1. **Field Mapping**: Similar to `RendererTemplateService.getTemplateURLs()` - maps attribute types to components
2. **Section Rendering**: Similar to section directives in AngularJS
3. **Attribute Container**: Similar to `attribute-container` directive
4. **Mode Support**: Supports create/view/edit modes like AngularJS version
5. **Form Data Management**: Similar to `objectIdx` management in AngularJS

### Key Differences

1. **React Hooks**: Uses React hooks for state management instead of AngularJS scope
2. **Component-based**: React components instead of AngularJS directives
3. **Props vs Scope**: Uses props instead of AngularJS scope inheritance
4. **Event Handling**: React event handlers instead of AngularJS event system

## Future Enhancements

- Add more field types (Currency, Phone/Email, Address, Reference fields, etc.)
- Implement attribute dependencies and visibility rules
- Add validation support
- Implement formula calculations
- Add support for table sections with row editing
- Add support for custom field types


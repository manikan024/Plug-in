# Architecture Documentation

## Overview

This React-based UI renderer is designed to replicate the functionality of the AngularJS `app-ui-renderer` and `app-ui-advsearch` modules while providing a modern, reusable component architecture.

## Component Hierarchy

```
App
├── UIRenderer (Main form renderer)
│   └── Section (Renders sections)
│       └── AttributeContainer (Wraps fields)
│           └── Field Components (TextField, SelectField, etc.)
│
└── AdvancedSearchRenderer (Search form renderer)
    └── Section (Renders sections)
        └── AttributeContainer (Wraps fields)
            └── Field Components (TextField, SelectField, etc.)
```

## Shared Components & Services

### Field Components (`src/shared/components/fields/`)

All field components are designed to be reusable and support multiple modes:

- **TextField**: Text inputs, numbers, emails, phones
- **SelectField**: Dropdowns, multi-select
- **DateField**: Date pickers
- **TextAreaField**: Multi-line text
- **CheckboxField**: Single or multi-select checkboxes

**Common Props:**
- `attribute`: Attribute metadata object
- `value`: Current field value
- `onChange`: Change handler function
- `mode`: 'create', 'view', or 'search'
- `disabled`: Disabled state
- `className`: Additional CSS classes

### FieldRendererService (`src/shared/services/fieldRendererService.js`)

Maps attribute types to React components, similar to `RendererTemplateService` in AngularJS.

**Key Methods:**
- `getFieldComponent(attribute, mode)`: Returns the appropriate component for an attribute
- `renderField(attribute, value, onChange, mode, options)`: Renders a field component

**Field Type Mapping:**
```javascript
{
  input: TextField,
  select: SelectField,
  date: DateField,
  textarea: TextAreaField,
  check: CheckboxField,
  // ... etc
}
```

### Attribute Utilities (`src/shared/utils/attributeUtils.js`)

Common utility functions for working with attributes:

- **Value Management**: `getAttributeValue()`, `setAttributeValue()`
- **Attribute Properties**: `isMandatory()`, `isDisabled()`, `getAttributeLabel()`
- **Visibility**: `isAttributeVisible()`, `getValidSections()`
- **Section Management**: `getSectionAttributes()`, `isTableSection()`

## Data Flow

### UIRenderer

1. **Initialization**: Receives `uiOptions` with `WEB_LAYOUT.sections`
2. **Section Processing**: Filters sections using `getValidSections()`
3. **Field Rendering**: Each section renders its attributes using `Section` component
4. **Field Changes**: Changes propagate up via `onFormDataChange` callback
5. **Form Submission**: `onSave` callback is triggered with final form data

### AdvancedSearchRenderer

1. **Initialization**: Similar to UIRenderer but in 'search' mode
2. **Search Criteria**: Form data represents search criteria
3. **Search Execution**: `onSearch` callback triggered with criteria
4. **Reset**: `onReset` clears all search criteria

## Comparison with AngularJS Implementation

### Similarities

| AngularJS | React | Purpose |
|-----------|-------|---------|
| `uiRenderer` directive | `UIRenderer` component | Main form renderer |
| `uiAdvSearchRenderer` directive | `AdvancedSearchRenderer` component | Search form renderer |
| `RendererTemplateService` | `FieldRendererService` | Maps types to components |
| `UiRendererUtilService` | `attributeUtils.js` | Utility functions |
| `attribute-container` directive | `AttributeContainer` component | Field wrapper |
| `section` directive | `Section` component | Section renderer |
| AngularJS scope | React state/props | Data management |

### Key Differences

1. **State Management**: React hooks (`useState`, `useEffect`) vs AngularJS scope
2. **Event Handling**: React event handlers vs AngularJS `$scope.$on`
3. **Component Lifecycle**: React hooks vs AngularJS lifecycle hooks
4. **Template System**: JSX vs AngularJS templates
5. **Dependency Injection**: Props vs AngularJS DI

## Extension Points

### Adding New Field Types

1. Create a new field component in `src/shared/components/fields/`
2. Add it to the export in `src/shared/components/fields/index.js`
3. Register it in `FieldRendererService.fieldComponentMap`
4. Use it in both UIRenderer and AdvancedSearchRenderer automatically

### Adding Custom Logic

1. **Attribute Dependencies**: Extend `attributeUtils.js` with dependency resolution
2. **Validation**: Add validation functions to `attributeUtils.js`
3. **Formulas**: Create a formula service similar to `ApptivoFormula` in AngularJS
4. **Custom Rendering**: Extend `FieldRendererService` with custom render methods

## Best Practices

1. **Reusability**: Always place reusable components in `src/shared/`
2. **Props Interface**: Keep component props consistent across similar components
3. **Mode Support**: Field components should support 'create', 'view', and 'search' modes
4. **Error Handling**: Handle missing or invalid attributes gracefully
5. **Performance**: Use React.memo for expensive field components if needed

## Future Enhancements

- [ ] Add more field types (Currency, Phone/Email, Address, Reference)
- [ ] Implement attribute dependencies and visibility rules
- [ ] Add comprehensive validation system
- [ ] Implement formula calculations
- [ ] Add support for table sections with inline editing
- [ ] Add support for custom field types
- [ ] Add unit tests for components and utilities
- [ ] Add TypeScript support for better type safety


# Comprehensive Analysis: apptivo-ng-ui to React Migration

## Table of Contents
1. [Initialization Sequence](#initialization-sequence)
2. [Core Services](#core-services)
3. [Dependency Engine](#dependency-engine)
4. [Formula Engine](#formula-engine)
5. [Field Change Handling](#field-change-handling)
6. [Re-rendering System](#re-rendering-system)
7. [Field Types](#field-types)
8. [Table Sections](#table-sections)
9. [Validation](#validation)

---

## 1. Initialization Sequence

### Exact Order from uiRender.js (post link function):

```javascript
// 1. Setup basic uiOptions
scope.uiOptions.uiRendererId = uiRendererId;
scope.uiOptions.uiRendererElement = element[0];
scope.uiOptions.mode = mode || 'CREATE';
scope.uiOptions.currencyFormat = configCache.currencySymbolType || 'CURRENCY_FORMAT_SYMBOL';
scope.uiOptions.objectIdx = objectIdx || {};

// 2. Initialize maps
scope.uiOptions.tableAddressAttributeMap = {};
scope.uiOptions.imageExtensionsMap = {};
scope.uiOptions.pdfFilesMap = {};

// 3. Prepare attribute maps
utilService.prepareAttributesMap(scope.uiOptions);
// Creates: sectionsMap, attributesMap, attributeSectionsMap, 
//          lineLevelAttributesMap, refAppAttributesMap, mandatoryAttributesMap

// 4. Initialize business address map
addressService.prepareAddressMap(globaleAddress, scope.uiOptions.businessAddressMap);
scope.uiOptions.addressTypes = addressService.filterEnabledAddressTypes(configService.getAddressTypes());
scope.uiOptions.startDate = calendarService.getServerDate().start;

// 5. Initialize dependency engine
utilService.initDependsOnMap(scope.uiOptions);
// Creates: dependencyCriteriaMap, visibilityDependencyCriteriaMap,
//          mandatoryDependencyCriteriaMap, valueDependencyCriteriaMap,
//          sectionVisibilityCriteria, sectionExpandCollapseCriteria

// 6. Upgrade web layout
uiGeneratorService.upgradeWebLayout(scope.uiOptions.WEB_LAYOUT, scope.uiOptions.objectIdx, 
                                    scope.uiOptions.mode, scope.uiOptions.configCache);
// Initializes date fields, custom attributes structure, table sections

// 7. Get valid sections
appUIGenService.getValidSections(scope.uiOptions, scope.uiOptions.mode, 
                                 scope.uiOptions.objectIdx, tabId);
// Filters sections based on privileges, dependencies, visibility

// 8. Update custom attribute values
appUIGenService.updateCustomAttributeValues(scope.uiOptions.WEB_LAYOUT, 
                                            scope.uiOptions.objectIdx, 
                                            scope.uiOptions.mode, scope.uiOptions);
// Ensures proper structure for custom attributes (select, radio, dateTime, etc.)

// 9. Update phone and email values
utilService.updatePhoneEmailValues(scope.uiOptions);
// Handles phone/email settings

// 10. Initialize reference field map
utilService.initReferenceFieldMap(scope.uiOptions);
// Creates referenceFieldsMap for reference field handling

// 11. Prepare reference app field attributes map
utilService.prepareRefAppFieldAttributesMap(scope.uiOptions);

// 12. Data cleansing attributes map
cleansingService.getDataCleansingAttributesMap(scope.uiOptions);

// 13. Formula registry initialization (if needed)
if (scope.uiOptions.hasPrefinedFormulaAttributes) {
    ApptivoFormula.updateRegistry(scope.uiOptions);
}
```

---

## 2. Core Services

### 2.1 UiRendererUtilService

**Key Functions:**

1. **prepareAttributesMap(uiOptions)**
   - Creates sectionsMap: `{sectionId: section}`
   - Creates attributesMap: `{attributeId: attribute}`
   - Creates attributeSectionsMap: `{attributeId: sectionId}`
   - Creates lineLevelAttributesMap: `{attributeId: attribute}` (for table rows)
   - Creates refAppAttributesMap: `{attributeId: attribute}` (for reference app fields)
   - Creates mandatoryAttributesMap: `{attributeId: attribute}` (for mandatory fields)
   - Recursively processes sections and nested sections
   - Handles derived sections

2. **initDependsOnMap(uiOptions)**
   - Builds dependencyCriteriaMap: `{drivingAttributeId: [dependents]}`
   - Builds visibilityDependencyCriteriaMap: `{drivingAttributeId: [dependentAttributes]}`
   - Builds mandatoryDependencyCriteriaMap: `{drivingAttributeId: [dependentAttributes]}`
   - Builds valueDependencyCriteriaMap: `{drivingAttributeId: [dependentAttributes]}`
   - Builds sectionVisibilityCriteria: `{drivingAttributeId: [dependentSections]}`
   - Builds sectionExpandCollapseCriteria: `{drivingAttributeId: [dependentSections]}`

3. **updatePhoneEmailValues(uiOptions)**
   - Processes phone and email attributes based on settings
   - Handles phoneType, phoneNumber, emailType, emailAddress

4. **initReferenceFieldMap(uiOptions)**
   - Creates referenceFieldsMap: `{referenceAttributeId: [dependentAttributes]}`
   - Handles reference field dependencies

5. **prepareRefAppFieldAttributesMap(uiOptions)**
   - Processes reference app field attributes
   - Maps reference app fields to their dependent attributes

### 2.2 AppUIGenService

**Key Functions:**

1. **upgradeWebLayout(WEB_LAYOUT, objectIdx, mode, configCache)**
   - Initializes date fields with proper structure
   - Initializes custom attributes structure
   - Handles table sections initialization
   - Sets up default values

2. **getValidSections(uiOptions, mode, objectIdx, tabId)**
   - Validates sections based on privileges
   - Evaluates dependency conditions
   - Filters sections based on visibility
   - Handles tab view sections

3. **updateCustomAttributeValues(WEB_LAYOUT, objectIdx, mode, uiOptions)**
   - Processes custom attributes in form sections
   - Processes custom attributes in table sections
   - Handles select, radio, dateTime custom attributes
   - Ensures proper structure for form binding

4. **validateDependency(attribute, dependencyType, uiOptions, rowIndex)**
   - Validates visibility dependencies
   - Validates mandatory dependencies
   - Validates value dependencies
   - Returns resultMap with isValidDependency flag

### 2.3 DependencyAttributeService

**Key Functions:**

1. **updateVisibilityDependency(uiOptions, attribute, rowIndex, isParentDisabled)**
   - Shows/hides dependent attributes based on driving attribute value
   - Handles table attributes
   - Handles address attributes
   - Handles section visibility
   - Handles expand/collapse sections
   - Triggers formula recalculation for visible attributes

2. **updateMandatoryDependency(uiOptions, drivingAttribute, rowIndex)**
   - Makes dependent attributes mandatory based on driving attribute value
   - Handles conditional mandatory fields
   - Updates mandatory indicators in UI

3. **updateValueDependency(uiOptions, attribute, rowIndex)**
   - Filters select options based on driving attribute value
   - Resets dependent attribute values when invalid
   - Handles multi-select, checkbox, radio attributes
   - Updates select dropdowns with filtered options

---

## 3. Formula Engine (ApptivoFormula)

### 3.1 Registry Structure

```javascript
uiOptions.Registry = {
    formula: {
        [attributeId]: {
            attributeId: string,
            tag: string,
            tagName: string,
            attribute: Attribute,
            section: Section,
            elements: {[rowIndex]: {container, element}},
            innerTableElements: {[parentRowIndex_rowIndex]: {container, element}},
            formulaAttributes: {[attributeId]: tagName},
            termAttributeId: string,
            hasNumberFields: boolean
        }
    },
    subscribers: {
        [tagName]: [formula]
    }
}
```

### 3.2 Formula Types

1. **Standard Formula**
   - Uses parsedFormula and refinedFormula
   - References other attributes by tagName
   - Example: `:quantity * :unitPrice`

2. **Predefined Formula**
   - Uses predefinedFormula.config
   - Has functionDefinition
   - Example: SUM, AVG, COUNT

3. **Advanced Formula**
   - Uses advancedFormula.functionBody
   - Custom JavaScript function
   - Can access uiOptions, attribute, rowIndex

### 3.3 Formula Execution Flow

```javascript
// On field change:
1. Get subscribers for changed attribute
2. For each subscriber:
   a. If standard formula:
      - Parse formula
      - Get attribute values
      - Execute formula
      - Update formula field value
   b. If predefined formula:
      - Get config
      - Execute functionDefinition
      - Update formula field value
   c. If advanced formula:
      - Execute functionBody
      - Update formula field value
3. Re-render formula field
4. Trigger dependent formulas
```

---

## 4. Field Change Handling

### 4.1 onChange Flow (from AppUiRendererApi.js)

```javascript
onChange(event, container, immediate) {
    1. Get attribute and scope
    2. Execute custom events
    3. Mark page as dirty
    4. If tag in ['referenceField', 'input', 'number', 'formula', 'currency', 'select', 'salutation']:
       a. Get attribute context
       b. Execute formula subscribers (with timeout for digest loop)
       c. Update dependency visibility
       d. Update dependency mandatory
       e. Update dependency value
       f. Re-render dependent attributes
}
```

### 4.2 Select Field Change (from ApptivoSelectController.js)

```javascript
onSelectChange(fieldValue) {
    1. Update field value in objectIdx
    2. Mark as dirty
    3. Execute onChange callback
    4. Execute custom events
    5. Update dependency visibility
    6. Update dependency mandatory
    7. Update dependency value
    8. Execute formula subscribers
    9. Mark as dirty
}
```

---

## 5. Re-rendering System

### 5.1 reRenderPage(uiOptions)
- Re-renders entire page
- Re-initializes all sections
- Re-executes all formulas
- Re-evaluates all dependencies

### 5.2 reRenderSection(uiOptions, sectionId, isFromDependency)
- Re-renders specific section
- Re-executes formulas in section
- Re-evaluates dependencies in section

### 5.3 reRenderAttributes(uiOptions, attributeIds, rowIndex, parentSectionRowIndex, isFromDependency, isViewMode)
- Re-renders specific attributes
- Updates attribute values
- Re-executes formulas for attributes
- Updates dependency states

### 5.4 reRenderAttribute(uiOptions, attribute, rowIndex, isFromDependency)
- Re-renders single attribute
- Updates attribute value display
- Re-executes formula if attribute is formula field

---

## 6. Field Types

### 6.1 Input Field
- Text input
- Handles data type (text, email, url, etc.)
- Handles case conversion (uppercase, lowercase, title case)
- Handles max length
- Handles key press events

### 6.2 Select Field
- Dropdown select
- Handles options from config or custom
- Handles searchable select
- Handles multi-select
- Handles value dependencies (filtered options)

### 6.3 Date Field
- Date picker
- Handles date format
- Handles min/max date
- Handles date formulas

### 6.4 Currency Field
- Currency input
- Handles currency code
- Handles currency format
- Handles currency source dependencies

### 6.5 Reference Field
- Reference to another object
- Handles search and select
- Handles reference field dependencies
- Handles reference app fields

### 6.6 Address Field
- Address input with multiple lines
- Handles address types
- Handles address formatting
- Handles address dependencies

### 6.7 Phone/Email Field
- Phone or email input
- Handles phone/email types
- Handles multiple phone/email entries

### 6.8 Formula Field
- Read-only calculated field
- Displays formula result
- Updates on dependent field changes

---

## 7. Table Sections

### 7.1 Table Section Structure
- Table sections have rows
- Each row has attributes
- Rows can have inner sections
- Rows can have line-level formulas

### 7.2 Table Actions
- ADD_ROW: Add new row
- DELETE_ROW: Delete row
- COPY_ROW: Copy row
- ADD_NOTE: Add note to row
- SIDE_PANEL_ROW: Open side panel for row
- SEARCH_ACTION: Search for row data
- VIEW_HISTORY: View row history

### 7.3 Table Row Handling
- Each row has rowIndex
- Attributes in rows use rowIndex
- Formulas in rows use rowIndex
- Dependencies in rows use rowIndex

---

## 8. Validation

### 8.1 Field Validation
- Required field validation
- Data type validation
- Format validation
- Custom validation

### 8.2 Form Validation
- Validates all mandatory fields
- Validates conditional mandatory fields
- Validates data types
- Validates formats

### 8.3 Validation States
- Valid: Field is valid
- Invalid: Field has error
- Mandatory: Field is required
- Conditional Mandatory: Field is required based on dependency

---

## Implementation Priority

1. **Phase 1: Core Initialization** ✅ (Partially done)
   - prepareAttributesMap
   - initDependsOnMap
   - upgradeWebLayout
   - getValidSections
   - updateCustomAttributeValues

2. **Phase 2: Dependency Engine** (In progress)
   - updateVisibilityDependency
   - updateMandatoryDependency
   - updateValueDependency

3. **Phase 3: Formula Engine**
   - Formula registry
   - Formula execution
   - Formula subscribers

4. **Phase 4: Field Change Handling**
   - onChange handler
   - Re-rendering system

5. **Phase 5: Advanced Features**
   - Table sections
   - Reference fields
   - Address fields
   - Phone/Email fields


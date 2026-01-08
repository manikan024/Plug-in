import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import AttributeContainer from './AttributeContainer';
import { getSectionAttributes, isTableSection } from '../utils/attributeUtils';
import { getAttributeOptions } from '../utils/configDataConverter';

/**
 * Section - Renders a section with its attributes
 * Matches AngularJS app-ui-renderer section template structure exactly
 */
function Section({
  section,
  formData,
  onFieldChange,
  mode = 'create',
  className = '',
  collapsible = false,
  defaultCollapsed = false,
  configData = {},
  uiRendererId = 'ui-renderer',
  rowIndex = null,
  parentSectionRowIndex = null,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const attributes = getSectionAttributes(section);
  const isTable = isTableSection(section);

  const handleFieldChange = (value, attribute, rowIndex = null) => {
    if (onFieldChange) {
      onFieldChange(attribute, value, rowIndex);
    }
  };

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (!section || attributes.length === 0) {
    return null;
  }

  const sectionId = section.sectionId || section.id;
  const sectionLabel = section.sectionName || section.label || sectionId;
  const isOpen = (section.isOpen !== false && section.isSectionOpened !== false) || !isCollapsed;
  const hasNoSectionLabel = !sectionLabel || section.isTitleEnabled === false;
  const sectionType = section.sectionType || '';
  const column = section.column || 'one';
  const modeClass = mode === 'create' ? 'createotr' : 'viewpage';
  const columnClass = column === 'two' ? 'twcolm' : 'onclm';
  const isSectionVisible = section.isSectionVisible !== false;
  const isInnerSection = section.isInnerSection === 'Y';

  if (!isSectionVisible) {
    return null;
  }

  // Build section body with attributes
  const renderSectionBody = () => {
    if (isTable) {
      // Render table section
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {attributes.map((attr) => (
                  <th 
                    key={attr.attributeId || attr.id}
                    className="border border-base-border px-4 py-2 text-left"
                  >
                    {attr.label?.modifiedLabel || attr.label?.name || ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(formData[section.lineType] || []).map((row, idx) => (
                <tr key={idx}>
                  {attributes.map((attr) => {
                    const options = getAttributeOptions(attr, configData);
                    const attrWithOptions = options.length > 0 ? { ...attr, options } : attr;
                    return (
                      <td key={attr.attributeId || attr.id} className="border border-base-border px-4 py-2">
                        <AttributeContainer
                          attribute={attrWithOptions}
                          value={formData[section.lineType]?.[idx]?.[attr.tagName]}
                          onChange={(value) => handleFieldChange(value, attr, idx)}
                          mode={mode}
                          rowIndex={idx}
                          showLabel={false}
                          options={options}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Render regular form section - using grid layout
    return (
      <>
        {attributes.map((attr, attrIndex) => {
          if (attr.isEnabled === false || attr.isEnabled === 'false') {
            return null;
          }
          
          const options = getAttributeOptions(attr, configData);
          const attrWithOptions = options.length > 0 ? { ...attr, options } : attr;
          // Determine column span based on attribute column setting
          const columnSpan = attr.column === 'one' ? 'md:col-span-2' : 'md:col-span-1';
          const attrKey = attr.attributeId || attr.id || `attr-${attrIndex}`;
          
          return (
            <div key={attrKey} className={columnSpan}>
              <AttributeContainer
                attribute={attrWithOptions}
                value={formData[attr.tagName]}
                onChange={(value) => handleFieldChange(value, attr)}
                mode={mode}
                showLabel={true}
                options={options}
              />
            </div>
          );
        })}
      </>
    );
  };

  // Build panel heading ID
  const panelHeadingId = isInnerSection 
    ? `${uiRendererId}_${rowIndex}_${sectionId}_${parentSectionRowIndex}`
    : `${uiRendererId}_${rowIndex || ''}_${sectionId}`;

  if (!isSectionVisible) {
    return null;
  }

  // Use React-plugin Section pattern with apptivo-ng-ui logic
  return (
    <div 
      className={cn("border border-base-border rounded-lg bg-base-card mb-4", className)}
      data-section-id={`${uiRendererId}_${sectionId}`}
    >
      {!hasNoSectionLabel && section.isTitleEnabled !== false && (
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-2 px-4 py-3 text-left text-base-foreground font-medium hover:bg-base-muted transition-colors",
            !collapsible && "cursor-default"
          )}
          onClick={collapsible ? toggleCollapse : undefined}
          aria-expanded={isOpen}
          aria-controls={`section-content-${sectionId}`}
        >
          {collapsible && (
            <ChevronRight
              className={cn(
                "w-4 h-4 text-base-mutedForeground transition-transform duration-200",
                isOpen && "rotate-90"
              )}
            />
          )}
          <span>{sectionLabel}</span>
        </button>
      )}
      {(isOpen || hasNoSectionLabel) && (
        <div 
          id={`section-content-${sectionId}`}
          className={cn(
            "px-4 py-4",
            !hasNoSectionLabel && "border-t border-base-border"
          )}
        >
          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", columnClass === 'twcolm' && "md:grid-cols-2", columnClass === 'onclm' && "md:grid-cols-1")}>
            {renderSectionBody()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Section;

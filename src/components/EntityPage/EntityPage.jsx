import React, { useState, useMemo, useEffect } from 'react';
import UIRenderer from '../UIRenderer/UIRenderer';
import AdvancedSearchRenderer from '../AdvancedSearchRenderer/AdvancedSearchRenderer';
import { Search } from 'lucide-react';
import { Button } from '../../shared/ui/button';
import { convertConfigDataToUiOptions } from '../../shared/utils/configDataConverter';
import { getConfigData, getCurrencyConfiguration, getAllContacts, getAllCustomers } from '../../services/api';
import { saveContactData } from '../../services/api';
import { OBJECT_IDS } from '../../services/api/object-constants';

/**
 * EntityPage - Main page component for viewing and managing entities
 * Matches React-plugin EntityPage pattern with zinnect-ng-ui components
 * Fetches config from API and calls save API
 */
function EntityPage({ 
  title, 
  addLabel, 
  items: externalItems, 
  onItemsChange, 
  uiOptions: externalUiOptions,
  configData: externalConfigData,
  objectId,
  mode: initialMode = 'list' 
}) {
  const [mode, setMode] = useState(initialMode); // list | view | edit | create
  const [selected, setSelected] = useState(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [configData, setConfigData] = useState(externalConfigData);
  const [currencyConfig, setCurrencyConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState(externalItems || []);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Fetch config data from API when component mounts or objectId changes
  useEffect(() => {
    if (externalConfigData) {
      setConfigData(externalConfigData);
      return;
    }

    if (!objectId) return;

    const fetchConfig = async () => {
      setLoading(true);
      try {
        // Fetch config data
        const config = await getConfigData(objectId);
        setConfigData(config);

        // Fetch currency config for customers
        if (objectId === OBJECT_IDS.CUSTOMERS) {
          try {
            const currency = await getCurrencyConfiguration();
            setCurrencyConfig(currency);
            // Merge currency config into config data
            setConfigData(prev => ({ ...prev, currencyConfig: currency }));
          } catch (error) {
            console.warn('Failed to fetch currency config:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching config data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [objectId, externalConfigData]);

  // Fetch items list from API when component mounts or objectId changes
  useEffect(() => {
    if (externalItems && externalItems.length > 0) {
      setItems(externalItems);
      return;
    }

    if (!objectId) return;

    const fetchItems = async () => {
      setItemsLoading(true);
      try {
        let response;
        
        // Fetch items based on objectId
        if (objectId === OBJECT_IDS.CONTACTS) {
          response = await getAllContacts({ numRecords: 50 });
        } else if (objectId === OBJECT_IDS.CUSTOMERS) {
          response = await getAllCustomers({ numRecords: 50 });
        } else {
          console.warn('No API service available for objectId:', objectId);
          return;
        }

        if (response && response.data) {
          setItems(response.data);
          // Notify parent if callback provided
          if (onItemsChange) {
            onItemsChange(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, [objectId, externalItems, onItemsChange]);

  // Convert configData to uiOptions if needed
  const convertedUiOptions = useMemo(() => {
    if (externalUiOptions) return externalUiOptions;
    if (configData) {
      return convertConfigDataToUiOptions(configData);
    }
    return null;
  }, [externalUiOptions, configData]);

  const handleAdvancedSearch = () => {
    setIsAdvancedSearchOpen(true);
  };

  const handleAdvancedSearchClose = () => {
    setIsAdvancedSearchOpen(false);
  };

  const handleSearchResults = (results) => {
    console.log('Advanced Search Results:', results);
    // Update items with search results from API
    if (Array.isArray(results)) {
      setItems(results);
      if (onItemsChange) {
        onItemsChange(results);
      }
      // Close advanced search panel after results are received
      setIsAdvancedSearchOpen(false);
      // Switch to list mode to show results
      setMode('list');
    }
  };

  const handleSelect = (item) => {
    setSelected(item);
    setFormData(item);
    setMode('view');
  };

  const handleAdd = () => {
    setSelected(null);
    setFormData({});
    setMode('create');
  };

  const handleEdit = () => {
    setMode('edit');
  };

  const handleCancel = () => {
    setSelected(null);
    setFormData({});
    setMode('list');
  };

  const handleFormSave = async (formData) => {
    if (!configData) {
      console.error('Config data not available');
      return;
    }

    setSaving(true);
    try {
      // Call save API based on objectId
      if (objectId === OBJECT_IDS.CONTACTS) {
        const response = await saveContactData(formData, configData);
        console.log('Contact saved via API:', response);
        
        // Refresh items list after save
        const refreshed = await getAllContacts({ numRecords: 50 });
        if (refreshed && refreshed.data) {
          setItems(refreshed.data);
          if (onItemsChange) {
            onItemsChange(refreshed.data);
          }
        }
      } else if (objectId === OBJECT_IDS.CUSTOMERS) {
        // TODO: Implement customer save API when available
        // For now, refresh customers list
        const refreshed = await getAllCustomers({ numRecords: 50 });
        if (refreshed && refreshed.data) {
          setItems(refreshed.data);
          if (onItemsChange) {
            onItemsChange(refreshed.data);
          }
        }
      } else {
        // Fallback: update local state for other entities
        const fallbackItem = {
          id: selected?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...formData,
          subject: formData.name || formData.customerName || formData.subject || 'New Item',
          description: formData.description || '',
        };
        
        if (onItemsChange) {
          if (mode === 'edit' && selected?.id) {
            const updated = items.map((item) =>
              item.id === selected.id ? { ...item, ...fallbackItem } : item
            );
            setItems(updated);
            onItemsChange(updated);
          } else {
            const newItems = [fallbackItem, ...items];
            setItems(newItems);
            onItemsChange(newItems);
          }
        }
      }
      
      setSelected(null);
      setFormData({});
      setMode('list');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const renderList = () => {
    const canShowAdvancedSearch = !!(convertedUiOptions);

    // Show loading state while fetching items
    if (itemsLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-base-card rounded-lg shadow-sm">
          <p className="text-base-muted-foreground text-lg">Loading {title.toLowerCase()}...</p>
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-base-muted-foreground mb-4">No {title.toLowerCase()} yet.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {canShowAdvancedSearch && (
              <Button
                variant="outline"
                onClick={handleAdvancedSearch}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Advanced Search
              </Button>
            )}
            <Button onClick={handleAdd}>
              {addLabel}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-base-border rounded-lg bg-base-card">
        <div className="border-b border-base-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-base-foreground">{title}</h2>
          <div className="flex gap-3 items-center">
            {canShowAdvancedSearch && (
              <Button
                variant="outline"
                onClick={handleAdvancedSearch}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Advanced Search
              </Button>
            )}
            <Button onClick={handleAdd}>
              {addLabel}
            </Button>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full text-left p-4 border border-base-border rounded-md hover:bg-base-muted transition-colors"
                  onClick={() => handleSelect(item)}
                >
                  <div className="font-medium text-base-foreground">{item.subject}</div>
                  <div className="text-sm text-base-muted-foreground mt-1">
                    {item.description || 'No description'}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderView = () => {
    if (!selected) return null;

    return (
      <div className="border border-base-border rounded-lg bg-base-card">
        <div className="border-b border-base-border px-6 py-4 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setMode('list');
              }}
              className="mb-2"
            >
              ← Back to {title.toLowerCase()}
            </Button>
            <h2 className="text-xl font-semibold text-base-foreground">{selected.subject}</h2>
          </div>
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-base-muted-foreground">Loading...</div>
          ) : convertedUiOptions ? (
            <UIRenderer
              uiOptions={convertedUiOptions}
              mode="view"
              formData={formData}
            />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-base-muted-foreground mb-1">Subject</p>
                <p className="text-base-foreground">{selected.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-base-muted-foreground mb-1">Description</p>
                <p className="text-base-foreground">
                  {selected.description || 'No description provided.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!convertedUiOptions) {
      return (
        <div className="border border-base-border rounded-lg bg-base-card">
          <div className="border-b border-base-border px-6 py-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="mb-2"
            >
              ← Back to {title.toLowerCase()}
            </Button>
            <h2 className="text-xl font-semibold text-base-foreground">{addLabel}</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-base-muted-foreground">
                Loading form configuration... Please wait.
              </div>
            ) : (
              <div className="text-base-muted-foreground">
                Form configuration not available. Please check if config data is loaded.
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="border border-base-border rounded-lg bg-base-card">
        <div className="border-b border-base-border px-6 py-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-2"
          >
            ← Back to {title.toLowerCase()}
          </Button>
          <h2 className="text-xl font-semibold text-base-foreground">
            {mode === 'edit' ? `Edit ${title.slice(0, -1)}` : addLabel}
          </h2>
        </div>
        <div className="p-6">
          <UIRenderer
            uiOptions={convertedUiOptions}
            mode={mode === 'edit' ? 'edit' : 'create'}
            formData={formData}
            onFormDataChange={setFormData}
            onSave={handleFormSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-base-foreground mb-2">{title}</h1>
        <p className="text-base-muted-foreground">
          View, add, and edit records. All data is fetched from API.
        </p>
      </header>
      
      {mode === 'list' && renderList()}
      {mode === 'view' && renderView()}
      {(mode === 'edit' || mode === 'create') && renderForm()}
      
      {/* Advanced Search Panel */}
      {isAdvancedSearchOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleAdvancedSearchClose}
        >
          <div 
            className="bg-white border border-base-border rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-base-foreground">Advanced Search</h2>
              <Button variant="ghost" onClick={handleAdvancedSearchClose}>
                ✕
              </Button>
            </div>
            {loading ? (
              <div className="text-base-muted-foreground p-8 text-center">
                Loading search form configuration...
              </div>
            ) : convertedUiOptions ? (
              <AdvancedSearchRenderer
                uiOptions={convertedUiOptions}
                formData={undefined}
                onFormDataChange={(newData) => {
                  // Store formData but don't pass it back to prevent infinite loops
                  setFormData(newData);
                }}
                onSearch={handleSearchResults}
                onReset={handleAdvancedSearchClose}
                objectId={objectId}
              />
            ) : (
              <div className="text-base-muted-foreground p-8 text-center">
                Search form configuration not available. Please wait for config data to load.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default EntityPage;


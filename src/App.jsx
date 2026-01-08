import React, { useState } from 'react';
import EntityPage from './components/EntityPage';
import { OBJECT_IDS } from './services/api/object-constants';

function App() {
  const [activeTab, setActiveTab] = useState('entity'); // 'entity' or 'examples'
  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]);

  return (
    <div className="min-h-screen bg-base-background">
      <div className="border-b border-base-border bg-base-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('entity')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'entity'
                  ? 'bg-base-primary text-base-primaryForeground'
                  : 'bg-base-muted text-base-foreground hover:bg-base-accent'
              }`}
            >
              Entity Page (Test)
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'examples'
                  ? 'bg-base-primary text-base-primaryForeground'
                  : 'bg-base-muted text-base-foreground hover:bg-base-accent'
              }`}
            >
              Examples
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'entity' ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contacts</h2>
              <EntityPage
                title="Contacts"
                addLabel="Add Contact"
                items={contacts}
                onItemsChange={setContacts}
                objectId={OBJECT_IDS.CONTACTS}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Customers</h2>
              <EntityPage
                title="Customers"
                addLabel="Add Customer"
                items={customers}
                onItemsChange={setCustomers}
                objectId={OBJECT_IDS.CUSTOMERS}
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-base-muted-foreground">Examples tab removed - all data now fetched from API</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


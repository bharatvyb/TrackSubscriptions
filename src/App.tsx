import React, { useState, useEffect } from 'react';
import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription, getSettings, saveSettings } from './utils/storage';
import { Subscription, AppSettings } from './types';
import Header from './components/Header';
import SubscriptionList from './components/SubscriptionList';
import SubscriptionForm from './components/SubscriptionForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import SettingsPanel from './components/SettingsPanel';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);
  
  // Load subscriptions from local storage
  useEffect(() => {
    setSubscriptions(getSubscriptions());
  }, []);
  
  // Handle adding a new subscription
  const handleAddSubscription = (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSubscription = addSubscription(data);
    setSubscriptions([...subscriptions, newSubscription]);
    setIsAddModalOpen(false);
  };
  
  // Handle updating an existing subscription
  const handleUpdateSubscription = (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSubscription) {
      const updated = updateSubscription(editingSubscription.id, data);
      if (updated) {
        setSubscriptions(
          subscriptions.map(sub => sub.id === editingSubscription.id ? updated : sub)
        );
      }
      setEditingSubscription(null);
    }
  };
  
  // Handle deleting a subscription
  const handleDeleteSubscription = () => {
    if (deletingSubscription) {
      deleteSubscription(deletingSubscription.id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== deletingSubscription.id));
      setDeletingSubscription(null);
    }
  };
  
  // Handle opening the edit modal
  const handleEditSubscription = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      setEditingSubscription(subscription);
    }
  };
  
  // Handle opening the delete confirmation modal
  const handleDeleteConfirmation = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      setDeletingSubscription(subscription);
    }
  };
  
  // Handle updating settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updatedSettings = saveSettings(newSettings);
    setSettings(updatedSettings);
  };
  
  // Render modal content based on state
  const renderModal = () => {
    if (isAddModalOpen) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SubscriptionForm
            onSubmit={handleAddSubscription}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </div>
      );
    }
    
    if (editingSubscription) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SubscriptionForm
            subscription={editingSubscription}
            onSubmit={handleUpdateSubscription}
            onCancel={() => setEditingSubscription(null)}
          />
        </div>
      );
    }
    
    if (deletingSubscription) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <DeleteConfirmation
            appName={deletingSubscription.appName}
            onConfirm={handleDeleteSubscription}
            onCancel={() => setDeletingSubscription(null)}
          />
        </div>
      );
    }
    
    if (isSettingsOpen) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={() => {
              setIsSettingsOpen(false);
              // Reload subscriptions in case data was imported
              setSubscriptions(getSubscriptions());
            }}
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-16">
        <Header
          onAddNew={() => setIsAddModalOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <main className="max-w-5xl mx-auto px-4 pt-24">
          <SubscriptionList
            subscriptions={subscriptions}
            settings={settings}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteConfirmation}
            onAddNew={() => setIsAddModalOpen(true)}
          />
        </main>
        
        {renderModal()}
      </div>
    </ThemeProvider>
  );
}

export default App;
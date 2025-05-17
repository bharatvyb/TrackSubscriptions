import React, { useState } from 'react';
import { AppSettings } from '../types';
import { exportToTSV, importFromTSV } from '../utils/storage';
import { Download, Upload, X } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onUpdateSettings, 
  onClose 
}) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ theme: e.target.value as AppSettings['theme'] });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ sortBy: e.target.value as AppSettings['sortBy'] });
  };
  
  const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ sortDirection: e.target.value as AppSettings['sortDirection'] });
  };
  
  const downloadTSV = () => {
    const tsvContent = exportToTSV();
    
    if (!tsvContent) {
      setImportError('No data to export');
      setTimeout(() => setImportError(null), 3000);
      return;
    }
    
    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.tsv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setImportSuccess('Data exported successfully');
    setTimeout(() => setImportSuccess(null), 3000);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importFromTSV(content);
      
      if (result.success) {
        setImportSuccess(`Successfully imported ${result.count} subscriptions`);
        setTimeout(() => {
          setImportSuccess(null);
          onClose(); // Close settings panel and return to updated list
        }, 2000);
      } else {
        setImportError(result.error || 'Failed to import data');
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close settings"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Appearance</h3>
          <div className="mb-4">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <select
              id="theme"
              value={settings.theme}
              onChange={handleThemeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Display Options</h3>
          <div className="mb-4">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort Subscriptions By
            </label>
            <select
              id="sortBy"
              value={settings.sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="expiryDate">Expiry Date</option>
              <option value="appName">App Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort Direction
            </label>
            <select
              id="sortDirection"
              value={settings.sortDirection}
              onChange={handleSortDirectionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Data Management</h3>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={downloadTSV} 
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export Subscriptions (TSV)
            </button>
            
            <label 
              htmlFor="importFile" 
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors cursor-pointer"
            >
              <Upload size={16} className="mr-2" />
              Import Subscriptions (TSV)
              <input
                type="file"
                id="importFile"
                accept=".tsv,text/tab-separated-values"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          
          {importError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {importError}
            </div>
          )}
          
          {importSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {importSuccess}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
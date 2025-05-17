import { Subscription, AppSettings } from '../types';

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  sortBy: 'expiryDate',
  sortDirection: 'asc',
  currency: 'INR',
};

// Storage keys
const SUBSCRIPTIONS_KEY = 'subscriptions';
const SETTINGS_KEY = 'settings';

// Get subscriptions from localStorage
export const getSubscriptions = (): Subscription[] => {
  const data = localStorage.getItem(SUBSCRIPTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

// Save subscriptions to localStorage
export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
};

// Add a new subscription
export const addSubscription = (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Subscription => {
  const subscriptions = getSubscriptions();
  const now = new Date().toISOString();
  
  const newSubscription: Subscription = {
    ...subscription,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  
  subscriptions.push(newSubscription);
  saveSubscriptions(subscriptions);
  
  return newSubscription;
};

// Update an existing subscription
export const updateSubscription = (id: string, updates: Partial<Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>>): Subscription | null => {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);
  
  if (index === -1) return null;
  
  const updatedSubscription: Subscription = {
    ...subscriptions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  subscriptions[index] = updatedSubscription;
  saveSubscriptions(subscriptions);
  
  return updatedSubscription;
};

// Delete a subscription
export const deleteSubscription = (id: string): boolean => {
  const subscriptions = getSubscriptions();
  const filteredSubscriptions = subscriptions.filter(sub => sub.id !== id);
  
  if (filteredSubscriptions.length === subscriptions.length) {
    return false;
  }
  
  saveSubscriptions(filteredSubscriptions);
  return true;
};

// Get app settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
};

// Save app settings
export const saveSettings = (settings: Partial<AppSettings>): AppSettings => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
  return updatedSettings;
};

// Export data to TSV
export const exportToTSV = (): string => {
  const subscriptions = getSubscriptions();
  
  if (subscriptions.length === 0) {
    return '';
  }
  
  // Define headers
  const headers = ['App Name', 'Plan Name', 'Price (INR)', 'Comments', 'Expiry Date'];
  
  // Create TSV content
  const tsvContent = [
    headers.join('\t'),
    ...subscriptions.map(sub => {
      return [
        sub.appName,
        sub.planName,
        sub.price.toString(),
        sub.comments,
        sub.expiryDate
      ].join('\t');
    })
  ].join('\n');
  
  return tsvContent;
};

// Import data from TSV
export const importFromTSV = (tsvContent: string): { success: boolean; count: number; error?: string } => {
  try {
    // Split by lines and filter out empty lines
    const lines = tsvContent.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) { // At least headers and one data row
      return { success: false, count: 0, error: 'Invalid TSV format or empty file' };
    }
    
    // Skip the header row
    const dataLines = lines.slice(1);
    const now = new Date().toISOString();
    const subscriptions: Subscription[] = [];
    
    // Parse each line
    for (const line of dataLines) {
      const [appName, planName, price, comments, expiryDate] = line.split('\t');
      
      if (!appName || !planName || !expiryDate) {
        return { success: false, count: 0, error: 'Missing required fields in TSV' };
      }
      
      const priceValue = parseFloat(price);
      
      if (isNaN(priceValue)) {
        return { success: false, count: 0, error: 'Invalid price format in TSV' };
      }
      
      subscriptions.push({
        id: crypto.randomUUID(),
        appName,
        planName,
        price: priceValue,
        comments: comments || '',
        expiryDate,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    // Save to local storage
    saveSubscriptions(subscriptions);
    
    return { success: true, count: subscriptions.length };
  } catch (error) {
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error during import' 
    };
  }
};
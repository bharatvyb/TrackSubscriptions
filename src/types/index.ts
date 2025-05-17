export interface Subscription {
  id: string;
  appName: string;
  planName: string;
  price: number;
  comments: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sortBy: 'appName' | 'expiryDate' | 'price';
  sortDirection: 'asc' | 'desc';
  currency: string;
}
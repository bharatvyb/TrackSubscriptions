import React from 'react';
import { Subscription, AppSettings } from '../types';
import SubscriptionCard from './SubscriptionCard';
import EmptyState from './EmptyState';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  settings: AppSettings;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  settings,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  if (subscriptions.length === 0) {
    return <EmptyState onAddNew={onAddNew} />;
  }

  // Sort subscriptions based on settings
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    const direction = settings.sortDirection === 'asc' ? 1 : -1;
    
    switch (settings.sortBy) {
      case 'appName':
        return direction * a.appName.localeCompare(b.appName);
      case 'price':
        return direction * (a.price - b.price);
      case 'expiryDate':
      default:
        return direction * (new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
    }
  });

  // Get total monthly cost
  const totalMonthlyCost = subscriptions.reduce((total, sub) => total + sub.price, 0);

  return (
    <div className="w-full">
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
        <h2 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
          Total Monthly Cost
        </h2>
        <p className="text-2xl font-bold text-purple-900 dark:text-white">
          ₹{totalMonthlyCost.toLocaleString('en-IN')}
        </p>
      </div>
      
      <div className="space-y-4">
        {sortedSubscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;
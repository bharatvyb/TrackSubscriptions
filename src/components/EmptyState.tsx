import React from 'react';
import { CalendarPlus } from 'lucide-react';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4">
        <CalendarPlus size={32} className="text-purple-600 dark:text-purple-300" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        No subscriptions yet
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Keep track of all your subscriptions in one place. Add your first subscription to get started.
      </p>
      
      <button
        onClick={onAddNew}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
      >
        Add Subscription
      </button>
    </div>
  );
};

export default EmptyState;
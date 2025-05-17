import React from 'react';
import { Subscription } from '../types';
import { formatDateForDisplay, getExpiryStatusClass, getExpiryStatusText } from '../utils/dateUtils';
import { Calendar, Edit, Trash2 } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onEdit, onDelete }) => {
  const statusClass = getExpiryStatusClass(subscription.expiryDate);
  const statusText = getExpiryStatusText(subscription.expiryDate);
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border-l-4 transition-all hover:shadow-lg
        ${statusClass === 'expired' ? 'border-red-500' : 
          statusClass === 'expiring-soon' ? 'border-amber-500' : 
          statusClass === 'upcoming' ? 'border-blue-500' : 
          'border-green-500'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.appName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{subscription.planName}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">₹{subscription.price.toLocaleString('en-IN')}</p>
          <div className="flex items-center mt-1">
            <Calendar size={14} className="mr-1" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatDateForDisplay(subscription.expiryDate)}
            </p>
          </div>
        </div>
      </div>
      
      {subscription.comments && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-2">{subscription.comments}</p>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <div 
          className={`text-xs py-1 px-2 rounded-full
            ${statusClass === 'expired' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
            statusClass === 'expiring-soon' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
            statusClass === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}
        >
          {statusText}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(subscription.id)}
            className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-purple-100 dark:hover:bg-purple-900"
            aria-label="Edit subscription"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(subscription.id)}
            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900"
            aria-label="Delete subscription"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
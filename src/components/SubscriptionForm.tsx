import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { formatDateForInput } from '../utils/dateUtils';
import { X } from 'lucide-react';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  subscription, 
  onSubmit, 
  onCancel 
}) => {
  const [appName, setAppName] = useState('');
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [comments, setComments] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing an existing subscription
  useEffect(() => {
    if (subscription) {
      setAppName(subscription.appName);
      setPlanName(subscription.planName);
      setPrice(subscription.price.toString());
      setComments(subscription.comments);
      setExpiryDate(formatDateForInput(subscription.expiryDate));
    } else {
      // Set default expiry date to 30 days from now if creating new
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setExpiryDate(formatDateForInput(defaultDate.toISOString()));
    }
  }, [subscription]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!appName.trim()) {
      newErrors.appName = 'App name is required';
    }
    
    if (!planName.trim()) {
      newErrors.planName = 'Plan name is required';
    }
    
    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        appName,
        planName,
        price: parseFloat(price),
        comments,
        expiryDate,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {subscription ? 'Edit Subscription' : 'Add Subscription'}
        </h2>
        <button 
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            App Name*
          </label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
              ${errors.appName ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
            placeholder="Netflix, Spotify, etc."
          />
          {errors.appName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.appName}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="planName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Plan Name*
          </label>
          <input
            type="text"
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
              ${errors.planName ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
            placeholder="Premium, Basic, Pro, etc."
          />
          {errors.planName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.planName}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (₹)*
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
              ${errors.price ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
            placeholder="199.00"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date*
          </label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white
              ${errors.expiryDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300'}`}
          />
          {errors.expiryDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Comments
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Any notes about this subscription..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            {subscription ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationProps {
  appName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  appName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Delete Subscription
            </h3>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <span className="font-medium">{appName}</span> subscription? This action cannot be undone.
        </p>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
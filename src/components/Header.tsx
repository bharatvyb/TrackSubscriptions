import React from 'react';
import { PlusCircle, Settings } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddNew, onOpenSettings }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-purple-700 dark:text-purple-400">
            SubscribeTrack
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddNew}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            <PlusCircle size={16} className="mr-1.5" />
            <span className="hidden sm:inline">Add New</span>
          </button>
          
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
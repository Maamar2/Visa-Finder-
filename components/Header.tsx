import React from 'react';
import { CalendarIcon } from './icons/CalendarIcon';

export const Header: React.FC = () => {
  return (
    <div className="text-center lg:text-left">
      <div className="flex items-center justify-center lg:justify-start gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Visa Alert Bot</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your smart appointment finder.</p>
        </div>
      </div>
    </div>
  );
};

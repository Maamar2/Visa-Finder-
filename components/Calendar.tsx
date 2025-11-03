import React from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (direction: 'next' | 'prev') => void;
  availableDates: string[];
  newlyFoundDates: Set<string>;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({ currentDate, onMonthChange, availableDates, newlyFoundDates }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const availableDatesSet = new Set(availableDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderDays = () => {
    const days = [];
    // Blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="p-1"></div>);
    }
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isAvailable = availableDatesSet.has(dateString);
      const isNewlyFound = newlyFoundDates.has(dateString);
      const isToday = date.getTime() === today.getTime();

      let dayClasses = 'w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-sm transition-all duration-300';
      if (isNewlyFound) {
        dayClasses += ' bg-green-500 text-white font-bold animate-pulse ring-4 ring-green-300';
      } else if (isAvailable) {
        dayClasses += ' bg-blue-500 text-white font-semibold cursor-pointer hover:bg-blue-600';
      } else {
        dayClasses += ' text-gray-500 dark:text-gray-400';
      }
      
      if(isToday) {
         dayClasses += ' ring-2 ring-blue-500 dark:ring-blue-400';
      }

      days.push(
        <div key={day} className="p-1 flex justify-center items-center">
          <div className={dayClasses}>{day}</div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <button onClick={() => onMonthChange('prev')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={() => onMonthChange('next')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-grow">
        {renderDays()}
      </div>
    </div>
  );
};

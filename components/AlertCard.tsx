import React from 'react';

interface AlertCardProps {
  statusMessage: string;
  isLoading: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ statusMessage, isLoading }) => {
  const isNewAppointment = statusMessage.includes('🎉');
  
  return (
    <div className={`p-4 rounded-2xl flex items-start gap-4 transition-all ${isNewAppointment ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-50 dark:bg-gray-800'}`}>
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-1"></div>
      ) : (
        <div className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isNewAppointment ? 'text-green-500' : 'text-blue-500'}`}>
          {isNewAppointment ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
      <p className={`text-sm ${isNewAppointment ? 'text-green-800 dark:text-green-200 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
        {statusMessage}
      </p>
    </div>
  );
};

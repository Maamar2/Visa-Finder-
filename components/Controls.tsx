import React from 'react';
import { AppointmentQuery, Country } from '../types';
import { BellIcon } from './icons/BellIcon';

interface ControlsProps {
  query: AppointmentQuery;
  setQuery: React.Dispatch<React.SetStateAction<AppointmentQuery>>;
  onFindAppointments: () => void;
  isAlerting: boolean;
  setIsAlerting: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const visaLocations: Country[] = [
  {
    name: 'Canada',
    consulates: [
      { name: 'Toronto', value: 'Toronto, Canada' },
      { name: 'Vancouver', value: 'Vancouver, Canada' },
      { name: 'Montreal', value: 'Montreal, Canada' },
    ],
  },
  {
    name: 'India',
    consulates: [
      { name: 'New Delhi', value: 'New Delhi, India' },
      { name: 'Mumbai', value: 'Mumbai, India' },
      { name: 'Chennai', value: 'Chennai, India' },
    ],
  },
  {
    name: 'Germany',
    consulates: [
      { name: 'Berlin', value: 'Berlin, Germany' },
      { name: 'Frankfurt', value: 'Frankfurt, Germany' },
      { name: 'Munich', value: 'Munich, Germany' },
    ],
  },
  {
    name: 'Mexico',
    consulates: [
        { name: 'Mexico City', value: 'Mexico City, Mexico'},
        { name: 'Tijuana', value: 'Tijuana, Mexico'},
        { name: 'Guadalajara', value: 'Guadalajara, Mexico'},
    ]
  }
];

const visaTypes = ['F-1 Student Visa', 'B1/B2 Visitor Visa', 'H-1B Work Visa'];

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{children}</label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 ${props.className || ''}`}>{props.children}</select>
);

export const Controls: React.FC<ControlsProps> = ({ query, setQuery, onFindAppointments, isAlerting, setIsAlerting, isLoading }) => {
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    const firstConsulate = visaLocations.find(c => c.name === newCountry)?.consulates[0].value || '';
    setQuery({ ...query, country: newCountry, consulate: firstConsulate });
  };
  
  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div>
        <Label htmlFor="country">Country</Label>
        <Select id="country" value={query.country} onChange={handleCountryChange} disabled={isLoading}>
          {visaLocations.map(c => <option key={c.name}>{c.name}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="consulate">Consulate / Embassy</Label>
        <Select id="consulate" value={query.consulate} onChange={e => setQuery({ ...query, consulate: e.target.value })} disabled={isLoading}>
          {visaLocations.find(c => c.name === query.country)?.consulates.map(con => <option key={con.value} value={con.value}>{con.name}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="visa-type">Visa Type</Label>
        <Select id="visa-type" value={query.visaType} onChange={e => setQuery({ ...query, visaType: e.target.value })} disabled={isLoading}>
          {visaTypes.map(vt => <option key={vt}>{vt}</option>)}
        </Select>
      </div>
      <button
        onClick={onFindAppointments}
        disabled={isLoading}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Searching...' : 'Find Appointments'}
      </button>

      <div className="pt-2">
        <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900 dark:text-white" id="availability-label">Real-time Alerts</span>
                <span className="text-xs text-gray-500 dark:text-gray-400" id="availability-description">Scan for new openings automatically.</span>
            </span>
            <button
                type="button"
                className={`${isAlerting ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                role="switch"
                aria-checked={isAlerting}
                onClick={() => setIsAlerting(!isAlerting)}
                disabled={isLoading}
            >
                <span aria-hidden="true" className={`${isAlerting ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
            </button>
        </div>
        {isAlerting && (
            <div className="mt-3 flex items-start p-3 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
                <BellIcon className="w-5 h-5 text-blue-500 flex-shrink-0"/>
                <p className="ml-2 text-xs text-blue-700 dark:text-blue-300">
                    The bot will check for new appointments every 15 seconds. You will be notified here if a new slot opens up.
                </p>
            </div>
        )}
      </div>

    </div>
  );
};

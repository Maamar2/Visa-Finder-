import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { Calendar } from './components/Calendar';
import { AlertCard } from './components/AlertCard';
import { AppointmentQuery } from './types';
import { fetchAvailableDates } from './services/geminiService';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [query, setQuery] = useState<AppointmentQuery>({
    country: 'Canada',
    consulate: 'Toronto, Canada',
    visaType: 'F-1 Student Visa',
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [newlyFoundDates, setNewlyFoundDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Select a location and click "Find Appointments" to begin.');
  const alertIntervalRef = useRef<number | null>(null);
  
  const handleFindAppointments = useCallback(async (dateToFetch: Date) => {
    setIsLoading(true);
    setStatusMessage(`Searching for appointments in ${query.consulate}...`);
    setAvailableDates([]);
    setNewlyFoundDates(new Set());

    try {
      const dates = await fetchAvailableDates(
        query.consulate,
        query.visaType,
        dateToFetch.getMonth() + 1,
        dateToFetch.getFullYear()
      );
      setAvailableDates(dates);
      setStatusMessage(dates.length > 0
        ? `Found ${dates.length} available dates for ${dateToFetch.toLocaleString('default', { month: 'long' })}.`
        : `No appointments found for ${dateToFetch.toLocaleString('default', { month: 'long' })}. Try another month.`);
    } catch (error) {
      console.error(error);
      setStatusMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  useEffect(() => {
    if (isAlerting) {
      setStatusMessage(`Real-time alerts enabled for ${query.consulate}. Scanning for new appointments...`);
      alertIntervalRef.current = window.setInterval(async () => {
        try {
          const newDates = await fetchAvailableDates(
            query.consulate,
            query.visaType,
            currentDate.getMonth() + 1,
            currentDate.getFullYear()
          );
          
          setAvailableDates(prevDates => {
            const existingDatesSet = new Set(prevDates);
            const newlyAdded: string[] = [];
            const allDates = [...prevDates];

            newDates.forEach(date => {
              if (!existingDatesSet.has(date)) {
                newlyAdded.push(date);
                allDates.push(date);
              }
            });

            if (newlyAdded.length > 0) {
              setStatusMessage(`🎉 New appointment found on ${newlyAdded.join(', ')}!`);
              const newFoundSet = new Set(newlyFoundDates);
              newlyAdded.forEach(d => newFoundSet.add(d));
              setNewlyFoundDates(newFoundSet);

              setTimeout(() => {
                setNewlyFoundDates(currentFound => {
                    const updated = new Set(currentFound);
                    newlyAdded.forEach(d => updated.delete(d));
                    return updated;
                });
              }, 5000); // Highlight for 5 seconds
            }
            return allDates.sort();
          });
        } catch (error) {
          console.error("Error during alert scan:", error);
        }
      }, 15000); // Scan every 15 seconds
    } else {
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current);
        alertIntervalRef.current = null;
      }
      if (statusMessage.startsWith('Real-time alerts enabled')) {
        setStatusMessage('Real-time alerts disabled.');
      }
    }

    return () => {
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current);
      }
    };
  }, [isAlerting, query, currentDate, newlyFoundDates]);


  const handleMonthChange = (direction: 'next' | 'prev') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Avoid month-end issues
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1));
      handleFindAppointments(newDate);
      return newDate;
    });
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 font-sans">
      <div className="container mx-auto p-4 lg:p-8">
        <main className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
            <div className="sticky top-8 space-y-6">
              <Header />
              <Controls
                query={query}
                setQuery={setQuery}
                onFindAppointments={() => handleFindAppointments(currentDate)}
                isAlerting={isAlerting}
                setIsAlerting={setIsAlerting}
                isLoading={isLoading}
              />
              <AlertCard statusMessage={statusMessage} isLoading={isLoading} />
            </div>
          </aside>
          <div className="w-full lg:w-2/3 xl:w-3/4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
            <Calendar
              currentDate={currentDate}
              onMonthChange={handleMonthChange}
              availableDates={availableDates}
              newlyFoundDates={newlyFoundDates}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Save, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getUserData, updateEvents } from '@/utils/localStorage';

interface CalendarProps {
  className?: string;
}

interface EventItem {
  id: string;
  date: string;
  title: string;
  isEditing?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 23)); // April 23, 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const userData = getUserData();
    setEvents(userData.events.map(event => ({ ...event, isEditing: false })));
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: 
          today.getDate() === i && 
          today.getMonth() === month && 
          today.getFullYear() === year,
        isSelected: 
          selectedDate && 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === month && 
          selectedDate.getFullYear() === year
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);

  const renderWeekdays = () => {
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return weekDays.map((day, index) => (
      <div key={index} className="text-center font-medium text-gray-500">
        {day}
      </div>
    ));
  };

  const getMonthEvents = () => {
    return events.filter(event => event.date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const toggleEditEvent = (id: string) => {
    setEvents(events.map(event => 
      event.id === id 
        ? { ...event, isEditing: !event.isEditing }
        : event
    ));
  };

  const updateEventTitle = (id: string, newTitle: string) => {
    const updatedEvents = events.map(event => 
      event.id === id 
        ? { ...event, title: newTitle, isEditing: false }
        : event
    );
    setEvents(updatedEvents);
    updateEvents(updatedEvents);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value;
    setEvents(events.map(event => 
      event.id === id ? { ...event, title: value } : event
    ));
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm", className)}>
      <div className="px-4 py-3 flex justify-between items-center">
        <button 
          className="p-1.5 hover:bg-gray-100 rounded-full"
          onClick={handlePrevMonth}
        >
          <ChevronLeft size={20} className="text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button 
          className="p-1.5 hover:bg-gray-100 rounded-full"
          onClick={handleNextMonth}
        >
          <ChevronRight size={20} className="text-gray-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 p-2">
        {renderWeekdays()}
        {days.map((day, index) => (
          <button
            key={index}
            className={cn(
              "h-8 w-8 flex items-center justify-center text-sm rounded-full mx-auto hover:bg-gray-100",
              day.isCurrentMonth ? "text-gray-800" : "text-gray-400",
              day.isToday && "font-bold ring-1 ring-sky-700",
              day.isSelected && "bg-sky-700 text-white hover:bg-sky-800"
            )}
            onClick={() => handleDateClick(day.date)}
            type="button"
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>

      <div className="mt-2 px-3 pb-4 space-y-2">
        {selectedDate && (
          <div className="text-sm font-medium text-sky-700 pb-1">
            Selected: {format(selectedDate, 'MMMM d, yyyy')}
          </div>
        )}
        {getMonthEvents().map((event) => (
          <div key={event.id} className="flex items-center text-sm py-1.5">
            <div className="w-8 text-gray-500 flex-shrink-0">
              {event.date.split('-')[2]}
            </div>
            <div className="flex-grow flex items-center">
              {event.isEditing ? (
                <Input
                  value={event.title}
                  onChange={(e) => handleTitleChange(e, event.id)}
                  className="py-0 h-8 text-sm"
                  autoFocus
                />
              ) : (
                <span>{event.title}</span>
              )}
            </div>
            <button 
              onClick={() => event.isEditing ? 
                updateEventTitle(event.id, event.title) : 
                toggleEditEvent(event.id)
              }
              className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            >
              {event.isEditing ? (
                <Save size={16} className="text-green-600" />
              ) : (
                <Edit2 size={16} className="text-gray-500" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

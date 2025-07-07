
'use client';

import { useState } from 'react';

export default function MissionCalendar({ missions, onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get mission dates for highlighting
  const missionDates = missions.map(mission => mission.date);
  const missionCountByDate = missions.reduce((acc, mission) => {
    acc[mission.date] = (acc[mission.date] || 0) + 1;
    return acc;
  }, {});

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  const handleDateClick = (day) => {
    const dateString = formatDate(day);
    onDateSelect(selectedDate === dateString ? '' : dateString);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 sticky top-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Mission Calendar</h3>
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          
          <h4 className="text-white font-medium">
            {monthNames[month]} {year}
          </h4>
          
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-gray-400 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, index) => (
            <div key={`empty-${index}`} className="h-8"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateString = formatDate(day);
            const hasMissions = missionDates.includes(dateString);
            const missionCount = missionCountByDate[dateString] || 0;
            const isSelected = selectedDate === dateString;
            
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`h-8 text-sm rounded flex items-center justify-center cursor-pointer transition-all relative ${
                  isToday(day)
                    ? 'bg-blue-600 text-white font-bold'
                    : isSelected
                    ? 'bg-red-600 text-white font-medium'
                    : hasMissions
                    ? 'bg-slate-600 text-white hover:bg-slate-500'
                    : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {day}
                {hasMissions && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {missionCount > 9 ? '9+' : missionCount}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mission Summary */}
      <div className="space-y-3">
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Mission Summary</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total Missions:</span>
              <span className="text-white font-medium">{missions.length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">This Month:</span>
              <span className="text-white font-medium">
                {missions.filter(m => {
                  const missionDate = new Date(m.date);
                  return missionDate.getMonth() === month && missionDate.getFullYear() === year;
                }).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Today:</span>
              <span className="text-white font-medium">
                {missions.filter(m => m.date === today.toISOString().split('T')[0]).length}
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Legend</h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-gray-400">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-600 rounded"></div>
              <span className="text-gray-400">Has Missions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

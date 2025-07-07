import React, { useState } from 'react';

export default function MissionFilters({ onFilterChange, totalMissions, filteredCount }) {
  const [filters, setFilters] = useState({
    date: '',
    location: '',
    keyword: '',
    difficulty: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      date: '',
      location: '',
      keyword: '',
      difficulty: 'All'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.date || filters.location || filters.keyword || filters.difficulty !== 'All';

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
      {/* Filter Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
              <i className="ri-filter-line text-red-400"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mission Filters</h3>
              <p className="text-sm text-gray-400">
                Showing {filteredCount} of {totalMissions} missions
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                    Filtered
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white px-3 py-1 hover:bg-slate-700 rounded cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
            >
              <i className={`ri-arrow-${showFilters ? 'up' : 'down'}-s-line`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="e.g. New York"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>

            {/* Keyword Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Keywords
              </label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="Search missions..."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 text-sm"
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-red-500 text-sm pr-8"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
            <span className="text-sm text-gray-400 mr-3">Quick filters:</span>
            
            <button
              onClick={() => handleFilterChange('date', new Date().toISOString().split('T')[0])}
              className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full cursor-pointer whitespace-nowrap"
            >
              Today
            </button>
            
            <button
              onClick={() => handleFilterChange('difficulty', 'Expert')}
              className="px-3 py-1 text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-full cursor-pointer whitespace-nowrap"
            >
              Expert Only
            </button>
            
            <button
              onClick={() => handleFilterChange('difficulty', 'Easy')}
              className="px-3 py-1 text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-full cursor-pointer whitespace-nowrap"
            >
              Easy Only
            </button>
            
            <button
              onClick={() => {
                const thisWeek = new Date();
                thisWeek.setDate(thisWeek.getDate() - 7);
                handleFilterChange('date', thisWeek.toISOString().split('T')[0]);
              }}
              className="px-3 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-full cursor-pointer whitespace-nowrap"
            >
              This Week
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';

export default function MissionFilters({ onFilterChange, totalMissions, filteredCount }) {
  const [filter, setFilter] = useState("All");
const [showForm, setShowForm] = useState(false);
const [selectedDate, setSelectedDate] = useState("");
const [filterLocation, setFilterLocation] = useState("");
const [searchKeyword, setSearchKeyword] = useState("");
const [filterWeek, setFilterWeek] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  let heroMissions = missions.filter((m) => m.heroId === selectedAvenger.id);

if (filter !== "All") heroMissions = heroMissions.filter((m) => m.priority === filter);
if (selectedDate) heroMissions = heroMissions.filter((m) => m.date === selectedDate);
if (filterLocation) heroMissions = heroMissions.filter((m) => m.location.toLowerCase().includes(filterLocation.toLowerCase()));
if (searchKeyword) heroMissions = heroMissions.filter((m) =>
  m.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
  m.description.toLowerCase().includes(searchKeyword.toLowerCase())
);
if (filterWeek) {
  heroMissions = heroMissions.filter((m) => {
    const d = new Date(m.date);
    return d >= filterWeek[0] && d <= filterWeek[1];
  });
}

  return (
 // ...inside your main content column (lg:col-span-3 space-y-8)...
<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
  <div className="p-6 border-b border-slate-700">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
        <i className="ri-filter-line text-red-400"></i>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Mission Filters</h3>
        <p className="text-sm text-gray-400">
          Showing {heroMissions.length} of {missions.filter(m => m.heroId === selectedAvenger.id).length} missions
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="block text-gray-300 text-sm mb-1">Filter by Date</label>
        <input
          type="date"
          className="w-full px-4 py-2 rounded bg-slate-700 text-white"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm mb-1">Filter by Location</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-slate-700 text-white"
          placeholder="e.g. New York"
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm mb-1">Search Keywords</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-slate-700 text-white"
          placeholder="Search missions..."
          value={searchKeyword}
          onChange={e => setSearchKeyword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm mb-1">Difficulty Level</label>
        <select
          className="w-full px-4 py-2 rounded bg-slate-700 text-white"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All Difficulties</option>
          <option value="Low">Easy Only</option>
          <option value="Medium">Advanced Only</option>
          <option value="High">Expert Only</option>
        </select>
      </div>
    </div>
    <div className="flex gap-2 mt-2">
      <button
        className="px-3 py-1 rounded bg-blue-700 text-white text-xs"
        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
      >
        Today
      </button>
      <button
        className="px-3 py-1 rounded bg-red-700 text-white text-xs"
        onClick={() => setFilter('High')}
      >
        Expert Only
      </button>
      <button
        className="px-3 py-1 rounded bg-green-700 text-white text-xs"
        onClick={() => setFilter('Low')}
      >
        Easy Only
      </button>
      <button
        className="px-3 py-1 rounded bg-blue-500 text-white text-xs"
        onClick={() => {
          // This Week: filter missions for this week
          const today = new Date();
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          setSelectedDate('');
          setFilter('All');
          setFilterWeek([weekStart, weekEnd]);
        }}
      >
        This Week
      </button>
      <button
        className="px-3 py-1 rounded bg-gray-700 text-white text-xs"
        onClick={() => {
          setSelectedDate('');
          setFilter('All');
          setFilterLocation('');
          setSearchKeyword('');
          setFilterWeek(null);
        }}
      >
        Clear
      </button>
    </div>
  </div>
</div>
  );
}
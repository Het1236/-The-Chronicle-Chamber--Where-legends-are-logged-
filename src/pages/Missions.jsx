import { useContext, useState } from "react";
import { AvengerContext } from "../context/AvengerContext";
import Navbar from "../components/Navbar";
import MissionForm from "../components/MissionForm";
import MissionCard from "../components/MissionCard";
import MissionMap from "../components/MissionMap";
import MissionCalendar from "../components/MissionCalendar";

export default function Missions() {
  const { selectedAvenger, missions } = useContext(AvengerContext);
  const [filter, setFilter] = useState("All");
const [showForm, setShowForm] = useState(false);
const [selectedDate, setSelectedDate] = useState("");
const [filterLocation, setFilterLocation] = useState("");
const [searchKeyword, setSearchKeyword] = useState("");
const [filterWeek, setFilterWeek] = useState(null);

  if (!selectedAvenger) return null;
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      <div className="relative py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${selectedAvenger.image})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mission Center
              </h1>
              <p className="text-gray-300">
                Manage and track all missions for {selectedAvenger.name}
              </p>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
              onClick={() => setShowForm(true)}
            >
              <i className="ri-add-line"></i>New Mission
            </button>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="max-w-3xl mx-auto my-4 mb-8">
          <MissionForm />
          <div className="flex justify-end mt-2">
            <button
              className="text-sm text-gray-400 hover:text-red-500"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <MissionCalendar
                missions={missions.filter(
                  (m) => m.heroId === selectedAvenger.id
                )}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />{" "}
            </div>
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <i className="ri-filter-line text-red-400"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Mission Filters
                      </h3>
                      <p className="text-sm text-gray-400">
                        Showing {heroMissions.length} of{" "}
                        {
                          missions.filter(
                            (m) => m.heroId === selectedAvenger.id
                          ).length
                        }{" "}
                        missions
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Filter by Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Filter by Location
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                        placeholder="e.g. New York"
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Search Keywords
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                        placeholder="Search missions..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Difficulty Level
                      </label>
                      <select
                        className="w-full px-4 py-2 rounded bg-slate-700 text-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
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
                      onClick={() =>
                        setSelectedDate(new Date().toISOString().split("T")[0])
                      }
                    >
                      Today
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-700 text-white text-xs"
                      onClick={() => setFilter("High")}
                    >
                      Expert Only
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-green-700 text-white text-xs"
                      onClick={() => setFilter("Low")}
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
                        setSelectedDate("");
                        setFilter("All");
                        setFilterWeek([weekStart, weekEnd]);
                      }}
                    >
                      This Week
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-gray-700 text-white text-xs"
                      onClick={() => {
                        setSelectedDate("");
                        setFilter("All");
                        setFilterLocation("");
                        setSearchKeyword("");
                        setFilterWeek(null);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    All Missions
                  </h2>
                  <span className="text-gray-400 text-sm">
                    {heroMissions.length} of{" "}
                    {
                      missions.filter((m) => m.heroId === selectedAvenger.id)
                        .length
                    }{" "}
                    missions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {heroMissions.map((mission) => (
                    <MissionCard key={mission.id} mission={mission} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Mission Map</h2>
            <p className="text-gray-300">
              Track all Avenger missions across the city
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <MissionMap missions={heroMissions} />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {heroMissions.length}
                </div>
                <div className="text-sm text-gray-400">Total Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {heroMissions.filter((m) => m.priority === "Low").length}
                </div>
                <div className="text-sm text-gray-400">Easy Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {heroMissions.filter((m) => m.priority === "Medium").length}
                </div>
                <div className="text-sm text-gray-400">Advanced Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {heroMissions.filter((m) => m.priority === "High").length}
                </div>
                <div className="text-sm text-gray-400">Expert Missions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useContext, useState } from "react";
import { AvengerContext } from "../context/AvengerContext";
import Navbar from "../components/Navbar";
import MissionForm from "../components/MissionForm";
import MissionCard from "../components/MissionCard";
import MissionMap from "../components/MissionMap";
import MissionCalendar from "../components/MissionCalendar";
import { animated } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn } from '../utils/animations';
import ParticleBackground from '../components/ParticleBackground';

export default function Missions() {
  const { selectedAvenger, missions, loading } = useContext(AvengerContext);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterWeek, setFilterWeek] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Animation hooks
  const [headerRef, headerProps] = useFadeIn(200);
  const [calendarRef, calendarProps] = useSlideIn('left', 400);
  const [filtersRef, filtersProps] = useSlideIn('right', 600);
  const [missionGridRef, missionGridProps] = useScaleIn(800);
  const [mapRef, mapProps] = useFadeIn(1000);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Mission Data...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <animated.div
        ref={headerRef}
        style={headerProps}
        className="relative py-16"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000"
          style={{
            backgroundImage: selectedAvenger?.image2 ? `url(${selectedAvenger.image2})` : 'none',
            backgroundColor: 'rgb(30, 41, 59)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                Mission Center
              </h1>
              <p className="text-gray-300">
                Manage and track all missions for {selectedAvenger.name}
              </p>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              onClick={() => setShowForm(true)}
            >
              <i className="ri-add-line"></i>New Mission
            </button>
          </div>
        </div>
      </animated.div>

      {showForm && (
        <animated.div
          // style={useScaleIn(0)[1]}
          className="max-w-3xl mx-auto my-4 mb-8"
        >
          <MissionForm />
          <div className="flex justify-end mt-2">
            <button
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </animated.div>
      )}

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <animated.div
              ref={calendarRef}
              style={calendarProps}
              className="lg:col-span-1"
            >
              <MissionCalendar
                missions={missions.filter((m) => m.heroId === selectedAvenger.id)}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </animated.div>

            <div className="lg:col-span-3 space-y-8">
              <animated.div
                ref={filtersRef}
                style={filtersProps}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-red-500/30 transition-colors duration-300"
              >
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                        <i className="ri-filter-line text-red-400"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Mission Filters</h3>
                        <p className="text-sm text-gray-400">
                          Showing {heroMissions.length} of{" "}
                          {missions.filter((m) => m.heroId === selectedAvenger.id).length}{" "}
                          missions
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <i className={`ri-arrow-${isFilterOpen ? 'up' : 'down'}-s-line text-xl`}></i>
                    </button>
                  </div>

                  <animated.div style={isFilterOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Filter by Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:ring-2 focus:ring-red-500 transition-shadow"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Filter by Location</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:ring-2 focus:ring-red-500 transition-shadow"
                          placeholder="e.g. New York"
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Search Keywords</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:ring-2 focus:ring-red-500 transition-shadow"
                          placeholder="Search missions..."
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Difficulty Level</label>
                        <select
                          className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:ring-2 focus:ring-red-500 transition-shadow"
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
                        className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs transition-colors"
                        onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                      >
                        Today
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs transition-colors"
                        onClick={() => setFilter("High")}
                      >
                        Expert Only
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-green-700 hover:bg-green-600 text-white text-xs transition-colors"
                        onClick={() => setFilter("Low")}
                      >
                        Easy Only
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white text-xs transition-colors"
                        onClick={() => {
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
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs transition-colors"
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
                  </animated.div>
                </div>
              </animated.div>

              <animated.div
                ref={missionGridRef}
                style={missionGridProps}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">All Missions</h2>
                  <span className="text-gray-400 text-sm">
                    {heroMissions.length} of{" "}
                    {missions.filter((m) => m.heroId === selectedAvenger.id).length}{" "}
                    missions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {heroMissions.map((mission, index) => (
                    <animated.div
                      key={mission.id}
                      // style={useScaleIn(100 * (index + 1))[1]}
                    >
                      <MissionCard mission={mission} />
                    </animated.div>
                  ))}
                </div>
              </animated.div>
            </div>
          </div>
        </div>
      </div>

      <animated.div
        ref={mapRef}
        style={mapProps}
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Mission Map</h2>
            <p className="text-gray-300">Track all Avenger missions across the city</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-red-500/30 transition-colors duration-300">
            <MissionMap missions={heroMissions} />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors">
                <div className="text-2xl font-bold text-white">{heroMissions.length}</div>
                <div className="text-sm text-gray-400">Total Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors">
                <div className="text-2xl font-bold text-green-400">
                  {heroMissions.filter((m) => m.priority === "Low").length}
                </div>
                <div className="text-sm text-gray-400">Easy Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors">
                <div className="text-2xl font-bold text-yellow-400">
                  {heroMissions.filter((m) => m.priority === "Medium").length}
                </div>
                <div className="text-sm text-gray-400">Advanced Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors">
                <div className="text-2xl font-bold text-red-400">
                  {heroMissions.filter((m) => m.priority === "High").length}
                </div>
                <div className="text-sm text-gray-400">Expert Missions</div>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}

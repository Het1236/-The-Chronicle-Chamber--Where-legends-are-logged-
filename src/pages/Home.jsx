import { useContext } from "react";
import { AvengerContext } from "../context/AvengerContext";
import Navbar from "../components/Navbar";
import MissionForm from "../components/MissionForm";
import MissionCard from "../components/MissionCard";
import MissionMap from "../components/MissionMap";
import { useNavigate } from "react-router-dom";

export default function Home() {
      const navigate = useNavigate()

  const { selectedAvenger, missions } = useContext(AvengerContext);
  if (!selectedAvenger) return null;
  const heroMissions = missions.filter((m) => m.heroId === selectedAvenger.id);

  const handleChangeHero = () => {
    navigate('/heroes');


  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      <div className="relative py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url(${selectedAvenger.image2})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8">
            <div
              className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded-full border-4 border-red-500 shadow-2xl"
          style={{ backgroundImage: `url(${selectedAvenger.image1})`,}}
            ></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {selectedAvenger.name}!
              </h1>
              <p className="text-xl text-red-400 italic mb-4">
                {selectedAvenger.quote}
              </p>
              <p className="text-gray-300 mb-6">
                Continue your heroic journey as {selectedAvenger.basicInfo.realName}. Log your
                missions and track your progress.
              </p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
                fdprocessedid="oxgt1l"
                onClick={handleChangeHero}
              >
                <i className="ri-user-line"></i>Change Hero
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-8 ">
        <MissionForm />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {heroMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
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

import { useContext } from "react";
import { AvengerContext } from "../context/AvengerContext";

export default function MissionCard({ mission }) {
  const { selectedAvenger, setEditingMission, deleteMission } = useContext(AvengerContext);

  const handleEdit = () => {
    setEditingMission(mission);
    const form = document.getElementById("mission-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this mission?")) {
      deleteMission(mission.id);
    }
  };

  return (
    <div className="group relative h-80 w-72 cursor-pointer perspective-[1200px]">
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl z-10">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: selectedAvenger?.image3
                ? `url(${selectedAvenger.image3})`
                : "none",
              backgroundColor: "rgb(30, 41, 59)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-600/20">
                  {mission.priority}
                </span>
                <span className="text-xs text-gray-300">{mission.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{mission.location}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="text-sm">👤</span>
                  <span>{mission.hero}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🛡️</span>
                  <span>{mission.threat}</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                  Hover for details
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl z-20">
          <div className="w-full h-full bg-slate-800 relative">
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: selectedAvenger?.image1
                  ? `url(${selectedAvenger.image1})`
                  : "none",
                backgroundColor: "rgb(30, 41, 59)",
              }}
            ></div>
            <div className="absolute inset-0 bg-slate-900/90"></div>
            <div className="relative p-6 h-full flex flex-col text-white">
              <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {mission.title}
                  </h3>
                  <p className="text-sm text-blue-400">{mission.hero}</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-medium text-green-400 bg-green-600/20">
                  {mission.priority}
                </span>
              </div>
              <div className="flex-1 space-y-3 text-sm">
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white font-medium">{mission.date}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="text-white font-medium">{mission.location}</p>
                </div>
                <div>
                  <span className="text-gray-400">Mission Details:</span>
                  <p className="text-gray-200 leading-relaxed text-xs mt-1 bg-black/30 rounded p-2">
                    {mission.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 rounded text-xs font-medium text-green-400 bg-green-600/20">
                    Priority: {mission.priority}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium text-blue-400 bg-blue-600/20">
                    Threat: {mission.threat}
                  </span>
                </div>
                {/* Action Buttons at Bottom Right */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-red-500/30 backdrop-blur-md border border-red-500/30 shadow-xl hover:bg-red-500/50 transition-all animate__animated animate__fadeIn"
                    title="Delete Mission"
                    style={{
                      minWidth: 90,
                      boxShadow: "0 4px 24px 0 rgba(255,80,80,0.15)",
                      border: "1.5px solid rgba(255,80,80,0.25)",
                    }}
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-xl hover:bg-white/30 transition-all animate__animated animate__fadeIn"
                    title="Edit Mission"
                    style={{
                      minWidth: 90,
                      boxShadow: "0 4px 24px 0 rgba(80,120,255,0.15)",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    <i className="ri-edit-2-line text-lg"></i>
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
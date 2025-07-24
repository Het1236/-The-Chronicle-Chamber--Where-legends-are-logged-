import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvengerContext } from "../context/AvengerContext";

export default function MissionCard({ mission }) {
  const navigate = useNavigate();
  const { selectedAvenger, setEditingMission, deleteMission } = useContext(AvengerContext);

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default behavior
    
    console.log("Editing mission:", mission);
    setEditingMission(mission);
    
    // Scroll to the form
    const form = document.getElementById("mission-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default behavior
    
    console.log("Attempting to delete mission:", mission);
    
    if (window.confirm("Are you sure you want to delete this mission?")) {
      try {
        console.log("Confirmed deletion for mission ID:", mission.id);
        await deleteMission(mission.id);
        console.log("Mission deleted successfully");
      } catch (error) {
        console.error("Error deleting mission:", error);
        alert("There was an error deleting the mission. Please try again.");
      }
    } else {
      console.log("Mission deletion cancelled");
    }
  };

  const handleCardClick = () => {
    navigate(`/mission/${mission.id}`);
  };

  return (
    <div 
      className="group relative h-80 w-72 cursor-pointer perspective-[1200px]"
      onClick={handleCardClick}
    >
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
                {/* Action Buttons at Bottom */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-1 px-4 py-1.5 rounded-md font-medium text-white bg-blue-600/80 hover:bg-blue-600 transition-all shadow-lg backdrop-blur-sm"
                    title="Edit Mission"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-1 px-4 py-1.5 rounded-md font-medium text-white bg-red-600/80 hover:bg-red-600 transition-all shadow-lg backdrop-blur-sm"
                    title="Delete Mission"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Delete</span>
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
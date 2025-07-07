import { useState } from "react";

export default function MissionCard({ mission, heroImage }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative h-64 cursor-pointer" onClick={handleCardClick}>
      <div className={`absolute inset-0 w-full h-full rounded-xl transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg">
          <div 
            className="w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url('${heroImage}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
              <p className="text-sm text-gray-200 mb-2">{mission.location}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  mission.priority === 'High' ? 'bg-red-600' :
                  mission.priority === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                }`}>
                  {mission.priority}
                </span>
                <span className="text-xs text-gray-300">{mission.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-slate-800 border border-slate-700 shadow-lg">
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">{mission.title}</h3>
            
            <div className="flex-1 space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{mission.location}</span>
              </div>
              
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-white ml-2">{mission.date}</span>
              </div>
              
              <div>
                <span className="text-gray-400">Priority:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  mission.priority === 'High' ? 'bg-red-600 text-white' :
                  mission.priority === 'Medium' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                }`}>
                  {mission.priority}
                </span>
              </div>
              
              {mission.description && (
                <div>
                  <span className="text-gray-400">Description:</span>
                  <p className="text-white mt-1 text-xs leading-relaxed">{mission.description}</p>
                </div>
              )}
              
              {mission.threat && (
                <div>
                  <span className="text-gray-400">Threat Level:</span>
                  <span className="text-white ml-2">{mission.threat}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-gray-400 text-center">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

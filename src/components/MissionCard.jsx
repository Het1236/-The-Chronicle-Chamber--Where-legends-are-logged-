import { useState,useContext } from "react";
import { AvengerContext } from '../context/AvengerContext';

export default function MissionCard({ mission, heroImage }) {
  const { selectedAvenger } = useContext(AvengerContext);


  return (
<div className="group relative h-80 w-72 cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(180deg)]">
          
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: `url(${selectedAvenger.image3})`,
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
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-slate-800 relative">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${selectedAvenger.image})`,
                }}
              ></div>
              
              {/* Dark overlay matching your design */}
              <div className="absolute inset-0 bg-slate-900/90"></div>
              
              <div className="relative p-6 h-full flex flex-col text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{mission.title}</h3>
                    <p className="text-sm text-blue-400">{mission.hero}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium text-green-400 bg-green-600/20">
                    {mission.priority}
                  </span>
                </div>

                {/* Mission Details */}
                <div className="flex-1 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <p className="text-white font-medium">{mission.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <p className="text-white font-medium">{mission.duration}</p>
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
                </div>

                {/* Footer */}
                <div className="border-t border-gray-600 pt-3 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Mission ID:</span>
                    <span className="text-white font-mono">#{mission.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

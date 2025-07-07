import React, { useRef, useEffect, useState } from 'react';

function getRandomPosition() {
  // Returns random % for left/top (for demo purposes)
  return {
    left: `${Math.random() * 90 + 5}%`,
    top: `${Math.random() * 70 + 10}%`
  };
}

export default function MissionMap({ missions }) {
  // Assign a random position to each mission (by id)
  const [positions, setPositions] = useState({});
  useEffect(() => {
    const newPositions = {};
    missions.forEach(m => {
      if (!positions[m.id]) newPositions[m.id] = getRandomPosition();
      else newPositions[m.id] = positions[m.id];
    });
    setPositions(newPositions);
    // eslint-disable-next-line
  }, [missions.length]);

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
        alt="Mission Map"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {missions.map(mission => (
        <div
          key={mission.id}
          className="absolute pointer-events-auto cursor-pointer group"
          style={{
            ...positions[mission.id],
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative transition-all duration-300 group-hover:scale-125">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse group-hover:animate-none">
              <i className="ri-map-pin-fill text-white text-sm"></i>
            </div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[180px]">
              <div className="font-bold">{mission.title}</div>
              <div>{mission.location}</div>
              <div className="text-gray-400">{mission.date}</div>
              <div className="text-gray-400">{mission.priority} / {mission.threat}</div>
              <div className="mt-1">{mission.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
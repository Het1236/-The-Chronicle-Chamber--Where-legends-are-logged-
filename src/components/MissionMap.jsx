import React from 'react';

export default function MissionMap({ missions }) {
  return (
    <div className="max-w-7xl mx-auto px-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Mission Locations</h2>
          <p className="text-gray-300">Track your heroic activities across the globe</p>
        </div>

        <div className="bg-slate-700 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.3076901735445!2d-74.00597568459394!3d40.71278797933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e6e8a7b%3A0x4b9d9c8d0f4a5a5a!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1633024800000!5m2!1sen!2sus"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-96"
          />
        </div>

        {missions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Mission Locations:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {missions.slice(0, 6).map((mission) => (
                <div key={mission.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <i className="ri-map-pin-line text-red-500 text-lg"></i>
                    <div>
                      <p className="text-white font-medium text-sm">{mission.location}</p>
                      <p className="text-gray-400 text-xs">{mission.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
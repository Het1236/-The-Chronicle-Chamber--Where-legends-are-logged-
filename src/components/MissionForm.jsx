import React, { useState, useContext } from 'react';
import { AvengerContext } from '../context/AvengerContext';

export default function MissionForm() {
  const { selectedAvenger, addMission } = useContext(AvengerContext);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    priority: 'Medium',
    description: '',
    threat: 'Low'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mission = {
      ...formData,
      id: Date.now(),
      hero: selectedAvenger.name,
      heroId: selectedAvenger.id,
      heroImage: selectedAvenger.image,
      timestamp: new Date().toISOString()
    };
    addMission(mission);
    setFormData({
      title: '',
      location: '',
      date: '',
      priority: 'Medium',
      description: '',
      threat: 'Low'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Log New Mission</h2>
          <p className="text-gray-300">Record your heroic activities and track your progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mission Title */}
            <div>
              <label className="block text-white font-medium mb-2">Mission Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
                placeholder="Enter mission title..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
                placeholder="Mission location..."
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-white font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-white font-medium mb-2">Priority Level</label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors text-sm pr-8 cursor-pointer"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            {/* Threat Level */}
            <div>
              <label className="block text-white font-medium mb-2">Threat Level</label>
              <div className="relative">
                <select
                  name="threat"
                  value={formData.threat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors text-sm pr-8 cursor-pointer"
                >
                  <option value="Low">Low Threat</option>
                  <option value="Medium">Medium Threat</option>
                  <option value="High">High Threat</option>
                  <option value="Critical">Critical Threat</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">Mission Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              maxLength="500"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
              placeholder="Describe the mission details, objectives, and outcomes..."
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">{formData.description.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2 mx-auto whitespace-nowrap"
            >
              <i className="ri-add-line"></i>
              Log Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useContext, useEffect } from "react";
import { AvengerContext } from "../context/AvengerContext";

export default function MissionForm() {
  const {
    selectedAvenger,
    addMission,
    editingMission,
    setEditingMission,
    updateMission,
  } = useContext(AvengerContext);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    priority: "Medium",
    description: "",
    threat: "Low",
    duration: "",
  });

  useEffect(() => {
    if (editingMission) {
      // Scroll to the form when editing mission is set
      const form = document.getElementById("mission-form");
      if (form) {
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      // Set form data from the editing mission
      setFormData({
        ...editingMission,
        // Ensure all required fields are present
        title: editingMission.title || "",
        location: editingMission.location || "",
        date: editingMission.date || "",
        priority: editingMission.priority || "Medium",
        description: editingMission.description || "",
        threat: editingMission.threat || "Low",
        duration: editingMission.duration || "",
      });
    } else {
      // Reset form data when not editing
      setFormData({
        title: "",
        location: "",
        date: "",
        priority: "Medium",
        description: "",
        threat: "Low",
        duration: "",
      });
    }
  }, [editingMission]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMission) {
        console.log("Updating mission:", formData);
        // Make sure we preserve the ID when updating
        const updatedMission = {
          ...formData,
          id: editingMission.id, // Ensure ID is preserved
          hero: selectedAvenger.name,
          heroId: selectedAvenger.id,
          heroImage: selectedAvenger.image3,
        };
        
        // Call the update function
        await updateMission(updatedMission);
        console.log("Mission updated successfully");
      } else {
        console.log("Adding new mission");
        // Add a new mission
        await addMission({
          ...formData,
          hero: selectedAvenger.name,
          heroId: selectedAvenger.id,
          heroImage: selectedAvenger.image3,
          timestamp: new Date().toISOString(),
        });
        console.log("Mission added successfully");
      }
      
      // Reset the form
      setFormData({
        title: "",
        location: "",
        date: "",
        priority: "Medium",
        description: "",
        threat: "Low",
        duration: "",
      });
      
      // Clear editing state
      if (editingMission) {
        setEditingMission(null);
      }
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("There was an error saving the mission. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-14 h-14 bg-cover bg-center bg-no-repeat rounded-full border-2 border-red-500"
            style={{
              backgroundImage: `url(${selectedAvenger.image1})`,
            }}
          ></div>
          <div>
            <h2 className="text-2xl font-bold text-white">Log New Mission </h2>
            <p className="text-gray-400">
              Logging as{" "}
              <span className="text-red-500">{selectedAvenger.name}</span> (
              {selectedAvenger.basicInfo.realName})
            </p>
            <p className="text-gray-300">
              Record your heroic activities and track your progress
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" id="mission-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Title */}
            <div>
              <label className="block text-white font-medium mb-2">
                Mission Title
              </label>
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
              <label className="block text-white font-medium mb-2">
                Location
              </label>
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
              <label className="block text-white font-medium mb-2">
                Priority Level
              </label>
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
              </div>
            </div>

            {/* Threat Level */}
            <div>
              <label className="block text-white font-medium mb-2">
                Threat Level
              </label>
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
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Mission Description
            </label>
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
              <span className="text-xs text-gray-400">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            {editingMission && (
              <button
                type="button"
                className="bg-gray-600 text-white px-6 py-2 rounded font-bold"
                onClick={() => setEditingMission(null)}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold transition-all ${
                editingMission ? "animate__animated animate__pulse" : ""
              }`}
            >
              {editingMission ? "Update Mission" : "Add Mission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

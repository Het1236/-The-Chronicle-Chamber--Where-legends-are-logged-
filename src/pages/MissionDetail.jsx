import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AvengerContext } from '../context/AvengerContext';
import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';
import { animated } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn } from '../utils/animations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Avenger-themed marker icons
const createAvengerIcon = (priority, hero) => {
  let priorityClass = 'easy';
  let iconHtml = '';
  let heroClass = '';
  
  switch(priority) {
    case 'Low':
      priorityClass = 'easy';
      break;
    case 'Medium':
      priorityClass = 'advanced';
      break;
    case 'High':
    case 'Critical':
      priorityClass = 'expert';
      break;
    default:
      break;
  }
  
  // Custom icon based on hero
  if (hero) {
    const heroName = hero.toLowerCase();
    if (heroName.includes('iron man')) {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#E53935">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6.5A5.5,5.5 0 0,1 17.5,12A5.5,5.5 0 0,1 12,17.5A5.5,5.5 0 0,1 6.5,12A5.5,5.5 0 0,1 12,6.5M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                  </svg>`;
      heroClass = 'iron-man-marker';
    } else if (heroName.includes('thor')) {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#2196F3">
                    <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,6.5L15,8.5V11.5L12,13.5L9,11.5V8.5L12,6.5M20,19H4V21H20V19Z" />
                  </svg>`;
      heroClass = 'thor-marker';
    } else if (heroName.includes('spider')) {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#B71C1C">
                    <path d="M16.5,5.5C17.6,5.5 18.5,4.6 18.5,3.5C18.5,2.4 17.6,1.5 16.5,1.5C15.4,1.5 14.5,2.4 14.5,3.5C14.5,4.6 15.4,5.5 16.5,5.5M12.9,19.4L13.9,15L16,17V23H18V15.5L15.9,13.5L16.5,10.5C17.89,12.09 19.89,13 22,13V11C20.24,11.03 18.6,10.11 17.7,8.6L16.7,7C16.34,6.4 15.7,6 15,6C14.7,6 14.5,6.1 14.2,6.1L9,8.3V13H11V9.6L12.8,8.9L11.2,17L6.3,16L5.9,18L12.9,19.4M4,9C3.45,9 3,8.55 3,8C3,7.45 3.45,7 4,7H7V9H4M5,5C4.45,5 4,4.55 4,4C4,3.45 4.45,3 5,3H10V5H5M3,13C2.45,13 2,12.55 2,12C2,11.45 2.45,11 3,11H7V13H3Z" />
                  </svg>`;
      heroClass = 'spiderman-marker';
    } else if (heroName.includes('doctor') || heroName.includes('strange')) {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FF9800">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,7V11H7V13H11V17H13V13H17V11H13V7H11Z" />
                  </svg>`;
      heroClass = 'strange-marker';
    } else if (heroName.includes('witch') || heroName.includes('wanda') || heroName.includes('scarlet')) {
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#E91E63">
                    <path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M4.5,8C5.33,5.38 7.86,3.5 10.5,3.5C14.14,3.5 17,6.36 17,10C17,11.82 16.25,13.41 15,14.56C16.25,15.71 17,17.3 17,19C17,21.21 15.21,23 13,23C11.5,23 10.18,22.17 9.5,20.92C8.82,22.17 7.5,23 6,23C3.79,23 2,21.21 2,19C2,17.3 2.75,15.71 4,14.56C2.75,13.41 2,11.82 2,10C2,9.28 2.12,8.59 2.34,7.93C2.96,8.55 3.9,8.93 4.5,8Z" />
                  </svg>`;
      heroClass = 'witch-marker';
    } else {
      // Default Avengers icon for other heroes
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFFFFF">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M9,8L11,15.5L12.5,13.5L15,15.5L13,8H9Z" />
                  </svg>`;
      heroClass = 'avenger-marker';
    }
  } else {
    // Fallback to default icon
    iconHtml = `<i class="ri-map-pin-fill"></i>`;
  }
  
  return L.divIcon({
    className: `mission-marker ${priorityClass} ${heroClass}`,
    html: `<div class="marker-content">${iconHtml}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const MissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { missions, setEditingMission, deleteMission } = useContext(AvengerContext);
  const [mission, setMission] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Animation hooks
  const [headerRef, headerProps] = useScaleIn(200);
  const [detailsRef, detailsProps] = useFadeIn(400);
  const [mapRef, mapProps] = useSlideIn('right', 600);
  
  useEffect(() => {
    // Find the mission with the matching ID
    const foundMission = missions.find(m => m.id === id);
    
    if (foundMission) {
      setMission(foundMission);
      
      // Generate coordinates for the mission location
      getCoordinatesForLocation(foundMission.location)
        .then(coords => {
          setCoordinates(coords);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error getting coordinates:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, missions]);
  
  // Function to get coordinates for locations (both fictional Marvel and real-world)
  const getCoordinatesForLocation = async (location) => {
    if (!location || typeof location !== 'string' || location.trim() === '') {
      console.error('Empty location provided');
      return { lat: 40.7128, lng: -74.0060 }; // Default to NYC
    }
    
    // Map of fictional Marvel locations to real-world coordinates
    const locationMap = {
      // Major cities
      'New York': { lat: 40.7128, lng: -74.0060 },
      'New York City': { lat: 40.7128, lng: -74.0060 },
      'Manhattan': { lat: 40.7831, lng: -73.9712 },
      'Queens': { lat: 40.7282, lng: -73.7949 },
      'Brooklyn': { lat: 40.6782, lng: -73.9442 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Tokyo': { lat: 35.6762, lng: 139.6503 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Moscow': { lat: 55.7558, lng: 37.6173 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Berlin': { lat: 52.5200, lng: 13.4050 },
      'Rome': { lat: 41.9028, lng: 12.4964 },
      'Madrid': { lat: 40.4168, lng: -3.7038 },
      'Sydney': { lat: -33.8688, lng: 151.2093 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Beijing': { lat: 39.9042, lng: 116.4074 },
      'Cairo': { lat: 30.0444, lng: 31.2357 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Toronto': { lat: 43.6532, lng: -79.3832 },
      'Seoul': { lat: 37.5665, lng: 126.9780 },
      'Mexico City': { lat: 19.4326, lng: -99.1332 },
      
      // Fictional Marvel locations
      'Wakanda': { lat: -1.2921, lng: 36.8219 }, // Using Nairobi, Kenya as a stand-in
      'Sokovia': { lat: 45.8150, lng: 15.9819 }, // Using Zagreb, Croatia as a stand-in
      'Asgard': { lat: 60.3913, lng: 5.3221 }, // Using Bergen, Norway as a stand-in
      'Stark Tower': { lat: 40.7484, lng: -73.9857 }, // Using Empire State Building location
      'Avengers Compound': { lat: 41.2565, lng: -73.6816 }, // Using location near Westchester, NY
      'Sanctum Sanctorum': { lat: 40.7294, lng: -74.0031 }, // Greenwich Village, NYC
      'Kamar-Taj': { lat: 27.7172, lng: 85.3240 }, // Using Kathmandu, Nepal
      'Latveria': { lat: 47.1625, lng: 27.5895 }, // Approximating to Romania
      'Genosha': { lat: -20.1609, lng: 57.5012 }, // Approximating to Mauritius
      'Madripoor': { lat: 1.3521, lng: 103.8198 }, // Approximating to Singapore
      'Attilan': { lat: 27.9881, lng: 86.9250 }, // Approximating to Himalayas
    };

    // Check if we have a mapping for this location
    for (const [key, value] of Object.entries(locationMap)) {
      if (location.toLowerCase().includes(key.toLowerCase())) {
        console.log(`Found predefined coordinates for ${location}:`, value);
        return value;
      }
    }

    // If no match found, return default coordinates
    console.log(`No predefined coordinates for ${location}, using default`);
    // Return a random location near New York as fallback
    const randomLat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const randomLng = -74.0060 + (Math.random() - 0.5) * 0.1;
    return { lat: randomLat, lng: randomLng };
  };
  
  const handleEdit = () => {
    setEditingMission(mission);
    navigate('/missions');
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      try {
        await deleteMission(mission.id);
        navigate('/missions');
      } catch (error) {
        console.error('Error deleting mission:', error);
        alert('There was an error deleting the mission. Please try again.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        <ParticleBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading mission details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!mission) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        <ParticleBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-error-warning-line text-red-500 text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Mission Not Found</h2>
            <p className="text-gray-300 mb-8">The mission you're looking for doesn't exist or has been deleted.</p>
            <button 
              onClick={() => navigate('/missions')} 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors inline-flex items-center"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Missions
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Mission Header */}
        <animated.div ref={headerRef} style={headerProps} className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-red-500 shadow-lg shadow-red-500/20"
                style={{ backgroundImage: `url(${mission.heroImage})` }}
              ></div>
              <div>
                <h1 className="text-3xl font-bold text-white">{mission.title}</h1>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-blue-400">{mission.hero}</span>
                  <span className="text-gray-500">•</span>
                  <span>{mission.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md transition-all shadow-lg backdrop-blur-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Mission
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-md transition-all shadow-lg backdrop-blur-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Mission
              </button>
            </div>
          </div>
        </animated.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mission Details */}
          <animated.div ref={detailsRef} style={detailsProps} className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="ri-file-list-3-line text-red-500 mr-2"></i>
                Mission Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Location</h3>
                    <p className="text-white font-medium flex items-center gap-2">
                      <i className="ri-map-pin-line text-red-400"></i>
                      {mission.location}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Date</h3>
                    <p className="text-white font-medium flex items-center gap-2">
                      <i className="ri-calendar-line text-blue-400"></i>
                      {mission.date}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Hero</h3>
                    <p className="text-white font-medium flex items-center gap-2">
                      <i className="ri-user-star-line text-yellow-400"></i>
                      {mission.hero}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Priority Level</h3>
                    <p className={`font-medium flex items-center gap-2 ${mission.priority === 'High' ? 'text-red-400' : mission.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      <i className="ri-alarm-warning-line"></i>
                      {mission.priority} Priority
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Threat Level</h3>
                    <p className={`font-medium flex items-center gap-2 ${mission.threat === 'Critical' ? 'text-red-400' : mission.threat === 'High' ? 'text-orange-400' : mission.threat === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      <i className="ri-shield-flash-line"></i>
                      {mission.threat} Threat
                    </p>
                  </div>
                  
                  {mission.duration && (
                    <div>
                      <h3 className="text-gray-400 text-sm">Duration</h3>
                      <p className="text-white font-medium flex items-center gap-2">
                        <i className="ri-time-line text-purple-400"></i>
                        {mission.duration}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-2">Mission Description</h3>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <p className="text-white leading-relaxed">{mission.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="ri-history-line text-red-500 mr-2"></i>
                Mission Timeline
              </h2>
              
              <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-600">
                <div className="relative">
                  <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <i className="ri-flag-line text-white text-xs"></i>
                  </div>
                  <h3 className="text-blue-400 font-medium">Mission Created</h3>
                  <p className="text-gray-400 text-sm">{mission.timestamp ? new Date(mission.timestamp).toLocaleString() : 'Unknown date'}</p>
                </div>
                
                {mission.updatedAt && (
                  <div className="relative">
                    <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <i className="ri-edit-line text-white text-xs"></i>
                    </div>
                    <h3 className="text-yellow-400 font-medium">Last Updated</h3>
                    <p className="text-gray-400 text-sm">{new Date(mission.updatedAt).toLocaleString()}</p>
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-[-30px] top-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <i className="ri-calendar-check-line text-white text-xs"></i>
                  </div>
                  <h3 className="text-green-400 font-medium">Mission Date</h3>
                  <p className="text-gray-400 text-sm">{mission.date}</p>
                </div>
              </div>
            </div>
          </animated.div>
          
          {/* Mission Map */}
          <animated.div ref={mapRef} style={mapProps} className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-xl h-[400px]">
              {coordinates && (
                <MapContainer 
                  center={[coordinates.lat, coordinates.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  className="z-10"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                  />
                  
                  <Marker
                    position={[coordinates.lat, coordinates.lng]}
                    icon={createAvengerIcon(mission.priority, mission.hero)}
                  >
                    <Popup>
                      <div className="mission-popup">
                        <div className="mission-popup-header">
                          <h3 className="font-bold text-lg">{mission.title}</h3>
                          <span className={`mission-priority ${mission.priority?.toLowerCase()}`}>
                            {mission.priority}
                          </span>
                        </div>
                        <div className="mission-popup-content">
                          <p><strong>Location:</strong> {mission.location}</p>
                          <p><strong>Hero:</strong> {mission.hero}</p>
                          <p><strong>Threat Level:</strong> {mission.threat}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="ri-shield-star-line text-red-500 mr-2"></i>
                Mission Stats
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Priority Level:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.priority === 'High' ? 'bg-red-500/20 text-red-300' : mission.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                    {mission.priority}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Threat Level:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.threat === 'Critical' ? 'bg-red-500/20 text-red-300' : mission.threat === 'High' ? 'bg-orange-500/20 text-orange-300' : mission.threat === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                    {mission.threat}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Assigned Hero:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                    {mission.hero}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mission Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => navigate('/missions')} 
                className="px-6 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-md transition-all shadow-lg backdrop-blur-sm inline-flex items-center gap-2"
              >
                <i className="ri-arrow-left-line"></i>
                Back to Missions
              </button>
            </div>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
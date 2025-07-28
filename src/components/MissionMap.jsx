import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import 'leaflet/dist/leaflet.css';
import { setKey, setLanguage, setRegion, fromAddress, RequestType } from 'react-geocode';
import './MissionMap.css'; // Import custom CSS for animations


setKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "");
setLanguage("en");
setRegion("us");

import L from 'leaflet';
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

// Component to handle map animations and interactions
function MapController({ selectedMission, setSelectedMission, coordinates }) {
  const map = useMap();
  
  // Effect to handle map zoom when a mission is selected
  useEffect(() => {
    if (selectedMission && selectedMission.coordinates) {
      // console.log('Flying to selected mission:', selectedMission);
      // Fly to the selected mission location with animation
      map.flyTo(
        [selectedMission.coordinates.lat, selectedMission.coordinates.lng],
        14, // Zoom level
        {
          duration: 1.5, // Animation duration in seconds
          easeLinearity: 0.25,
        }
      );
    }
  }, [map, selectedMission]);
  
  // Effect to fit bounds when coordinates change
  useEffect(() => {
    if (Object.keys(coordinates).length > 0 && !selectedMission) {
      const lats = Object.values(coordinates).map(coord => coord.lat);
      const lngs = Object.values(coordinates).map(coord => coord.lng);
      
      if (lats.length > 0 && lngs.length > 0) {
        // console.log('Fitting map to bounds of all missions');
        const bounds = [
          [Math.min(...lats) - 0.5, Math.min(...lngs) - 0.5],
          [Math.max(...lats) + 0.5, Math.max(...lngs) + 0.5]
        ];
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10, animate: true });
      }
    }
  }, [map, coordinates, selectedMission]);

  return null;
}

// Main MissionMap component
export default function MissionMap({ missions }) {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({});
  const [selectedMission, setSelectedMission] = useState(null);
  const [animationEffect, setAnimationEffect] = useState(null);
  const mapRef = useRef(null);

  // Function to geocode a location string to coordinates using Google Maps API
  const geocodeLocation = async (location) => {
    if (!location || typeof location !== 'string' || location.trim() === '') {
      // console.error("Invalid location provided to geocodeLocation:", location);
      return { lat: 40.7128, lng: -74.0060 }; // Default to NYC
    }
    
    try {
      // console.log(`Attempting to geocode location: ${location}`);
      
      // Ensure the API key is set
      if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        console.warn("No Google Maps API key found. Geocoding may not work properly.");
      }
      
      // Set options for the geocoding request
      setKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "");
      setLanguage("en");
      setRegion("us"); // Default region
      
      // Make the geocoding request
      const response = await fromAddress(location);
      
      if (response.results && response.results.length > 0) {
        const { lat, lng } = response.results[0].geometry.location;
        // console.log(`Successfully geocoded ${location} to:`, { lat, lng });
        return { lat, lng };
      } else {
        console.warn(`No results found for location: ${location}`);
        // Use exact NYC coordinates as fallback
        // console.log(`Using New York City coordinates as fallback for: ${location}`);
        return { lat: 40.7128, lng: -74.0060 };
      }
    } catch (error) {
      console.error("Error geocoding location:", location, error);
      // Use exact NYC coordinates as fallback
      // console.log(`Using New York City coordinates as fallback for: ${location}`);
      return { lat: 40.7128, lng: -74.0060 };
    }
  };

  // Effect to geocode mission locations
  useEffect(() => {
    const fetchCoordinates = async () => {
      // console.log('Fetching coordinates for missions:', missions.length);
      const newCoordinates = { ...coordinates };
      let hasNewCoordinates = false;

      // Process all missions with locations
      for (const mission of missions) {
        if (mission.location) {
          try {
            // console.log(`Processing mission ${mission.id}: ${mission.title} at ${mission.location}`);
            // For demo purposes, we'll use a mapping of fictional locations
            // In production, you would use the geocodeLocation function
            const coords = await getCoordinatesForLocation(mission.location);
            
            // Only update if coordinates changed or didn't exist
            if (!coordinates[mission.id] || 
                coordinates[mission.id].lat !== coords.lat || 
                coordinates[mission.id].lng !== coords.lng) {
              // console.log(`Updating coordinates for mission ${mission.id}:`, coords);
              newCoordinates[mission.id] = coords;
              hasNewCoordinates = true;
            }
          } catch (error) {
            console.error(`Error geocoding ${mission.location}:`, error);
          }
        } else {
          // console.log(`Mission ${mission.id} has no location`);
        }
      }

      if (hasNewCoordinates) {
        setCoordinates(newCoordinates);
        // console.log('Updated coordinates:', newCoordinates);
      } else {
        // console.log('No coordinate updates needed');
      }
    };

    fetchCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions]);

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
      'San Francisco': { lat: 37.7749, lng: -122.4194 },
      'Washington DC': { lat: 38.9072, lng: -77.0369 },
      'Las Vegas': { lat: 36.1699, lng: -115.1398 },
      'Miami': { lat: 25.7617, lng: -80.1918 },
      'Seattle': { lat: 47.6062, lng: -122.3321 },
      'Boston': { lat: 42.3601, lng: -71.0589 },
      'Atlanta': { lat: 33.7490, lng: -84.3880 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'Denver': { lat: 39.7392, lng: -104.9903 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      
      // Fictional Marvel locations
      'Wakanda': { lat: -1.2921, lng: 36.8219 }, // Using Nairobi, Kenya as a stand-in
      'Sokovia': { lat: 45.8150, lng: 15.9819 }, // Using Zagreb, Croatia as a stand-in
      'Asgard': { lat: 60.3913, lng: 5.3221 }, // Using Bergen, Norway as a stand-in
      'Stark Tower': { lat: 40.7484, lng: -73.9857 }, // Using Empire State Building location
      'Avengers Tower': { lat: 40.7484, lng: -73.9857 }, // Using Empire State Building location
      'Avengers Compound': { lat: 41.2565, lng: -73.6816 }, // Using location near Westchester, NY
      'Sanctum Sanctorum': { lat: 40.7294, lng: -74.0031 }, // Greenwich Village, NYC
      'Kamar-Taj': { lat: 27.7172, lng: 85.3240 }, // Using Kathmandu, Nepal
      'Latveria': { lat: 47.1625, lng: 27.5895 }, // Approximating to Romania
      'Genosha': { lat: -20.1609, lng: 57.5012 }, // Approximating to Mauritius
      'Madripoor': { lat: 1.3521, lng: 103.8198 }, // Approximating to Singapore
      'Attilan': { lat: 27.9881, lng: 86.9250 }, // Approximating to Himalayas
      'Xandar': { lat: 51.5074, lng: -0.1278 }, // Using London as a stand-in
      'Knowhere': { lat: 27.1750, lng: 78.0422 }, // Using Agra, India as a stand-in
      'Titan': { lat: 36.1699, lng: -115.1398 }, // Using Las Vegas as a stand-in
      'Vormir': { lat: 63.9850, lng: -22.6050 }, // Using Iceland as a stand-in
      'Hala': { lat: 25.2048, lng: 55.2708 }, // Using Dubai as a stand-in
      'Sakaar': { lat: -25.3444, lng: 131.0369 }, // Using Uluru, Australia as a stand-in
    };

    // Check if we have a mapping for this location
    for (const [key, value] of Object.entries(locationMap)) {
      if (location.toLowerCase().includes(key.toLowerCase())) {
        // console.log(`Found predefined coordinates for ${location}:`, value);
        return value;
      }
    }

    // If no match found, try to geocode it
    // console.log(`No predefined coordinates for ${location}, attempting to geocode...`);
    try {
      const result = await geocodeLocation(location);
      // console.log(`Successfully geocoded ${location} to:`, result);
      return result;
    } catch (error) {
      console.error(`Failed to geocode ${location}:`, error);
      // Return exact NYC coordinates as fallback, not random
      // console.log(`Geocoding failed for ${location}, using New York City as fallback`);
      return { lat: 40.7128, lng: -74.0060 };
    }
  };

  // Function to trigger Avenger-themed animation effect
  const triggerAnimationEffect = (mission) => {
    if (!mission || !mission.coordinates) {
      console.error('Cannot trigger animation: missing mission or coordinates', mission);
      return;
    }
    
    // Set the selected mission
    setSelectedMission(mission);
    
    // console.log('Triggering animation for mission:', mission.title);
    
    // Choose an animation effect based on hero or mission priority/threat level
    let effect = 'ironman'; // Default effect
    
    if (mission.hero) {
      const heroName = mission.hero.toLowerCase();
      if (heroName.includes('iron man')) {
        effect = 'ironman';
      } else if (heroName.includes('thor')) {
        effect = 'thor';
      } else if (heroName.includes('strange')) {
        effect = 'drstrange';
      } else if (heroName.includes('witch') || heroName.includes('scarlet') || heroName.includes('wanda')) {
        effect = 'scarletwitch';
      } else if (heroName.includes('spider')) {
        effect = 'spiderman';
      } else if (mission.threat === 'Expert' || mission.priority === 'Critical') {
        effect = 'thor'; // Thor effect for high-threat missions
      } else if (mission.threat === 'Advanced' || mission.priority === 'High') {
        effect = 'drstrange'; // Dr. Strange effect for medium-threat missions
      }
    } else if (mission.threat === 'Expert' || mission.priority === 'Critical') {
      effect = 'thor'; // Thor effect for high-threat missions
    } else if (mission.threat === 'Advanced' || mission.priority === 'High') {
      effect = 'drstrange'; // Dr. Strange effect for medium-threat missions
    }
    
    // console.log('Selected animation type:', effect);
    setAnimationEffect(effect);
    
    // If we have a map reference, zoom to the location
    if (mission.coordinates && mapRef.current) {
      const map = mapRef.current;
      map.flyTo(
        [mission.coordinates.lat, mission.coordinates.lng],
        14, // Zoom level
        {
          animate: true,
          duration: 1.5
        }
      );
    }
    
    // Reset animation effect after animation completes
    setTimeout(() => setAnimationEffect(null), 2000);
  };

  // Default map center (New York City - Avengers Tower)
  const defaultCenter = [40.7484, -73.9857];
  
  // Calculate map bounds to fit all mission markers
  const mapBounds = useMemo(() => {
    if (Object.keys(coordinates).length === 0) return null;
    
    const lats = Object.values(coordinates).map(coord => coord.lat);
    const lngs = Object.values(coordinates).map(coord => coord.lng);
    
    if (lats.length === 0 || lngs.length === 0) return null;
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    // Add padding to ensure all markers are visible
    const padding = lats.length === 1 ? 0.1 : 0.5; // More padding if multiple markers
    
    return [
      [minLat - padding, minLng - padding], // Southwest corner
      [maxLat + padding, maxLng + padding]  // Northeast corner
    ];
  }, [coordinates]);
  
  // Log mission data for debugging
  useEffect(() => {
    // console.log('Missions data:', missions);
    // console.log('Coordinates data:', coordinates);
    // console.log('Number of missions:', missions.length);
    // console.log('Number of coordinates:', Object.keys(coordinates).length);
  }, [missions, coordinates]);

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden">
      {/* Avenger-themed animation overlays */}
      {animationEffect && (
        <div className={`absolute inset-0 z-20 pointer-events-none ${animationEffect}-effect`}>
          {animationEffect === 'ironman' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/repulsor.svg" alt="Iron Man Repulsor" className="w-full h-full object-contain" />
            </div>
          )}
          {animationEffect === 'drstrange' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/portal.svg" alt="Doctor Strange Portal" className="w-full h-full object-contain" />
            </div>
          )}
          {animationEffect === 'thor' && (
            <div className="lightning-overlay active"></div>
          )}
          {animationEffect === 'scarletwitch' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/chaos-magic.svg" alt="Scarlet Witch Chaos Magic" className="w-full h-full object-contain" />
            </div>
          )}
          {animationEffect === 'spiderman' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/web.svg" alt="Spider-Man Web" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      )}
      
      {/* Leaflet Map */}
      <MapContainer 
        center={defaultCenter} 
        zoom={Object.keys(coordinates).length > 0 ? 10 : 3} 
        bounds={mapBounds}
        boundsOptions={{ padding: [50, 50] }}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <MapController 
          selectedMission={selectedMission} 
          setSelectedMission={setSelectedMission} 
          coordinates={coordinates}
        />
        
        {/* Mission Markers */}
        {missions.map(mission => {
          const missionCoords = coordinates[mission.id];
          
          // Skip missions without coordinates or location
          if (!missionCoords && !mission.location) {
            // console.log(`Mission ${mission.id} has no coordinates or location`);
            return null;
          }
          
          // If we don't have coordinates yet but have a location, show a placeholder
          if (!missionCoords && mission.location) {
            // console.log(`Mission ${mission.id} has location but no coordinates yet`);
            return null; // Skip for now until coordinates are loaded
          }
          
          // console.log(`Rendering marker for mission ${mission.id} at:`, missionCoords);
          
          return (
            <Marker
              key={mission.id}
              position={[missionCoords.lat, missionCoords.lng]}
              icon={createAvengerIcon(mission.priority, mission.hero)}
              eventHandlers={{
                click: () => {
                  // console.log(`Clicked on mission: ${mission.title}`);
                  triggerAnimationEffect({
                    ...mission,
                    coordinates: missionCoords
                  });
                  // Navigate to mission detail page after a short delay to allow animation to play
                  setTimeout(() => {
                    navigate(`/mission/${mission.id}`);
                  }, 1000);
                },
                mouseover: (e) => {
                  // Show custom tooltip on hover with enhanced styling
                  const marker = e.target;
                  const tooltipContent = `
                    <div class="mission-hover-tooltip">
                      <div class="tooltip-header ${mission.priority?.toLowerCase()}">
                        <h3>${mission.title}</h3>
                        <span class="tooltip-priority ${mission.priority?.toLowerCase()}">${mission.priority}</span>
                      </div>
                      <div class="tooltip-content">
                        <p><strong>Location:</strong> ${mission.location}</p>
                        <p><strong>Hero:</strong> ${mission.hero}</p>
                        <p><strong>Threat Level:</strong> ${mission.threat}</p>
                      </div>
                    </div>
                  `;
                  marker.bindTooltip(tooltipContent, {
                    direction: 'top',
                    offset: [0, -30],
                    className: 'mission-tooltip',
                    opacity: 1.0,
                    permanent: false,
                    interactive: true
                  }).openTooltip();
                },
                mouseout: (e) => {
                  // Close tooltip on mouseout
                  const marker = e.target;
                  if (marker._tooltip) {
                    marker.closeTooltip();
                  }
                }
              }}
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
                    {mission.description && (
                      <div className="mission-description">
                        <p><strong>Details:</strong></p>
                        <p className="description-text">{mission.description.length > 100 ? `${mission.description.substring(0, 100)}...` : mission.description}</p>
                      </div>
                    )}
                    <div className="mission-popup-actions">
                      <button
                        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm backdrop-blur-sm shadow-lg"
                        onClick={() => {
                          setSelectedMission(mission);
                          triggerAnimationEffect({
                            ...mission,
                            coordinates: missionCoords
                          });
                          // Navigate to mission detail page after a short delay to allow animation to play
                          setTimeout(() => {
                            navigate(`/mission/${mission.id}`);
                          }, 1000);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View Mission
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map styling is now in MissionMap.css */}
    </div>
  );
}

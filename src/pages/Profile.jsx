import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { AvengerContext } from '../context/AvengerContext';
import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';
import { animated } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn } from '../utils/animations';
import { getUserData } from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userData, loading: authLoading } = useAuth();
  const { missions, loading: missionsLoading } = useContext(AvengerContext);
  const [userMissions, setUserMissions] = useState([]);
  const [activeMissions, setActiveMissions] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Animation hooks
  const [headerRef, headerProps] = useScaleIn(200);
  const [statsRef, statsProps] = useFadeIn(400);
  const [heroesRef, heroesProps] = useSlideIn('left', 600);
  const [missionsRef, missionsProps] = useSlideIn('right', 800);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
    
    const loadUserData = async () => {
      if (currentUser && userData) {
        // Get user's selected heroes
        setSelectedHeroes(userData.selectedHeroes || []);
        
        // Filter missions for this user
        if (missions && missions.length > 0) {
          const userMissions = missions.filter(mission => {
            // Check if any of the user's selected heroes is assigned to this mission
            if (userData.selectedHeroes && userData.selectedHeroes.length > 0) {
              return userData.selectedHeroes.some(hero => hero.id === mission.heroId);
            }
            return false;
          });
          
          setUserMissions(userMissions);
          
          // Separate active and completed missions (for demo purposes, we'll consider missions with date in the future as active)
          const now = new Date();
          const active = userMissions.filter(mission => {
            const missionDate = new Date(mission.date);
            return missionDate >= now;
          });
          
          const completed = userMissions.filter(mission => {
            const missionDate = new Date(mission.date);
            return missionDate < now;
          });
          
          setActiveMissions(active);
          setCompletedMissions(completed);
        }
        
        setLoading(false);
      }
    };
    
    if (!authLoading && !missionsLoading) {
      loadUserData();
    }
  }, [currentUser, userData, missions, authLoading, missionsLoading, navigate]);
  
  // Calculate mission statistics
  const getMissionStats = () => {
    const totalMissions = userMissions.length;
    const highPriority = userMissions.filter(m => m.priority === 'High').length;
    const mediumPriority = userMissions.filter(m => m.priority === 'Medium').length;
    const lowPriority = userMissions.filter(m => m.priority === 'Low').length;
    
    return { totalMissions, highPriority, mediumPriority, lowPriority };
  };
  
  const stats = getMissionStats();
  
  if (loading || authLoading || missionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Profile Data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <animated.div ref={headerRef} style={headerProps} className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-red-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <i className="ri-shield-check-fill text-white text-xs"></i>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {currentUser?.displayName || 'Agent'}
          </h1>
          <p className="text-gray-300">{currentUser?.email}</p>
          <div className="mt-2 inline-block px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full text-blue-300 text-sm">
            <i className="ri-shield-star-line mr-1"></i>
            S.H.I.E.L.D. Agent
          </div>
        </animated.div>
        
        {/* Stats */}
        <animated.div ref={statsRef} style={statsProps} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-white mb-2">{stats.totalMissions}</div>
            <div className="text-gray-400 text-sm">Total Missions</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-red-500 mb-2">{stats.highPriority}</div>
            <div className="text-gray-400 text-sm">High Priority</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">{stats.mediumPriority}</div>
            <div className="text-gray-400 text-sm">Medium Priority</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl font-bold text-green-500 mb-2">{stats.lowPriority}</div>
            <div className="text-gray-400 text-sm">Low Priority</div>
          </div>
        </animated.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selected Heroes */}
          <animated.div ref={heroesRef} style={heroesProps} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <i className="ri-team-fill text-red-500 mr-2"></i>
              Your Heroes
            </h2>
            
            {selectedHeroes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-search-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-400">You haven't selected any heroes yet</p>
                <button 
                  onClick={() => navigate('/heroes')} 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Select Heroes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedHeroes.map((hero) => (
                  <div key={hero.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-center hover:bg-slate-700 transition-colors">
                    <div 
                      className="w-12 h-12 rounded-full bg-cover bg-center mr-4 border-2 border-red-500"
                      style={{ backgroundImage: `url(${hero.image1})` }}
                    ></div>
                    <div>
                      <h3 className="text-white font-bold">{hero.name}</h3>
                      <p className="text-gray-400 text-sm">{hero.alias}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        {userMissions.filter(m => m.heroId === hero.id).length} missions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </animated.div>
          
          {/* Active Missions */}
          <animated.div ref={missionsRef} style={missionsProps} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <i className="ri-rocket-fill text-red-500 mr-2"></i>
              Active Missions
            </h2>
            
            {activeMissions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-calendar-todo-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-400">No active missions</p>
                <button 
                  onClick={() => navigate('/')} 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Create Mission
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {activeMissions.map((mission) => {
                  // Find the hero for this mission
                  const hero = selectedHeroes.find(h => h.id === mission.heroId);
                  
                  return (
                    <div key={mission.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-bold">{mission.title}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          mission.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                          mission.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {mission.priority} Priority
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <i className="ri-map-pin-line mr-1"></i>
                        {mission.location}
                        <span className="mx-2">•</span>
                        <i className="ri-calendar-line mr-1"></i>
                        {mission.date}
                      </div>
                      <div className="flex items-center mt-2">
                        {hero && (
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full bg-cover bg-center mr-2 border border-red-500"
                              style={{ backgroundImage: `url(${hero.image1})` }}
                            ></div>
                            <span className="text-sm text-blue-300">{hero.name}</span>
                          </div>
                        )}
                        <button 
                          onClick={() => navigate('/missions')} 
                          className="ml-auto text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </animated.div>
        </div>
        
        {/* Completed Missions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <i className="ri-check-double-line text-green-500 mr-2"></i>
            Completed Missions
          </h2>
          
          {completedMissions.length === 0 ? (
            <div className="text-center py-8 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-history-line text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-400">No completed missions yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedMissions.map((mission) => {
                // Find the hero for this mission
                const hero = selectedHeroes.find(h => h.id === mission.heroId);
                
                return (
                  <div key={mission.id} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold">{mission.title}</h3>
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <i className="ri-map-pin-line mr-1"></i>
                      {mission.location}
                      <span className="mx-2">•</span>
                      <i className="ri-calendar-line mr-1"></i>
                      {mission.date}
                    </div>
                    {hero && (
                      <div className="flex items-center mt-2">
                        <div 
                          className="w-6 h-6 rounded-full bg-cover bg-center mr-2 border border-green-500"
                          style={{ backgroundImage: `url(${hero.image1})` }}
                        ></div>
                        <span className="text-sm text-green-300">{hero.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
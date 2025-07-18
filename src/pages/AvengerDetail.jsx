import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvengerById, getMissionsByHeroId } from '../services/firebaseService';
import Navbar from '../components/Navbar';
import ParticleBackground from '../components/ParticleBackground';
import { animated, useSpring, useTrail, config } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn, useFloat, useTypingEffect } from '../utils/animations';

const AvengerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avenger, setAvenger] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Animation hooks
  const [headerRef, headerProps] = useScaleIn(200);
  const [infoRef, infoProps] = useFadeIn(400);
  const [statsRef, statsProps] = useSlideIn('left', 600);
  const [missionsRef, missionsProps] = useSlideIn('right', 800);
  
  // Floating animation for hero image
  const floatProps = useFloat(3000, 15);
  
  // Typing effect for quote
  const { typedText: quote, isComplete: quoteComplete } = useTypingEffect(
    avenger?.quote || "", 
    1000, 
    20
  );
  
  // Trail animation for abilities and equipment
  const abilities = avenger?.detailedInfo?.abilities || [];
  const equipment = avenger?.detailedInfo?.equipment || [];
  
  const abilitiesTrail = useTrail(abilities.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.gentle,
    delay: 800,
  });
  
  const equipmentTrail = useTrail(equipment.length, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.gentle,
    delay: 1000,
  });
  
  // Background gradient based on hero
  const getHeroGradient = (id) => {
    const gradients = {
      spiderman: 'from-red-900 via-blue-900 to-red-800',
      ironman: 'from-red-900 via-yellow-800 to-red-800',
      thor: 'from-blue-900 via-indigo-800 to-blue-700',
      doctorstrange: 'from-purple-900 via-indigo-900 to-blue-800',
      scarletwitch: 'from-red-900 via-purple-900 to-red-800',
      // Default fallback
      default: 'from-slate-900 via-blue-900 to-slate-800'
    };
    
    return gradients[id] || gradients.default;
  };
  
  // Hero-specific particle configuration
  const getHeroParticleConfig = (id) => {
    const configs = {
      spiderman: { color: '#ff0000', shape: 'circle', speed: 2 },
      ironman: { color: '#ffcc00', shape: 'circle', speed: 3 },
      thor: { color: '#3366ff', shape: 'circle', speed: 4 },
      doctorstrange: { color: '#9900cc', shape: 'circle', speed: 2 },
      scarletwitch: { color: '#cc0066', shape: 'circle', speed: 1 },
      // Default fallback
      default: { color: '#ffffff', shape: 'circle', speed: 2 }
    };
    
    return configs[id] || configs.default;
  };
  
  useEffect(() => {
    const fetchAvengerData = async () => {
      try {
        setLoading(true);
        
        // Fetch avenger details
        const avengerData = await getAvengerById(id);
        if (avengerData) {
          setAvenger(avengerData);
          
          // Fetch missions for this avenger
          const avengerMissions = await getMissionsByHeroId(id);
          setMissions(avengerMissions);
        } else {
          // Handle case where avenger is not found
          console.error('Avenger not found');
          // Could redirect to error page here
        }
      } catch (error) {
        console.error('Error fetching avenger data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchAvengerData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${getHeroGradient(id)} relative overflow-hidden flex items-center justify-center`}>
        <ParticleBackground config={getHeroParticleConfig(id)} />
        <Navbar />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Avenger Data...</p>
        </div>
      </div>
    );
  }
  
  if (!avenger) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="text-center max-w-md mx-auto p-8 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <i className="ri-error-warning-line text-red-500 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Avenger Not Found</h2>
          <p className="text-gray-300 mb-6">The hero you're looking for doesn't exist in our database or may have been snapped away.</p>
          <button 
            onClick={() => navigate('/heroes')} 
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Return to Hero Selection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-b ${getHeroGradient(avenger.id)} relative overflow-hidden`}>
      <ParticleBackground config={getHeroParticleConfig(avenger.id)} />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <animated.div ref={headerRef} style={headerProps} className="relative mb-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {avenger.name}
              </h1>
              <h2 className="text-2xl text-gray-300 mb-4">{avenger.alias}</h2>
              
              {/* Animated quote */}
              <div className="relative bg-slate-800/30 backdrop-blur-sm border-l-4 border-red-500 pl-4 py-3 my-6 max-w-md">
                <p className="text-gray-200 italic">"{quote}<span className={quoteComplete ? 'opacity-0' : 'opacity-100'}>|</span>"</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-red-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('abilities')} 
                  className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'abilities' ? 'bg-red-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'}`}
                >
                  Abilities
                </button>
                <button 
                  onClick={() => setActiveTab('missions')} 
                  className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'missions' ? 'bg-red-600 text-white' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'}`}
                >
                  Missions
                </button>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <animated.div style={floatProps} className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-red-500 shadow-2xl shadow-red-500/20">
                  <img 
                    src={avenger.image1} 
                    alt={avenger.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
                  <span className="text-red-500 font-bold">{avenger.basicInfo.powers}</span>
                </div>
              </animated.div>
            </div>
          </div>
        </animated.div>
        
        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <animated.div ref={infoRef} style={infoProps} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Basic Info Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="ri-user-fill text-red-500 mr-2"></i>
                Basic Info
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-sm">Real Name</h4>
                  <p className="text-white font-medium">{avenger.basicInfo.realName}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Powers</h4>
                  <p className="text-white font-medium">{avenger.basicInfo.powers}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Location</h4>
                  <p className="text-white font-medium">{avenger.basicInfo.location}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Affiliation</h4>
                  <p className="text-white font-medium">{avenger.detailedInfo.affiliation}</p>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm">Status</h4>
                  <p className="text-white font-medium">{avenger.detailedInfo.status}</p>
                </div>
              </div>
            </div>
            
            {/* Biography Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <i className="ri-book-fill text-red-500 mr-2"></i>
                Biography
              </h3>
              <p className="text-gray-300 leading-relaxed">{avenger.detailedInfo.biography}</p>
              
              {/* Image Gallery */}
              <div className="mt-8">
                <h4 className="text-xl font-bold text-white mb-4">Gallery</h4>
                <div className="grid grid-cols-3 gap-4">
                  <img 
                    src={avenger.image1} 
                    alt={`${avenger.name} 1`} 
                    className="w-full h-32 object-cover rounded-lg border border-slate-700 hover:border-red-500 transition-colors cursor-pointer"
                  />
                  <img 
                    src={avenger.image2} 
                    alt={`${avenger.name} 2`} 
                    className="w-full h-32 object-cover rounded-lg border border-slate-700 hover:border-red-500 transition-colors cursor-pointer"
                  />
                  <img 
                    src={avenger.image3} 
                    alt={`${avenger.name} 3`} 
                    className="w-full h-32 object-cover rounded-lg border border-slate-700 hover:border-red-500 transition-colors cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </animated.div>
        )}
        
        {activeTab === 'abilities' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Abilities Card */}
            <animated.div ref={statsRef} style={statsProps} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="ri-flashlight-fill text-red-500 mr-2"></i>
                Abilities
              </h3>
              <ul className="space-y-4">
                {abilitiesTrail.map((style, index) => (
                  <animated.li 
                    key={index} 
                    style={style}
                    className="flex items-center bg-slate-700/30 p-3 rounded-lg border border-slate-600"
                  >
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-red-400 font-bold">{index + 1}</span>
                    </div>
                    <span className="text-white">{abilities[index]}</span>
                  </animated.li>
                ))}
              </ul>
            </animated.div>
            
            {/* Equipment Card */}
            <animated.div ref={missionsRef} style={missionsProps} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="ri-tools-fill text-red-500 mr-2"></i>
                Equipment
              </h3>
              <ul className="space-y-4">
                {equipmentTrail.map((style, index) => (
                  <animated.li 
                    key={index} 
                    style={style}
                    className="flex items-center bg-slate-700/30 p-3 rounded-lg border border-slate-600"
                  >
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-shield-check-fill text-blue-400"></i>
                    </div>
                    <span className="text-white">{equipment[index]}</span>
                  </animated.li>
                ))}
              </ul>
            </animated.div>
          </div>
        )}
        
        {activeTab === 'missions' && (
          <animated.div ref={missionsRef} style={missionsProps} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 shadow-xl mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <i className="ri-rocket-fill text-red-500 mr-2"></i>
              {avenger.name}'s Missions
            </h3>
            
            {missions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-calendar-todo-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-400 mb-4">No missions assigned to {avenger.name} yet</p>
                <button 
                  onClick={() => navigate('/missions')} 
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Create Mission
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {missions.map((mission) => (
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
                    <p className="text-gray-300 text-sm mb-3">{mission.description}</p>
                    <button 
                      onClick={() => navigate('/missions')} 
                      className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </animated.div>
        )}
        
        {/* Back Button */}
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/profile')} 
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors inline-flex items-center"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvengerDetail;
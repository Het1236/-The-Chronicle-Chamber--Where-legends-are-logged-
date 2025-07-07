import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MissionForm from '../components/MissionForm';
import MissionCard from '../components/MissionCard';
import MissionMap from '../components/MissionMap';
import Header from '../components/Header';

export default function Home() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [selectedAvenger, setSelectedAvenger] = useState(null);

  useEffect(() => {
    const storedAvenger = localStorage.getItem('selectedAvenger');
    if (storedAvenger) {
      setSelectedAvenger(JSON.parse(storedAvenger));
    } else {
      navigate('/heroes');
    }

    const storedMissions = localStorage.getItem('missions');
    if (storedMissions) {
      setMissions(JSON.parse(storedMissions));
    }
  }, [navigate]);

  const handleMissionSubmit = (mission) => {
    const updatedMissions = [...missions, mission];
    setMissions(updatedMissions);
    localStorage.setItem('missions', JSON.stringify(updatedMissions));
  };

  const handleChangeHero = () => {
    localStorage.removeItem('selectedAvenger');
    navigate('/heroes');
  };

  if (!selectedAvenger) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800">
      <Header selectedAvenger={selectedAvenger} onChangeHero={handleChangeHero} />

      {/* Hero Section */}
      <div className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('${selectedAvenger.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
        
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-8">
            <div 
              className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded-full border-4 border-red-500 shadow-2xl"
              style={{ backgroundImage: `url('${selectedAvenger.image}')` }}
            />
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {selectedAvenger.name}
              </h1>
              <p className="text-xl text-red-400 italic mb-4">"{selectedAvenger.quote}"</p>
              <p className="text-gray-300 mb-6">
                Continue your heroic journey as {selectedAvenger.alias}. Log your missions and track your progress.
              </p>
              
              <button
                onClick={handleChangeHero}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <i className="ri-user-line"></i>
                Change Hero
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Form */}
      <div className="py-16">
        <MissionForm onSubmit={handleMissionSubmit} selectedAvenger={selectedAvenger} />
      </div>

      {/* Mission Cards */}
      {missions.length > 0 && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Mission History</h2>
              <p className="text-gray-300">Your completed missions as {selectedAvenger.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} heroImage={selectedAvenger.image} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission Map */}
      {missions.length > 0 && (
        <div className="py-16">
          <MissionMap missions={missions} />
        </div>
      )}
    </div>
  );
}
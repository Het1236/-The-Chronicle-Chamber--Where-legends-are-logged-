import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avengerImg from '../assets/Avengers.jpg'

export default function HeroSelection() {
    const navigate = useNavigate()
  const [hoveredHero, setHoveredHero] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

  const avengers = [
    {
      id: 'spiderman',
      name: 'Spider-Man',
      alias: 'Peter Parker',
      image: 'https://readdy.ai/api/search-image?query=Spider-Man%20in%20iconic%20red%20and%20blue%20suit%2C%20dynamic%20pose%2C%20ultra%20high%20definition%2C%20photorealistic%2C%20dramatic%20lighting%2C%20detailed%20texture%20of%20suit%2C%20web%20pattern%20visible%2C%20muscular%20athletic%20build%2C%20against%20New%20York%20City%20backdrop%2C%20cinematic%20quality&width=400&height=400&seq=10&orientation=squarish',
      quote: "With great power comes great responsibility.",
      basicInfo: {
        realName: 'Peter Parker',
        powers: 'Spider Powers',
        location: 'New York City'
      },
      detailedInfo: {
        biography: 'Bitten by a radioactive spider, Peter Parker gained incredible powers and uses them to protect New York City.',
        abilities: ['Wall-crawling', 'Spider-sense', 'Super strength', 'Web-slinging', 'Enhanced agility'],
        equipment: ['Web-shooters', 'Spider-suit', 'Various gadgets'],
        affiliation: 'Avengers, Daily Bugle',
        status: 'Active Hero'
      }
    },
    {
      id: 'ironman',
      name: 'Iron Man',
      alias: 'Tony Stark',
      image: 'https://readdy.ai/api/search-image?query=Iron%20Man%20in%20sleek%20red%20and%20gold%20armor%2C%20ultra%20high%20definition%2C%20photorealistic%2C%20dramatic%20lighting%2C%20arc%20reactor%20glowing%20in%20center%2C%20detailed%20metal%20texture%2C%20heroic%20pose%2C%20technological%20background%2C%20cinematic%20quality%2C%20Mark%2085%20suit&width=400&height=400&seq=11&orientation=squarish',
      quote: "I am Iron Man.",
      basicInfo: {
        realName: 'Tony Stark',
        powers: 'Powered Armor',
        location: 'Malibu, California'
      },
      detailedInfo: {
        biography: 'Genius billionaire inventor who created the Iron Man armor to become one of the world\'s greatest heroes.',
        abilities: ['Genius intellect', 'Master engineer', 'Strategic planning', 'Leadership'],
        equipment: ['Iron Man suits', 'Arc reactor', 'FRIDAY AI', 'Stark Industries tech'],
        affiliation: 'Avengers, Stark Industries',
        status: 'Active Hero'
      }
    },
    {
      id: 'thor',
      name: 'Thor',
      alias: 'God of Thunder',
      image: 'https://readdy.ai/api/search-image?query=Thor%20with%20Stormbreaker%20axe%2C%20long%20blonde%20hair%2C%20red%20cape%20flowing%2C%20ultra%20high%20definition%2C%20photorealistic%2C%20dramatic%20lighting%2C%20Norse%20armor%20details%2C%20electricity%20crackling%20around%20him%2C%20muscular%20build%2C%20cosmic%20background%2C%20cinematic%20quality&width=400&height=400&seq=12&orientation=squarish',
      quote: "I am Thor, God of Thunder!",
      basicInfo: {
        realName: 'Thor Odinson',
        powers: 'Asgardian God',
        location: 'Asgard/Earth'
      },
      detailedInfo: {
        biography: 'The God of Thunder from Asgard, wielding the enchanted hammer Mjolnir to protect both Earth and the Nine Realms.',
        abilities: ['Weather control', 'Superhuman strength', 'Flight', 'Immortality', 'Combat mastery'],
        equipment: ['Mjolnir', 'Stormbreaker', 'Asgardian armor'],
        affiliation: 'Avengers, Asgard',
        status: 'Active Hero'
      }
    },
    {
      id: 'doctorstrange',
      name: 'Doctor Strange',
      alias: 'Stephen Strange',
      image: 'https://readdy.ai/api/search-image?query=Doctor%20Strange%20with%20Cloak%20of%20Levitation%2C%20mystical%20hand%20gestures%20with%20orange%20energy%2C%20ultra%20high%20definition%2C%20photorealistic%2C%20dramatic%20lighting%2C%20detailed%20Eye%20of%20Agamotto%20amulet%2C%20facial%20hair%20perfectly%20groomed%2C%20magical%20symbols%20floating%20around%2C%20cosmic%20background%2C%20cinematic%20quality&width=400&height=400&seq=13&orientation=squarish',
      quote: "The bill comes due. Always.",
      basicInfo: {
        realName: 'Stephen Strange',
        powers: 'Master of Mystic Arts',
        location: 'Sanctum Sanctorum'
      },
      detailedInfo: {
        biography: 'Former neurosurgeon turned Master of the Mystic Arts, protecting Earth from mystical and interdimensional threats.',
        abilities: ['Magic mastery', 'Time manipulation', 'Astral projection', 'Portal creation', 'Reality alteration'],
        equipment: ['Cloak of Levitation', 'Eye of Agamotto', 'Sling Ring'],
        affiliation: 'Avengers, Masters of the Mystic Arts',
        status: 'Active Hero'
      }
    },
    {
      id: 'scarletwitch',
      name: 'Scarlet Witch',
      alias: 'Wanda Maximoff',
      image: 'https://readdy.ai/api/search-image?query=Scarlet%20Witch%20with%20red%20energy%20powers%20emanating%20from%20hands%2C%20flowing%20red%20outfit%20with%20headpiece%2C%20ultra%20high%20definition%2C%20photorealistic%2C%20dramatic%20lighting%2C%20intense%20facial%20expression%2C%20detailed%20costume%20texture%2C%20mystical%20background%20with%20red%20energy%20effects%2C%20cinematic%20quality&width=400&height=400&seq=14&orientation=squarish',
      quote: "You took everything from me.",
      basicInfo: {
        realName: 'Wanda Maximoff',
        powers: 'Chaos Magic',
        location: 'Westview/Mobile'
      },
      detailedInfo: {
        biography: 'Powerful sorceress with reality-altering abilities, using chaos magic to protect those she loves.',
        abilities: ['Chaos magic', 'Reality manipulation', 'Telekinesis', 'Mind control', 'Energy projection'],
        equipment: ['Darkhold knowledge', 'Mystical artifacts'],
        affiliation: 'Avengers, X-Men',
        status: 'Active Hero'
      }
    }
  ];

const handleHeroSelect = (hero) => {
  setSelectedHero(hero);
  localStorage.setItem('selectedAvenger', JSON.stringify(hero));
  // In your actual implementation, you would navigate to home page
  // For now, we'll just show a selection confirmation
   navigate('/', { state: { selectedHero: hero } });
  alert(`Selected ${hero.name}! In your app, this would navigate to the home page.`);
};

  const handleNavigation = (page) => {
    // In your actual implementation, you would use React Router navigation
    alert(`Navigating to ${page}. In your app, this would use React Router.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-red-500">Avengers</span>{' '}
              <span className="text-gray-400">Mission</span>{' '}
              <span className="text-blue-400">Log</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <button 
              className="text-red-400 font-medium px-3 py-2 cursor-pointer whitespace-nowrap"
              onClick={() => handleNavigation('Choose Hero')}
            >
              Choose Hero
            </button>
            <button 
              className="text-white hover:text-blue-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors"
              onClick={() => handleNavigation('Home')}
            >
              Home
            </button>
            <button 
              className="text-white hover:text-green-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors"
              onClick={() => handleNavigation('Mission Log')}
            >
              Mission Log
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative h-80 flex items-center justify-center px-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${avengerImg})`
        }}
      >
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">Choose Your Avenger</h1>
          <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
            Select a hero to view their mission logs and continue their heroic journey.
          </p>
        </div>
      </div>

      {/* Available Heroes Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Available Heroes</h2>
            <p className="text-gray-300">Click on any hero to access their mission dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {avengers.map((hero) => (
              <div
                key={hero.id}
                className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredHero(hero.id)}
                onMouseLeave={() => setHoveredHero(null)}
                onClick={() => handleHeroSelect(hero)}
              >
                <div className="relative">
                  <div className="w-48 h-48 mx-auto mb-4 relative">
                    <div 
                      className="w-full h-full rounded-full bg-cover bg-center bg-no-repeat border-4 border-slate-600 group-hover:border-red-500 transition-all duration-300 shadow-2xl"
                      style={{ backgroundImage: `url('${hero.image}')` }}
                    >
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                        hoveredHero === hero.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                          <div className="bg-black/50 rounded-lg px-3 py-1 backdrop-blur-sm">
                            <p className="text-white text-sm font-medium">Click to Select</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`absolute inset-0 rounded-full border-4 border-red-500 transition-all duration-300 ${
                      hoveredHero === hero.id ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
                    }`} />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{hero.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{hero.alias}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{hero.basicInfo.powers}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Save the World?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Choose your hero identity and start documenting your heroic missions to protect humanity.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Log Missions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Track Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>View Map</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
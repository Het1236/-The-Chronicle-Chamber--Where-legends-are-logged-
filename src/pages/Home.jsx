import { useContext, useEffect, useState } from "react";
import { AvengerContext } from "../context/AvengerContext";
import Navbar from "../components/Navbar";
import MissionForm from "../components/MissionForm";
import MissionCard from "../components/MissionCard";
import MissionMap from "../components/MissionMap";
import { useNavigate } from "react-router-dom";
import { animated } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn, useBounce } from '../utils/animations';
import ParticleBackground from "../components/ParticleBackground";

export default function Home() {
  const navigate = useNavigate();
  const { selectedAvenger, missions } = useContext(AvengerContext);
  // Animation hooks
  const [heroProfileRef, heroProfileProps] = useScaleIn(200);
  const [welcomeTextRef, welcomeTextProps] = useSlideIn('right', 400);
  const [formRef, formProps] = useFadeIn(600);
  const [mapRef, mapProps] = useFadeIn(800);
  const [statsRef, statsProps] = useScaleIn(1000);
  if (!selectedAvenger) return null;
  const heroMissions = missions.filter((m) => m.heroId === selectedAvenger.id);

  const handleChangeHero = () => {
    navigate('/heroes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_0%,transparent_70%)] pointer-events-none"></div>
      <ParticleBackground/>
      <Navbar />
      <div className="relative py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity duration-1000"
          style={{
            backgroundImage: selectedAvenger?.image2 ? `url(${selectedAvenger.image2})` : 'none',
            backgroundColor: 'rgb(30, 41, 59)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-8">
         
          <div className="flex items-center gap-8">
            <animated.div
              ref={heroProfileRef}
              // style={heroProfileProps}
              className="w-32 h-32 bg-cover bg-center bg-no-repeat rounded-full border-4 border-red-500 shadow-2xl hover:scale-110 transition-transform duration-300"
              style={{
                ...heroProfileProps,
                backgroundImage: selectedAvenger?.image1 ? `url(${selectedAvenger.image1})` : 'none',
                backgroundColor: 'rgb(30, 41, 59)'
              }}
            ></animated.div>
            <animated.div
              ref={welcomeTextRef}
              style={welcomeTextProps}
              className="flex-1"
            >
              <h1 className="text-4xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                Welcome back, {selectedAvenger.name}!
              </h1>
              <p className="text-xl text-red-400 italic mb-4">{selectedAvenger.quote}</p>
              <p className="text-gray-300 mb-6">
                Continue your heroic journey as {selectedAvenger.basicInfo.realName}. Log your
                missions and track your progress.
              </p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
                onClick={handleChangeHero}
              >
                <i className="ri-user-line"></i>Change Hero
              </button>
            </animated.div>
          </div>
        </div>
      </div>

      <animated.div
        ref={formRef}
        style={formProps}
        className="max-w-7xl mx-auto px-8 py-8"
      >
        <MissionForm />
           <div class="text-center mb-12 my-5"><h2 class="text-3xl font-bold text-white mb-4">Mission History</h2><p class="text-gray-300">Your completed missions as {selectedAvenger.name}</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {heroMissions.map((mission, index) => (
            <animated.div
              key={mission.id}
              // style={useScaleIn(200 * (index + 1))[1]}
            >
              <MissionCard mission={mission} />
            </animated.div>
          ))}
        </div>
      </animated.div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <animated.div
            ref={mapRef}
            style={mapProps}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
              Mission Map
            </h2>
            <p className="text-gray-300">Track all Avenger missions across the city</p>
          </animated.div>
          <animated.div
            style={mapProps}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-red-500/30 transition-colors duration-300"
          >
            <MissionMap missions={heroMissions} />
            <animated.div
              ref={statsRef}
              style={statsProps}
              className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors cursor-pointer group">
                <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                  {heroMissions.length}
                </div>
                <div className="text-sm text-gray-400">Total Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors cursor-pointer group">
                <div className="text-2xl font-bold text-green-400 group-hover:scale-110 transition-transform">
                  {heroMissions.filter((m) => m.priority === "Low").length}
                </div>
                <div className="text-sm text-gray-400">Easy Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors cursor-pointer group">
                <div className="text-2xl font-bold text-yellow-400 group-hover:scale-110 transition-transform">
                  {heroMissions.filter((m) => m.priority === "Medium").length}
                </div>
                <div className="text-sm text-gray-400">Advanced Missions</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center hover:bg-slate-600/50 transition-colors cursor-pointer group">
                <div className="text-2xl font-bold text-red-400 group-hover:scale-110 transition-transform">
                  {heroMissions.filter((m) => m.priority === "High").length}
                </div>
                <div className="text-sm text-gray-400">Expert Missions</div>
              </div>
            </animated.div>
          </animated.div>
        </div>
      </div>
    </div>
  );
}

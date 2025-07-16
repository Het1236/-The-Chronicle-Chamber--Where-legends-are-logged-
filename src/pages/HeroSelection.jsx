import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AvengerContext } from "../context/AvengerContext";
import { useAuth } from "../context/AuthContext";
import { getAvengers } from "../services/firebaseService";
import { updateUserSelectedHeroes } from "../services/authService";
import { animated, useSpring } from "@react-spring/web";
import { useFadeIn, useScaleIn, useSlideIn } from "../utils/animations";
import ParticleBackground from "../components/ParticleBackground";
import avengerImg from "../assets/Avengers.jpg";
import spidermanImg from "../assets/Spidy3.jpeg";
import spidermanImg2 from "../assets/Spidy4.jpg";
import spidermanImg3 from "../assets/Spidy2.jpg";
import thorImg from "../assets/Thor3.jpg";
import thorImg2 from "../assets/Thor4.jpg";
import thorImg3 from "../assets/Thor2.jpg";
import drStrangeImg from "../assets/DrStrange2.jpg";
import drStrangeImg2 from "../assets/DrStrange4.jpg";
import drStrangeImg3 from "../assets/DrStrange3.jpg";
import wandImg from "../assets/Wanda3.jpg";
import wandImg2 from "../assets/Wanda4.jpg";
import wandImg3 from "../assets/Wanda2.jpg";
import ironManImg3 from "../assets/IronMan3.jpg";
import ironManImg2 from "../assets/IronMan6.jpg";
import ironManImg from "../assets/IronMan2.jpg";
import Navbar from "../components/Navbar";
import { useTrail, useSprings, config } from "@react-spring/web";

export default function HeroSelection() {
  const navigate = useNavigate();
  const { selectAvenger } = useContext(AvengerContext);
  const { currentUser } = useAuth();
  const [hoveredHero, setHoveredHero] = useState(null);
  const [avengers, setAvengers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch avengers from Firebase
  useEffect(() => {
    const fetchAvengers = async () => {
      try {
        setLoading(true);
        const avengersList = await getAvengers();
        if (avengersList.length > 0) {
          setAvengers(avengersList);
        } else {
          // Fallback to hardcoded avengers if Firebase fetch fails
          console.log('No avengers found in Firestore, using fallback data');
          setAvengers(fallbackAvengers);
        }
      } catch (error) {
        console.error('Error fetching avengers:', error);
        setAvengers(fallbackAvengers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvengers();
  }, []);

  // Animation hooks
  const [heroSectionRef, heroSectionProps] = useFadeIn(200);
  const [gridRef, gridProps] = useScaleIn(400);
  const [ctaRef, ctaProps] = useSlideIn("bottom", 600);

  // Fallback avengers data in case Firebase fetch fails
  const fallbackAvengers = [
    {
      id: "spiderman",
      name: "Spider-Man",
      alias: "Peter Parker",
      image1: `${spidermanImg}`,
      image2: `${spidermanImg2}`,
      image3: `${spidermanImg3}`,
      quote: "With great power comes great responsibility.",
      basicInfo: {
        realName: "Peter Parker",
        powers: "Spider Powers",
        location: "New York City",
      },
      detailedInfo: {
        biography:
          "Bitten by a radioactive spider, Peter Parker gained incredible powers and uses them to protect New York City.",
        abilities: [
          "Wall-crawling",
          "Spider-sense",
          "Super strength",
          "Web-slinging",
          "Enhanced agility",
        ],
        equipment: ["Web-shooters", "Spider-suit", "Various gadgets"],
        affiliation: "Avengers, Daily Bugle",
        status: "Active Hero",
      },
    },
    {
      id: "ironman",
      name: "Iron Man",
      alias: "Tony Stark",
      image1: `${ironManImg}`,
      image2: `${ironManImg2}`,
      image3: `${ironManImg3}`,
      quote: "I am Iron Man.",
      basicInfo: {
        realName: "Tony Stark",
        powers: "Powered Armor",
        location: "Malibu, California",
      },
      detailedInfo: {
        biography:
          "Genius billionaire inventor who created the Iron Man armor to become one of the world's greatest heroes.",
        abilities: [
          "Genius intellect",
          "Master engineer",
          "Strategic planning",
          "Leadership",
        ],
        equipment: [
          "Iron Man suits",
          "Arc reactor",
          "FRIDAY AI",
          "Stark Industries tech",
        ],
        affiliation: "Avengers, Stark Industries",
        status: "Active Hero",
      },
    },
    {
      id: "thor",
      name: "Thor",
      alias: "God of Thunder",
      image1: `${thorImg}`,
      image2: `${thorImg2}`,
      image3: `${thorImg3}`,
      quote: "I am Thor, God of Thunder!",
      basicInfo: {
        realName: "Thor Odinson",
        powers: "Asgardian God",
        location: "Asgard/Earth",
      },
      detailedInfo: {
        biography:
          "The God of Thunder from Asgard, wielding the enchanted hammer Mjolnir to protect both Earth and the Nine Realms.",
        abilities: [
          "Weather control",
          "Superhuman strength",
          "Flight",
          "Immortality",
          "Combat mastery",
        ],
        equipment: ["Mjolnir", "Stormbreaker", "Asgardian armor"],
        affiliation: "Avengers, Asgard",
        status: "Active Hero",
      },
    },
    {
      id: "doctorstrange",
      name: "Doctor Strange",
      alias: "Stephen Strange",
      image1: `${drStrangeImg}`,
      image2: `${drStrangeImg2}`,
      image3: `${drStrangeImg3}`,
      quote: "The bill comes due. Always.",
      basicInfo: {
        realName: "Stephen Strange",
        powers: "Master of Mystic Arts",
        location: "Sanctum Sanctorum",
      },
      detailedInfo: {
        biography:
          "Former neurosurgeon turned Master of the Mystic Arts, protecting Earth from mystical and interdimensional threats.",
        abilities: [
          "Magic mastery",
          "Time manipulation",
          "Astral projection",
          "Portal creation",
          "Reality alteration",
        ],
        equipment: ["Cloak of Levitation", "Eye of Agamotto", "Sling Ring"],
        affiliation: "Avengers, Masters of the Mystic Arts",
        status: "Active Hero",
      },
    },
    {
      id: "scarletwitch",
      name: "Scarlet Witch",
      alias: "Wanda Maximoff",
      image1: `${wandImg}`,
      image2: `${wandImg2}`,
      image3: `${wandImg3}`,
      quote: "You took everything from me.",
      basicInfo: {
        realName: "Wanda Maximoff",
        powers: "Chaos Magic",
        location: "Westview/Mobile",
      },
      detailedInfo: {
        biography:
          "Powerful sorceress with reality-altering abilities, using chaos magic to protect those she loves.",
        abilities: [
          "Chaos magic",
          "Reality manipulation",
          "Telekinesis",
          "Mind control",
          "Energy projection",
        ],
        equipment: ["Darkhold knowledge", "Mystical artifacts"],
        affiliation: "Avengers, X-Men",
        status: "Active Hero",
      },
    },
  ];
  const trail = useTrail(avengers.length, {
    from: { opacity: 0, transform: "scale(0.9)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { mass: 1, tension: 280, friction: 25 },
    delay: 200, // Initial delay
  });

  const handleHeroSelect = async (hero) => {
    console.log('Selecting hero:', hero.name);
    
    try {
      // First select the avenger in context
      await selectAvenger(hero);
      
      // If user is authenticated, update their selected heroes in Firebase
      if (currentUser && currentUser.uid) {
        console.log('Updating user selected heroes for:', currentUser.uid);
        await updateUserSelectedHeroes(currentUser.uid, hero);
      } else {
        console.warn('Cannot update user selected heroes: No authenticated user');
      }
      
      // Navigate to home page
      console.log('Navigating to home page');
      navigate("/");
    } catch (error) {
      console.error("Error in hero selection process:", error);
    }
  };

  // // Hero card hover animation
  // const getHeroSpring = (isHovered) =>
  //   useSpring({
  //     scale: isHovered ? 1.05 : 1,
  //     boxShadow: isHovered
  //       ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
  //       : "0 0 0 0 rgba(0, 0, 0, 0)",
  //     config: { tension: 300, friction: 20 },
  //   });

const [springs, api] = useSprings(avengers.length, index => ({
  scale: 1,
  boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
}));


useEffect(() => {
  api.start(index => {
    const isHovered = avengers[index]?.id === hoveredHero;
    return {
      scale: isHovered ? 1.05 : 1,
      boxShadow: isHovered
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
        : '0 0 0 0 rgba(0, 0, 0, 0)',
    };
  });
}, [hoveredHero, api, avengers]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <Navbar />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Avengers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <animated.div
        ref={heroSectionRef}
        // style={heroSectionProps}
        className="relative h-80 flex items-center justify-center px-8 bg-cover bg-center bg-no-repeat"
        style={{
          ...heroSectionProps,
          backgroundImage: avengerImg
            ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${avengerImg})`
            : "none",
          backgroundColor: "rgb(30, 41, 59)",
        }}
      >
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
            Choose Your Avenger
          </h1>
          <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
            Select a hero to view their mission logs and continue their heroic
            journey.
          </p>
        </div>
      </animated.div>

      {/* Available Heroes Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <animated.div
            ref={gridRef}
            style={gridProps}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Available Heroes
            </h2>
            <p className="text-gray-300">
              Click on any hero to access their mission dashboard
            </p>
          </animated.div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
            {trail.map((style, index) => {
              const hero = avengers[index];
              const isHovered = hoveredHero === hero.id;
              // const hoverSpring = getHeroSpring(isHovered);

              return (
                <animated.div
                  key={hero.id}
                  style={{ ...trail[index], ...springs[index] }}
                  className="group relative cursor-pointer w-full max-w-[250px]"
                  onMouseEnter={() => setHoveredHero(hero.id)}
                  onMouseLeave={() => setHoveredHero(null)}
                  onClick={() => handleHeroSelect(hero)}
                >
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700/50 transition-colors duration-300 border border-slate-600/30 hover:border-red-500/30 shadow-xl hover:shadow-red-500/10">
                    <div className="w-full aspect-square max-w-[12rem] mx-auto mb-4 relative">
                      <div
                        className="w-full h-full rounded-full bg-cover bg-center bg-no-repeat border-4 border-slate-600 group-hover:border-red-500 transition-all duration-300 shadow-2xl"
                        style={{
                          backgroundImage: hero.image1
                            ? `url(${hero.image1})`
                            : "none",
                          backgroundColor: "rgb(30, 41, 59)",
                        }}
                      >
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                            hoveredHero === hero.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        >
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                            <div className="bg-black/50 rounded-lg px-3 py-1 backdrop-blur-sm">
                              <p className="text-white text-sm font-medium">
                                Click to Select
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`absolute inset-0 rounded-full border-4 border-red-500 transition-all duration-300 ${
                          hoveredHero === hero.id
                            ? "scale-110 opacity-100"
                            : "scale-100 opacity-0"
                        }`}
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-1">
                        {hero.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-2 drop-shadow-lg">
                        {hero.alias}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="bg-red-500/20 p-1.5 rounded-lg">
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300">
                          {hero.basicInfo.powers}
                        </span>
                      </div>
                    </div>
                  </div>{" "}
                </animated.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <animated.div
        ref={ctaRef}
        style={ctaProps}
        className="py-16 bg-slate-800/30 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Save the World?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Choose your hero identity and start documenting your heroic missions
            to protect humanity.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Log Missions</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Track Progress</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>View Map</span>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
}

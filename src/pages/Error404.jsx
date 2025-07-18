import { useNavigate } from 'react-router-dom';
import { animated, useSpring, useTrail, config } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn, useFloat, useTypingEffect } from '../utils/animations';
import ParticleBackground from '../components/ParticleBackground';

const Error404 = () => {
  const navigate = useNavigate();
  
  // Animation hooks
  const [headerRef, headerProps] = useScaleIn(200);
  const [contentRef, contentProps] = useFadeIn(400);
  const [buttonRef, buttonProps] = useSlideIn('bottom', 600);
  
  // Floating animation for error icon
  const floatProps = useFloat(3000, 15);
  
  // Typing effect for error message
  const { typedText: errorMessage, isComplete } = useTypingEffect(
    "The page you're looking for has been snapped out of existence.", 
    1000, 
    30
  );
  
  // Trail animation for error codes
  const errorCodes = [
    { code: '404', text: 'Page Not Found' },
    { code: '616', text: 'Universe Not Found' },
    { code: '199999', text: 'MCU Error' },
  ];
  
  const trail = useTrail(errorCodes.length, {
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    config: config.gentle,
    delay: 800,
  });
  
  // Pulse animation for the main error code
  const pulseProps = useSpring({
    from: { scale: 1 },
    to: [{ scale: 1.1 }, { scale: 1 }],
    config: { duration: 1500 },
    loop: true,
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      <ParticleBackground config={{ color: '#ff0000', shape: 'circle', speed: 1 }} />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Error Header */}
          <animated.div ref={headerRef} style={headerProps} className="mb-8">
            <animated.div style={{ ...floatProps, ...pulseProps }} className="relative inline-block">
              <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-red-500 mb-4 drop-shadow-lg">
                404
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </animated.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Reality Stone Error
            </h1>
          </animated.div>
          
          {/* Error Content */}
          <animated.div ref={contentRef} style={contentProps} className="mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 shadow-xl shadow-red-500/10">
              <div className="mb-8">
                <p className="text-xl text-gray-200 mb-4">
                  {errorMessage}<span className={isComplete ? 'opacity-0' : 'opacity-100'}>|</span>
                </p>
                <p className="text-gray-400">
                  Try using the Time Stone to go back, or choose another path forward.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {trail.map((style, index) => (
                  <animated.div 
                    key={index} 
                    style={style}
                    className="bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-lg p-4 flex flex-col items-center"
                  >
                    <div className="text-2xl font-bold text-red-500 mb-2">{errorCodes[index].code}</div>
                    <div className="text-gray-300 text-sm">{errorCodes[index].text}</div>
                  </animated.div>
                ))}
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-white rounded-md transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Return Home
                </button>
              </div>
            </div>
          </animated.div>
          
          {/* Thanos Quote */}
          <animated.div ref={buttonRef} style={buttonProps} className="text-center">
            <div className="inline-block bg-slate-800/30 backdrop-blur-sm border-l-4 border-purple-500 pl-4 py-3 text-left">
              <p className="text-gray-300 italic">"Perfectly balanced, as all things should be."</p>
              <p className="text-purple-400 text-sm mt-1">— Thanos</p>
            </div>
          </animated.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      
      {/* Infinity Stones */}
      <div className="absolute top-10 right-10 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
      <div className="absolute top-20 right-16 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
      <div className="absolute top-16 right-24 w-2 h-2 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
      <div className="absolute top-24 right-20 w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 animate-pulse"></div>
      <div className="absolute top-28 right-12 w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse"></div>
      <div className="absolute top-10 right-28 w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
    </div>
  );
};

export default Error404;
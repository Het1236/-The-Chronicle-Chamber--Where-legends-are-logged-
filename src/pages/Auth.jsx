import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  registerWithEmailAndPassword, 
  loginWithEmailAndPassword, 
  signInWithGoogle, 
  signInWithFacebook 
} from '../services/authService';
import { animated, useSpring } from '@react-spring/web';
import { useFadeIn, useScaleIn, useSlideIn } from '../utils/animations';
import logoImg from '../assets/Logo.png';

const Auth = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Animation refs
  const [logoRef, logoProps] = useScaleIn(200);
  const [formRef, formProps] = useFadeIn(400);
  const [socialRef, socialProps] = useSlideIn('bottom', 600);
  
  // Particle animation
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/heroes');
    }
  }, [currentUser, navigate]);
  
  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = Math.floor(window.innerWidth * 0.05);
      
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: getRandomColor(),
        });
      }
    };
    
    const getRandomColor = () => {
      // Marvel-themed colors
      const colors = [
        'rgba(237, 29, 36, 0.7)',  // Red
        'rgba(0, 114, 188, 0.7)',   // Blue
        'rgba(255, 242, 0, 0.7)',   // Yellow
        'rgba(140, 0, 149, 0.7)',   // Purple
        'rgba(236, 28, 36, 0.7)',   // Red (slightly different)
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });
      
      // Draw connecting lines between nearby particles
      particlesRef.current.forEach((particle, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const particle2 = particlesRef.current[j];
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    resizeCanvas();
    createParticles();
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Form animations
  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    reset: true,
    delay: 200,
  });
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const { user, error } = await loginWithEmailAndPassword(email, password);
        if (error) {
          throw new Error(error.message || 'Failed to login');
        }
      } else {
        // Register
        if (!displayName) {
          throw new Error('Display name is required');
        }
        
        const { user, error } = await registerWithEmailAndPassword(email, password, displayName);
        if (error) {
          throw new Error(error.message || 'Failed to register');
        }
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          setIsLogin(true);
          setShowSuccessMessage(false);
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle social login
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        throw new Error(error.message || 'Failed to sign in with Google');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await signInWithFacebook();
      if (error) {
        throw new Error(error.message || 'Failed to sign in with Facebook');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  // Toggle between login and register
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
      {/* Particle background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
      
      {/* Logo animation */}
      <animated.div ref={logoRef} style={logoProps} className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="h-20 flex items-center justify-center transform hover:scale-105 transition-transform">
          <img src={logoImg} alt="The Chronicle Chamber Logo" className="h-full object-contain" />
        </div>
        <h1 className="text-center text-white text-2xl font-bold mt-4 tracking-wider">
          <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text font-serif">The Chronicle Chamber</span>
        </h1>
        <p className="text-center text-gray-300 text-sm italic">Secure your mission logs</p>
      </animated.div>
      
      {/* Auth form */}
      <animated.div ref={formRef} style={{...formProps, ...formAnimation}} className="bg-slate-800/80 backdrop-blur-md p-8 rounded-lg shadow-xl border border-slate-700 w-full max-w-md z-10 mt-20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLogin ? 'Login to Your Account' : 'Create New Account'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {showSuccessMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-2 rounded mb-4">
            Account created successfully! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={toggleForm}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <animated.div ref={socialRef} style={socialProps} className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
            >
              <i className="ri-google-fill text-lg mr-2"></i>
              Google
            </button>
            <button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-slate-600 rounded-md shadow-sm bg-slate-700 text-sm font-medium text-white hover:bg-slate-600 transition-colors"
            >
              <i className="ri-facebook-fill text-lg mr-2"></i>
              Facebook
            </button>
          </animated.div>
        </div>
      </animated.div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full text-gray-400 text-xs z-10">
        &copy; {new Date().getFullYear()} The Chronicle Chamber. All rights reserved.
      </div>
    </div>
  );
};

export default Auth;
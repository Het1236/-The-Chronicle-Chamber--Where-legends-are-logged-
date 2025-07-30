import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AvengerContext, AvengerProvider } from './context/AvengerContext';
import { AuthProvider, AuthContext} from './context/AuthContext';
import HeroSelection from './pages/HeroSelection';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AvengerDetail from './pages/AvengerDetail';
import MissionDetail from './pages/MissionDetail';
import Error404 from './pages/Error404';
import ParticleBackground from './components/ParticleBackground';
import IntroVideo from './components/IntroVideo';
import { initializeAvengersInFirestore } from './utils/initializeFirebase';

function PrivateRoute({ children }) {
  const avengerContext = useContext(AvengerContext);
  const authContext = useContext(AuthContext);
  
  const selectedAvenger = avengerContext?.selectedAvenger;
  const avengerLoading = avengerContext?.loading || false;
  const currentUser = authContext?.currentUser;
  const authLoading = authContext?.loading || false;
  
  // Remove these console logs
  // console.log('PrivateRoute:', { 
  //   authContext: !!authContext,
  //   currentUser: !!currentUser, 
  //   authLoading, 
  //   avengerContext: !!avengerContext,
  //   selectedAvenger: !!selectedAvenger, 
  //   avengerLoading 
  // });
  
  if (authLoading || avengerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        <ParticleBackground />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    // Remove this console log
    // console.log('PrivateRoute: No user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (!selectedAvenger && window.location.pathname !== '/heroes') {
    // Remove this console log
    // console.log('PrivateRoute: No selected avenger, redirecting to hero selection');
    return <Navigate to="/heroes" />;
  }
  
  return children;
}

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const { currentUser } = useContext(AuthContext);
  
  // Initialize Firebase data and migrate localStorage data
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Only initialize if user is authenticated
        if (currentUser) {
          // Initialize avengers collection in Firestore
          await initializeAvengersInFirestore();
          
          // Migrate existing localStorage data to Firestore
          // await migrateLocalStorageToFirestore();
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };
    
    initializeFirebase();
    
    // Check if the intro has been shown before in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, [currentUser]); // Add currentUser as dependency

  const handleVideoEnd = () => {
    setShowIntro(false);
    // Save to session storage so it doesn't show again during this session
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  if (showIntro) {
    return <IntroVideo onVideoEnd={handleVideoEnd} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/heroes" element={
          <PrivateRoute>
            <HeroSelection />
          </PrivateRoute>
        } />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/missions" element={
          <PrivateRoute>
            <Missions />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/avenger/:id" element={
          <PrivateRoute>
            <AvengerDetail />
          </PrivateRoute>
        } />
        <Route path="/mission/:id" element={
          <PrivateRoute>
            <MissionDetail />
          </PrivateRoute>
        } />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AvengerProvider>
        <AppContent />
      </AvengerProvider>
    </AuthProvider>
  );
}
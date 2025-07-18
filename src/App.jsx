import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AvengerContext, AvengerProvider } from './context/AvengerContext';
import { AuthProvider, AuthContext} from './context/AuthContext';
import HeroSelection from './pages/HeroSelection';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AvengerDetail from './pages/AvengerDetail';
import Error404 from './pages/Error404';
import ParticleBackground from './components/ParticleBackground';
import { initializeAvengersInFirestore, migrateLocalStorageToFirestore } from './utils/initializeFirebase';

function PrivateRoute({ children }) {
  const avengerContext = useContext(AvengerContext);
  const authContext = useContext(AuthContext);
  
  const selectedAvenger = avengerContext?.selectedAvenger;
  const avengerLoading = avengerContext?.loading || false;
  const currentUser = authContext?.currentUser;
  const authLoading = authContext?.loading || false;
  
  console.log('PrivateRoute:', { 
    authContext: !!authContext,
    currentUser: !!currentUser, 
    authLoading, 
    avengerContext: !!avengerContext,
    selectedAvenger: !!selectedAvenger, 
    avengerLoading 
  });
  
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
    console.log('PrivateRoute: No user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  if (!selectedAvenger && window.location.pathname !== '/heroes') {
    console.log('PrivateRoute: No selected avenger, redirecting to hero selection');
    return <Navigate to="/heroes" />;
  }
  
  return children;
}

function AppContent() {
  // Initialize Firebase data and migrate localStorage data
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize avengers collection in Firestore
        await initializeAvengersInFirestore();
        
        // Migrate existing localStorage data to Firestore
        await migrateLocalStorageToFirestore();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };
    
    initializeFirebase();
  }, []);

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
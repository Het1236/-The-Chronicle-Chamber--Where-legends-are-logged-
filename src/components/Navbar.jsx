import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AvengerContext } from '../context/AvengerContext';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import logoImg from '../assets/Logo.png';

export default function Navbar() {
  const { selectedAvenger } = useContext(AvengerContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 flex items-center justify-center transform hover:scale-105 transition-transform">
            <img src={logoImg} alt="The Chronicle Chamber Logo" className="h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-wide">
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-transparent bg-clip-text font-serif">The Chronicle Chamber</span>
            </h1>
            <p className="text-sm text-gray-400 italic tracking-wider font-light">Where legends are logged</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {selectedAvenger && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-600 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div
                className="w-6 h-6 bg-cover bg-center bg-no-repeat rounded-full border border-red-500 shadow-sm"
                style={{ backgroundImage: `url(${selectedAvenger.image1})` }}
              ></div>
              <span className="text-white text-sm font-medium">{selectedAvenger.name}</span>
            </div>
          )}
          <nav className="flex items-center gap-4">
            <button
              className="text-white hover:text-red-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors font-medium hover:bg-slate-800/50 rounded-lg"
              onClick={() => navigate('/heroes')}
            >
              Choose Hero
            </button>
            <Link
              className="text-white hover:text-blue-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors font-medium hover:bg-slate-800/50 rounded-lg"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-white hover:text-green-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors font-medium hover:bg-slate-800/50 rounded-lg"
              to="/missions"
            >
              Mission Log
            </Link>
            <Link
              className="text-white hover:text-purple-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors font-medium hover:bg-slate-800/50 rounded-lg flex items-center"
              to="/profile"
            >
              <i className="ri-user-3-line mr-1"></i>
              Profile
            </Link>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400 px-3 py-2 cursor-pointer whitespace-nowrap transition-colors font-medium hover:bg-slate-800/50 rounded-lg flex items-center"
              >
                <i className="ri-logout-box-line mr-1"></i>
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AvengerContext } from '../context/AvengerContext';

export default function Navbar() {
  const { selectedAvenger } = useContext(AvengerContext);
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 transform hover:scale-105 transition-transform">
            <i className="ri-shield-line text-white text-xl"></i>
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
          <nav className="flex items-center gap-6">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
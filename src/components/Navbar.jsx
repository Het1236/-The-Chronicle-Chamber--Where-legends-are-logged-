import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AvengerContext } from '../context/AvengerContext';

export default function Navbar() {
  const { selectedAvenger } = useContext(AvengerContext);
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <i className="ri-shield-line text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-red-500">Avengers</span>{" "}
            <span className="text-gray-400">Mission</span>{" "}
            <span className="text-blue-400">Log</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {selectedAvenger && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-600">
              <div
                className="w-6 h-6 bg-cover bg-center bg-no-repeat rounded-full border border-red-500"
                style={{ backgroundImage: `url(${selectedAvenger.image1})` }}
              ></div>
              <span className="text-white text-sm">{selectedAvenger.name}</span>
            </div>
          )}
          <nav className="flex items-center gap-6">
            <button
              className="text-white hover:text-red-400 px-3 py-2 cursor-pointer whitespace-nowrap"
              onClick={() => navigate('/heroes')}
            >
              Choose Hero
            </button>
            <Link
              className="text-white hover:text-blue-400 px-3 py-2 cursor-pointer whitespace-nowrap"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-white hover:text-green-400 px-3 py-2 cursor-pointer whitespace-nowrap"
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
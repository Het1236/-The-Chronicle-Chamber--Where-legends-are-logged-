import { Link, useLocation } from 'react-router-dom';

export default function Header({ selectedAvenger, onChangeHero }) {
  const location = useLocation();

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <i className="ri-shield-star-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "Pacifico, serif" }}>
              logo
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              to="/"
              className={`text-gray-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                location.pathname === '/' ? 'text-red-400' : ''
              }`}
            >
              <i className="ri-home-line"></i>
              Home
            </Link>
            
            <Link 
              to="/missions"
              className={`text-gray-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                location.pathname === '/missions' ? 'text-red-400' : ''
              }`}
            >
              <i className="ri-file-list-3-line"></i>
              Mission Log
            </Link>

            {selectedAvenger && (
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-700">
                <div 
                  className="w-8 h-8 bg-cover bg-center bg-no-repeat rounded-full border-2 border-red-500"
                  style={{ backgroundImage: `url('${selectedAvenger.image}')` }}
                />
                <span className="text-white font-medium">{selectedAvenger.name}</span>
                
                {onChangeHero && (
                  <button
                    onClick={onChangeHero}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Change
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
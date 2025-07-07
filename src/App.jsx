import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HeroSelection from './pages/HeroSelection';


function App() {
  return (
    //  <div className="bg-blue-500 text-white p-4 rounded-lg">
    //   <h1 className="text-2xl font-bold">Tailwind Test</h1>
    //   <p className="mt-2">If you can see blue background, Tailwind is working!</p>
    // </div>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/heroes" element={<HeroSelection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
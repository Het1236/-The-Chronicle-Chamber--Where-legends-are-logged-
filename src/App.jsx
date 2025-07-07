import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AvengerContext } from './context/AvengerContext';
import HeroSelection from './pages/HeroSelection';
import Home from './pages/Home';
import Missions from './pages/Missions';

function PrivateRoute({ children }) {
  const { selectedAvenger } = useContext(AvengerContext);
  return selectedAvenger ? children : <Navigate to="/heroes" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/heroes" element={<HeroSelection />} />
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
      </Routes>
    </Router>
  );
}
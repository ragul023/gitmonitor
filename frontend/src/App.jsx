
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import AppLayout from './Components/Layout/Applayout';


import './App.css';


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/*"
        element={<AppLayout />}
      />
    </Routes>
  );
}

export default App;
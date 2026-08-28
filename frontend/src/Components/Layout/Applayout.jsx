import Dashboard from '../../Pages/Dashboard/Dashboard';
import Repositories from "../../Pages/Repositories/Repositories"
import Events from "../../Pages/Events/Events"
import { useNavigate,Route,Routes } from 'react-router-dom';
// import AI from './Pages/AI/AI';

import Sidebar from "../../Components/Sidebar/Sidebar"
import Navbar from "../../Components/Navbar/Navbar"
import { useState } from 'react';


const AppLayout = () => {

  const navigate = useNavigate();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('github-monitor');

  const handleNavigate = (target) => {
    setMobileNavOpen(false);
    window.scrollTo(0, 0);
    navigate(`/${target}`);
  };

  return (
    <div className="app-layout">
      <Sidebar
        onNavigate={handleNavigate}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      <div className="app-main">
        <Navbar
          selectedRepo={selectedRepo}
          setSelectedRepo={setSelectedRepo}
          onMobileMenu={() => setMobileNavOpen(true)}
        />

        <main className="app-content">
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard onNavigate={handleNavigate} />}
            />

            <Route
              path="/events"
              element={<Events />}
            />

            <Route
              path="/repositories"
              element={<Repositories onNavigate={handleNavigate} />}
            />

            {/* <Route
              path="/ai"
              element={<AI />}
            /> */}

            <Route
              path="/settings"
              element={<Dashboard onNavigate={handleNavigate} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
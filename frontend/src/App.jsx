import { useState, useCallback } from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import Navbar from './Components/Navbar/Navbar';
import LandingPage from './Pages/LandingPage/LandingPage';
import Dashboard from './Pages/Dashboard/Dashboard';
import Events from './Pages/Events/Events';
import Repositories from './Pages/Repositories/Repositories';
import AI from './Pages/AI/AI';
import './App.css';

function App() {
  const [page, setPage] = useState('landing');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('github-monitor');

  const navigate = useCallback((target) => {
    setPage(target);
    setMobileNavOpen(false);
    window.scrollTo(0, 0);
  }, []);

  if (page === 'landing') {
    return <LandingPage onNavigate={navigate} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        onNavigate={navigate}
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
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'events' && <Events />}
          {page === 'repositories' && <Repositories onNavigate={navigate} />}
          {page === 'ai' && <AI />}
          {page === 'settings' && <Dashboard onNavigate={navigate} />}
        </main>
      </div>
    </div>
  );
}

export default App;

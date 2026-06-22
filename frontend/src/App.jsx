import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import SessionsPage from './pages/SessionsPage';
import SessionDetailsPage from './pages/SessionDetailsPage';
import HeatmapPage from './pages/HeatmapPage';
import './App.css';
import './ui/ui.css';

function Nav() {
  return (
    <nav className="ui-nav">
      <div className="ui-nav-left">
        <div className="ui-brand">
          <p className="ui-title">User Analytics Dashboard</p>
          <p className="ui-subtitle">Sessions, events, and click heatmaps</p>
        </div>
      </div>

      <div className="ui-tabs">
        <Link to="/" className="ui-tab">
          Sessions
        </Link>
        <Link to="/heatmap" className="ui-tab">
          Heatmap
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="ui-app">
        <Nav />
        <Routes>
          <Route path="/" element={<SessionsPage />} />
          <Route path="/sessions/:sessionId" element={<SessionDetailsPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;



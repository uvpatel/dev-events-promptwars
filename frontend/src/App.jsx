/**
 * App Root - Router setup with providers
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/layout/Navbar';
import ChatBot from './components/chat/ChatBot';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VenueMap from './pages/VenueMap';
import Planner from './pages/Planner';
import Admin from './pages/Admin';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen bg-dark-950 bg-noise">
            <Navbar />
            <main id="main-content" role="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<VenueMap />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
            <ChatBot />
          </div>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

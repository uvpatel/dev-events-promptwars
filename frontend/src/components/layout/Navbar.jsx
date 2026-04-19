/**
 * Navbar Component - Glassmorphism sticky top navigation
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Map, LayoutDashboard, Calendar, Shield, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Zap },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/map', label: 'Venue Map', icon: Map },
  { to: '/planner', label: 'Planner', icon: Calendar },
  { to: '/admin', label: 'Admin', icon: Shield },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, login, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
        style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="EventFlow AI Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display">
                <span className="gradient-text">Event</span>
                <span className="text-dark-100">Flow</span>
                <span className="text-primary-400 ml-1 text-sm">AI</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1" role="menubar">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(to)
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                      : 'text-dark-400 hover:text-dark-100 hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Auth / User */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-primary-400" />
                    )}
                    <span className="text-sm text-dark-200">{user?.displayName || 'User'}</span>
                    {user?.isDemo && <span className="text-[10px] text-primary-400 bg-primary-500/20 px-1.5 py-0.5 rounded">DEMO</span>}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="btn-gradient text-sm py-2 px-4"
                  aria-label="Sign in with Google"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-dark-300 hover:text-white hover:bg-white/[0.05] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/[0.06]"
              style={{ background: 'rgba(2, 6, 23, 0.95)' }}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(to)
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-dark-400 hover:text-dark-100 hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-white/[0.06]">
                  {isAuthenticated ? (
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => { login(); setMobileOpen(false); }}
                      className="btn-gradient w-full text-sm py-3"
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In with Google
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/[0.06]" style={{ background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center justify-around py-2">
          {navLinks.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                isActive(to) ? 'text-primary-400' : 'text-dark-500 hover:text-dark-300'
              }`}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

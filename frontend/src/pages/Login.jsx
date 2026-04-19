/**
 * Login Page - Google sign-in with animated background
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Zap, Shield, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="page-container flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">You're Signed In!</h2>
          <p className="text-dark-400 mb-6">Welcome back, {user?.displayName || 'User'}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-gradient w-full py-3">
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary-500/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass-card p-10 max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">
            Welcome to <span className="gradient-text">EventFlow AI</span>
          </h1>
          <p className="text-dark-400 text-sm">Sign in to access your personalized event experience</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-gray-800 font-semibold text-base hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 mb-4"
          aria-label="Sign in with Google"
        >
          <Chrome className="w-5 h-5" />
          Sign in with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-xs text-dark-500 bg-dark-900/80">or continue as</span>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full btn-ghost py-4 rounded-2xl text-base"
          aria-label="Continue as demo user"
        >
          <LogIn className="w-5 h-5" />
          Demo User
        </button>

        <p className="text-center text-xs text-dark-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

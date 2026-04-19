/**
 * Home Page - Hero section with animated gradient, features, and stats
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, Users, Clock, Brain, CalendarCheck, Navigation, LayoutDashboard, Shield,
  ArrowRight, Sparkles, Zap, Globe, Activity
} from 'lucide-react';

const features = [
  { icon: Map, title: 'Smart Venue Map', description: 'Interactive maps with custom markers for stages, booths, food stalls, and more.', color: 'from-violet-500 to-purple-600' },
  { icon: Users, title: 'Crowd Density', description: 'Real-time crowd visualization with green, yellow, and red density zones.', color: 'from-cyan-500 to-blue-600' },
  { icon: Clock, title: 'Queue Prediction', description: 'AI-estimated waiting times for food stalls, washrooms, and counters.', color: 'from-amber-500 to-orange-600' },
  { icon: Brain, title: 'AI Assistant', description: 'Ask anything about the event — powered by Google Gemini AI.', color: 'from-pink-500 to-rose-600' },
  { icon: CalendarCheck, title: 'Event Planner', description: 'Save sessions, bookmark booths, and set reminders for your schedule.', color: 'from-emerald-500 to-teal-600' },
  { icon: Navigation, title: 'Smart Navigation', description: 'Fastest route to any destination, automatically avoiding crowded areas.', color: 'from-indigo-500 to-violet-600' },
  { icon: LayoutDashboard, title: 'Live Dashboard', description: 'Upcoming sessions, crowd status, recommendations, and announcements.', color: 'from-sky-500 to-cyan-600' },
  { icon: Shield, title: 'Admin Panel', description: 'Create events, manage booths, update crowd data, and run sessions.', color: 'from-red-500 to-pink-600' },
];

const stats = [
  { value: '5,000+', label: 'Attendees', icon: Users },
  { value: '12', label: 'Sessions', icon: CalendarCheck },
  { value: '22', label: 'Booths & Stalls', icon: Map },
  { value: 'Real-time', label: 'Crowd Data', icon: Activity },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/20 bg-primary-500/10 text-primary-300 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by Google Gemini AI
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Navigate Events
            <br />
            <span className="gradient-text">Intelligently</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time crowd visualization, AI-powered navigation, and smart queue predictions.
            Make every conference, venue, and exhibition effortless.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/dashboard" className="btn-gradient text-base px-8 py-4 rounded-2xl">
              <Zap className="w-5 h-5" />
              Explore Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/map" className="btn-ghost text-base px-8 py-4 rounded-2xl">
              <Globe className="w-5 h-5" />
              View Venue Map
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/[0.04]" aria-label="Event Statistics">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold font-display gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24" aria-label="Features">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="section-title gradient-text inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Everything You Need
            </motion.h2>
            <p className="section-subtitle mt-3">Eight powerful features to transform your event experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="glass-card-hover p-6 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-dark-100 mb-2 font-display">{feature.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24" aria-label="Call to action">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            className="glass-card p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
            <Zap className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Ready to Experience TechConf 2026?</h2>
            <p className="text-dark-400 mb-8">Sign in to save your personalized schedule, get AI-powered recommendations, and navigate the venue effortlessly.</p>
            <Link to="/login" className="btn-gradient text-base px-8 py-4 rounded-2xl inline-flex">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-dark-400">EventFlow AI © 2026</span>
          </div>
          <div className="text-sm text-dark-500">Powered by Google Gemini • Firebase • Google Maps</div>
        </div>
      </footer>
    </div>
  );
}

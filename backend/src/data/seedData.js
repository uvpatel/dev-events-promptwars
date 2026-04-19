/**
 * EventFlow AI - Seed Data
 * Complete demo data for a tech conference venue
 */
const { v4: uuidv4 } = require('uuid');

// ─── Demo Event ───────────────────────────────────────────────
const demoEvent = {
  id: 'evt-techconf-2026',
  name: 'TechConf 2026',
  description: 'The premier technology conference bringing together innovators, developers, and industry leaders for two days of inspiration, learning, and networking.',
  date: '2026-04-20',
  endDate: '2026-04-21',
  venue: {
    name: 'Ahmedabad International Convention Centre',
    address: 'SG Highway, Ahmedabad, Gujarat 380054',
    lat: 23.0300,
    lng: 72.5170,
  },
  totalAttendees: 5000,
  announcements: [
    { id: 'ann-1', text: '🎉 Welcome to TechConf 2026! Check in at Gate A or Gate B.', timestamp: '2026-04-20T08:00:00Z', priority: 'high' },
    { id: 'ann-2', text: '🍔 Food Court opens at 11:00 AM. Try the special TechConf meal!', timestamp: '2026-04-20T10:45:00Z', priority: 'medium' },
    { id: 'ann-3', text: '🎤 Keynote by Dr. Sarah Chen starts in 30 minutes at Main Stage!', timestamp: '2026-04-20T08:30:00Z', priority: 'high' },
    { id: 'ann-4', text: '📱 Download the EventFlow AI app for real-time navigation.', timestamp: '2026-04-20T07:30:00Z', priority: 'low' },
    { id: 'ann-5', text: '🏆 Hackathon results will be announced at 5:00 PM on Stage 2.', timestamp: '2026-04-20T14:00:00Z', priority: 'medium' },
  ],
  createdBy: 'admin',
};

// ─── Venue Locations (Booths, Stalls, Facilities) ──────────────
const venueLocations = [
  // Stages
  { id: 'loc-stage-1', eventId: demoEvent.id, name: 'Main Stage', type: 'stage', description: 'The main keynote and featured talks stage. Capacity: 2000', location: { lat: 23.0305, lng: 72.5168 }, icon: '🎤', capacity: 2000 },
  { id: 'loc-stage-2', eventId: demoEvent.id, name: 'Stage 2 - Innovation', type: 'stage', description: 'Innovation track sessions and workshops. Capacity: 800', location: { lat: 23.0310, lng: 72.5175 }, icon: '🎤', capacity: 800 },
  { id: 'loc-stage-3', eventId: demoEvent.id, name: 'Stage 3 - Workshop', type: 'stage', description: 'Hands-on workshop stage. Capacity: 300', location: { lat: 23.0295, lng: 72.5180 }, icon: '🎤', capacity: 300 },

  // Booths
  { id: 'loc-booth-1', eventId: demoEvent.id, name: 'Google Cloud Booth', type: 'booth', description: 'Explore Google Cloud solutions, demos, and win cool swag!', location: { lat: 23.0302, lng: 72.5160 }, icon: '🏪', rating: 4.8 },
  { id: 'loc-booth-2', eventId: demoEvent.id, name: 'Microsoft Azure Booth', type: 'booth', description: 'Azure AI and cloud computing demos with live coding sessions.', location: { lat: 23.0298, lng: 72.5162 }, icon: '🏪', rating: 4.6 },
  { id: 'loc-booth-3', eventId: demoEvent.id, name: 'AWS Booth', type: 'booth', description: 'Amazon Web Services showcase with serverless demos.', location: { lat: 23.0306, lng: 72.5155 }, icon: '🏪', rating: 4.7 },
  { id: 'loc-booth-4', eventId: demoEvent.id, name: 'Startup Showcase', type: 'booth', description: 'Featured startups presenting innovative products.', location: { lat: 23.0312, lng: 72.5165 }, icon: '🏪', rating: 4.5 },
  { id: 'loc-booth-5', eventId: demoEvent.id, name: 'Open Source Village', type: 'booth', description: 'Community-driven open source projects and contributions.', location: { lat: 23.0308, lng: 72.5158 }, icon: '🏪', rating: 4.4 },
  { id: 'loc-booth-6', eventId: demoEvent.id, name: 'Career Fair', type: 'booth', description: 'Meet top tech companies hiring for exciting roles.', location: { lat: 23.0300, lng: 72.5152 }, icon: '🏪', rating: 4.3 },
  { id: 'loc-booth-7', eventId: demoEvent.id, name: 'AI & ML Lab', type: 'booth', description: 'Hands-on AI/ML experiements and model showcases.', location: { lat: 23.0315, lng: 72.5170 }, icon: '🏪', rating: 4.9 },
  { id: 'loc-booth-8', eventId: demoEvent.id, name: 'DevOps Corner', type: 'booth', description: 'CI/CD pipelines, Kubernetes, and infrastructure demos.', location: { lat: 23.0293, lng: 72.5172 }, icon: '🏪', rating: 4.2 },

  // Food Stalls
  { id: 'loc-food-1', eventId: demoEvent.id, name: 'Byte Burgers', type: 'food_stall', description: 'Gourmet burgers and fries. Veg & non-veg options available.', location: { lat: 23.0290, lng: 72.5165 }, icon: '🍔', rating: 4.5 },
  { id: 'loc-food-2', eventId: demoEvent.id, name: 'Code & Coffee', type: 'food_stall', description: 'Premium coffee, tea, and pastries. WiFi available!', location: { lat: 23.0288, lng: 72.5158 }, icon: '☕', rating: 4.7 },
  { id: 'loc-food-3', eventId: demoEvent.id, name: 'Pizza Protocol', type: 'food_stall', description: 'Fresh wood-fired pizzas with customizable toppings.', location: { lat: 23.0292, lng: 72.5155 }, icon: '🍕', rating: 4.4 },
  { id: 'loc-food-4', eventId: demoEvent.id, name: 'Desi Bites', type: 'food_stall', description: 'Authentic Indian street food and thali meals.', location: { lat: 23.0286, lng: 72.5162 }, icon: '🍛', rating: 4.6 },

  // Washrooms
  { id: 'loc-wash-1', eventId: demoEvent.id, name: 'Washroom Block A', type: 'washroom', description: 'Near Main Stage. Accessible facilities available.', location: { lat: 23.0303, lng: 72.5150 }, icon: '🚻' },
  { id: 'loc-wash-2', eventId: demoEvent.id, name: 'Washroom Block B', type: 'washroom', description: 'Near Food Court. Baby changing facilities available.', location: { lat: 23.0285, lng: 72.5170 }, icon: '🚻' },

  // Entry Gates
  { id: 'loc-gate-a', eventId: demoEvent.id, name: 'Gate A - Main Entrance', type: 'entry_gate', description: 'Main entrance from SG Highway. Registration desk located here.', location: { lat: 23.0280, lng: 72.5160 }, icon: '🚪' },
  { id: 'loc-gate-b', eventId: demoEvent.id, name: 'Gate B - East Entrance', type: 'entry_gate', description: 'East side entrance. Shuttle drop-off point.', location: { lat: 23.0300, lng: 72.5185 }, icon: '🚪' },

  // Exits
  { id: 'loc-exit-1', eventId: demoEvent.id, name: 'Exit 1 - West', type: 'exit', description: 'West exit to parking lot P1.', location: { lat: 23.0318, lng: 72.5148 }, icon: '🚶' },
  { id: 'loc-exit-2', eventId: demoEvent.id, name: 'Exit 2 - South', type: 'exit', description: 'South exit to parking lot P2 and taxi stand.', location: { lat: 23.0278, lng: 72.5175 }, icon: '🚶' },
];

// ─── Sessions ─────────────────────────────────────────────────
const sessions = [
  { id: 'ses-1', eventId: demoEvent.id, title: 'Opening Keynote: The Future of AI', speaker: 'Dr. Sarah Chen', speakerTitle: 'Chief AI Officer, Google DeepMind', stage: 'Main Stage', stageId: 'loc-stage-1', startTime: '2026-04-20T09:00:00Z', endTime: '2026-04-20T10:00:00Z', description: 'Explore how AI is reshaping technology and society in this decade.', tags: ['AI', 'Keynote'], capacity: 2000 },
  { id: 'ses-2', eventId: demoEvent.id, title: 'Building Scalable Cloud Architecture', speaker: 'Raj Patel', speakerTitle: 'VP Engineering, Flipkart', stage: 'Stage 2 - Innovation', stageId: 'loc-stage-2', startTime: '2026-04-20T09:00:00Z', endTime: '2026-04-20T10:00:00Z', description: 'Learn how to design systems that handle millions of requests.', tags: ['Cloud', 'Architecture'], capacity: 800 },
  { id: 'ses-3', eventId: demoEvent.id, title: 'React 20: What\'s New', speaker: 'Emily Zhang', speakerTitle: 'Staff Engineer, Meta', stage: 'Stage 3 - Workshop', stageId: 'loc-stage-3', startTime: '2026-04-20T09:30:00Z', endTime: '2026-04-20T10:30:00Z', description: 'Deep dive into the latest React features and best practices.', tags: ['React', 'Frontend'], capacity: 300 },
  { id: 'ses-4', eventId: demoEvent.id, title: 'Kubernetes in Production', speaker: 'Alex Kumar', speakerTitle: 'SRE Lead, Netflix', stage: 'Main Stage', stageId: 'loc-stage-1', startTime: '2026-04-20T10:30:00Z', endTime: '2026-04-20T11:30:00Z', description: 'Battle-tested strategies for running K8s at scale.', tags: ['DevOps', 'Kubernetes'], capacity: 2000 },
  { id: 'ses-5', eventId: demoEvent.id, title: 'Generative AI Workshop', speaker: 'Dr. Priya Sharma', speakerTitle: 'ML Research Lead, Google', stage: 'Stage 3 - Workshop', stageId: 'loc-stage-3', startTime: '2026-04-20T11:00:00Z', endTime: '2026-04-20T12:30:00Z', description: 'Hands-on: Build your own AI assistant using Gemini API.', tags: ['AI', 'Workshop', 'Gemini'], capacity: 300 },
  { id: 'ses-6', eventId: demoEvent.id, title: 'The State of Web Security', speaker: 'Marcus Johnson', speakerTitle: 'Security Architect, Cloudflare', stage: 'Stage 2 - Innovation', stageId: 'loc-stage-2', startTime: '2026-04-20T10:30:00Z', endTime: '2026-04-20T11:30:00Z', description: 'Latest threats and defense strategies for modern web applications.', tags: ['Security', 'Web'], capacity: 800 },
  { id: 'ses-7', eventId: demoEvent.id, title: 'Lunch Break & Networking', speaker: '', speakerTitle: '', stage: 'Food Court', stageId: 'loc-food-1', startTime: '2026-04-20T12:30:00Z', endTime: '2026-04-20T14:00:00Z', description: 'Enjoy lunch and connect with fellow attendees.', tags: ['Networking', 'Break'], capacity: 5000 },
  { id: 'ses-8', eventId: demoEvent.id, title: 'Startup Pitch Competition', speaker: 'Panel of Judges', speakerTitle: 'VCs & Industry Leaders', stage: 'Main Stage', stageId: 'loc-stage-1', startTime: '2026-04-20T14:00:00Z', endTime: '2026-04-20T15:30:00Z', description: 'Watch 10 startups pitch their ideas to top investors.', tags: ['Startup', 'Competition'], capacity: 2000 },
  { id: 'ses-9', eventId: demoEvent.id, title: 'Advanced TypeScript Patterns', speaker: 'Lena Kowalski', speakerTitle: 'Principal Engineer, Stripe', stage: 'Stage 2 - Innovation', stageId: 'loc-stage-2', startTime: '2026-04-20T14:00:00Z', endTime: '2026-04-20T15:00:00Z', description: 'Master advanced type-level programming in TypeScript.', tags: ['TypeScript', 'Advanced'], capacity: 800 },
  { id: 'ses-10', eventId: demoEvent.id, title: 'Building with Firebase', speaker: 'Anika Gupta', speakerTitle: 'Developer Advocate, Google', stage: 'Stage 3 - Workshop', stageId: 'loc-stage-3', startTime: '2026-04-20T14:30:00Z', endTime: '2026-04-20T16:00:00Z', description: 'Build and deploy a full-stack app with Firebase in 90 minutes.', tags: ['Firebase', 'Workshop'], capacity: 300 },
  { id: 'ses-11', eventId: demoEvent.id, title: 'Hackathon Results & Awards', speaker: 'Event Organizers', speakerTitle: '', stage: 'Stage 2 - Innovation', stageId: 'loc-stage-2', startTime: '2026-04-20T17:00:00Z', endTime: '2026-04-20T18:00:00Z', description: 'Announcement of hackathon winners and prize distribution.', tags: ['Hackathon', 'Awards'], capacity: 800 },
  { id: 'ses-12', eventId: demoEvent.id, title: 'Closing Keynote: Code for Good', speaker: 'James Williams', speakerTitle: 'CEO, Tech For Humanity', stage: 'Main Stage', stageId: 'loc-stage-1', startTime: '2026-04-20T18:00:00Z', endTime: '2026-04-20T19:00:00Z', description: 'How technology can solve the world\'s biggest challenges.', tags: ['Keynote', 'Social Impact'], capacity: 2000 },
];

// ─── Crowd Zones ──────────────────────────────────────────────
const crowdZones = [
  { id: 'zone-1', eventId: demoEvent.id, zoneName: 'Main Stage Area', density: 'high', percentage: 85, coordinates: { lat: 23.0305, lng: 72.5168, radius: 80 } },
  { id: 'zone-2', eventId: demoEvent.id, zoneName: 'Innovation Stage', density: 'medium', percentage: 55, coordinates: { lat: 23.0310, lng: 72.5175, radius: 60 } },
  { id: 'zone-3', eventId: demoEvent.id, zoneName: 'Workshop Stage', density: 'low', percentage: 30, coordinates: { lat: 23.0295, lng: 72.5180, radius: 50 } },
  { id: 'zone-4', eventId: demoEvent.id, zoneName: 'Exhibition Hall', density: 'high', percentage: 78, coordinates: { lat: 23.0302, lng: 72.5158, radius: 100 } },
  { id: 'zone-5', eventId: demoEvent.id, zoneName: 'Food Court', density: 'medium', percentage: 60, coordinates: { lat: 23.0289, lng: 72.5160, radius: 70 } },
  { id: 'zone-6', eventId: demoEvent.id, zoneName: 'Networking Lounge', density: 'low', percentage: 25, coordinates: { lat: 23.0315, lng: 72.5165, radius: 50 } },
  { id: 'zone-7', eventId: demoEvent.id, zoneName: 'Registration Area', density: 'medium', percentage: 45, coordinates: { lat: 23.0282, lng: 72.5160, radius: 60 } },
  { id: 'zone-8', eventId: demoEvent.id, zoneName: 'Gate A Entrance', density: 'high', percentage: 72, coordinates: { lat: 23.0280, lng: 72.5160, radius: 40 } },
  { id: 'zone-9', eventId: demoEvent.id, zoneName: 'Gate B Entrance', density: 'low', percentage: 20, coordinates: { lat: 23.0300, lng: 72.5185, radius: 40 } },
  { id: 'zone-10', eventId: demoEvent.id, zoneName: 'Parking Area', density: 'low', percentage: 15, coordinates: { lat: 23.0320, lng: 72.5148, radius: 90 } },
];

// ─── Queue Data ───────────────────────────────────────────────
const queueData = [
  { id: 'q-1', locationId: 'loc-food-1', name: 'Byte Burgers', currentWaitMinutes: 12, queueLength: 18, status: 'open' },
  { id: 'q-2', locationId: 'loc-food-2', name: 'Code & Coffee', currentWaitMinutes: 5, queueLength: 8, status: 'open' },
  { id: 'q-3', locationId: 'loc-food-3', name: 'Pizza Protocol', currentWaitMinutes: 22, queueLength: 30, status: 'open' },
  { id: 'q-4', locationId: 'loc-food-4', name: 'Desi Bites', currentWaitMinutes: 8, queueLength: 12, status: 'open' },
  { id: 'q-5', locationId: 'loc-wash-1', name: 'Washroom Block A', currentWaitMinutes: 3, queueLength: 5, status: 'open' },
  { id: 'q-6', locationId: 'loc-wash-2', name: 'Washroom Block B', currentWaitMinutes: 1, queueLength: 2, status: 'open' },
];

module.exports = {
  demoEvent,
  venueLocations,
  sessions,
  crowdZones,
  queueData,
};

/**
 * Gemini AI Service
 * Handles AI chat interactions with event context
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { demoEvent, venueLocations, sessions, queueData } = require('../data/seedData');
const { getCrowdDensity, getCrowdSummary } = require('./crowdSimulator');

let genAI = null;
let model = null;

/**
 * Initialize Gemini API
 */
function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key' || process.env.DEMO_MODE === 'true') {
    console.log('⚠️  Gemini API key not configured - using demo responses');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('✅ Gemini AI initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
    return false;
  }
}

/**
 * Build context string with current event data
 */
function buildEventContext() {
  const crowdData = getCrowdDensity();
  const summary = getCrowdSummary();

  const stalls = venueLocations.filter((l) => l.type === 'food_stall');
  const stages = venueLocations.filter((l) => l.type === 'stage');
  const booths = venueLocations.filter((l) => l.type === 'booth');
  const gates = venueLocations.filter((l) => l.type === 'entry_gate' || l.type === 'exit');

  return `
EVENT INFORMATION:
- Event: ${demoEvent.name}
- Date: ${demoEvent.date}
- Venue: ${demoEvent.venue.name}, ${demoEvent.venue.address}
- Total Attendees: ${demoEvent.totalAttendees}

STAGES:
${stages.map((s) => `- ${s.name}: ${s.description}`).join('\n')}

BOOTHS:
${booths.map((b) => `- ${b.name}: ${b.description} (Rating: ${b.rating || 'N/A'})`).join('\n')}

FOOD STALLS & QUEUE TIMES:
${stalls.map((s) => {
  const queue = queueData.find((q) => q.locationId === s.id);
  return `- ${s.name}: ${s.description} | Wait: ${queue ? queue.currentWaitMinutes + ' min' : 'Unknown'} | Queue: ${queue ? queue.queueLength + ' people' : 'Unknown'}`;
}).join('\n')}

GATES & EXITS:
${gates.map((g) => `- ${g.name}: ${g.description}`).join('\n')}

SESSIONS/SCHEDULE:
${sessions.map((s) => `- ${s.title} by ${s.speaker || 'TBA'} at ${s.stage} (${new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`).join('\n')}

CURRENT CROWD STATUS:
- Average Density: ${summary.averageDensity}%
- High Density Zones: ${summary.highDensityZones}
- Most Crowded: ${summary.mostCrowded.zoneName} (${summary.mostCrowded.percentage}%)
- Least Crowded: ${summary.leastCrowded.zoneName} (${summary.leastCrowded.percentage}%)

ZONE DETAILS:
${crowdData.map((z) => `- ${z.zoneName}: ${z.density} (${z.percentage}%)`).join('\n')}

ANNOUNCEMENTS:
${demoEvent.announcements.map((a) => `- ${a.text}`).join('\n')}
  `.trim();
}

/**
 * System prompt for the AI assistant
 */
const SYSTEM_PROMPT = `You are EventFlow AI Assistant, a helpful and friendly guide for TechConf 2026. Your role is to help attendees navigate the event, find locations, check schedules, avoid crowds, and have the best possible experience.

GUIDELINES:
- Be concise but helpful (2-4 sentences max per response)
- Use emojis sparingly for friendliness
- When giving directions, reference landmarks (stages, food court, gates)
- Always consider current crowd density when suggesting routes or areas
- Recommend less crowded alternatives when asked about busy areas
- For queue times, always mention the shortest option
- Be proactive about safety (suggest exits, washrooms, water)
- If you don't know something, say so honestly

You have access to real-time event data provided in the context below.`;

/**
 * Generate AI response for user message
 */
async function generateResponse(userMessage, conversationHistory = []) {
  const context = buildEventContext();

  // If Gemini is not available, use demo responses
  if (!model) {
    return generateDemoResponse(userMessage);
  }

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\n\nCURRENT EVENT DATA:\n${context}\n\nUser: ${userMessage}`;

    const chat = model.startChat({
      history: conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(fullPrompt);
    const response = result.response.text();

    return { text: response, source: 'gemini' };
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return generateDemoResponse(userMessage);
  }
}

/**
 * Demo response generator when Gemini API is not available
 */
function generateDemoResponse(message) {
  const msg = message.toLowerCase();
  const summary = getCrowdSummary();
  const crowdData = getCrowdDensity();

  // Stage/location queries
  if (msg.includes('stage 1') || msg.includes('main stage')) {
    return { text: '🎤 The Main Stage is located at the center of the venue. It\'s currently hosting keynote and featured talks. Current crowd density is ' + (crowdData.find(z => z.zoneName === 'Main Stage Area')?.density || 'medium') + '. Head straight from Gate A!', source: 'demo' };
  }
  if (msg.includes('stage 2') || msg.includes('innovation')) {
    return { text: '💡 Stage 2 (Innovation Stage) is to the northeast of the venue, near the AI & ML Lab booth. Take a right from the Main Stage area.', source: 'demo' };
  }
  if (msg.includes('stage 3') || msg.includes('workshop')) {
    return { text: '🔧 Stage 3 (Workshop Stage) is on the east side of the venue. It\'s currently the least crowded stage - great time to attend!', source: 'demo' };
  }

  // Crowd queries
  if (msg.includes('crowd') || msg.includes('busy') || msg.includes('packed')) {
    return { text: `📊 Current crowd status: Average density is ${summary.averageDensity}%. Most crowded: ${summary.mostCrowded.zoneName} (${summary.mostCrowded.percentage}%). I'd recommend heading to ${summary.leastCrowded.zoneName} which is only at ${summary.leastCrowded.percentage}%.`, source: 'demo' };
  }

  // Food/queue queries
  if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry') || msg.includes('queue') || msg.includes('wait')) {
    const shortestQueue = queueData.filter(q => q.locationId.startsWith('loc-food')).sort((a, b) => a.currentWaitMinutes - b.currentWaitMinutes)[0];
    return { text: `🍽️ The shortest queue right now is at ${shortestQueue.name} with only a ${shortestQueue.currentWaitMinutes}-minute wait! We have 4 food stalls: Byte Burgers, Code & Coffee, Pizza Protocol, and Desi Bites.`, source: 'demo' };
  }

  // Session/schedule queries
  if (msg.includes('next') || msg.includes('session') || msg.includes('schedule') || msg.includes('what\'s on')) {
    return { text: '📅 Coming up: "Opening Keynote: The Future of AI" by Dr. Sarah Chen at the Main Stage (9:00 AM), "Building Scalable Cloud Architecture" by Raj Patel at Stage 2 (9:00 AM), and "React 20: What\'s New" workshop at Stage 3 (9:30 AM).', source: 'demo' };
  }

  // Gate/navigation queries
  if (msg.includes('gate') || msg.includes('entrance') || msg.includes('exit') || msg.includes('reach') || msg.includes('how do i get')) {
    return { text: '🚪 There are 2 entry gates: Gate A (Main Entrance, from SG Highway) and Gate B (East Entrance, shuttle drop-off). Exit 1 is on the west side (to Parking P1) and Exit 2 is on the south side (to Parking P2 & taxi stand).', source: 'demo' };
  }

  // Washroom queries
  if (msg.includes('washroom') || msg.includes('bathroom') || msg.includes('toilet') || msg.includes('restroom')) {
    const washQueues = queueData.filter(q => q.locationId.startsWith('loc-wash'));
    const bestWash = washQueues.sort((a, b) => a.currentWaitMinutes - b.currentWaitMinutes)[0];
    return { text: `🚻 There are 2 washroom blocks. ${bestWash.name} has the shortest wait at ${bestWash.currentWaitMinutes} minutes. Block A is near the Main Stage, and Block B is near the Food Court.`, source: 'demo' };
  }

  // Booth queries
  if (msg.includes('booth') || msg.includes('exhibit') || msg.includes('stall')) {
    return { text: '🏪 We have 8 exhibition booths! Top rated: AI & ML Lab (4.9⭐), Google Cloud (4.8⭐), and AWS Booth (4.7⭐). The Exhibition Hall area is currently at ' + (crowdData.find(z => z.zoneName === 'Exhibition Hall')?.percentage || 65) + '% capacity.', source: 'demo' };
  }

  // Help/greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.includes('hey')) {
    return { text: '👋 Welcome to TechConf 2026! I\'m your AI assistant. I can help you with:\n• Finding stages, booths, and facilities\n• Checking crowd density and queue times\n• Viewing the session schedule\n• Navigation and directions\n\nWhat would you like to know?', source: 'demo' };
  }

  // Default fallback
  return { text: `I'm here to help you navigate TechConf 2026! 🎯 You can ask me about:\n• Stage & booth locations\n• Session schedules\n• Crowd density & queue times\n• Directions & navigation\n• Food options & facilities`, source: 'demo' };
}

module.exports = {
  initGemini,
  generateResponse,
};

/**
 * EventFlow AI - Server Entry Point
 */
require('dotenv').config();

const app = require('./src/app');
const { initFirebase } = require('./src/services/firestore');
const { initGemini } = require('./src/services/gemini');

const PORT = process.env.PORT || 8080;

// Initialize services
console.log('🚀 Starting EventFlow AI Backend...');
console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📌 Demo Mode: ${process.env.DEMO_MODE || 'true'}`);

initFirebase();
initGemini();

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ EventFlow AI Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});

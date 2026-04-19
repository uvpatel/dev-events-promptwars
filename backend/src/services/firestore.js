/**
 * Firebase Firestore Service
 * Handles database operations with demo mode fallback
 */
const admin = require('firebase-admin');

let db = null;
let isDemo = true;

// In-memory store for demo mode
const demoStore = {
  user_plans: {},
};

/**
 * Initialize Firebase Admin SDK
 */
function initFirebase() {
  if (process.env.DEMO_MODE === 'true' || !process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID === 'your-project-id') {
    console.log('⚠️  Running in demo mode - using in-memory data store');
    isDemo = true;
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    db = admin.firestore();
    isDemo = false;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase init failed:', error.message);
    isDemo = true;
  }
}

/**
 * Verify Firebase ID token
 */
async function verifyToken(token) {
  if (isDemo) {
    // Demo mode: accept any token-like string
    return {
      uid: 'demo-user-001',
      email: 'demo@eventflow.ai',
      name: 'Demo User',
      picture: '',
      role: token === 'admin-token' ? 'admin' : 'user',
    };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}

/**
 * Get user's saved plan data
 */
async function getUserPlan(userId) {
  if (isDemo) {
    return demoStore.user_plans[userId] || {
      userId,
      savedSessions: [],
      bookmarkedBooths: [],
      reminders: [],
    };
  }

  const doc = await db.collection('user_plans').doc(userId).get();
  if (!doc.exists) {
    return { userId, savedSessions: [], bookmarkedBooths: [], reminders: [] };
  }
  return { id: doc.id, ...doc.data() };
}

/**
 * Save session to user's plan
 */
async function saveToUserPlan(userId, type, itemId) {
  if (isDemo) {
    if (!demoStore.user_plans[userId]) {
      demoStore.user_plans[userId] = {
        userId,
        savedSessions: [],
        bookmarkedBooths: [],
        reminders: [],
      };
    }

    const plan = demoStore.user_plans[userId];
    if (type === 'session' && !plan.savedSessions.includes(itemId)) {
      plan.savedSessions.push(itemId);
    } else if (type === 'booth' && !plan.bookmarkedBooths.includes(itemId)) {
      plan.bookmarkedBooths.push(itemId);
    }

    return plan;
  }

  const ref = db.collection('user_plans').doc(userId);
  const field = type === 'session' ? 'savedSessions' : 'bookmarkedBooths';

  await ref.set(
    { [field]: admin.firestore.FieldValue.arrayUnion(itemId) },
    { merge: true }
  );

  return getUserPlan(userId);
}

/**
 * Remove item from user's plan
 */
async function removeFromUserPlan(userId, type, itemId) {
  if (isDemo) {
    const plan = demoStore.user_plans[userId];
    if (!plan) return { userId, savedSessions: [], bookmarkedBooths: [], reminders: [] };

    if (type === 'session') {
      plan.savedSessions = plan.savedSessions.filter((id) => id !== itemId);
    } else if (type === 'booth') {
      plan.bookmarkedBooths = plan.bookmarkedBooths.filter((id) => id !== itemId);
    }

    return plan;
  }

  const ref = db.collection('user_plans').doc(userId);
  const field = type === 'session' ? 'savedSessions' : 'bookmarkedBooths';

  await ref.update({
    [field]: admin.firestore.FieldValue.arrayRemove(itemId),
  });

  return getUserPlan(userId);
}

module.exports = {
  initFirebase,
  verifyToken,
  getUserPlan,
  saveToUserPlan,
  removeFromUserPlan,
  isDemoMode: () => isDemo,
};

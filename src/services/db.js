import {
  getDb,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  COLLECTIONS,
  firebaseConfig
} from './firebase';

const STORAGE_KEY_APPS = 'scrs_hiring_applications_v4';
const STORAGE_KEY_UPCOMING_EVENTS = 'scrs_upcoming_events_v1';
const STORAGE_KEY_EVENT_REGS = 'scrs_event_registrations_v1';
const STORAGE_KEY_PAST_EVENTS = 'scrs_past_events_v1';
const STORAGE_KEY_TEAM = 'scrs_team_coordinators_v1';

// All data is retrieved directly from Cloud Firestore - no hardcoded demo or sample data
export const INITIAL_DEMO_APPLICATIONS = [];
export const INITIAL_UPCOMING_EVENTS = [];
export const INITIAL_PAST_EVENTS = [];
export const INITIAL_TEAM_MEMBERS = [];

// Clean legacy sample items from browser localStorage cache
export function purgeLegacySampleData() {
  try {
    const rawEvents = localStorage.getItem(STORAGE_KEY_UPCOMING_EVENTS);
    if (rawEvents) {
      const parsed = JSON.parse(rawEvents);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(e => e.id !== 'evt-1' && e.id !== 'evt-2');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY_UPCOMING_EVENTS, JSON.stringify(cleaned));
        }
      }
    }

    const rawApps = localStorage.getItem(STORAGE_KEY_APPS);
    if (rawApps) {
      const parsed = JSON.parse(rawApps);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(a => !a.id?.startsWith('demo-app-'));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(cleaned));
        }
      }
    }

    const rawPast = localStorage.getItem(STORAGE_KEY_PAST_EVENTS);
    if (rawPast) {
      const parsed = JSON.parse(rawPast);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(p => p.id !== 'past-evt-1' && p.id !== 'past-evt-2' && p.id !== 'past-1' && p.id !== 'past-2');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY_PAST_EVENTS, JSON.stringify(cleaned));
        }
      }
    }

    const rawTeam = localStorage.getItem(STORAGE_KEY_TEAM);
    if (rawTeam) {
      const parsed = JSON.parse(rawTeam);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(t => !t.id?.startsWith('demo-team-'));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(cleaned));
        }
      }
    }
  } catch (err) {
    console.warn('Purge legacy sample data notice:', err);
  }
}

// ============================================================================
// HELPER METHODS
// ============================================================================

export function getLocalApplications() {
  const data = localStorage.getItem(STORAGE_KEY_APPS);
  if (!data) return [];
  try {
    const list = JSON.parse(data);
    return Array.isArray(list) ? list.filter(item => !item.id?.startsWith('demo-app-')) : [];
  } catch {
    return [];
  }
}

export function saveLocalApplications(apps) {
  localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
}

export function generateTrackingId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SCRS-2026-${randomDigits}`;
}

export function generateEventPassId() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `PASS-${randomDigits}`;
}

export function isFirebaseConnected() {
  const db = getDb();
  return Boolean(db);
}

export function getDatabaseConnectionInfo() {
  const db = getDb();
  return {
    isConnected: Boolean(db),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    mode: db ? 'Cloud Firestore (Real-time)' : 'Local Storage Cache'
  };
}

// ============================================================================
// APPLICATIONS COLLECTION (Cloud Firestore + Local Fallback)
// ============================================================================

export async function submitApplication(data) {
  const trackingId = generateTrackingId();
  const newApplication = {
    ...data,
    email: data.email?.trim().toLowerCase(),
    trackingId,
    track: 'Coordinator',
    status: 'pending',
    marks: null,
    interviewDetails: null,
    notes: '',
    rating: 0,
    createdAt: new Date().toISOString()
  };

  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.APPLICATIONS);
      const docRef = await addDoc(colRef, {
        ...newApplication,
        serverTimestamp: serverTimestamp()
      });
      newApplication.id = docRef.id;
    } catch (err) {
      console.warn('Firestore application write notice:', err);
      newApplication.id = 'app-' + Date.now();
    }
  } else {
    newApplication.id = 'app-' + Date.now();
  }

  const localList = getLocalApplications();
  localList.unshift(newApplication);
  saveLocalApplications(localList);

  return newApplication;
}

export async function fetchApplications() {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTIONS.APPLICATIONS), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const firestoreApps = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      saveLocalApplications(firestoreApps);
      return firestoreApps;
    } catch (err) {
      console.warn('Firestore fetchApplications notice:', err);
    }
  }
  return getLocalApplications();
}

export function subscribeToApplications(callback) {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTIONS.APPLICATIONS), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        saveLocalApplications(list);
        callback(list);
      }, (error) => {
        console.warn('subscribeToApplications snapshot notice:', error);
        callback(getLocalApplications());
      });
    } catch (e) {
      console.warn('Failed to attach applications real-time listener:', e);
    }
  }
  callback(getLocalApplications());
  return () => {};
}

export async function updateApplication(appId, updates) {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, COLLECTIONS.APPLICATIONS, appId);
      await setDoc(docRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.warn('Firestore updateApplication notice:', err);
    }
  }

  const current = getLocalApplications();
  const updated = current.map(item => {
    if (item.id === appId || item.trackingId === appId) {
      return { ...item, ...updates, updatedAt: new Date().toISOString() };
    }
    return item;
  });
  saveLocalApplications(updated);
  return updated.find(i => i.id === appId || i.trackingId === appId);
}

export async function deleteApplication(appId) {
  const db = getDb();
  if (db) {
    try {
      // 1. Direct document delete
      const docRef = doc(db, COLLECTIONS.APPLICATIONS, appId);
      await deleteDoc(docRef);

      // 2. Fallback check by trackingId or id property
      const q1 = query(collection(db, COLLECTIONS.APPLICATIONS), where('trackingId', '==', appId));
      const snap1 = await getDocs(q1);
      for (const d of snap1.docs) {
        await deleteDoc(d.ref);
      }

      const q2 = query(collection(db, COLLECTIONS.APPLICATIONS), where('id', '==', appId));
      const snap2 = await getDocs(q2);
      for (const d of snap2.docs) {
        await deleteDoc(d.ref);
      }
    } catch (err) {
      console.warn('Firestore deleteApplication notice:', err);
    }
  }

  const current = getLocalApplications();
  const updated = current.filter(item => item.id !== appId && item.trackingId !== appId);
  saveLocalApplications(updated);
  return updated;
}

export async function lookupApplication(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  const db = getDb();
  if (db) {
    try {
      const q1 = query(collection(db, COLLECTIONS.APPLICATIONS), where('trackingId', '==', identifier.trim().toUpperCase()));
      const snap1 = await getDocs(q1);
      if (!snap1.empty) return { id: snap1.docs[0].id, ...snap1.docs[0].data() };

      const q2 = query(collection(db, COLLECTIONS.APPLICATIONS), where('email', '==', clean));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) return { id: snap2.docs[0].id, ...snap2.docs[0].data() };

      // In Cloud mode, do not fall back to local demo caches if not found in Firestore
      return null;
    } catch (err) {
      console.warn('Firestore lookup query notice:', err);
    }
  }

  const localList = getLocalApplications();
  return localList.find(app =>
    app.trackingId?.toLowerCase() === clean || app.email?.toLowerCase() === clean
  ) || null;
}

export async function getApplicationsForEmail(email) {
  if (!email) return [];
  const clean = email.trim().toLowerCase();

  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTIONS.APPLICATIONS), where('email', '==', clean));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveLocalApplications(list);
      return list;
    } catch (err) {
      console.warn('Firestore query by email notice:', err);
    }
  }

  const localList = getLocalApplications();
  return localList.filter(app => app.email?.toLowerCase() === clean);
}

// ============================================================================
// UPCOMING EVENTS (Cloud Firestore + Local Cache)
// ============================================================================

export function getLocalUpcomingEvents() {
  const data = localStorage.getItem(STORAGE_KEY_UPCOMING_EVENTS);
  if (!data) return [];
  try {
    const list = JSON.parse(data);
    return Array.isArray(list) ? list.filter(item => item.id !== 'evt-1' && item.id !== 'evt-2') : [];
  } catch {
    return [];
  }
}

export function saveUpcomingEvents(events) {
  localStorage.setItem(STORAGE_KEY_UPCOMING_EVENTS, JSON.stringify(events));
}

// Synchronous return for immediate UI rendering, triggers background fetch if needed
export function getUpcomingEvents() {
  return getLocalUpcomingEvents();
}

export async function fetchUpcomingEvents() {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.UPCOMING_EVENTS);
      const snapshot = await getDocs(colRef);
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      saveUpcomingEvents(events);
      return events;
    } catch (err) {
      console.warn('Firestore fetchUpcomingEvents notice:', err);
    }
  }
  return getLocalUpcomingEvents();
}

export function subscribeToUpcomingEvents(callback) {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.UPCOMING_EVENTS);
      return onSnapshot(colRef, (snapshot) => {
        const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        saveUpcomingEvents(events);
        callback(events);
      }, (error) => {
        console.warn('subscribeToUpcomingEvents notice:', error);
        callback(getLocalUpcomingEvents());
      });
    } catch (e) {
      console.warn('Failed to attach upcoming events listener:', e);
    }
  }
  callback(getLocalUpcomingEvents());
  return () => {};
}

export async function addUpcomingEvent(eventData) {
  const current = getLocalUpcomingEvents();
  const eventId = eventData.id || 'evt-' + Date.now();
  const newEvent = {
    ...eventData,
    id: eventId,
    createdAt: new Date().toISOString()
  };

  current.unshift(newEvent);
  saveUpcomingEvents(current);

  // Sync to Firestore
  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.UPCOMING_EVENTS, eventId), {
        ...newEvent,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore addUpcomingEvent notice:', err);
    }
  }

  return newEvent;
}

export async function updateUpcomingEvent(eventId, updates) {
  const current = getLocalUpcomingEvents();
  const updated = current.map(item => item.id === eventId ? { ...item, ...updates } : item);
  saveUpcomingEvents(updated);

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.UPCOMING_EVENTS, eventId), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore updateUpcomingEvent notice:', err);
    }
  }

  return updated;
}

export async function deleteUpcomingEvent(eventId) {
  const db = getDb();
  if (db) {
    try {
      // 1. Direct document delete
      await deleteDoc(doc(db, COLLECTIONS.UPCOMING_EVENTS, eventId));
      // 2. Query fallback if document was saved with another ID or custom field
      const q = query(collection(db, COLLECTIONS.UPCOMING_EVENTS), where('id', '==', eventId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (err) {
      console.warn('Firestore deleteUpcomingEvent notice:', err);
    }
  }

  const current = getLocalUpcomingEvents();
  const updated = current.filter(item => item.id !== eventId);
  saveUpcomingEvents(updated);
  return updated;
}

// ============================================================================
// EVENT REGISTRATIONS (Cloud Firestore + Local Cache)
// ============================================================================

export function getLocalEventRegistrations() {
  const data = localStorage.getItem(STORAGE_KEY_EVENT_REGS);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

export function saveEventRegistrations(regs) {
  localStorage.setItem(STORAGE_KEY_EVENT_REGS, JSON.stringify(regs));
}

export function getEventRegistrations() {
  return getLocalEventRegistrations();
}

export async function fetchEventRegistrations() {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.EVENT_REGISTRATIONS);
      const snapshot = await getDocs(colRef);
      const regs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      saveEventRegistrations(regs);
      return regs;
    } catch (err) {
      console.warn('Firestore fetchEventRegistrations notice:', err);
    }
  }
  return getLocalEventRegistrations();
}

export function subscribeToEventRegistrations(callback) {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.EVENT_REGISTRATIONS);
      return onSnapshot(colRef, (snapshot) => {
        const regs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        saveEventRegistrations(regs);
        callback(regs);
      }, (error) => {
        console.warn('subscribeToEventRegistrations notice:', error);
        callback(getLocalEventRegistrations());
      });
    } catch (e) {
      console.warn('Failed to attach event registrations listener:', e);
    }
  }
  callback(getLocalEventRegistrations());
  return () => {};
}

export function registerForEvent(registrationData) {
  const passId = generateEventPassId();
  const regId = 'reg-' + Date.now();
  const newReg = {
    ...registrationData,
    id: regId,
    passId,
    status: 'Confirmed',
    registeredAt: new Date().toISOString()
  };

  const list = getLocalEventRegistrations();
  list.unshift(newReg);
  saveEventRegistrations(list);

  // Sync to Cloud Firestore
  const db = getDb();
  if (db) {
    setDoc(doc(db, COLLECTIONS.EVENT_REGISTRATIONS, regId), {
      ...newReg,
      serverTimestamp: serverTimestamp()
    }).catch(err => console.warn('Firestore registerForEvent notice:', err));
  }

  return newReg;
}

export async function getRegistrationsForEmail(email) {
  if (!email) return [];
  const clean = email.trim().toLowerCase();

  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, COLLECTIONS.EVENT_REGISTRATIONS), where('email', '==', clean));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveEventRegistrations(list);
      return list;
    } catch (err) {
      console.warn('Firestore getRegistrationsForEmail notice:', err);
    }
  }

  const list = getLocalEventRegistrations();
  return list.filter(r => r.email?.toLowerCase() === clean);
}

// ============================================================================
// PAST EVENTS & WINNERS (Cloud Firestore + Local Cache)
// ============================================================================

export function getLocalPastEvents() {
  const data = localStorage.getItem(STORAGE_KEY_PAST_EVENTS);
  if (!data) return [];
  try {
    const list = JSON.parse(data);
    return Array.isArray(list) ? list.filter(item => item.id !== 'past-evt-1' && item.id !== 'past-evt-2' && item.id !== 'past-1' && item.id !== 'past-2') : [];
  } catch {
    return [];
  }
}

export function savePastEvents(pastEvents) {
  try {
    localStorage.setItem(STORAGE_KEY_PAST_EVENTS, JSON.stringify(pastEvents));
  } catch (err) {
    console.warn('localStorage savePastEvents warning, sanitizing images:', err);
    try {
      const sanitized = pastEvents.map((evt, idx) => {
        if (idx > 0) {
          return {
            ...evt,
            photos: (evt.photos || []).filter(p => p && !p.startsWith('data:image/'))
          };
        }
        return evt;
      });
      localStorage.setItem(STORAGE_KEY_PAST_EVENTS, JSON.stringify(sanitized));
    } catch (err2) {
      console.error('Critical storage error saving past events:', err2);
    }
  }
}

export function getPastEvents() {
  return getLocalPastEvents();
}

export async function fetchPastEvents() {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.PAST_EVENTS);
      const snapshot = await getDocs(colRef);
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      savePastEvents(events);
      return events;
    } catch (err) {
      console.warn('Firestore fetchPastEvents notice:', err);
    }
  }
  return getLocalPastEvents();
}

export function subscribeToPastEvents(callback) {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.PAST_EVENTS);
      return onSnapshot(colRef, (snapshot) => {
        const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        savePastEvents(events);
        callback(events);
      }, (error) => {
        console.warn('subscribeToPastEvents notice:', error);
        callback(getLocalPastEvents());
      });
    } catch (e) {
      console.warn('Failed to attach past events listener:', e);
    }
  }
  callback(getLocalPastEvents());
  return () => {};
}

export async function addPastEvent(eventData) {
  const current = getLocalPastEvents();
  const pastId = eventData.id || 'past-' + Date.now();
  const newPastEvent = {
    ...eventData,
    id: pastId,
    createdAt: new Date().toISOString()
  };

  current.unshift(newPastEvent);
  savePastEvents(current);

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.PAST_EVENTS, pastId), {
        ...newPastEvent,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore addPastEvent notice:', err);
    }
  }

  return newPastEvent;
}

export async function updatePastEvent(pastId, updates) {
  const current = getLocalPastEvents();
  const updated = current.map(item => item.id === pastId ? { ...item, ...updates } : item);
  savePastEvents(updated);

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.PAST_EVENTS, pastId), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore updatePastEvent notice:', err);
    }
  }

  return updated;
}

export async function deletePastEvent(pastId) {
  const db = getDb();
  if (db) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PAST_EVENTS, pastId));
      const q = query(collection(db, COLLECTIONS.PAST_EVENTS), where('id', '==', pastId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (err) {
      console.warn('Firestore deletePastEvent notice:', err);
    }
  }

  const current = getLocalPastEvents();
  const updated = current.filter(item => item.id !== pastId);
  savePastEvents(updated);
  return updated;
}

// ============================================================================
// CLUB TEAM & COORDINATORS (Cloud Firestore + Local Cache)
// ============================================================================

export function getLocalTeamMembers() {
  const data = localStorage.getItem(STORAGE_KEY_TEAM);
  if (!data) return [];
  try {
    const list = JSON.parse(data);
    return Array.isArray(list) ? list.filter(item => !item.id?.startsWith('demo-team-')) : [];
  } catch {
    return [];
  }
}

export function saveTeamMembers(team) {
  localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(team));
}

export function getTeamMembers() {
  return getLocalTeamMembers();
}

export async function fetchTeamMembers() {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.TEAM_MEMBERS);
      const snapshot = await getDocs(colRef);
      const team = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      saveTeamMembers(team);
      return team;
    } catch (err) {
      console.warn('Firestore fetchTeamMembers notice:', err);
    }
  }
  return getLocalTeamMembers();
}

export function subscribeToTeamMembers(callback) {
  const db = getDb();
  if (db) {
    try {
      const colRef = collection(db, COLLECTIONS.TEAM_MEMBERS);
      return onSnapshot(colRef, (snapshot) => {
        const team = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        saveTeamMembers(team);
        callback(team);
      }, (error) => {
        console.warn('subscribeToTeamMembers notice:', error);
        callback(getLocalTeamMembers());
      });
    } catch (e) {
      console.warn('Failed to attach team members listener:', e);
    }
  }
  callback(getLocalTeamMembers());
  return () => {};
}

export async function addTeamMember(memberData) {
  const current = getLocalTeamMembers();
  const memberId = memberData.id || 'team-' + Date.now();
  const newMember = {
    ...memberData,
    id: memberId,
    createdAt: new Date().toISOString()
  };

  current.push(newMember);
  saveTeamMembers(current);

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.TEAM_MEMBERS, memberId), {
        ...newMember,
        serverTimestamp: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore addTeamMember notice:', err);
    }
  }

  return newMember;
}

export async function updateTeamMember(memberId, updates) {
  const current = getLocalTeamMembers();
  const updated = current.map(item => item.id === memberId ? { ...item, ...updates } : item);
  saveTeamMembers(updated);

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTIONS.TEAM_MEMBERS, memberId), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore updateTeamMember notice:', err);
    }
  }

  return updated;
}

export async function deleteTeamMember(memberId) {
  const db = getDb();
  if (db) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TEAM_MEMBERS, memberId));
      const q = query(collection(db, COLLECTIONS.TEAM_MEMBERS), where('id', '==', memberId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (err) {
      console.warn('Firestore deleteTeamMember notice:', err);
    }
  }

  const current = getLocalTeamMembers();
  const updated = current.filter(item => item.id !== memberId);
  saveTeamMembers(updated);
  return updated;
}

// ============================================================================
// CLOUD DATABASE REFRESH & LIVE SYNC (Always retrieved directly from Cloud Firestore)
// ============================================================================

export async function refreshDatabaseCollections() {
  const db = getDb();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please verify your credentials in .env.');
  }

  const [apps, upcoming, past, team, regs] = await Promise.all([
    fetchApplications(),
    fetchUpcomingEvents(),
    fetchPastEvents(),
    fetchTeamMembers(),
    fetchEventRegistrations()
  ]);

  return {
    applications: apps.length,
    upcomingEvents: upcoming.length,
    pastEvents: past.length,
    teamMembers: team.length,
    eventRegistrations: regs.length
  };
}

// Alias for backwards compatibility with any calling UI components
export const seedInitialDataToCloud = refreshDatabaseCollections;

// Helper to distinguish Faculty Coordinators from Student/Club Coordinators
export function isFacultyMember(member) {
  if (!member) return false;
  if (member.category === 'faculty') return true;
  if (member.category === 'club') return false;
  const d = (member.domain || '').toLowerCase();
  const r = (member.role || '').toLowerCase();
  const n = (member.name || '').toLowerCase();
  return (
    d.includes('faculty') ||
    d.includes('advisory') ||
    d.includes('mentor') ||
    r.includes('faculty') ||
    r.includes('advisor') ||
    r.includes('professor') ||
    r.includes('dr.') ||
    n.startsWith('dr.')
  );
}

export async function ensureInitialDataInFirestore() {
  // Permanently disabled: Never re-seeds sample items to Firestore so deleted items stay deleted.
  return;
}




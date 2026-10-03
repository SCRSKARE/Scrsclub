import {
  getDb,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  initFirebase
} from './firebase';

const STORAGE_KEY = 'scrs_hiring_applications_v3';

// Seed demo applications with realistic KLU Coordinator applicants (@klu.ac.in)
const INITIAL_DEMO_APPLICATIONS = [
  {
    id: 'demo-app-1',
    trackingId: 'SCRS-2026-7821',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@klu.ac.in',
    phone: '+91 98765 43210',
    rollNumber: '2200030042',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    track: 'Coordinator',
    role: 'Technical & Web Dev Coordinator',
    domain: 'Technical & Web Dev Coordinator',
    secondaryDomain: 'Creative Design & Media Coordinator',
    skills: 'React, Node.js, Python, System Design, Git, Docker',
    portfolioUrl: 'https://github.com/aarav-sharma-demo',
    linkedinUrl: 'https://linkedin.com/in/aarav-sharma',
    whyJoin: 'I want to lead the technical wing to organize our college hackathon and guide juniors in open-source development.',
    initiativeIdea: 'A campus-wide 36-hour hackathon with live automated judge bots and beginner workshops.',
    weeklyHours: '10-12 hours/week',
    experience: 'Built the annual symposium landing page visited by 4,000+ students and created a club Discord bot.',
    status: 'interview_scheduled',
    interviewDetails: {
      date: '2026-10-06',
      time: '04:30 PM',
      mode: 'Offline (Club Room 304, SAC)',
      interviewer: 'Club President & Faculty Advisor'
    },
    notes: 'Strong portfolio and clear vision for hackathon.',
    rating: 5,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'demo-app-2',
    trackingId: 'SCRS-2026-5192',
    fullName: 'Ananya Verma',
    email: 'ananya.verma@klu.ac.in',
    phone: '+91 91234 56789',
    rollNumber: '2300030018',
    branch: 'Electronics & Communication',
    year: '2nd Year',
    track: 'Coordinator',
    role: 'Events & Operations Coordinator',
    domain: 'Events & Operations Coordinator',
    secondaryDomain: 'Public Relations & Outreach Coordinator',
    skills: 'Event Planning, Vendor Management, Public Speaking, Budgeting',
    portfolioUrl: 'https://linkedin.com/in/ananya-verma-demo',
    linkedinUrl: 'https://linkedin.com/in/ananya-verma-demo',
    whyJoin: 'Passionate about bringing high-energy campus events and creating memorable tech experiences for students.',
    initiativeIdea: 'Introducing a monthly Tech Talk speaker series with industry alumni working in deep tech.',
    weeklyHours: '8-10 hours/week',
    experience: 'Managed registration desk and guest relations for 500+ participants at the national robotics conclave.',
    status: 'shortlisted',
    interviewDetails: null,
    notes: 'Great communication skills; review logistics pitch.',
    rating: 4,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'demo-app-3',
    trackingId: 'SCRS-2026-3401',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@klu.ac.in',
    phone: '+91 97654 32109',
    rollNumber: '2300030077',
    branch: 'Information Technology',
    year: '2nd Year',
    track: 'Coordinator',
    role: 'Corporate & Sponsorship Coordinator',
    domain: 'Corporate & Sponsorship Coordinator',
    secondaryDomain: 'Events & Operations Coordinator',
    skills: 'Pitch Decks, Corporate Cold Outreach, Financial Accounting, Negotiation',
    portfolioUrl: 'https://linkedin.com/in/rohan-tech',
    linkedinUrl: 'https://linkedin.com/in/rohan-tech',
    whyJoin: 'Eager to bring corporate sponsors and developer grants to fund large-scale college projects.',
    initiativeIdea: 'A structured sponsorship tier deck with cloud provider credits for our hackathon participants.',
    weeklyHours: '8-10 hours/week',
    experience: 'Raised 1.5 Lakhs in sponsorship for the college tech symposium.',
    status: 'pending',
    interviewDetails: null,
    notes: '',
    rating: 0,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'demo-app-4',
    trackingId: 'SCRS-2026-9034',
    fullName: 'Sneha Patel',
    email: 'sneha.patel@klu.ac.in',
    phone: '+91 99887 76655',
    rollNumber: '2300030055',
    branch: 'Computer Science & Engineering',
    year: '2nd Year',
    track: 'Coordinator',
    role: 'Creative Design & Media Coordinator',
    domain: 'Creative Design & Media Coordinator',
    secondaryDomain: 'Public Relations & Outreach Coordinator',
    skills: 'Figma, Adobe Illustrator, Canva, Reel Editing (Premiere Pro)',
    portfolioUrl: 'https://behance.net/snehapatel-demo',
    linkedinUrl: 'https://linkedin.com/in/snehapatel',
    whyJoin: 'I love visual storytelling and want to lead SCRS’s design and media identity.',
    initiativeIdea: 'A mini carousel series showcasing "Behind the Scenes of Robotics" on Instagram and YouTube.',
    weeklyHours: '8-10 hours/week',
    experience: 'Designed social media graphics for department fest and college dance society.',
    status: 'accepted',
    interviewDetails: {
      date: '2026-10-02',
      time: '02:00 PM',
      mode: 'Offline (Club Room 304, SAC)',
      interviewer: 'Design Lead'
    },
    notes: 'Outstanding Behance portfolio. Appointed Creative & Media Coordinator.',
    rating: 5,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

// Helper to get local stored applications
export function getLocalApplications() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
    return INITIAL_DEMO_APPLICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_DEMO_APPLICATIONS;
  }
}

export function saveLocalApplications(apps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

// Generate unique tracking ID: SCRS-2026-XXXX
export function generateTrackingId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SCRS-2026-${randomDigits}`;
}

// Check if Firebase is currently active
export function isFirebaseConnected() {
  const db = getDb();
  return Boolean(db);
}

// Submit a new application
export async function submitApplication(data) {
  const trackingId = generateTrackingId();
  const newApplication = {
    ...data,
    email: data.email?.trim().toLowerCase(),
    trackingId,
    track: 'Coordinator',
    status: 'pending', // 'pending' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected'
    interviewDetails: null,
    notes: '',
    rating: 0,
    createdAt: new Date().toISOString()
  };

  const db = getDb();

  // If Firebase is available, save to Firestore
  if (db) {
    try {
      const colRef = collection(db, 'applications');
      const docRef = await addDoc(colRef, {
        ...newApplication,
        serverTimestamp: serverTimestamp()
      });
      newApplication.id = docRef.id;
    } catch (err) {
      console.warn('Firestore write failed, falling back to local storage:', err);
      newApplication.id = 'app-' + Date.now();
    }
  } else {
    newApplication.id = 'app-' + Date.now();
  }

  // Always mirror in localStorage for offline availability & quick display
  const localList = getLocalApplications();
  localList.unshift(newApplication);
  saveLocalApplications(localList);

  return newApplication;
}

// Fetch all applications
export async function fetchApplications() {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreApps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        saveLocalApplications(firestoreApps);
        return firestoreApps;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using local store:', err);
    }
  }
  return getLocalApplications();
}

// Subscribe to real-time updates (Firestore onSnapshot or LocalStorage fallback)
export function subscribeToApplications(callback) {
  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (list.length > 0) {
          saveLocalApplications(list);
          callback(list);
        } else {
          callback(getLocalApplications());
        }
      }, (error) => {
        console.warn('onSnapshot error, falling back to local storage:', error);
        callback(getLocalApplications());
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Failed to attach real-time listener:', e);
    }
  }

  // Fallback: initial local load
  callback(getLocalApplications());
  return () => {};
}

// Update application status & notes
export async function updateApplication(appId, updates) {
  const db = getDb();
  if (db) {
    try {
      const docRef = doc(db, 'applications', appId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn('Firestore update failed, updating local copy:', err);
    }
  }

  // Update local storage
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

// Look up application by tracking ID or Email
export async function lookupApplication(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  // Try Firestore first
  const db = getDb();
  if (db) {
    try {
      const q1 = query(collection(db, 'applications'), where('trackingId', '==', identifier.trim().toUpperCase()));
      const snap1 = await getDocs(q1);
      if (!snap1.empty) {
        return { id: snap1.docs[0].id, ...snap1.docs[0].data() };
      }
      const q2 = query(collection(db, 'applications'), where('email', '==', clean));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        return { id: snap2.docs[0].id, ...snap2.docs[0].data() };
      }
    } catch (err) {
      console.warn('Firestore lookup query failed:', err);
    }
  }

  // Fallback to local
  const localList = getLocalApplications();
  const found = localList.find(app =>
    app.trackingId?.toLowerCase() === clean ||
    app.email?.toLowerCase() === clean
  );
  return found || null;
}

// Get all applications for a specific KLU user email
export async function getApplicationsForEmail(email) {
  if (!email) return [];
  const clean = email.trim().toLowerCase();

  const db = getDb();
  if (db) {
    try {
      const q = query(collection(db, 'applications'), where('email', '==', clean));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore query by email failed:', err);
    }
  }

  const localList = getLocalApplications();
  return localList.filter(app => app.email?.toLowerCase() === clean);
}

// Reset / Seed applications
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPLICATIONS));
  return INITIAL_DEMO_APPLICATIONS;
}

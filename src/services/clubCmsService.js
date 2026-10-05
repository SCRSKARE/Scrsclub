import {
  getDb,
  doc,
  getDocs,
  collection,
  updateDoc,
  initFirebase
} from './firebase';

const CMS_STORAGE_KEY = 'scrs_club_cms_data_v2';

export const DEFAULT_CMS_DATA = {
  homepage: {
    heroBadge: 'Official Student Chapter • KL University',
    heroHeadline: 'Empowering Minds, Engineering Solutions & Fostering Research',
    heroSubtitle: 'The premier technical and research community at KL University. We bridge the gap between academic theory, bleeding-edge engineering, and real-world impact through national hackathons, workshops, and publications.',
    stats: {
      members: '500+',
      events: '45+',
      papers: '18+',
      awards: '25+'
    },
    introTitle: 'Pioneering Computing, Innovation & Technical Leadership',
    introText: 'Founded with the mission to elevate student research and technical excellence, SCRS (Student Community & Research Society) organizes national-level hackathons, AI conclaves, hands-on bootcamps, and peer research initiatives. Whether you are passionate about Deep Learning, Systems Engineering, UI/UX, or Event Leadership, SCRS is the launchpad for your ambitions.'
  },
  pastEvents: [
    {
      id: 'past-hackscrs-2025',
      title: 'HackSCRS 2025 — National 36-Hour Hackathon',
      category: 'Hackathon',
      date: 'October 18–19, 2025',
      venue: 'SAC Central Auditorium & Tech Labs, KLU',
      attendance: '650+ Participants • 120 Teams',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      shortDescription: 'A high-octane 36-hour hackathon focused on AI for Social Good, Decentralized Systems, and Smart Campus Solutions with prizes worth ₹2,50,000.',
      fullDescription: 'HackSCRS 2025 brought together brilliant student developers from 40+ engineering institutes across India. Over 36 relentless hours, teams developed cutting-edge prototypes evaluated by industry leaders from Google, Microsoft, and Amazon. The hackathon featured 4 technical mentor checkpoints, midnight gaming tournaments, and live keynote sessions on Agentic AI.',
      galleryImages: [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
      ],
      winners: [
        {
          id: 'w1',
          name: 'Team NeuroVision',
          teamMembers: 'Aarav Sharma, Priya Nair, Karthik R',
          prize: '₹1,00,000 Grand Champion',
          projectTitle: 'OmniSight: Multi-Modal Assistant for Visually Impaired',
          photoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
          description: 'Engineered an edge-deployable computer vision wearable that narrates surroundings in 12 regional Indian languages with sub-100ms latency.'
        },
        {
          id: 'w2',
          name: 'Team BlockHealth',
          teamMembers: 'Devansh Mehta, Sneha Reddy',
          prize: '₹60,000 First Runner Up',
          projectTitle: 'ZeroTrust EHR: Zero-Knowledge Medical Record Exchange',
          photoUrl: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=600&q=80',
          description: 'Decentralized patient consent management built using zk-SNARKs allowing hospitals to securely share medical records.'
        },
        {
          id: 'w3',
          name: 'Team EcoGrid',
          teamMembers: 'Rahul Varma, Neha Gupta, Tanya Sen',
          prize: '₹40,000 Best Sustainability Hack',
          projectTitle: 'SolarPulse: IoT Smart Microgrid Load Balancer',
          photoUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
          description: 'Reinforcement learning controller reducing peak battery degradation across distributed campus solar arrays by 34%.'
        }
      ],
      order: 1
    },
    {
      id: 'past-neurocompute-2025',
      title: 'NeuroCompute — Soft Computing & Neural Systems Summit',
      category: 'Symposium',
      date: 'August 12, 2025',
      venue: 'Research Block Seminar Hall 1, KLU',
      attendance: '320+ Attendees • 14 Paper Presentations',
      bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      shortDescription: 'An international technical symposium presenting student peer-reviewed papers on neural network optimization, fuzzy logic, and genetic algorithms.',
      fullDescription: 'The summit welcomed Dr. S. Rao (Senior Scientist, DRDO) and keynote researchers from premier universities. Over 14 student research papers were presented, with 4 papers selected for indexed journal submission.',
      galleryImages: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80'
      ],
      winners: [
        {
          id: 'w4',
          name: 'Ananya Deshmukh',
          teamMembers: 'Ananya Deshmukh & Dr. M. K. Rao (Advisor)',
          prize: 'Best Research Paper Award & ₹25,000',
          projectTitle: 'Hybrid Spiking Neural Network for Ultra-Low Power ECG Anomaly Detection',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
          description: 'Demonstrated 98.7% accuracy with 4x reduced power dissipation on neuromorphic edge chips.'
        }
      ],
      order: 2
    },
    {
      id: 'past-cloudcon-2025',
      title: 'CloudCon: Kubernetes & Cloud-Native Architecture Bootcamp',
      category: 'Bootcamp',
      date: 'April 5–6, 2025',
      venue: 'CSE Computer Lab 7, KLU',
      attendance: '180+ Hands-on Developers',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      shortDescription: 'A 2-day hands-on intensive masterclass on microservices, Docker, Kubernetes orchestration, and CI/CD pipelines.',
      fullDescription: 'Participants built and deployed production-ready microservice clusters to Google Cloud Platform, learning infrastructure as code with Terraform and monitoring with Prometheus.',
      galleryImages: [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'
      ],
      winners: [
        {
          id: 'w5',
          name: 'Vikram Singhania',
          teamMembers: 'Vikram Singhania',
          prize: 'Top DevOps Architect & GCP Swag Pack',
          projectTitle: 'Zero-Downtime Blue/Green GitOps Engine',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
          description: 'Automated canary deployment pipeline with instantaneous automated rollback triggered on Prometheus error rate thresholds.'
        }
      ],
      order: 3
    }
  ],
  upcomingEvents: [
    {
      id: 'upcoming-ai-conclave-2026',
      title: 'SCRS AI Conclave 2026: Generative Systems & Agentic Workflows',
      category: 'Flagship Conference',
      date: '2026-11-14',
      time: '09:30 AM – 05:00 PM IST',
      venue: 'Main Campus Auditorium (SAC), KL University',
      bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      description: 'Join us for our biggest flagship symposium of the semester! Explore cutting-edge LLMs, multi-agent orchestrations, reasoning models, and production deployment patterns with keynote speakers from top AI labs.',
      importantInfo: 'Open to all B.Tech / M.Tech / PhD students. Free lunch and delegate welcome kit provided. Bring your laptops for the afternoon live interactive coding workshop!',
      registrationLink: 'https://forms.gle/scrs-ai-conclave-2026',
      registrationDeadline: '2026-11-10',
      isRegistrationOpen: true,
      order: 1
    },
    {
      id: 'upcoming-algo-sprint-2026',
      title: 'CodeWars 2026: Algorithmic Duel & Speed Programming',
      category: 'Competition',
      date: '2026-10-25',
      time: '03:00 PM – 07:00 PM IST',
      venue: 'Computing Center Lab 3 & 4 (Room 412), KLU',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      description: 'A 4-hour speed programming face-off covering dynamic programming, graph theory, geometry, and greedy heuristics. Cash prizes worth ₹50,000 for top 3 rank holders.',
      importantInfo: 'Solo participation. ICPC scoring rules apply. Permitted languages: C++, Java, Python, Rust. Refreshments served.',
      registrationLink: 'https://forms.gle/scrs-codewars-2026',
      registrationDeadline: '2026-10-23',
      isRegistrationOpen: true,
      order: 2
    },
    {
      id: 'upcoming-web3-workshop-2026',
      title: 'Zero2Production: Full-Stack React 19 & Cloud Native Masterclass',
      category: 'Workshop',
      date: '2026-11-28',
      time: '10:00 AM – 04:00 PM IST',
      venue: 'SAC Seminar Hall 201, KLU',
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      description: 'A zero-fluff, hands-on workshop guiding students from zero to a live production application built with React, Vite, Tailwind/Vanilla CSS, and Serverless databases.',
      importantInfo: 'Pre-requisite: Basic JavaScript knowledge. Git installed. Limited to 100 participants on first-come-first-serve basis.',
      registrationLink: 'https://forms.gle/scrs-fullstack-2026',
      registrationDeadline: '2026-11-25',
      isRegistrationOpen: true,
      order: 3
    }
  ],
  teamMembers: [
    {
      id: 'team-1',
      name: 'Aditya Varma',
      designation: 'Club President',
      wing: 'Executive Board',
      bio: 'Final year CSE student focusing on Distributed Systems & AI. Passionate about empowering student builders and leading high-impact initiatives.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/aditya-varma-demo',
      github: 'https://github.com/aditya-varma-demo',
      email: 'aditya.varma@klu.ac.in',
      isCore: true,
      order: 1
    },
    {
      id: 'team-2',
      name: 'Pooja Krishnan',
      designation: 'Vice President & Research Lead',
      wing: 'Research Wing',
      bio: 'Pre-final year scholar specializing in Soft Computing & Neuromorphic architectures. Authored 2 IEEE conference papers.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/pooja-krishnan-demo',
      github: 'https://github.com/pooja-krishnan-demo',
      email: 'pooja.krishnan@klu.ac.in',
      isCore: true,
      order: 2
    },
    {
      id: 'team-3',
      name: 'Sai Teja Reddy',
      designation: 'Technical Head & Systems Lead',
      wing: 'Technical Wing',
      bio: 'Full-stack engineer, Kubernetes enthusiast, and open-source contributor. Architected SCRS digital platforms and hackathon portals.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/saiteja-reddy-demo',
      github: 'https://github.com/saiteja-reddy-demo',
      email: 'saiteja.reddy@klu.ac.in',
      isCore: true,
      order: 3
    },
    {
      id: 'team-4',
      name: 'Meera Nambiar',
      designation: 'Creative Director & UI/UX Lead',
      wing: 'Design & Media',
      bio: 'Visual designer and storyteller crafting memorable digital experiences, brand identities, and multimedia campaigns.',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/meera-nambiar-demo',
      github: '',
      email: 'meera.nambiar@klu.ac.in',
      isCore: false,
      order: 4
    },
    {
      id: 'team-5',
      name: 'Harsh Vardhan',
      designation: 'Events & Operations Lead',
      wing: 'Events & Operations',
      bio: 'Logistics strategist who managed HackSCRS 2025 with 650+ participants. Keeps every timeline and stage running like clockwork.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/harsh-vardhan-demo',
      github: '',
      email: 'harsh.vardhan@klu.ac.in',
      isCore: false,
      order: 5
    },
    {
      id: 'team-6',
      name: 'Kavya Sree',
      designation: 'PR & Corporate Outreach Lead',
      wing: 'PR & Corporate',
      bio: 'Connecting SCRS with top tech sponsors, alumni mentors, and national student networks. Raised ₹2.5L+ in sponsorships.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      linkedin: 'https://linkedin.com/in/kavya-sree-demo',
      github: '',
      email: 'kavya.sree@klu.ac.in',
      isCore: false,
      order: 6
    }
  ],
  aboutContent: {
    facultyAdvisor: {
      name: 'Dr. K. Srinivas Rao, Ph.D.',
      title: 'Faculty Advisor & Professor of Computer Science',
      department: 'Department of Computer Science & Engineering, KL University',
      quote: 'SCRS represents the vanguard of student innovation. We don\'t just teach code; we empower scholars to publish breakthrough research and build solutions that serve humanity.',
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80'
    },
    mission: 'To foster an inspiring ecosystem where undergraduate and postgraduate scholars bridge the frontier between theoretical computing, engineering craftsmanship, and open research.',
    vision: 'To be recognized as a premier national collegiate center of technical excellence, recognized for impactful publications, top-tier hackathon champions, and ethical engineering leaders.',
    milestones: [
      { year: '2023', title: 'SCRS Chapter Inception', desc: 'Founded by passionate computer science students to promote research and hackathon culture.' },
      { year: '2024', title: '1st National Hackathon', desc: 'Hosted 400+ developers from 25 colleges across South India.' },
      { year: '2025', title: 'HackSCRS Flagship & Research Milestone', desc: '14 research papers accepted in Scopus-indexed conferences, 650+ attendees in annual hackathon.' },
      { year: '2026', title: 'Global AI & Innovation Chapter', desc: 'Expanding into generative systems, agentic workflows, and autonomous robotics wings.' }
    ]
  },
  contactInfo: {
    room: 'Room 304, 3rd Floor, Student Activity Center (SAC)',
    campus: 'KL University Green Fields Campus',
    city: 'Vaddeswaram, Guntur District, Andhra Pradesh 522502',
    email: 'scrs@klu.ac.in',
    phone: '+91 98765 43210',
    instagram: 'https://instagram.com/scrs_klu',
    linkedin: 'https://linkedin.com/company/scrs-klu',
    github: 'https://github.com/scrs-club',
    discord: 'https://discord.gg/scrs-klu'
  }
};

let listeners = [];

function notifyListeners(data) {
  listeners.forEach(cb => {
    try {
      cb(data);
    } catch (err) {
      console.error('Error notifying CMS listener:', err);
    }
  });
}

export function subscribeToClubData(callback) {
  listeners.push(callback);
  // Send initial data immediately
  const initial = getClubCmsData();
  callback(initial);

  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
}

export function getClubCmsData() {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default keys to ensure schema completeness
      return {
        ...DEFAULT_CMS_DATA,
        ...parsed,
        homepage: { ...DEFAULT_CMS_DATA.homepage, ...(parsed.homepage || {}) },
        aboutContent: { ...DEFAULT_CMS_DATA.aboutContent, ...(parsed.aboutContent || {}) },
        contactInfo: { ...DEFAULT_CMS_DATA.contactInfo, ...(parsed.contactInfo || {}) }
      };
    }
  } catch (err) {
    console.warn('Failed to parse club CMS data from localStorage:', err);
  }
  // Store default
  saveClubCmsData(DEFAULT_CMS_DATA);
  return DEFAULT_CMS_DATA;
}

export function saveClubCmsData(newData) {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));
    notifyListeners(newData);
  } catch (err) {
    console.error('Failed to save club CMS data:', err);
  }
}

// ----------------- CRUD Operations -----------------

// Homepage
export function updateHomepageContent(homepagePartial) {
  const current = getClubCmsData();
  const updated = {
    ...current,
    homepage: {
      ...current.homepage,
      ...homepagePartial
    }
  };
  saveClubCmsData(updated);
  return updated.homepage;
}

// Past Events
export function addPastEvent(eventData) {
  const current = getClubCmsData();
  const newEvent = {
    id: 'past-' + Date.now(),
    title: eventData.title || 'Untitled Past Event',
    category: eventData.category || 'Tech Event',
    date: eventData.date || new Date().toISOString().split('T')[0],
    venue: eventData.venue || 'KL University Campus',
    attendance: eventData.attendance || '200+ Participants',
    bannerUrl: eventData.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    shortDescription: eventData.shortDescription || '',
    fullDescription: eventData.fullDescription || '',
    galleryImages: Array.isArray(eventData.galleryImages) ? eventData.galleryImages : [],
    winners: Array.isArray(eventData.winners) ? eventData.winners : [],
    order: (current.pastEvents.length || 0) + 1
  };
  const updatedEvents = [newEvent, ...current.pastEvents];
  saveClubCmsData({ ...current, pastEvents: updatedEvents });
  return newEvent;
}

export function updatePastEvent(id, updatedFields) {
  const current = getClubCmsData();
  const updatedEvents = current.pastEvents.map(ev => {
    if (ev.id === id) {
      return { ...ev, ...updatedFields };
    }
    return ev;
  });
  saveClubCmsData({ ...current, pastEvents: updatedEvents });
  return updatedEvents.find(ev => ev.id === id);
}

export function deletePastEvent(id) {
  const current = getClubCmsData();
  const updatedEvents = current.pastEvents.filter(ev => ev.id !== id);
  saveClubCmsData({ ...current, pastEvents: updatedEvents });
  return true;
}

export function reorderPastEvents(reorderedEvents) {
  const current = getClubCmsData();
  saveClubCmsData({ ...current, pastEvents: reorderedEvents });
}

// Upcoming Events
export function addUpcomingEvent(eventData) {
  const current = getClubCmsData();
  const newEvent = {
    id: 'upcoming-' + Date.now(),
    title: eventData.title || 'Upcoming Event',
    category: eventData.category || 'Technical Workshop',
    date: eventData.date || '2026-12-01',
    time: eventData.time || '10:00 AM – 04:00 PM IST',
    venue: eventData.venue || 'SAC Auditorium, KLU',
    bannerUrl: eventData.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    description: eventData.description || '',
    importantInfo: eventData.importantInfo || '',
    registrationLink: eventData.registrationLink || '',
    registrationDeadline: eventData.registrationDeadline || '',
    isRegistrationOpen: eventData.isRegistrationOpen !== false,
    order: (current.upcomingEvents.length || 0) + 1
  };
  const updatedEvents = [...current.upcomingEvents, newEvent];
  saveClubCmsData({ ...current, upcomingEvents: updatedEvents });
  return newEvent;
}

export function updateUpcomingEvent(id, updatedFields) {
  const current = getClubCmsData();
  const updatedEvents = current.upcomingEvents.map(ev => {
    if (ev.id === id) {
      return { ...ev, ...updatedFields };
    }
    return ev;
  });
  saveClubCmsData({ ...current, upcomingEvents: updatedEvents });
  return updatedEvents.find(ev => ev.id === id);
}

export function deleteUpcomingEvent(id) {
  const current = getClubCmsData();
  const updatedEvents = current.upcomingEvents.filter(ev => ev.id !== id);
  saveClubCmsData({ ...current, upcomingEvents: updatedEvents });
  return true;
}

export function reorderUpcomingEvents(reorderedEvents) {
  const current = getClubCmsData();
  saveClubCmsData({ ...current, upcomingEvents: reorderedEvents });
}

// Move Completed Upcoming Event to Past Events
export function moveUpcomingToPast(upcomingId, completionDetails = {}) {
  const current = getClubCmsData();
  const upcoming = current.upcomingEvents.find(ev => ev.id === upcomingId);
  if (!upcoming) return false;

  const pastEvent = {
    id: 'past-' + upcoming.id.replace('upcoming-', '') + '-' + Date.now(),
    title: upcoming.title,
    category: upcoming.category,
    date: completionDetails.date || upcoming.date,
    venue: upcoming.venue,
    attendance: completionDetails.attendance || '350+ Participants',
    bannerUrl: upcoming.bannerUrl,
    shortDescription: upcoming.description ? upcoming.description.slice(0, 180) + '...' : '',
    fullDescription: completionDetails.fullDescription || upcoming.description,
    galleryImages: completionDetails.galleryImages || [upcoming.bannerUrl],
    winners: completionDetails.winners || [],
    order: 1
  };

  const remainingUpcoming = current.upcomingEvents.filter(ev => ev.id !== upcomingId);
  const updatedPast = [pastEvent, ...current.pastEvents];

  saveClubCmsData({
    ...current,
    upcomingEvents: remainingUpcoming,
    pastEvents: updatedPast
  });

  return pastEvent;
}

// Team Members
export function addTeamMember(memberData) {
  const current = getClubCmsData();
  const newMember = {
    id: 'team-' + Date.now(),
    name: memberData.name || 'New Member',
    designation: memberData.designation || 'Coordinator',
    wing: memberData.wing || 'Technical Wing',
    bio: memberData.bio || '',
    photoUrl: memberData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    linkedin: memberData.linkedin || '',
    github: memberData.github || '',
    email: memberData.email || '',
    isCore: Boolean(memberData.isCore),
    order: (current.teamMembers.length || 0) + 1
  };
  const updatedMembers = [...current.teamMembers, newMember];
  saveClubCmsData({ ...current, teamMembers: updatedMembers });
  return newMember;
}

export function updateTeamMember(id, updatedFields) {
  const current = getClubCmsData();
  const updatedMembers = current.teamMembers.map(m => {
    if (m.id === id) {
      return { ...m, ...updatedFields };
    }
    return m;
  });
  saveClubCmsData({ ...current, teamMembers: updatedMembers });
  return updatedMembers.find(m => m.id === id);
}

export function deleteTeamMember(id) {
  const current = getClubCmsData();
  const updatedMembers = current.teamMembers.filter(m => m.id !== id);
  saveClubCmsData({ ...current, teamMembers: updatedMembers });
  return true;
}

export function reorderTeamMembers(reorderedMembers) {
  const current = getClubCmsData();
  saveClubCmsData({ ...current, teamMembers: reorderedMembers });
}

// About Content
export function updateAboutContent(aboutPartial) {
  const current = getClubCmsData();
  const updated = {
    ...current,
    aboutContent: {
      ...current.aboutContent,
      ...aboutPartial
    }
  };
  saveClubCmsData(updated);
  return updated.aboutContent;
}

// Contact Info
export function updateContactInfo(contactPartial) {
  const current = getClubCmsData();
  const updated = {
    ...current,
    contactInfo: {
      ...current.contactInfo,
      ...contactPartial
    }
  };
  saveClubCmsData(updated);
  return updated.contactInfo;
}

// Reset to Default CMS Data
export function resetCmsToDefault() {
  saveClubCmsData(DEFAULT_CMS_DATA);
  return DEFAULT_CMS_DATA;
}

// Image compression utility for direct client file uploads
export function compressImageFile(file, maxWidth = 1200, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

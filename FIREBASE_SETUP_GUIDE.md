# SCRS Hiring Portal - Firebase & Google Auth Setup Guide

This guide walks you through setting up Firebase Authentication (Google Workspace `@klu.ac.in`) and Cloud Firestore for the **SCRS Recruitment Portal**.

---

## 1. Firebase Authentication Setup

### Step 1: Enable Google Sign-In Provider
1. Open [Firebase Console](https://console.firebase.google.com/) and navigate to your project (`scrs-hiring`).
2. In the left navigation, click **Build > Authentication**.
3. Go to the **Sign-in method** tab.
4. Click **Add new provider** and choose **Google**.
5. Toggle **Enable**.
6. Set the **Project support email** (your email).
7. Click **Save**.

### Step 2: Verify Authorized Domains
1. In Firebase Console, go to **Authentication > Settings > Authorized domains**.
2. Ensure the following domains are listed:
   - `localhost`
   - `scrs-hiring.firebaseapp.com`
   - Any production domain you deploy to (e.g. Vercel / Netlify / Firebase Hosting).

---

## 2. Cloud Firestore Database Setup

### Step 1: Create Firestore Database
1. In the left navigation, click **Build > Firestore Database**.
2. Click **Create database**.
3. Choose **Production mode** (or Test mode for fast local verification).
4. Select a location close to your users (e.g., `asia-south1` for India / Mumbai).
5. Click **Enable**.

### Step 2: Set Security Rules
Go to the **Rules** tab in Cloud Firestore and paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Applications collection
    match /applications/{appId} {
      // Anyone can submit an application
      allow create: if true;
      
      // Anyone can read with trackingId or if authenticated with @klu.ac.in
      allow read: if true;
      
      // Updates (status, ratings, interview slots) restricted to coordinators
      allow update, delete: if true;
    }
  }
}
```

---

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=AIzaSyD9p0w4GBGEL_j5x4AElT31ojy78klL5XY
VITE_FIREBASE_AUTH_DOMAIN=scrs-hiring.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scrs-hiring
VITE_FIREBASE_STORAGE_BUCKET=scrs-hiring.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=6337164630
VITE_FIREBASE_APP_ID=1:6337164630:web:eec6e45525c0e29c25d2f7
```

---

## 4. Run & Test Locally

```bash
npm install
npm run dev
```

1. Open `http://localhost:5173/` in your browser.
2. Click **Login** in the top navigation bar.
3. Sign in with your official `@klu.ac.in` Google Workspace account:
   - Coordinator accounts (e.g., `admin@klu.ac.in`, `scrs.admin@klu.ac.in`) automatically open the **Coordinator Review Dashboard**.
   - Student applicant accounts automatically open the **Application Status & Interview Tracker**.

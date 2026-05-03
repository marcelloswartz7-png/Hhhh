# Namibia Learner's License Pro - Setup & Deployment

This application is designed as a high-performance PWA for preparing for the Namibian Learner's License.

## Firebase Setup

Due to project creation quotas, you may need to manually link your Firebase project:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project named `Namibia License Pro`.
3.  Enable **Authentication** and enable **Google Login** / **Email & Password**.
4.  Enable **Cloud Firestore** in production mode.
5.  Deploy the security rules found in `firestore.rules`.
6.  Create a Web App in your Firebase project and copy the configuration.
7.  Create a file named `firebase-applet-config.json` in the root directory with the following structure:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "measurementId": "YOUR_MEASUREMENT_ID"
}
```

## Local Development

```bash
npm install
npm run dev
```

## Vercel Deployment

This project is optimized for deployment on Vercel:

1.  Connect your GitHub repository to Vercel.
2.  Vercel will automatically detect Vite.
3.  Add `GEMINI_API_KEY` to your Environment Variables in Vercel if you use AI features.
4.  The PWA manifest and service worker will be automatically generated on build.

## Features

- **Mobile First**: Optimized for touch inputs and small screens.
- **Offline Support**: Basic caching via Service Workers.
- **Progress Tracking**: Local storage fallback ensures stats are saved even without a complex backend.
- **Namibian Content**: Includes specific questions about Namibian road rules and signs.

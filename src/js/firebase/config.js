/**
 * Firebase configuration
 * Ersetze diese Werte mit deiner eigenen Firebase-Konfiguration
 * 
 * Anleitung:
 * 1. Gehe zu https://console.firebase.google.com/
 * 2. Erstelle ein neues Projekt
 * 3. Aktiviere "Realtime Database"
 * 4. Gehe zu Projekt-Einstellungen > Allgemein > Deine Apps > Web-App registrieren
 * 5. Kopiere die Konfiguration hierher
 */

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyA4K5veMW86XX3Djw-_yLY0a3dINLUvvts",
  authDomain: "haushalts-app-94d47.firebaseapp.com",
  databaseURL: "https://haushalts-app-94d47-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "haushalts-app-94d47",
  storageBucket: "haushalts-app-94d47.firebasestorage.app",
  messagingSenderId: "767347589868",
  appId: "1:767347589868:web:052c52a0121f1a91549bc9",
  measurementId: "G-GV7XESZJ4R"
};

// Flag, ob Firebase aktiviert ist (für Entwicklung ohne Firebase)
const ENABLE_FIREBASE = true; // Auf true setzen, wenn Firebase konfiguriert ist

export { firebaseConfig, ENABLE_FIREBASE };

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

// Deine Firebase-Konfiguration (wird später durch deine Werte ersetzt)
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// Flag, ob Firebase aktiviert ist (für Entwicklung ohne Firebase)
const ENABLE_FIREBASE = false; // Auf true setzen, wenn Firebase konfiguriert ist

export { firebaseConfig, ENABLE_FIREBASE };

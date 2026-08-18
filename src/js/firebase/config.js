/**
 * Firebase configuration
 * 
 * WICHTIG: Bevor Firebase funktioniert, musst du:
 * 1. Ein Firebase-Projekt erstellen: https://console.firebase.google.com/
 * 2. Die Realtime Database aktivieren:
 *    - Gehe zu "Realtime Database" in der Seitenleiste
 *    - Klicke auf "Datenbank erstellen"
 *    - Wähle den Modus "Testmodus" (für Entwicklung) oder "Lockere Regeln" (für Produktion)
 *    - Wähle einen Standort (z. B. "europe-west1")
 * 
 * 3. Eine Web-App registrieren:
 *    - Gehe zu Projekt-Einstellungen (Zahnrad-Icon) > "Deine Apps"
 *    - Klicke auf "Web-App hinzufügen" (</> Symbol)
 *    - Gib einen Namen ein (z. B. "Haushaltskosten-App")
 *    - Registriere die App
 * 
 * 4. Kopiere die Firebase-Konfiguration:
 *    - Nach der Registrierung wird ein Code-Snippet angezeigt
 *    - Kopiere den Inhalt von `const firebaseConfig = { ... };`
 *    - Ersetze damit die Platzhalter unten
 * 
 * 5. Aktiviere Firebase in dieser App:
 *    - Setze ENABLE_FIREBASE = true (siehe unten)
 * 
 * 6. Starte die App neu und prüfe die Browser-Konsole (F12) auf Fehler
 * 
 * Falls du Firebase nicht verwenden möchtest, bleibt ENABLE_FIREBASE = false.
 * Dann werden die Daten lokal im Browser (localStorage) gespeichert.
 */

// Deine Firebase-Konfiguration (ERSETZE DIESE PLATZHALTER MIT DEINEN WERTEN!)
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// Flag, ob Firebase aktiviert ist
// SETZE DIESEN WERT AUF TRUE, WENN DU FIREBASE VERWENDEN MÖCHTEST!
const ENABLE_FIREBASE = false;

export { firebaseConfig, ENABLE_FIREBASE };

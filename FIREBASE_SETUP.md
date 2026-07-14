# Firebase Setup Anleitung

Diese Anleitung hilft dir, Firebase für deine Haushaltskosten-App einzurichten.

## 🔥 Schritt 1: Firebase-Projekt erstellen

1. Gehe zu [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Klicke auf **"Projekt hinzufügen"**
3. Gib einen Namen für dein Projekt ein (z. B. "Haushaltskosten-App")
4. Akzeptiere die Nutzungsbedingungen und klicke auf **"Weiter"**
5. Deaktiviere Google Analytics (optional) und klicke auf **"Projekt erstellen"**

## 📁 Schritt 2: Realtime Database aktivieren

1. In deinem Firebase-Projekt, klicke im linken Menü auf **"Realtime Database"**
2. Klicke auf **"Datenbank erstellen"**
3. Wähle den **Standort** (z. B. `europe-west1` für Europa)
4. Beginne im **Testmodus** (für Entwicklung) - du kannst später die Sicherheitsregeln anpassen
5. Klicke auf **"Aktivieren"**

## 🌐 Schritt 3: Web-App registrieren

1. Klicke im linken Menü auf das **Zahnrad-Icon (⚙️) > "Projekteinstellungen"**
2. Scrolle nach unten zu **"Deine Apps"**
3. Klicke auf **"Web-App registrieren"** (</> Symbol)
4. Gib einen **App-Namen** ein (z. B. "Haushaltskosten-Web")
5. Klicke auf **"App registrieren"**

## 📋 Schritt 4: Firebase-Konfiguration kopieren

Nach der Registrierung siehst du deine Firebase-Konfiguration. Kopiere diesen Code:

```javascript
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};
```

## ✏️ Schritt 5: Konfiguration in der App eintragen

1. Öffne die Datei: `src/js/firebase/config.js`
2. Ersetze den Platzhalter-Code mit deiner Firebase-Konfiguration
3. Ändere `ENABLE_FIREBASE` von `false` zu `true`

```javascript
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};

const ENABLE_FIREBASE = true; // Auf true setzen!
```

## 🔒 Schritt 6: Sicherheitsregeln anpassen (optional)

**Wichtig:** Der Testmodus erlaubt jedem, deine Daten zu lesen und zu schreiben. Für die Produktion solltest du die Sicherheitsregeln anpassen.

1. Gehe zu **"Realtime Database" > "Regeln"**
2. Ersetze den Inhalt mit:

```json
{
  "rules": {
    "costs": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. Klicke auf **"Veröffentlichen"**

**Hinweis:** Mit diesen Regeln können nur authentifizierte Benutzer auf die Daten zugreifen. Du müsstest dann die Authentifizierung einrichten.

Für eine **öffentliche Demo** (ohne Authentifizierung) kannst du auch diese Regeln verwenden:

```json
{
  "rules": {
    "costs": {
      ".read": true,
      ".write": true
    }
  }
}
```

⚠️ **Achtung:** Dies erlaubt jedem, deine Daten zu lesen und zu ändern! Nur für Testzwecke verwenden.

## 🚀 Schritt 7: App testen

1. Starte deine App mit `npm run dev`
2. Öffne die Browser-Konsole (F12 > Console)
3. Du solltest sehen: `✅ Firebase ist aktiviert - Daten werden synchronisiert`
4. Füge einige Kosten hinzu und prüfe, ob sie in der Firebase-Console erscheinen

## 📊 Schritt 8: Daten in Firebase anzeigen

1. Gehe zu [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Wähle dein Projekt aus
3. Klicke auf **"Realtime Database"**
4. Du solltest deine Kosten unter dem Pfad `/costs` sehen

## 🔄 Synchronisation

- **Echtzeit-Updates:** Änderungen werden sofort synchronisiert
- **Offline-Unterstützung:** Die App speichert Daten auch lokal und synchronisiert sie, sobald die Verbindung wiederhergestellt ist
- **Fallback:** Falls Firebase nicht verfügbar ist, wird `localStorage` verwendet

## 🛠 Problembehebung

### Firebase wird nicht initialisiert
- Prüfe, ob `ENABLE_FIREBASE` auf `true` gesetzt ist
- Prüfe, ob die Firebase-Konfiguration korrekt kopiert wurde
- Prüfe die Browser-Konsole auf Fehler

### Daten werden nicht gespeichert
- Prüfe die Firebase-Console auf Fehler
- Prüfe, ob die Sicherheitsregeln korrekt sind
- Prüfe, ob du im richtigen Firebase-Projekt bist

### Daten werden nicht angezeigt
- Prüfe, ob die App mit Firebase verbunden ist
- Prüfe die Browser-Konsole auf Fehler
- Versuche, die Seite neu zu laden

## 📚 Weitere Ressourcen

- [Firebase Dokumentation](https://firebase.google.com/docs)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Sicherheitsregeln](https://firebase.google.com/docs/database/security)

---

**Hinweis:** Diese Anleitung gilt für die Haushaltskosten-App mit Firebase-Integration.

# 🔥 Firebase Setup Anleitung (2025)
*Für die Haushaltskosten-App*

Diese **aktualisierte Anleitung** führt dich Schritt für Schritt durch die Einrichtung von Firebase für deine Haushaltskosten-App.

---

## 📌 Vorraussetzungen
- Ein **Google-Konto** (für Firebase)
- Ein **Browser** (Chrome, Firefox, Edge, etc.)
- **Node.js** (optional, für lokale Tests)

---

## 🚀 Schritt 1: Firebase-Projekt erstellen

### 1.1 Firebase Console öffnen
👉 [https://console.firebase.google.com/](https://console.firebase.google.com/)

### 1.2 Neues Projekt anlegen
1. Klicke auf **"Projekt hinzufügen"** (oder **"Add project"**)
2. Gib einen **Projektnamen** ein (z. B. `Haushaltskosten-App`)
3. **Google Analytics** kann **deaktiviert** werden (für diese App nicht nötig)
4. Klicke auf **"Weiter"** (oder **"Continue"**)
5. Klicke auf **"Projekt erstellen"** (oder **"Create project"**)

✅ **Fertig!** Dein Firebase-Projekt ist erstellt.

---

## 🗃️ Schritt 2: Realtime Database einrichten

### 2.1 Realtime Database aktivieren
1. Wähle dein Projekt in der Firebase-Console aus
2. Klicke im linken Menü auf **"Realtime Database"** (unter "Build")
3. Klicke auf **"Datenbank erstellen"** (oder **"Create database"**)

### 2.2 Datenbank-Konfiguration
1. **Standort auswählen:**
   - Für **Europa**: `europe-west1` (Belgien) oder `europe-central2` (Deutschland)
   - Für **USA**: `us-central1` (Iowa)
   - Für **Asien**: `asia-southeast1` (Singapur)
   
   💡 **Empfehlung:** Wähle den Standort, der **geografisch am nächsten** zu deinen Nutzern ist.

2. **Sicherheitsmodus auswählen:**
   - **Testmodus** (für Entwicklung) ⚠️
     - Erlaubt **allen** das Lesen und Schreiben (unsicher für Produktion!)
     - Ideal für **lokale Tests**
   - **Lock-Modus** (sicher, aber keine Schreibrechte)
     - Nur Lesen erlaubt
   - **Benutzerdefiniert** (für Produktion)
     - Erfordert manuelle Konfiguration der Sicherheitsregeln

   👉 **Für diese Anleitung:** Wähle **"Testmodus"** und klicke auf **"Weiter"**

3. Klicke auf **"Aktivieren"** (oder **"Enable"**)

✅ **Fertig!** Die Realtime Database ist aktiviert.

---

## 🌐 Schritt 3: Web-App registrieren

### 3.1 App registrieren
1. Klicke im linken Menü auf das **⚙️ Zahnrad-Icon** (Projekteinstellungen)
2. Scrolle nach unten zu **"Deine Apps"** (oder **"Your apps"**)
3. Klicke auf **"Web-App registrieren"** (</> Symbol)

### 3.2 App-Details eingeben
1. **App-Nickname:** Gib einen Namen ein (z. B. `Haushaltskosten-Web`)
2. Klicke auf **"App registrieren"**

### 3.3 Firebase SDK kopieren
Nach der Registrierung siehst du deinen **Firebase-Konfigurationscode**. 
Kopiere **diesen gesamten Block** (er sieht so aus):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

✅ **Wichtig:** Kopiere **genau diesen Code** – du brauchst ihn für den nächsten Schritt!

---

## ✏️ Schritt 4: Firebase in der App konfigurieren

### 4.1 Konfigurationsdatei öffnen
Öffne in deinem Projekt die Datei:
```
src/js/firebase/config.js
```

### 4.2 Konfiguration einfügen
Ersetze den **Platzhalter-Code** mit deiner **echten Firebase-Konfiguration** und setze `ENABLE_FIREBASE` auf `true`:

```javascript
/**
 * Firebase configuration
 * Ersetze diese Werte mit deiner eigenen Firebase-Konfiguration
 */

const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT_ID.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT_ID.firebaseio.com",
  projectId: "DEIN_PROJEKT_ID",
  storageBucket: "DEIN_PROJEKT_ID.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// 👇 WICHTIG: Auf true setzen, um Firebase zu aktivieren!
const ENABLE_FIREBASE = true;

export { firebaseConfig, ENABLE_FIREBASE };
```

### 4.3 Änderungen speichern
Speichere die Datei (`Strg + S` oder `Cmd + S`).

---

## 🔥 Schritt 5: App testen

### 5.1 Entwicklungsserver starten
Führe im Terminal aus:
```bash
npm run dev
```

### 5.2 App im Browser öffnen
Öffne [http://localhost:5173](http://localhost:5173) (oder den angezeigten Port).

### 5.3 Firebase-Status prüfen
- **Grüne Meldung:** ✅ `"Firebase aktiv - Daten werden synchronisiert"`
  → Alles funktioniert! 🎉
- **Rote Meldung:** ℹ️ `"Firebase deaktiviert - Nutze localStorage"`
  → Prüfe die Konfiguration (siehe [Fehlerbehebung](#-fehlerbehebung))

### 5.4 Daten testen
1. Füge einige **Kosten** hinzu
2. Öffne die [Firebase Console](https://console.firebase.google.com/) 
3. Gehe zu **"Realtime Database"**
4. Prüfe, ob deine Daten unter `/costs` erscheinen

✅ **Fertig!** Deine App nutzt jetzt Firebase!

---

## 🔒 Schritt 6: Sicherheitsregeln anpassen (für Produktion)

⚠️ **WICHTIG:** Der **Testmodus** erlaubt **jedem**, deine Daten zu lesen und zu ändern! 
Für eine **sichere Produktion** musst du die Sicherheitsregeln anpassen.

### 6.1 Sicherheitsregeln öffnen
1. Gehe in der Firebase-Console zu **"Realtime Database"**
2. Klicke auf den Tab **"Regeln"** (oder **"Rules"**)

### 6.2 Regeln für öffentliche Nutzung (ohne Authentifizierung)
Falls du möchtest, dass **jeder** deine Daten **lesen und schreiben** kann (z. B. für eine Demo):

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

⚠️ **Achtung:** Dies ist **unsicher** – jeder kann deine Daten ändern oder löschen!

### 6.3 Regeln für private Nutzung (mit Authentifizierung)
Falls nur **angemeldete Benutzer** auf die Daten zugreifen sollen:

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

🔐 **Voraussetzung:** Du musst die [Firebase-Authentifizierung](#-optional-authentifizierung-hinzufügen) einrichten.

### 6.4 Regeln veröffentlichen
Klicke auf **"Veröffentlichen"** (oder **"Publish"**), um die Änderungen zu speichern.

---

## 📊 Schritt 7: Daten in Firebase verwalten

### 7.1 Daten anzeigen
1. Gehe zu **"Realtime Database"** in der Firebase-Console
2. Du siehst deine Daten unter `/costs` als JSON-Baum

### 7.2 Daten manuell bearbeiten
- Klicke auf einen **Eintrag**, um ihn zu bearbeiten
- Klicke auf **"Hinzufügen"** (oder **"Add"**), um manuell Daten hinzuzufügen
- Klicke auf **"Löschen"** (🗑️), um Daten zu entfernen

### 7.3 Daten exportieren/importieren
- Klicke auf **"⋮" (Mehr Optionen) > "JSON exportieren"**
- Klicke auf **"JSON importieren"**, um Daten hochzuladen

---

## 🔄 Optional: Authentifizierung hinzufügen

Falls du möchtest, dass **nur angemeldete Benutzer** Daten sehen können:

### 1. Authentifizierung aktivieren
1. Gehe zu **"Authentication"** (unter "Build")
2. Klicke auf **"Anmeldemethode hinzufügen"**
3. Wähle eine oder mehrere Methoden:
   - **E-Mail/Passwort** (einfachste Option)
   - **Google** (einfache Anmeldung)
   - **GitHub, Facebook, Twitter, etc.**

### 2. Sicherheitsregeln anpassen
Ändere die Regeln in der Realtime Database zu:

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

### 3. Authentifizierung in der App einrichten
Erstelle eine neue Datei `src/js/firebase/auth.js`:

```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { firebaseConfig } from './config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Login mit Google
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    return true;
  } catch (error) {
    console.error('Login fehlgeschlagen:', error);
    return false;
  }
}

/**
 * Logout
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout fehlgeschlagen:', error);
    return false;
  }
}

/**
 * Aktuellen Benutzer abrufen
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Auf Auth-Status-Änderungen reagieren
 */
export function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}
```

### 4. UI für Login/Logout hinzufügen
Füge in `index.html` einen Login-Button hinzu:

```html
<button id="loginBtn" class="btn">Mit Google anmelden</button>
<button id="logoutBtn" class="btn btn-danger" style="display: none;">Abmelden</button>
```

Und in `app.js`:

```javascript
import { signInWithGoogle, signOutUser, onAuthStateChanged } from './firebase/auth.js';

// Login-Button initialisieren
document.getElementById('loginBtn')?.addEventListener('click', signInWithGoogle);
document.getElementById('logoutBtn')?.addEventListener('click', signOutUser);

// Auth-Status überwachen
onAuthStateChanged((user) => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
});
```

---

## 🛠 Fehlerbehebung

### ❌ Problem: Firebase wird nicht initialisiert
**Symptome:**
- Rote Meldung: `"Firebase deaktiviert - Nutze localStorage"`
- Keine Daten in Firebase

**Lösungen:**
1. **Prüfe `ENABLE_FIREBASE`:**
   - Öffne `src/js/firebase/config.js`
   - Stelle sicher, dass `ENABLE_FIREBASE = true` ist

2. **Prüfe die Firebase-Konfiguration:**
   - Kopiere die Konfiguration **genau** aus der Firebase-Console
   - Achte auf **Anführungszeichen** und **Kommas**

3. **Prüfe die Browser-Konsole (F12):**
   - Gibt es Fehler wie `Firebase not defined`?
   - Wird die Firebase-SDK geladen?

4. **Prüfe die Internetverbindung:**
   - Firebase benötigt eine **Internetverbindung**
   - Teste mit einem anderen Browser

---

### ❌ Problem: Daten werden nicht gespeichert
**Symptome:**
- Daten erscheinen nicht in der Firebase-Console
- Keine Fehler in der Browser-Konsole

**Lösungen:**
1. **Prüfe die Sicherheitsregeln:**
   - Gehe zu **"Realtime Database" > "Regeln"**
   - Stelle sicher, dass `.read` und `.write` auf `true` stehen (für Testmodus)

2. **Prüfe den Datenbank-Pfad:**
   - Die App speichert Daten unter `/costs`
   - Prüfe, ob der Pfad in der Firebase-Console existiert

3. **Prüfe die Browser-Konsole:**
   - Gibt es Fehler wie `Permission denied`?
   - Falls ja: Sicherheitsregeln anpassen

---

### ❌ Problem: Daten werden nicht angezeigt
**Symptome:**
- Die App zeigt keine Daten an
- Firebase-Console zeigt Daten, aber die App nicht

**Lösungen:**
1. **Prüfe die Sicherheitsregeln:**
   - `.read` muss auf `true` stehen (für Testmodus)

2. **Prüfe die Browser-Konsole:**
   - Gibt es Fehler wie `Failed to load data`?

3. **Cache leeren:**
   - Lösche den Browser-Cache und lade die Seite neu

---

### ❌ Problem: Firebase-SDK wird nicht geladen
**Symptome:**
- Fehler: `Firebase is not defined`
- Firebase-Funktionen funktionieren nicht

**Lösungen:**
1. **Prüfe die Skript-Tags in `index.html`:**
   ```html
   <!-- Firebase SDK (muss VOR dem App-Skript geladen werden) -->
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
   ```

2. **Prüfe die Reihenfolge:**
   - Firebase-SDKs **müssen vor** `app.js` geladen werden

3. **Prüfe die Internetverbindung:**
   - Firebase-SDKs werden von Google geladen
   - Falls blockiert: Prüfe Firewall/Ad-Blocker

---

## 📚 Nützliche Ressourcen

- **[Firebase Console](https://console.firebase.google.com/)** – Projektverwaltung
- **[Firebase Dokumentation](https://firebase.google.com/docs)** – Offizielle Docs
- **[Firebase Realtime Database](https://firebase.google.com/docs/database)** – Datenbank-Dokumentation
- **[Firebase Sicherheitsregeln](https://firebase.google.com/docs/database/security)** – Regeln anpassen
- **[Firebase Authentifizierung](https://firebase.google.com/docs/auth)** – Benutzerverwaltung

---

## 💡 Tipps & Best Practices

### 🔹 Datenbank-Struktur
- **Pfad:** `/costs` (alle Kosten)
- **Struktur:**
  ```json
  {
    "-Nxyz123": {
      "person": "Max",
      "amount": 50.00,
      "reason": "Einkaufen",
      "category": "Lebensmittel",
      "date": "2025-01-15"
    }
  }
  ```

### 🔹 Offline-Unterstützung
- Firebase speichert Daten **lokal im Cache**
- Änderungen werden **automatisch synchronisiert**, sobald die Verbindung wiederhergestellt ist
- **Fallback:** Falls Firebase nicht verfügbar ist, nutzt die App `localStorage`

### 🔹 Performance-Optimierung
- **Indizes:** Für große Datenmengen kannst du Indizes erstellen
- **Datenbereinigung:** Lösche alte Daten regelmäßig
- **Sicherheitsregeln:** Passe sie an, um unerlaubten Zugriff zu verhindern

---

## 🎯 Zusammenfassung

| **Schritt** | **Aktion** | **Status** |
|------------|------------|------------|
| 1 | Firebase-Projekt erstellen | ✅ |
| 2 | Realtime Database aktivieren | ✅ |
| 3 | Web-App registrieren | ✅ |
| 4 | Konfiguration in `config.js` einfügen | ✅ |
| 5 | App testen | ✅ |
| 6 | Sicherheitsregeln anpassen | ⚠️ (Optional) |
| 7 | Authentifizierung hinzufügen | ⚠️ (Optional) |

---

## 🚀 Fertig! 🎉

Deine Haushaltskosten-App nutzt jetzt **Firebase** für:
- ✅ **Echtzeit-Synchronisation** (Änderungen erscheinen sofort auf allen Geräten)
- ✅ **Cloud-Speicherung** (Daten gehen nicht verloren)
- ✅ **Offline-Unterstützung** (Funktioniert auch ohne Internet)
- ✅ **Fallback zu localStorage** (Sicherheit durch Redundanz)

**Viel Spaß mit deiner App!** 😊

---

*Letzte Aktualisierung: Januar 2025*
*Firebase-Version: 10.7.1*

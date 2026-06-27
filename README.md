# Haushaltskosten-App

[![HTML/CSS/JS Validation](https://github.com/JoeDus-prog/Haushaltskosten-app/actions/workflows/html-validate.yml/badge.svg)](https://github.com/JoeDus-prog/Haushaltskosten-app/actions/workflows/html-validate.yml)
[![Deploy to GitHub Pages](https://github.com/JoeDus-prog/Haushaltskosten-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/JoeDus-prog/Haushaltskosten-app/actions/workflows/deploy.yml)

Eine einfache **Web-App zur Verwaltung von Haushaltskosten** (z. B. für Lebensmittel, Kosmetikartikel, Strom, Miete), um stets einen konkreten und schnellen Überblick über die Ausgaben zu haben.

🔒 **100% Client-seitig** - Alle Daten bleiben auf deinem Gerät! Keine Server, keine Cloud, keine Registrierung.

## 🌟 Neue Features in Version 1.1.0

- ✅ **XSS-Schutz** - Sichere Datenverarbeitung
- ✅ **Suche & Filter** - Kosten nach Name, Grund oder Betrag suchen
- ✅ **Sortierfunktion** - Nach Name, Betrag oder Datum sortieren
- ✅ **CSV Export/Import** - Daten sichern und wiederherstellen
- ✅ **Dark Mode** - Automatische Anpassung an Systemeinstellungen
- ✅ **Barrierefreiheit** - Bessere Bedienbarkeit für alle Nutzer
- ✅ **Toast Notifications** - Benutzerfreundliche Rückmeldungen
- ✅ **Responsive Design** - Optimiert für alle Geräte

## 🎯 Funktionen

### Grundfunktionen
- **Kosten hinzufügen**: Name, Betrag und Grund eingeben
- **Kosten löschen**: Einträge mit Bestätigungsdialog entfernen
- **Alle löschen**: Komplettes Zurücksetzen der Daten
- **Gesamtübersicht**: Automatische Berechnung der Gesamtsumme
- **Datenpersistenz**: Alle Einträge werden im Browser gespeichert (`localStorage`)

### Erweiterte Funktionen
- **Suche**: Kosten nach Name, Grund oder Betrag filtern
- **Sortieren**: Nach Person (A-Z), Betrag (höchste/niedrigste) oder Datum
- **Zeitfilter**: Kosten nach heute, dieser Woche oder diesem Monat filtern
- **Export**: Alle Daten als CSV-Datei exportieren
- **Import**: Daten aus CSV-Datei importieren
- **Benachrichtigungen**: Visuelle Rückmeldungen für Aktionen

## 🚀 Schnellstart

### Option 1: Direkt im Browser öffnen
1. Lade die Dateien herunter oder klone das Repository
2. Öffne die `index.html` in deinem Browser
3. Beginne mit dem Hinzufügen von Kosten

### Option 2: Lokale Entwicklung
```bash
# Repository klonen
git clone https://github.com/JoeDus-prog/Haushaltskosten-app.git

# In den Projektordner wechseln
cd Haushaltskosten-app

# Lokale Entwicklungsumgebung starten (optional)
npm install
npm run dev

# Oder einfach index.html im Browser öffnen
```

### Option 3: GitHub Pages
Die App ist automatisch auf GitHub Pages verfügbar:
👉 [https://joedus-prog.github.io/Haushaltskosten-app/](https://joedus-prog.github.io/Haushaltskosten-app/)

## 📁 Projektstruktur

```
Haushaltskosten-app/
├── index.html          # Haupt-HTML-Datei
├── README.md           # Projektbeschreibung
├── SECURITY.md         # Sicherheitsrichtlinien
├── package.json        # Projektkonfiguration
├── .eslintrc.json      # ESLint-Konfiguration
├── .gitignore          # Ignorierte Dateien
├── /src
│   ├── app.js          # JavaScript-Logik (Klassen-basiert)
│   └── styles.css      # CSS-Stile mit Variablen & Dark Mode
└── /assets             # Für Bilder/Icons
    ├── /images
    └── /icons
```

## 🛠 Technologien

- **HTML5** – Struktur der Webseite
- **CSS3** – Styling, Responsive Design, Dark Mode
- **Vanilla JavaScript (ES6+)** – Logik und Interaktivität
- **localStorage** – Speicherung der Daten im Browser
- **GitHub Actions** – Automatische Validierung und Deployment

## 💡 Verwendung

### Kosten hinzufügen
1. **Name** der Person eingeben (z. B. "Max")
2. **Betrag** in Euro angeben (z. B. "50.00")
3. Optional: **Grund** angeben (z. B. "Einkaufen")
4. Auf **"Hinzufügen"** klicken

### Kosten verwalten
- **Löschen**: Klicke auf den "Löschen"-Button neben dem Eintrag
- **Alle löschen**: Klicke auf "Alle löschen" (mit Bestätigung)
- **Suche**: Nutze das Suchfeld, um Kosten zu finden
- **Sortieren**: Wähle eine Sortieroption aus dem Dropdown
- **Filtern**: Filtere nach Zeiträumen (heute, Woche, Monat)

### Daten exportieren/importieren
- **Export**: Klicke auf "Exportieren", um eine CSV-Datei herunterzuladen
- **Import**: Klicke auf "Importieren" und wähle eine CSV-Datei aus

## 📊 Datenformat

Die Kosten werden als JSON-Array im `localStorage` gespeichert:

```json
[
  {
    "person": "Max",
    "amount": "50.00",
    "reason": "Einkaufen",
    "date": "2024-01-15T12:00:00.000Z"
  },
  {
    "person": "Anna",
    "amount": "30.00",
    "reason": "Strom",
    "date": "2024-01-16T10:30:00.000Z"
  }
]
```

CSV-Export-Format:
```csv
"Datum","Person","Betrag (€)","Grund"
"15.01.2024","Max","50.00","Einkaufen"
"16.01.2024","Anna","30.00","Strom"
```

## 🎨 Design & Anpassungen

### Farbschema
Die App nutzt CSS-Variablen für einfaches Theming:

```css
:root {
  --primary-color: #3498db;
  --danger-color: #e74c3c;
  --success-color: #2ecc71;
  /* ... weitere Variablen */
}
```

### Dark Mode
Die App unterstützt automatisch den Dark Mode basierend auf den Systemeinstellungen.

### Responsive Design
- **Mobile**: Optimiert für kleine Bildschirme
- **Tablet**: Angepasste Layouts für mittlere Bildschirme
- **Desktop**: Volle Funktionalität auf großen Bildschirmen

## 🔒 Sicherheit

### Geschützte Funktionen
- ✅ **XSS-Schutz**: Alle Benutzereingaben werden mit `textContent` (nicht `innerHTML`) eingefügt
- ✅ **Input-Validierung**: Formulareingaben werden validiert
- ✅ **Keine Server-Kommunikation**: Alle Daten bleiben lokal
- ✅ **Bestätigungsdialoge**: Wichtige Aktionen erfordern Bestätigung

### Sicherheitsrichtlinien
Siehe [SECURITY.md](SECURITY.md) für detaillierte Informationen.

## 🧪 Testing

### Automatische Tests
Die App enthält integrierte Tests, die in der Browser-Konsole ausgeführt werden können:

```javascript
// In der Browser-Konsole ausführen
runTests();
```

Oder direkt beim Laden:
```
// URL mit Test-Parameter
index.html?test=true
```

### Manuelles Testen
1. Kosten hinzufügen und löschen
2. Suche und Filter testen
3. Export und Import testen
4. Dark Mode aktivieren (Systemeinstellungen)
5. Responsive Design auf verschiedenen Geräten testen

## 📦 Entwicklung

### Voraussetzungen
- Node.js (optional, für Entwicklungstools)
- Moderner Browser (Chrome, Firefox, Safari, Edge)

### Entwicklungsumgebung
```bash
# Abhängigkeiten installieren
npm install

# Lokale Entwicklungsserver starten
npm run dev

# Code formatieren
npm run format

# Code prüfen
npm run lint
```

### Build für Produktion
```bash
# Einfacher Build (alle Dateien kopieren)
mkdir -p dist
cp index.html src/* assets/* dist/
```

## 🤝 Beitrag leisten

1. **Forke** das Repository
2. **Erstelle** einen Feature-Branch (`git checkout -b feat/neue-funktion`)
3. **Commite** deine Änderungen (`git commit -m 'feat: neue Funktion hinzufügen'`)
4. **Push** zum Branch (`git push origin feat/neue-funktion`)
5. **Öffne** einen Pull Request

### Beitragsrichtlinien
- Folge den bestehenden Code-Stil
- Füge Kommentare für komplexe Logik hinzu
- Teste deine Änderungen
- Aktualisiere die Dokumentation

## 🚀 Erweiterungsmöglichkeiten

- [ ] **Kategorien**: Kosten nach Kategorien filtern (z. B. "Lebensmittel", "Haushalt")
- [ ] **Diagramme**: Visualisierung der Ausgaben mit Chart.js
- [ ] **Benutzerverwaltung**: Mehrere Nutzer mit eigenen Budgets
- [ ] **Budget-Limits**: Warnungen bei Überschreitung von Limits
- [ ] **Wiederkehrende Kosten**: Automatische Einträge für regelmäßige Ausgaben
- [ ] **Mehrsprachigkeit**: Unterstützung für weitere Sprachen
- [ ] **Backend-Integration**: Optionale Speicherung in einer Datenbank (z. B. Firebase)
- [ ] **PWA**: Installierbare Progressive Web App

## 📜 Lizenz

Dieses Projekt ist Open Source und steht unter der [MIT-Lizenz](LICENSE).

## 👤 Autor

**JoeDus-prog**
- GitHub: [@JoeDus-prog](https://github.com/JoeDus-prog)
- E-Mail: [joedus.prog@gmail.com](mailto:joedus.prog@gmail.com)

## 🙏 Dank

- Allen Nutzern, die die App testen und Feedback geben
- Der Open-Source-Community für Inspiration und Tools

---

**⭐ Star dieses Repository, wenn es dir gefällt!**

**🐛 Bugs melden oder 💡 Feature-Anfragen stellen:** [Issues](https://github.com/JoeDus-prog/Haushaltskosten-app/issues)

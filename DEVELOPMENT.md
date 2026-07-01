# Entwicklungshandbuch

Dieses Dokument beschreibt die Entwicklungsumgebung und verfügbaren Skripte für die Haushaltskosten-App.

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18.x oder höher
- npm oder yarn

### Installation

```bash
# Abhängigkeiten installieren
npm install
```

## 📋 Verfügbare Skripte

| Skript | Beschreibung |
|--------|--------------|
| `npm run lint` | Führt ESLint für alle JavaScript-Dateien aus |
| `npm run lint:fix` | Führt ESLint aus und behebt automatisch behebbare Probleme |
| `npm run format` | Formatiert alle Code-Dateien mit Prettier |
| `npm test` | Führt alle Tests mit Jest aus |
| `npm run test:watch` | Führt Tests im Watch-Modus aus (automatische Neuausführung bei Änderungen) |
| `npm run test:coverage` | Führt Tests aus und generiert einen Coverage-Report |
| `npm run validate` | Führt Linting, Formatierung und Tests aus |

## 🛠 Entwicklungstools

### ESLint

ESLint wird für die Code-Qualität verwendet. Die Konfiguration befindet sich in `.eslintrc.json`.

**Regeln:**
- Keine `console.log`-Aufrufe (nur `console.error` erlaubt)
- Keine ungenutzten Variablen
- Verwendung von `const` statt `var`
- Strenge Gleichheitsprüfung (`===` statt `==`)
- JSDoc-Kommentare für Funktionen erforderlich

### Prettier

Prettier wird für die Code-Formatierung verwendet. Die Konfiguration befindet sich in `.prettierrc`.

**Einstellungen:**
- Semikolons: Ja
- Einfache Anführungszeichen
- Zeilenlänge: 100 Zeichen
- Einrückung: 2 Leerzeichen

### Jest

Jest wird für das Testen verwendet. Die Konfiguration befindet sich in `jest.config.js`.

**Test-Struktur:**
- Tests befinden sich im `tests/` Verzeichnis
- Test-Dateien haben das Suffix `.test.js`
- Mocks für Browser-APIs (localStorage, DOM) sind in `tests/setup.js` definiert

## 📁 Projektstruktur

```
Haushaltskosten-app/
├── index.html              # Haupt-HTML-Datei
├── src/
│   ├── app.js              # Hauptanwendung (ES Modules)
│   ├── app.browser.js      # Browser-freundliche Version (ohne Modules)
│   ├── storage.js          # Storage-Funktionen
│   ├── utils.js            # Utility-Funktionen
│   └── styles.css          # CSS-Stile
├── tests/
│   ├── app.test.js         # Tests für die Anwendung
│   └── setup.js            # Jest-Setup
├── .eslintrc.json          # ESLint-Konfiguration
├── .prettierrc             # Prettier-Konfiguration
├── jest.config.js          # Jest-Konfiguration
├── package.json            # npm-Konfiguration
└── DEVELOPMENT.md          # Dieses Dokument
```

## 🔧 Modularisierung

Die Anwendung ist in folgende Module aufgeteilt:

### storage.js
- `loadCosts()` - Lädt Kosten aus localStorage
- `saveCosts(costs)` - Speichert Kosten in localStorage

### utils.js
- `calculateTotal(costs)` - Berechnet den Gesamtbetrag
- `formatCurrency(amount)` - Formatiert Beträge als Währung
- `escapeHtml(text)` - Escaped HTML-Sonderzeichen (XSS-Schutz)
- `createCostElement(cost, index)` - Erstellt HTML-Elemente für Kosteneinträge

### app.js / app.browser.js
- Hauptanwendungslogik
- Event-Handler
- Export/Import-Funktionen
- Initialisierung

## 🧪 Testen

### Unit Tests

Tests decken folgende Funktionen ab:
- `loadCosts()` und `saveCosts()`
- `calculateTotal()`
- `formatCurrency()`
- `escapeHtml()`
- `createCostElement()`

### Integration Tests

Tests für das Zusammenspiel mehrerer Funktionen:
- Speichern und Laden von Kosten
- Berechnung des Gesamtbetrags nach Speichern/Laden
- Filtern von ungültigen Einträgen

### Testen ausführen

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus (für Entwicklung)
npm run test:watch

# Tests mit Coverage-Report
npm run test:coverage
```

## 🎨 Code-Qualität

### Linting

```bash
# Code prüfen
npm run lint

# Code automatisch reparieren
npm run lint:fix
```

### Formatierung

```bash
# Code formatieren
npm run format
```

### Vollständige Validierung

```bash
# Linting, Formatierung und Tests
npm run validate
```

## 🌐 Browser-Kompatibilität

Die Anwendung unterstützt zwei Modi:

1. **ES Modules** (moderne Browser)
   - Wird durch `<script type="module">` geladen
   - Besser für Entwicklung und Modularisierung

2. **Browser-Version** (Fallback)
   - Wird durch `<script nomodule>` geladen
   - Für ältere Browser ohne Module-Unterstützung

## 📦 Deployment

### GitHub Pages

Die Anwendung kann direkt auf GitHub Pages deployed werden:

1. GitHub Pages aktivieren
2. `main` Branch als Quelle auswählen
3. Die `index.html` wird automatisch geladen

### Manuelles Deployment

Einfach alle Dateien auf einen Webserver kopieren. Es sind keine Build-Schritte erforderlich.

## 🔄 Continuous Integration

Die GitHub Actions Workflow-Datei (`.github/workflows/html-css-js.yml`) führt folgende Schritte aus:

1. Code auschecken
2. Node.js einrichten
3. Abhängigkeiten installieren
4. ESLint ausführen
5. Tests ausführen

## 📚 Nützliche Ressourcen

- [ESLint Dokumentation](https://eslint.org/docs/user-guide/getting-started)
- [Prettier Dokumentation](https://prettier.io/docs/en/index.html)
- [Jest Dokumentation](https://jestjs.io/docs/getting-started)
- [MDN Web Docs](https://developer.mozilla.org/)

## 🤝 Beitrag leisten

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feat/neue-funktion`)
3. Commite deine Änderungen (`git commit -m 'feat: neue Funktion hinzufügen'`)
4. Push zum Branch (`git push origin feat/neue-funktion`)
5. Öffne einen Pull Request

### Commit-Nachrichten

Bitte halte dich an die [Conventional Commits](https://www.conventionalcommits.org/) Konvention:

- `feat:` - Neue Funktion
- `fix:` - Bugfix
- `docs:` - Dokumentationsänderungen
- `style:` - Code-Formatierung (keine funktionalen Änderungen)
- `refactor:` - Code-Refactoring (keine neuen Funktionen oder Bugfixes)
- `test:` - Tests hinzufügen oder ändern
- `chore:` - Sonstige Änderungen (z.B. Build-Konfiguration)

### Pull Requests

- Beschreibe deine Änderungen detailliert
- Füge Screenshots hinzu, falls die UI betroffen ist
- Verlinke auf relevante Issues
- Stelle sicher, dass alle Tests passieren
- Führe `npm run validate` vor dem Push aus

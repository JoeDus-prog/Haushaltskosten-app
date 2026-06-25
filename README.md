# Haushaltskosten-App

Eine einfache Web-App zur Verwaltung von Haushaltskosten (z. B. für Lebensmittel, Kosmetikartikel, Strom, Miete), um stets einen konkreten und schnellen Überblick über die Ausgaben zu haben.

## ✨ Funktionen

- **Kosten hinzufügen**: Name, Betrag und Grund eingeben
- **Kosten löschen**: Einträge mit einem Klick entfernen
- **Gesamtübersicht**: Automatische Berechnung der Gesamtsumme
- **Datenpersistenz**: Alle Einträge werden im Browser gespeichert (`localStorage`)
- **Responsive Design**: Optimiert für Desktop und Mobile

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

# index.html im Browser öffnen
```

## 📁 Projektstruktur

```
Haushaltskosten-app/
├── index.html          # Haupt-HTML-Datei
├── README.md           # Projektbeschreibung
├── /src
│   ├── app.js          # JavaScript-Logik (Datenverwaltung)
│   └── styles.css      # CSS-Stile
└── /assets             # Für Bilder/Icons (optional)
```

## 🛠 Technologien

- **HTML5** – Struktur der Webseite
- **CSS3** – Styling und Responsive Design
- **Vanilla JavaScript** – Logik und Interaktivität
- **localStorage** – Speicherung der Daten im Browser

## 💡 Verwendung

1. **Kosten hinzufügen**:
   - Name der Person eingeben (z. B. "Max")
   - Betrag in Euro angeben (z. B. "50.00")
   - Optional: Grund angeben (z. B. "Einkaufen")
   - Auf "Hinzufügen" klicken

2. **Kosten löschen**:
   - Klicke auf den "Löschen"-Button neben dem Eintrag

3. **Gesamtsumme**:
   - Wird automatisch aktualisiert und angezeigt

## 📝 Datenformat

Die Kosten werden als JSON-Array im `localStorage` gespeichert:

```json
[
  {
    "person": "Max",
    "amount": "50.00",
    "reason": "Einkaufen"
  },
  {
    "person": "Anna",
    "amount": "30.00",
    "reason": "Strom"
  }
]
```

## 🔧 Erweiterungsmöglichkeiten

- [ ] **Kategorien**: Kosten nach Kategorien filtern (z. B. "Lebensmittel", "Haushalt")
- [ ] **Diagramme**: Visualisierung der Ausgaben mit Chart.js
- [ ] **Benutzerverwaltung**: Mehrere Nutzer mit eigenen Budgets
- [ ] **Export/Import**: Daten als CSV/JSON exportieren/importieren
- [ ] **Backend-Integration**: Speicherung in einer Datenbank (z. B. Firebase)
- [ ] **Mehrsprachigkeit**: Unterstützung für weitere Sprachen

## 🤝 Beitrag leisten

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feat/neue-funktion`)
3. Commite deine Änderungen (`git commit -m 'feat: neue Funktion hinzufügen'`)
4. Push zum Branch (`git push origin feat/neue-funktion`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist Open Source und kann frei verwendet werden.

---

**Autor**: [JoeDus-prog](https://github.com/JoeDus-prog)

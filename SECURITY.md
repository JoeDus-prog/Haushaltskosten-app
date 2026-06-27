# Security Policy

## 📋 Supported Versions

| Version | Supported          | Release Date |
| ------- | ------------------ | ------------ |
| 1.x     | :white_check_mark: | 2024        |

## 🔒 Security Overview

Die **Haushaltskosten-App** ist eine **reine Client-seitige Webanwendung** ohne Server-Komponenten. Alle Daten werden lokal im Browser gespeichert (`localStorage`).

### ✅ Sicherheitsmaßnahmen

- **Keine Server-Kommunikation** - Keine API-Aufrufe, keine Datenübertragung
- **localStorage** - Alle Daten bleiben auf dem lokalen Gerät des Nutzers
- **Input-Validierung** - Formulareingaben werden validiert
- **XSS-Schutz** - Alle Benutzereingaben werden mit `textContent` (nicht `innerHTML`) eingefügt
- **Keine externen Abhängigkeiten** - Keine npm-Pakete, keine CDN-Skripte

### ⚠️ Potenzielle Risiken

| Risiko | Status | Maßnahme |
| ------ | ------ | -------- |
| **XSS (Cross-Site Scripting)** | ✅ Geschützt | Verwendung von `textContent` statt `innerHTML` |
| **Datenverlust** | ⚠️ Client-seitig | Nutzer muss Browser-Daten sichern |
| **CSRF** | ✅ Nicht relevant | Keine Server-Kommunikation |
| **SQL Injection** | ✅ Nicht relevant | Keine Datenbank |

## 📧 Reporting a Vulnerability

Falls du ein Sicherheitsproblem in diesem Projekt findest:

1. **Öffne ein Issue** auf GitHub mit dem Label `security`
2. **Beschreibe das Problem** detailliert
3. **Gib Schritte zur Reproduktion** an
4. **Warte auf Rückmeldung** - Ich reagiere innerhalb von 48 Stunden

### 🔐 Responsible Disclosure

Ich bitte darum, Sicherheitslücken **nicht öffentlich** zu diskutieren, bis ein Fix verfügbar ist.

## 🛡️ Security Best Practices für Nutzer

1. **Browser aktualisieren** - Nutze immer die neueste Version deines Browsers
2. **Private Geräte** - Nutze die App nur auf vertrauenswürdigen Geräten
3. **Daten Backup** - Exportiere regelmäßig deine Daten über die Export-Funktion
4. **Browser-Sicherheit** - Aktiviere die Sicherheitsfunktionen deines Browsers

## 📚 Security Checklist für Entwickler

- [x] Alle Benutzereingaben werden escaped
- [x] Keine Verwendung von `innerHTML` mit Benutzerdaten
- [x] Input-Validierung auf Client-Seite
- [x] Keine externen Skripte ohne Integritätsprüfung
- [x] Keine sensiblen Daten in der App
- [ ] Content Security Policy (CSP) Header (für zukünftige Server-Integration)

---

**Autor**: [JoeDus-prog](https://github.com/JoeDus-prog)  
**Letzte Aktualisierung**: 2024

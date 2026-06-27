/**
 * Jest Setup File
 * Wird vor jedem Test ausgeführt
 */

// Mock für DOM-Elemente
beforeEach(() => {
  // Standard DOM-Elemente erstellen
  document.body.innerHTML = `
    <div class="container">
      <form id="costForm" class="cost-form">
        <div class="form-group">
          <input type="text" id="person" placeholder="Name" required>
        </div>
        <div class="form-group">
          <input type="number" id="amount" placeholder="Betrag (€)" step="0.01" required>
        </div>
        <div class="form-group">
          <input type="text" id="reason" placeholder="Grund (z. B. Einkaufen)">
        </div>
        <button type="submit" class="btn">Hinzufügen</button>
      </form>

      <div class="summary" id="summary">
        <p>Gesamt: <span id="totalAmount">0€</span></p>
      </div>

      <ul id="costList" class="cost-list"></ul>
    </div>
  `;
});

// Mock für console.error, um Warnungen zu unterdrücken
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock für alert
window.alert = jest.fn();

// Mock für confirm
window.confirm = jest.fn(() => true);

// Mock für URL.createObjectURL und URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn((blob) => 'mock-url'),
  writable: true,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
});

// Mock für Blob
window.Blob = class Blob {
  constructor(content, options) {
    this.content = content;
    this.options = options;
  }
};

// Mock für FileReader
window.FileReader = class FileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }

  readAsText(file) {
    if (this.onload) {
      this.onload({ target: { result: JSON.stringify(file.content) } });
    }
  }
};

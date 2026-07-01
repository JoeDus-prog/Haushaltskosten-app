/**
 * Haushaltskosten-App - Browser Version (ohne ES Modules)
 * Verwaltung von Haushaltskosten mit localStorage
 * 
 * @module app
 */

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Lädt Kosten aus localStorage
 * @returns {Array<Object>} Array von Kosteneinträgen
 */
function loadCosts() {
  try {
    const savedCosts = localStorage.getItem('haushaltskosten');
    return savedCosts ? JSON.parse(savedCosts) : [];
  } catch (error) {
    console.error('Fehler beim Laden der Kosten:', error);
    return [];
  }
}

/**
 * Speichert Kosten in localStorage
 * @param {Array<Object>} costs - Array von Kosteneinträgen
 */
function saveCosts(costs) {
  try {
    // Validierung: Nur gültige Einträge speichern
    const validCosts = costs.filter(cost => 
      cost && cost.person && cost.amount !== undefined
    );
    localStorage.setItem('haushaltskosten', JSON.stringify(validCosts));
  } catch (error) {
    console.error('Fehler beim Speichern der Kosten:', error);
    // Fallback: Leeres Array speichern
    localStorage.setItem('haushaltskosten', JSON.stringify([]));
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Berechnet den Gesamtbetrag aller Kosten
 * @param {Array<Object>} costs - Array von Kosteneinträgen
 * @returns {number} Gesamtbetrag
 */
function calculateTotal(costs) {
  return costs.reduce((total, cost) => {
    const amount = parseFloat(cost.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

/**
 * Formatiert einen Betrag als Währung
 * @param {number|string} amount - Betrag
 * @returns {string} Formatierter Betrag mit 2 Dezimalstellen
 */
function formatCurrency(amount) {
  const num = parseFloat(amount);
  return isNaN(num) ? '0.00' : num.toFixed(2);
}

/**
 * Escaped HTML-Sonderzeichen zur XSS-Prävention
 * @param {string} text - Text zum Escapen
 * @returns {string} Escapeter Text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Erstellt ein HTML-Element für einen Kosteneintrag
 * @param {Object} cost - Kosteneintrag
 * @param {number} index - Index des Eintrags
 * @returns {HTMLElement} li-Element
 */
function createCostElement(cost, index) {
  const li = document.createElement('li');
  li.className = 'cost-item';
  li.setAttribute('data-index', index);
  
  li.innerHTML = `
    <div class="cost-info">
      <span class="cost-person">${escapeHtml(cost.person)}</span>:
      <span class="cost-amount">${formatCurrency(cost.amount)}€</span>
      ${cost.reason ? `<span class="cost-reason">(${escapeHtml(cost.reason)})</span>` : ''}
    </div>
    <button class="delete-btn" data-index="${index}" aria-label="Eintrag löschen">
      Löschen
    </button>
  `;
  return li;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Zeigt alle Kosten in der Liste an
 */
function renderCosts() {
  const costs = loadCosts();
  const costList = document.getElementById('costList');
  const totalAmount = document.getElementById('totalAmount');

  // Liste leeren
  costList.innerHTML = '';

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = createCostElement(cost, index);
    costList.appendChild(li);
  });

  // Gesamtbetrag aktualisieren
  const total = calculateTotal(costs);
  totalAmount.textContent = `${formatCurrency(total)}€`;
  
  // ARIA-Live-Region für Screenreader
  totalAmount.setAttribute('aria-live', 'polite');
}

/**
 * Fügt einen neuen Kosteneintrag hinzu
 * @param {string} person - Name der Person
 * @param {string|number} amount - Betrag
 * @param {string} [reason=''] - Grund für die Kosten
 */
function addCost(person, amount, reason = '') {
  const costs = loadCosts();
  
  // Betrag als Zahl formatieren
  const amountNum = parseFloat(amount);
  
  // Validierung
  if (isNaN(amountNum) || amountNum <= 0) {
    throw new Error('Betrag muss eine positive Zahl sein');
  }
  
  const newCost = {
    person: person.trim(),
    amount: formatCurrency(amountNum),
    reason: reason.trim(),
    createdAt: new Date().toISOString()
  };
  
  costs.push(newCost);
  saveCosts(costs);
  renderCosts();
}

/**
 * Löscht einen Kosteneintrag
 * @param {number} index - Index des zu löschenden Eintrags
 */
function deleteCost(index) {
  if (index < 0) return;
  
  const costs = loadCosts();
  
  // Bestätigungsdialog
  if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
    costs.splice(index, 1);
    saveCosts(costs);
    renderCosts();
  }
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Initialisiert das Formular mit Event-Listenern
 */
function initForm() {
  const form = document.getElementById('costForm');
  
  if (!form) {
    console.error('Formular nicht gefunden');
    return;
  }

  // Event Delegation für die Kostenliste
  document.getElementById('costList').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      deleteCost(index);
    }
  });

  // Formular-Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const personInput = document.getElementById('person');
    const amountInput = document.getElementById('amount');
    const reasonInput = document.getElementById('reason');

    const person = personInput.value.trim();
    const amount = amountInput.value.trim();
    const reason = reasonInput.value.trim();

    // Validierung
    if (!person) {
      alert('Bitte geben Sie einen Namen ein.');
      personInput.focus();
      return;
    }

    if (!amount) {
      alert('Bitte geben Sie einen Betrag ein.');
      amountInput.focus();
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Bitte geben Sie einen gültigen, positiven Betrag ein.');
      amountInput.focus();
      return;
    }

    try {
      // Kosten hinzufügen
      addCost(person, amountNum, reason);
      
      // Formular zurücksetzen
      form.reset();
      
      // Fokus auf erstes Feld setzen
      personInput.focus();
      
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
      alert('Es ist ein Fehler aufgetreten: ' + error.message);
    }
  });
}

// ============================================
// EXPORT/IMPORT FUNCTIONS
// ============================================

/**
 * Exportiert alle Kosten als JSON
 */
function exportCosts() {
  const costs = loadCosts();
  const dataStr = JSON.stringify(costs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `haushaltskosten-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importiert Kosten aus einer JSON-Datei
 * @param {File} file - JSON-Datei
 */
function importCosts(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const importedCosts = JSON.parse(e.target.result);
      
      // Validierung der importierten Daten
      if (!Array.isArray(importedCosts)) {
        throw new Error('Ungültiges Dateiformat. Bitte wählen Sie eine gültige JSON-Datei.');
      }
      
      // Vorhandene Kosten laden und zusammenführen
      const existingCosts = loadCosts();
      const mergedCosts = [...existingCosts, ...importedCosts];
      
      saveCosts(mergedCosts);
      renderCosts();
      alert('Kosten erfolgreich importiert!');
      
    } catch (error) {
      console.error('Fehler beim Import:', error);
      alert('Fehler beim Import: ' + error.message);
    }
  };
  
  reader.onerror = () => {
    alert('Fehler beim Lesen der Datei.');
  };
  
  reader.readAsText(file);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialisiert die Anwendung
 */
function init() {
  // DOM-Elemente prüfen
  const requiredElements = ['costForm', 'costList', 'totalAmount'];
  const missingElements = requiredElements.filter(id => !document.getElementById(id));
  
  if (missingElements.length > 0) {
    console.error('Fehlende DOM-Elemente:', missingElements);
    return;
  }

  // Standard-Kosten hinzufügen, falls keine vorhanden
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: 'Max', amount: '50.00', reason: 'Einkaufen', createdAt: new Date().toISOString() },
      { person: 'Anna', amount: '30.00', reason: 'Strom', createdAt: new Date().toISOString() }
    ]);
  }

  // Kosten anzeigen
  renderCosts();

  // Formular initialisieren
  initForm();

  // Export/Import-Buttons initialisieren (falls vorhanden)
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const fileInput = document.getElementById('fileInput');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', exportCosts);
  }
  
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        importCosts(e.target.files[0]);
        e.target.value = ''; // Reset für nächsten Import
      }
    });
  }
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);

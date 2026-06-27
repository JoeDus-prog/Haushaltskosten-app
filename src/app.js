/**
 * Haushaltskosten-App
 * Verwaltung von Haushaltskosten mit localStorage
 * 
 * @author JoeDus-prog
 * @version 1.1.0
 * @license MIT
 */

/**
 * Hauptklasse für die Kostenverwaltung
 */
class CostManager {
  constructor() {
    // DOM-Elemente
    this.costForm = document.getElementById('costForm');
    this.costList = document.getElementById('costList');
    this.totalAmount = document.getElementById('totalAmount');
    this.summary = document.getElementById('summary');
    
    // Storage Key
    this.storageKey = 'haushaltskosten';
    
    // Toast Container
    this.toastContainer = null;
    
    // Such- und Filter-Elemente
    this.searchInput = null;
    this.sortSelect = null;
    this.filterSelect = null;
    
    // Aktueller Zustand
    this.currentCosts = [];
    this.currentSort = 'date';
    this.currentOrder = 'desc';
    this.currentFilter = 'all';
    
    // Initialisierung
    this.init();
  }

  /**
   * Initialisiert die Anwendung
   */
  init() {
    this.createToastContainer();
    this.createSearchControls();
    this.loadCosts();
    this.initForm();
    this.initEventListeners();
    this.renderCosts();
    
    // Standard-Kosten hinzufügen, falls keine vorhanden
    if (this.currentCosts.length === 0) {
      this.addCost('Max', 50.00, 'Einkaufen');
      this.addCost('Anna', 30.00, 'Strom');
    }
  }

  /**
   * Erstellt den Toast-Container für Benachrichtigungen
   */
  createToastContainer() {
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    document.body.appendChild(this.toastContainer);
  }

  /**
   * Erstellt Such- und Filter-Controls
   */
  createSearchControls() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    // Suchfeld
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search';
    searchInput.placeholder = 'Suche nach Name oder Grund...';
    searchInput.aria.label = 'Kosten suchen';
    
    // Sortierauswahl
    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort';
    sortSelect.aria.label = 'Sortieren nach';
    sortSelect.innerHTML = `
      <option value="date">Datum (neueste)</option>
      <option value="person">Name (A-Z)</option>
      <option value="amount">Betrag (höchste)</option>
    `;
    
    // Filterauswahl
    const filterSelect = document.createElement('select');
    filterSelect.id = 'filter';
    filterSelect.aria.label = 'Filtern nach';
    filterSelect.innerHTML = `
      <option value="all">Alle</option>
      <option value="today">Heute</option>
      <option value="week">Diese Woche</option>
      <option value="month">Dieser Monat</option>
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(sortSelect);
    searchContainer.appendChild(filterSelect);
    
    // Vor dem Formular einfügen
    this.costForm.parentNode.insertBefore(searchContainer, this.costForm);
    
    // Referenzen speichern
    this.searchInput = searchInput;
    this.sortSelect = sortSelect;
    this.filterSelect = filterSelect;
  }

  /**
   * Lädt Kosten aus localStorage
   */
  loadCosts() {
    const savedCosts = localStorage.getItem(this.storageKey);
    this.currentCosts = savedCosts ? JSON.parse(savedCosts) : [];
    return this.currentCosts;
  }

  /**
   * Speichert Kosten in localStorage
   */
  saveCosts() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.currentCosts));
  }

  /**
   * Berechnet den Gesamtbetrag
   */
  calculateTotal(costs = this.currentCosts) {
    return costs.reduce((total, cost) => {
      const amount = parseFloat(cost.amount);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }

  /**
   * Erstellt ein einzelnes Kostenelement (XSS-sicher)
   */
  createCostItem(cost, index) {
    const li = document.createElement('li');
    li.dataset.index = index;
    
    // Cost Info Container
    const costInfo = document.createElement('div');
    costInfo.className = 'cost-info';
    
    // Person
    const personSpan = document.createElement('span');
    personSpan.className = 'cost-person';
    personSpan.textContent = cost.person;
    
    // Betrag
    const amountSpan = document.createElement('span');
    amountSpan.className = 'cost-amount';
    amountSpan.textContent = `${parseFloat(cost.amount).toFixed(2)}€`;
    
    // Grund (optional)
    if (cost.reason && cost.reason.trim()) {
      const reasonSpan = document.createElement('span');
      reasonSpan.className = 'cost-reason';
      reasonSpan.textContent = ` (${cost.reason})`;
      costInfo.appendChild(reasonSpan);
    }
    
    // Datum (falls vorhanden)
    if (cost.date) {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'cost-date';
      dateSpan.textContent = ` - ${this.formatDate(cost.date)}`;
      costInfo.appendChild(dateSpan);
    }
    
    // Elemente zusammenbauen
    costInfo.prepend(amountSpan);
    costInfo.prepend(document.createTextNode(': '));
    costInfo.prepend(personSpan);
    
    // Lösch-Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Löschen';
    deleteBtn.dataset.index = index;
    deleteBtn.aria.label = `Eintrag von ${cost.person} löschen`;
    
    // Event Listener (wird später hinzugefügt)
    
    li.appendChild(costInfo);
    li.appendChild(deleteBtn);
    
    return li;
  }

  /**
   * Formatiert ein Datum
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Rendert alle Kosten
   */
  renderCosts() {
    const costs = this.getFilteredAndSortedCosts();
    
    // Liste leeren
    this.costList.innerHTML = '';
    
    if (costs.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <div class="empty-state-icon">💰</div>
        <p>Keine Kosten gefunden</p>
      `;
      this.costList.appendChild(emptyState);
    } else {
      // Jeden Kosteneintrag hinzufügen
      costs.forEach((cost, index) => {
        const originalIndex = this.currentCosts.indexOf(cost);
        const li = this.createCostItem(cost, originalIndex);
        this.costList.appendChild(li);
      });
    }
    
    // Gesamtbetrag aktualisieren
    this.updateTotal();
    
    // Event Listener für Lösch-Buttons hinzufügen
    this.initDeleteButtons();
  }

  /**
   * Gibt gefilterte und sortierte Kosten zurück
   */
  getFilteredAndSortedCosts() {
    let costs = [...this.currentCosts];
    
    // Filtern
    switch (this.currentFilter) {
      case 'today':
        costs = this.filterByToday(costs);
        break;
      case 'week':
        costs = this.filterByWeek(costs);
        break;
      case 'month':
        costs = this.filterByMonth(costs);
        break;
      default:
        // Kein Filter oder 'all'
        break;
    }
    
    // Suchbegriff anwenden
    if (this.searchInput && this.searchInput.value) {
      const searchTerm = this.searchInput.value.toLowerCase();
      costs = costs.filter(cost =>
        cost.person.toLowerCase().includes(searchTerm) ||
        (cost.reason && cost.reason.toLowerCase().includes(searchTerm)) ||
        cost.amount.toString().includes(searchTerm)
      );
    }
    
    // Sortieren
    costs = this.sortCosts(costs);
    
    return costs;
  }

  /**
   * Filtert Kosten nach heute
   */
  filterByToday(costs) {
    const today = new Date().toDateString();
    return costs.filter(cost => {
      if (!cost.date) {
        // Ältere Einträge ohne Datum werden als "heute" behandelt
        return true;
      }
      const costDate = new Date(cost.date).toDateString();
      return costDate === today;
    });
  }

  /**
   * Filtert Kosten nach dieser Woche
   */
  filterByWeek(costs) {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
    
    return costs.filter(cost => {
      if (!cost.date) return true;
      const costDate = new Date(cost.date);
      return costDate >= startOfWeek && costDate <= endOfWeek;
    });
  }

  /**
   * Filtert Kosten nach diesem Monat
   */
  filterByMonth(costs) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return costs.filter(cost => {
      if (!cost.date) return true;
      const costDate = new Date(cost.date);
      return costDate >= startOfMonth && costDate <= endOfMonth;
    });
  }

  /**
   * Sortiert Kosten
   */
  sortCosts(costs) {
    const sorted = [...costs];
    
    switch (this.currentSort) {
      case 'person':
        sorted.sort((a, b) => {
          const aName = a.person.toLowerCase();
          const bName = b.person.toLowerCase();
          return this.currentOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        });
        break;
      case 'amount':
        sorted.sort((a, b) => {
          const aAmount = parseFloat(a.amount);
          const bAmount = parseFloat(b.amount);
          return this.currentOrder === 'asc' ? aAmount - bAmount : bAmount - aAmount;
        });
        break;
      case 'date':
      default:
        // Standard: nach Datum sortieren (neueste zuerst)
        sorted.sort((a, b) => {
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;
          return this.currentOrder === 'asc' ? aDate - bDate : bDate - aDate;
        });
        break;
    }
    
    return sorted;
  }

  /**
   * Aktualisiert den Gesamtbetrag
   */
  updateTotal() {
    const costs = this.getFilteredAndSortedCosts();
    const total = this.calculateTotal(costs);
    this.totalAmount.textContent = `${total.toFixed(2)}€`;
  }

  /**
   * Fügt einen neuen Kosteneintrag hinzu
   */
  addCost(person, amount, reason = '') {
    const newCost = {
      person: person.trim(),
      amount: parseFloat(amount).toFixed(2),
      reason: reason.trim(),
      date: new Date().toISOString()
    };
    
    this.currentCosts.push(newCost);
    this.saveCosts();
    this.renderCosts();
    this.showToast('Kosten hinzugefügt!', 'success');
  }

  /**
   * Löscht einen Kosteneintrag
   */
  deleteCost(index) {
    if (confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      this.currentCosts.splice(index, 1);
      this.saveCosts();
      this.renderCosts();
      this.showToast('Kosten gelöscht!', 'success');
    }
  }

  /**
   * Löscht alle Kosteneinträge
   */
  deleteAllCosts() {
    if (confirm('Möchtest du wirklich ALLE Kosten löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
      this.currentCosts = [];
      this.saveCosts();
      this.renderCosts();
      this.showToast('Alle Kosten gelöscht!', 'success');
    }
  }

  /**
   * Exportiert Kosten als CSV
   */
  exportToCSV() {
    const costs = this.currentCosts;
    
    if (costs.length === 0) {
      this.showToast('Keine Daten zum Exportieren!', 'warning');
      return;
    }
    
    const csvContent = [
      ['Datum', 'Person', 'Betrag (€)', 'Grund'],
      ...costs.map(cost => [
        cost.date ? this.formatDate(cost.date) : '',
        cost.person,
        cost.amount,
        cost.reason || ''
      ])
    ].map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(';')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `haushaltskosten-${new Date().toLocaleDateString('de-DE')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    this.showToast('Daten exportiert!', 'success');
  }

  /**
   * Importiert Kosten aus CSV
   */
  importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Erste Zeile überspringen (Header)
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(';').map(v => v.replace(/^"|"$/g, '').replace(/"""/g, '"'));
          
          if (values.length >= 3) {
            const [date, person, amount, ...reasonParts] = values;
            const reason = reasonParts.join(';');
            
            this.addCost(person, parseFloat(amount), reason);
          }
        }
        
        this.showToast(`${lines.length - 1} Einträge importiert!`, 'success');
      } catch (error) {
        this.showToast('Fehler beim Import: Ungültiges CSV-Format!', 'error');
      }
    };
    
    reader.readAsText(file);
    
    // Input zurücksetzen
    event.target.value = '';
  }

  /**
   * Zeigt eine Toast-Benachrichtigung an
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    this.toastContainer.appendChild(toast);
    
    // Nach 3 Sekunden entfernen
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Initialisiert das Formular
   */
  initForm() {
    this.costForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const person = document.getElementById('person').value.trim();
      const amount = document.getElementById('amount').value.trim();
      const reason = document.getElementById('reason').value.trim();
      
      // Validierung
      if (!person) {
        this.showToast('Bitte geben Sie einen Namen ein!', 'error');
        return;
      }
      
      if (!amount) {
        this.showToast('Bitte geben Sie einen Betrag ein!', 'error');
        return;
      }
      
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        this.showToast('Bitte geben Sie einen gültigen Betrag ein!', 'error');
        return;
      }
      
      // Kosten hinzufügen
      this.addCost(person, amountNum, reason);
      
      // Formular zurücksetzen
      this.costForm.reset();
      
      // Fokus auf erstes Feld setzen
      document.getElementById('person').focus();
    });
  }

  /**
   * Initialisiert Event Listener für Lösch-Buttons
   */
  initDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteCost(index);
      });
    });
  }

  /**
   * Initialisiert alle Event Listener
   */
  initEventListeners() {
    // Suchfeld
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.debounce(() => {
        this.renderCosts();
      }, 300));
    }
    
    // Sortierauswahl
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderCosts();
      });
    }
    
    // Filterauswahl
    if (this.filterSelect) {
      this.filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.renderCosts();
      });
    }
    
    // Export-Button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportToCSV());
    }
    
    // Clear-Button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.deleteAllCosts());
    }
    
    // Import-Button (falls vorhanden)
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
      const importInput = document.createElement('input');
      importInput.type = 'file';
      importInput.id = 'importFile';
      importInput.accept = '.csv';
      importInput.style.display = 'none';
      importInput.addEventListener('change', (e) => this.importFromCSV(e));
      
      importBtn.addEventListener('click', () => importInput.click());
      document.body.appendChild(importInput);
    }
  }

  /**
   * Debounce-Funktion für Performance-Optimierung
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

/**
 * Initialisierung der Anwendung
 */
document.addEventListener('DOMContentLoaded', () => {
  // App initialisieren
  const app = new CostManager();
  
  // Für Debugging: App in globalen Scope verfügbar machen
  window.HaushaltskostenApp = app;
});

/**
 * Testfunktion für die Konsole
 */
function runTests() {
  const app = window.HaushaltskostenApp;
  
  if (!app) {
    console.error('App nicht initialisiert. Bitte warte bis die Seite geladen ist.');
    return;
  }
  
  console.log('🧪 Haushaltskosten-App Tests werden ausgeführt...');
  
  // Test 1: Kosten hinzufügen
  const initialCount = app.currentCosts.length;
  app.addCost('Test', 10.00, 'Testgrund');
  console.assert(app.currentCosts.length === initialCount + 1, 'Test 1: Kosten hinzufügen - FEHLGESCHLAGEN');
  
  // Test 2: Gesamtbetrag berechnen
  const total = app.calculateTotal();
  console.assert(!isNaN(total), 'Test 2: Gesamtbetrag berechnen - FEHLGESCHLAGEN');
  
  // Test 3: Kosten löschen
  const costToDelete = app.currentCosts.length - 1;
  app.deleteCost(costToDelete);
  console.assert(app.currentCosts.length === initialCount, 'Test 3: Kosten löschen - FEHLGESCHLAGEN');
  
  // Test 4: Export
  try {
    app.exportToCSV();
    console.log('Test 4: Export - MANUELL PRÜFEN (Download sollte gestartet sein)');
  } catch (error) {
    console.error('Test 4: Export - FEHLGESCHLAGEN', error);
  }
  
  // Test 5: Sortieren
  app.currentSort = 'person';
  const sorted = app.sortCosts([...app.currentCosts]);
  console.assert(Array.isArray(sorted), 'Test 5: Sortieren - FEHLGESCHLAGEN');
  
  // Test 6: Filtern
  app.currentFilter = 'all';
  const filtered = app.getFilteredAndSortedCosts();
  console.assert(Array.isArray(filtered), 'Test 6: Filtern - FEHLGESCHLAGEN');
  
  console.log('✅ Alle automatischen Tests abgeschlossen!');
  console.log(`Aktuelle Kosten: ${app.currentCosts.length} Einträge`);
  console.log(`Gesamtbetrag: ${app.calculateTotal().toFixed(2)}€`);
}

// Tests beim Laden ausführen (nur in Entwicklung)
if (window.location.search.includes('test=true')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runTests, 1000);
  });
}

/**
 * Haushaltskosten-App
 * Verwaltung von Haushaltskosten mit localStorage
 */

// Kosten aus localStorage laden
function loadCosts() {
  const savedCosts = localStorage.getItem('haushaltskosten');
  return savedCosts ? JSON.parse(savedCosts) : [];
}

// Kosten in localStorage speichern
function saveCosts(costs) {
  localStorage.setItem('haushaltskosten', JSON.stringify(costs));
}

// Gesamtbetrag berechnen
function calculateTotal(costs) {
  return costs.reduce((total, cost) => total + parseFloat(cost.amount) || 0, 0);
}

// Kosten in der Liste anzeigen
function renderCosts() {
  const costs = loadCosts();
  const costList = document.getElementById('costList');
  const totalAmount = document.getElementById('totalAmount');

  // Liste leeren
  costList.innerHTML = '';

  // Jeden Kosteneintrag hinzufügen
  costs.forEach((cost, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cost-info">
        <span class="cost-person">${cost.person}</span>:
        <span class="cost-amount">${cost.amount}€</span>
        ${cost.reason ? `<span class="cost-reason">(${cost.reason})</span>` : ''}
      </div>
      <button class="delete-btn" data-index="${index}">Löschen</button>
    `;
    costList.appendChild(li);
  });

  // Lösch-Buttons hinzufügen
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      deleteCost(index);
    });
  });

  // Gesamtbetrag aktualisieren
  const total = calculateTotal(costs);
  totalAmount.textContent = `${total.toFixed(2)}€`;
}

// Neuen Kosteneintrag hinzufügen
function addCost(person, amount, reason) {
  const costs = loadCosts();
  costs.push({ person, amount, reason });
  saveCosts(costs);
  renderCosts();
}

// Kosteneintrag löschen
function deleteCost(index) {
  const costs = loadCosts();
  costs.splice(index, 1);
  saveCosts(costs);
  renderCosts();
}

// Formular-Event-Listener
function initForm() {
  const form = document.getElementById('costForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const person = document.getElementById('person').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const reason = document.getElementById('reason').value.trim();

    // Validierung
    if (!person || !amount) {
      alert('Bitte geben Sie mindestens Name und Betrag ein.');
      return;
    }

    // Betrag als Zahl formatieren
    const amountNum = parseFloat(amount).toFixed(2);

    // Kosten hinzufügen
    addCost(person, amountNum, reason);

    // Formular zurücksetzen
    form.reset();
  });
}

// Initialisierung
function init() {
  // Standard-Kosten hinzufügen, falls keine vorhanden
  const costs = loadCosts();
  if (costs.length === 0) {
    saveCosts([
      { person: 'Max', amount: '50.00', reason: 'Einkaufen' },
      { person: 'Anna', amount: '30.00', reason: 'Strom' }
    ]);
  }

  // Kosten anzeigen
  renderCosts();

  // Formular initialisieren
  initForm();
}

// beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', init);

/**
 * Charts Module
 * Verantwortlich für die Visualisierung der Kostendaten mit Chart.js
 */

import { loadCosts, calculateTotal } from "./storage.js";

// Chart-Instanz für späteren Zugriff
let costsChart = null;

/**
 * Berechnet die Daten für das Personen-Diagramm
 * @returns {Object} Objekt mit labels und data
 */
function getPersonChartData() {
  const costs = loadCosts();

  // Daten nach Person gruppieren
  const personData = {};
  costs.forEach(cost => {
    const amount = parseFloat(cost.amount) || 0;
    if (personData[cost.person]) {
      personData[cost.person] += amount;
    } else {
      personData[cost.person] = amount;
    }
  });

  return {
    labels: Object.keys(personData),
    data: Object.values(personData)
  };
}

/**
 * Berechnet die Daten für das Kategorien-Diagramm
 * @returns {Object} Objekt mit labels und data
 */
function getCategoryChartData() {
  const costs = loadCosts();

  // Daten nach Grund/Kategorie gruppieren
  const categoryData = {};
  costs.forEach(cost => {
    const amount = parseFloat(cost.amount) || 0;
    const category = cost.reason || "Sonstiges";
    if (categoryData[category]) {
      categoryData[category] += amount;
    } else {
      categoryData[category] = amount;
    }
  });

  return {
    labels: Object.keys(categoryData),
    data: Object.values(categoryData)
  };
}

/**
 * Erstellt oder aktualisiert das Personen-Diagramm
 */
function createPersonChart() {
  const { labels, data } = getPersonChartData();
  const total = calculateTotal(loadCosts());

  const ctx = document.getElementById("personChart");

  // Falls Chart bereits existiert, zerstören
  if (costsChart) {
    costsChart.destroy();
  }

  // Falls kein Canvas-Element existiert, erstellen
  if (!ctx) {
    return;
  }

  // eslint-disable-next-line no-undef
  costsChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC24A",
          "#607D8B"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "var(--text-primary)",
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value.toFixed(2)}€ (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Erstellt oder aktualisiert das Kategorien-Diagramm
 */
function createCategoryChart() {
  const { labels, data } = getCategoryChartData();
  const total = calculateTotal(loadCosts());

  const ctx = document.getElementById("categoryChart");

  // Falls kein Canvas-Element existiert, erstellen
  if (!ctx) {
    return;
  }

  // Falls Chart bereits existiert, zerstören
  if (window.categoryChart) {
    window.categoryChart.destroy();
  }

  // eslint-disable-next-line no-undef
  window.categoryChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC24A",
          "#607D8B"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "var(--text-primary)",
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value.toFixed(2)}€ (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Erstellt die Chart-Container im DOM
 */
function createChartContainers() {
  const summary = document.querySelector(".summary");
  if (!summary) return;

  const chartsContainer = document.createElement("div");
  chartsContainer.className = "charts-container";
  chartsContainer.innerHTML = `
    <div class="chart-wrapper">
      <h3>Verteilung nach Personen</h3>
      <div class="chart-container">
        <canvas id="personChart"></canvas>
      </div>
    </div>
    <div class="chart-wrapper">
      <h3>Verteilung nach Kategorien</h3>
      <div class="chart-container">
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  `;

  // Container nach dem summary einfügen
  summary.after(chartsContainer);
}

/**
 * Initialisiert die Diagramme
 */
export function initCharts() {
  // Chart-Container erstellen
  createChartContainers();

  // Chart.js Skript dynamisch laden
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
  script.onload = function () {
    // Chart.js ist geladen, Diagramme erstellen
    createPersonChart();
    createCategoryChart();
  };
  script.onerror = function () {
    // Fehlerbehandlung ohne console
  };
  document.head.appendChild(script);
}

/**
 * Aktualisiert alle Diagramme
 */
export function updateCharts() {
  // eslint-disable-next-line no-undef
  if (typeof Chart !== "undefined") {
    createPersonChart();
    createCategoryChart();
  }
}

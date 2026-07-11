/**
 * Export/Import Module
 * Verantwortlich für den Export und Import von Kostendaten
 */

import { loadCosts, saveCosts } from "./storage.js";

/**
 * Exportiert die Kostendaten als JSON-Datei
 */
export function exportCosts() {
  const costs = loadCosts();
  const dataStr = JSON.stringify(costs, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "haushaltskosten-export.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Importiert Kostendaten aus einer JSON-Datei
 * @param {File} file - Die hochgeladene Datei
 * @returns {Promise<boolean>} true wenn erfolgreich, false bei Fehler
 */
export function importCosts(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedCosts = JSON.parse(e.target.result);
        if (Array.isArray(importedCosts)) {
          saveCosts(importedCosts);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        resolve(false);
      }
    };
    reader.onerror = function () {
      resolve(false);
    };
    reader.readAsText(file);
  });
}

/**
 * Erstellt die Export/Import UI-Elemente
 * @param {Function} onImportSuccess - Callback für erfolgreichen Import
 * @returns {Object} Objekt mit exportButton und importButton
 */
export function createExportImportUI(onImportSuccess) {
  // Container für Export/Import-Buttons
  const exportImportContainer = document.createElement("div");
  exportImportContainer.className = "export-import-container";
  exportImportContainer.innerHTML = `
    <div class="export-import-buttons">
      <button id="exportBtn" class="btn btn-secondary" aria-label="Daten exportieren">
        📤 Exportieren
      </button>
      <button id="importBtn" class="btn btn-secondary" aria-label="Daten importieren">
        📥 Importieren
      </button>
    </div>
    <input type="file" id="importFile" accept=".json" style="display: none;" aria-label="Datei auswählen">
  `;

  // Container in den DOM einfügen (nach dem summary)
  const summary = document.querySelector(".summary");
  if (summary) {
    summary.after(exportImportContainer);
  }

  return {
    exportButton: exportImportContainer.querySelector("#exportBtn"),
    importButton: exportImportContainer.querySelector("#importBtn"),
    importInput: exportImportContainer.querySelector("#importFile"),
    onImportSuccess
  };
}

/**
 * Initialisiert die Export/Import-Funktionalität
 * @param {Function} renderCallback - Funktion zum Neurendern der Daten
 */
export function initExportImport(renderCallback) {
  const { exportButton, importButton, importInput, onImportSuccess } = createExportImportUI(renderCallback);

  // Export-Button Event-Listener
  exportButton.addEventListener("click", () => {
    exportCosts();
  });

  // Import-Button Event-Listener
  importButton.addEventListener("click", () => {
    importInput.click();
  });

  // File Input Event-Listener
  importInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      const success = await importCosts(file);
      if (success) {
        alert("Daten erfolgreich importiert!");
        // Neu rendern
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        alert("Fehler beim Import! Bitte stellen Sie sicher, dass die Datei ein gültiges JSON-Array enthält.");
      }
      // Input zurücksetzen
      importInput.value = "";
    }
  });
}

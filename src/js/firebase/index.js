/**
 * Firebase initialization and database functions
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, set, onValue, remove, off } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { firebaseConfig, ENABLE_FIREBASE } from './config.js';

// Firebase-App initialisieren
let db = null;
let costsRef = null;

/**
 * Initialize Firebase
 */
export function initializeFirebase() {
  if (!ENABLE_FIREBASE) {
    console.log('Firebase ist deaktiviert. Nutze localStorage als Fallback.');
    return false;
  }
  
  try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    costsRef = ref(db, 'costs');
    console.log('Firebase erfolgreich initialisiert');
    return true;
  } catch (error) {
    console.error('Fehler bei Firebase-Initialisierung:', error);
    return false;
  }
}

/**
 * Load costs from Firebase
 * @param {Function} callback - Callback function with costs array
 * @returns {Function} Unsubscribe function
 */
export function onCostsLoaded(callback) {
  if (!ENABLE_FIREBASE || !db || !costsRef) {
    // Fallback zu localStorage
    return () => {};
  }
  
  return onValue(costsRef, (snapshot) => {
    const costs = [];
    snapshot.forEach((childSnapshot) => {
      const cost = childSnapshot.val();
      cost.id = childSnapshot.key; // Firebase-ID hinzufügen
      costs.push(cost);
    });
    callback(costs);
  });
}

/**
 * Load costs once from Firebase
 * @returns {Promise<Array>} Promise with costs array
 */
export async function loadCostsFromFirebase() {
  if (!ENABLE_FIREBASE || !db || !costsRef) {
    return [];
  }
  
  try {
    const snapshot = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js').then(module => {
      return new Promise((resolve) => {
        onValue(costsRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
      });
    });
    
    const costs = [];
    snapshot.forEach((childSnapshot) => {
      const cost = childSnapshot.val();
      cost.id = childSnapshot.key;
      costs.push(cost);
    });
    return costs;
  } catch (error) {
    console.error('Fehler beim Laden aus Firebase:', error);
    return [];
  }
}

/**
 * Save a cost to Firebase
 * @param {Object} cost - Cost object to save
 * @returns {Promise<string>} Promise with the new cost ID
 */
export async function saveCostToFirebase(cost) {
  if (!ENABLE_FIREBASE || !db || !costsRef) {
    return '';
  }
  
  try {
    const newCostRef = push(costsRef);
    await set(newCostRef, cost);
    return newCostRef.key;
  } catch (error) {
    console.error('Fehler beim Speichern in Firebase:', error);
    return '';
  }
}

/**
 * Update a cost in Firebase
 * @param {string} id - Cost ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
export async function updateCostInFirebase(id, updates) {
  if (!ENABLE_FIREBASE || !db) {
    return;
  }
  
  try {
    const costRef = ref(db, `costs/${id}`);
    await set(costRef, updates);
  } catch (error) {
    console.error('Fehler beim Aktualisieren in Firebase:', error);
  }
}

/**
 * Delete a cost from Firebase
 * @param {string} id - Cost ID to delete
 * @returns {Promise<void>}
 */
export async function deleteCostFromFirebase(id) {
  if (!ENABLE_FIREBASE || !db) {
    return;
  }
  
  try {
    const costRef = ref(db, `costs/${id}`);
    await remove(costRef);
  } catch (error) {
    console.error('Fehler beim Löschen aus Firebase:', error);
  }
}

/**
 * Get Firebase database reference
 * @returns {Object|null} Database reference or null
 */
export function getDatabaseRef() {
  return db;
}

/**
 * Check if Firebase is enabled
 * @returns {boolean}
 */
export function isFirebaseEnabled() {
  return ENABLE_FIREBASE && !!db;
}

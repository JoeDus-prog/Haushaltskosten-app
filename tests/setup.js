/**
 * Test Setup File
 * Global test setup for Vitest
 */

// Mock localStorage for all tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Define global variables for tests
global.localStorage = localStorageMock;
global.window = {
  localStorage: localStorageMock,
  matchMedia: () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
};

global.document = {
  createElement: (tag) => ({
    tag,
    href: '',
    download: '',
    click: () => {},
    setAttribute: () => {},
    appendChild: () => {},
    innerHTML: '',
    textContent: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: (id) => {
      const elements = {
        costForm: {
          addEventListener: () => {},
          reset: () => {},
          dispatchEvent: () => {}
        },
        person: {
          value: '',
          focus: () => {},
          addEventListener: () => {}
        },
        amount: {
          value: '',
          focus: () => {},
          addEventListener: () => {}
        },
        reason: {
          value: '',
          focus: () => {},
          addEventListener: () => {}
        },
        costList: {
          innerHTML: '',
          appendChild: () => {},
          addEventListener: () => {}
        },
        totalAmount: {
          textContent: ''
        },
        themeToggle: {
          textContent: '',
          addEventListener: () => {}
        }
      };
      return elements[id] || null;
    }
  }),
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => null
  }
};

global.URL = {
  createObjectURL: () => 'blob:mock-url',
  revokeObjectURL: () => {}
};

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

// Clean up after each test
afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

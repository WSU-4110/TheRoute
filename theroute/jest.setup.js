//jest.setup.js
import '@testing-library/jest-dom';  // For improved assertions
import 'jest-canvas-mock';           // If you're using canvas mock
import 'text-encoding';
import '@testing-library/jest-dom'; // Extends Jest matchers for DOM elements

// Mock TextDecoder if needed
global.TextDecoder = require('util').TextDecoder;

// Mocking mapbox-gl-geocoder to prevent errors in tests
jest.mock('@mapbox/mapbox-gl-geocoder', () => {
  return jest.fn().mockImplementation(() => {
    return { 
      on: jest.fn(), 
      addTo: jest.fn(),
    };
  });
});

// Mocking localStorage before each test to ensure isolation
beforeEach(() => {
  global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(), // Added clear method if needed
  };
});
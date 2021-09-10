global.fetch = require('jest-fetch-mock')

console.log = jest.fn();
console.info = jest.fn();
console.debug = jest.fn();
console.trace = jest.fn();
console.warn = jest.fn();
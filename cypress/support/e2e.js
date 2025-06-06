// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err, runnable) => {
  // You can filter known errors here if you want to only suppress some
  if (err.message.includes('Invalid email')) {
    return false; // Prevents Cypress from failing the test
  }
  // You can add more filters if needed
  return true;
});

Cypress.on('uncaught:exception', (err) => {
  // Ignore known validation errors so we can assert error messages in the UI
  if (
    err.message.includes('Password must be at least 8 characters') ||
    err.message.includes('contain at least one uppercase letter') ||
    err.message.includes('Passwords do not match')
  ) {
    return false; // prevents Cypress from failing the test
  }
  // For all other errors, do not suppress
});

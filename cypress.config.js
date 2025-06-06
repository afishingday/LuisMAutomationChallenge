const { defineConfig } = require("cypress");
const { saveUser } = require('./cypress/support/saveUser');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.laboratoriodetesting.com',
    setupNodeEvents(on, config) {
      // Custom task to persist user
      on('task', {
        saveUser(user) {
          saveUser(user);
          return null;
        },
      });
      // Mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    }
  },
reporter: 'cypress-mochawesome-reporter',
reporterOptions: {
  reportDir: 'reports/mochawesome',
  overwrite: false,
  html: false, // importante, si no, genera solo HTML
  json: true,  // importante, sin esto no genera los .json
  timestamp: 'mmddyyyy_HHMMss'
}

});

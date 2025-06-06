![Cypress Weekly E2E Suite](https://github.com/afishingday/LuisMAutomationChallenge/actions/workflows/cypress-weekly.yml/badge.svg)

# LuisMAutomationChallenge – Cypress E2E Automation for Laboratorio de Testing

---

## 📋 Project Overview

This repository contains end-to-end (E2E) automated tests for the [Laboratorio de Testing](https://www.laboratoriodetesting.com) e-commerce platform, built using [Cypress](https://www.cypress.io/). The automation covers critical user flows such as registration, login, shopping cart, checkout, and order validation. The project is structured to maximize maintainability, readability, and ease of onboarding for new contributors.

---

## 🚀 Getting Started

### 1. **Clone the Repository**


git clone https://github.com/YOUR-USER/LuisMAutomationChallenge.git
cd LuisMAutomationChallenge


### 2. **Install Dependencies**

Requires [Node.js](https://nodejs.org/) (v16+ recommended) and [npm](https://www.npmjs.com/).


npm install


### 3. **Open Cypress (Interactive UI)**


npm run cypress:open


This opens the Cypress UI for visual test execution, debugging, and inspection.

### 4. **How to Run and Generate Unified Reports**


npm run test

Or directly: npx cypress run


### 5. **Clean Reports (Optional but Recommended)**

Before running a new suite, clear previous Mochawesome reports:


npm run clean:reports


---

## 📂 Project Structure


LuisMAutomationChallenge/
├─ cypress/
│   ├─ commands/        # Custom Cypress commands (reusable logic)
│   ├─ e2e/             # Test specs, separated by user flows/features
│   │   ├─ register.cy.js
│   │   ├─ login.cy.js
│   │   ├─ shop.cy.js
│   ├─ fixtures/        # Static test data (e.g. users, credit cards)
│   ├─ pages/           # Page Object Models (selectors & actions)
│   ├─ support/         # Global setup, helpers, plugins, custom tasks
│   └─ tmp/             # Temp/test-generated users for traceability
├─ docs/                # Documentation, strategy, and references
├─ reports/             # Mochawesome HTML & JSON reports
├─ cypress.config.js    # Cypress config & plugin setup
├─ package.json         # Project dependencies & scripts
└─ README.md            # This file


**Key folders explained:**

* `/cypress/e2e/`: Test specs for different flows (registration, login, shop/checkout).
* `/cypress/pages/`: Page Object Model classes—selectors and UI actions for maintainability.
* `/cypress/fixtures/`: Static data (e.g. reusable user objects, credit cards, test data).
* `/cypress/tmp/created-users.json`: Tracks emails of users created by E2E tests to avoid reusing them. **Do not delete if you want to avoid registration collisions!**
* `/cypress/commands/`: Custom reusable Cypress commands for clear and DRY test code.

---

## 🧩 Test Spec Overview

All specs are designed to be self-contained, readable, and reusable. Below is an overview of the current coverage:

### **1. User Registration (`register.cy.js`)**

* Registers a new user with unique email and tracks it in `/cypress/tmp/created-users.json`.
* Validates registration form errors: invalid email, required fields, password pattern, password mismatch, already-registered email.
* Asserts success modals and correct redirects.

### **2. Login (`login.cy.js`)**

* Validates required fields and disabled login button on empty or invalid form.
* Tests for non-activated accounts (expected modal), and for successful login (expected cookie, session, and logout button).
* Checks password masking.

### **3. Shop & Checkout (`shop.cy.js`)**

* Navigates to featured products, opens product details, validates all relevant product info.
* Increments/decrements product quantity, adds to cart, validates cart badge.
* Adds multiple random products with different quantities, validates all product/cart info.
* Completes full checkout with buyer and payment info, asserts order confirmation modal, and navigates to My Account to verify order.
* Validates checkout form: ensures button is disabled until all required fields are completed, email field error appears for invalid email only.

---

## 👤 Test Data and User Management

### **Test Data**

* User data, credit card numbers, and other test info are defined in `/cypress/fixtures/` and used throughout specs.
* Provided test credit cards (for checkout):

  * 4301822375925071 (2029-09 | CVV: 668)
  * 5840254353870254 (2028-11 | CVV: 637)

### **Temporary User Tracking**

* When a new user is registered during a test, their email is **persisted** in `/cypress/tmp/created-users.json` using a custom Cypress task.
* This ensures:

  * No duplicate registration attempts (avoids "email already registered" errors in next runs)
  * Traceability of what accounts are created by the suite
* If you want to start fresh, you can safely delete `created-users.json` (not recommended in CI unless you want a full reset).
* **User management is automatic**: the suite will always try to use a new email if previous ones exist.

---

## 🛠️ Custom Commands & Page Objects

* **Custom commands** in `/cypress/commands/` abstract complex or repetitive logic (e.g. form filling, modals, reusable assertions).
* **Page Object Model** (`/cypress/pages/`) ensures selectors/actions are centralized for easy maintenance if the UI changes.

---

## 📊 Unified Mochawesome Reporting

This project uses [cypress-mochawesome-reporter](https://github.com/cypress-io/cypress-mochawesome-reporter) to generate detailed, unified HTML test reports automatically after each suite run.

**No manual merge required!**

### **How to Generate & View the Report**

1. **Run all tests:**

   
   npm run test
   # or
   npx cypress run
   

2. **After the run, find the HTML report at:**

   
   reports/mochawesome/index.html_<timestamp>.html
   

3. **Open the HTML report in your browser to review all specs and test cases in a single dashboard.**

### **Clean Reports (optional)**


npm run clean:reports


### **Example scripts in `package.json`:**

json
"scripts": {
  "clean:reports": "rm -rf reports/mochawesome",
  "test": "npx cypress run",
  "cypress:open": "npx cypress open"
}


### **Report Directory Structure**


reports/
└─ mochawesome/
   ├─ .jsons/                # Internal JSON files per spec (auto-managed)
   ├─ index.html_<timestamp>.html   # Main HTML report (open this!)
   └─ assets/                # CSS/JS assets for the HTML report


---

## ✔️ Sample Test Flow (snippet)

### **Register a new user and verify redirect**

js
it('should register a new user successfully and redirect to login', () => {
  const newUser = { email: 'luis+1234@lfm.com', name: 'Luis QA', password: 'StrongPassword123' };
  registerPage.visit();
  registerPage.fillEmail(newUser.email);
  registerPage.fillName(newUser.name);
  registerPage.fillPassword(newUser.password);
  registerPage.fillRepeatPassword(newUser.password);
  registerPage.submit();
  registerPage.assertSuccessModal();
  registerPage.goToLoginFromSuccessModal();
  cy.url().should('include', '/auth/login');
  cy.task('saveUser', newUser); // Adds the new user to created-users.json
});


### **Login test**

js
it('should login successfully and display the logout button', () => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type('huge.test@gmail.com');
  cy.get('input[name="password"]').type('Huge2025.');
  cy.get('[data-at="submit-login"]').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  cy.get('a[href="/auth/logout"]').should('be.visible');
  cy.getCookie('__AUTH-TOKEN-APP').should('exist');
});


### **Shop & Checkout snippet**

js
it('should complete the full checkout flow, validate order modal and my account info', () => {
  // login, add products, validate cart, fill forms...
  cy.get('button.bg-primaryColor').contains('Completar Pago').should('not.be.disabled').click();
  cy.get('h2.swal2-title').should('contain', 'Orden creada');
  cy.get('div.swal2-html-container').should('contain', 'Tu orden se ha creado con éxito');
  cy.get('button.swal2-confirm').contains('Ir a mi cuenta').click();
  cy.url().should('include', '/my-account');
  cy.get('table').within(() => {
    cy.get('td.font-medium').should('exist').and('contain', 'Order #');
    cy.get('td').contains(/\$\d{1,3}(,\d{3})*(\.\d{2})?/); // total
    cy.get('td').contains(/\d{2} \w{3}, \d{2}/); // date
  });
});

## 🕒 Scheduled GitHub Actions: Cypress Weekly E2E Suite

This repository uses [GitHub Actions](https://github.com/features/actions) to automatically run all Cypress E2E tests once a week.

- **Schedule:** Every Friday at 3:00 PM UTC.
- **Purpose:** Ensures continuous health-check and regression coverage, even if no code changes are made during the week.
- **Badge:** The badge above shows the status of the latest scheduled run (green = passing, red = failing).

### How does it work?
- The workflow installs all dependencies, runs the entire Cypress test suite in headless mode, and archives the latest [Mochawesome](https://github.com/cypress-io/cypress-mochawesome-reporter) HTML reports as build artifacts.
- You can manually trigger the suite at any time from the “Actions” tab in GitHub.
- Downloadable test reports are available in the build’s “Artifacts” section after each run.

**This ensures your test automation remains robust, monitored, and easily accessible for your team and stakeholders.**
---

## 💡 Useful Tips

* **Specs are independent**: You can run them individually via UI or CLI, or as a complete suite.
* **Test cases are idempotent**: Re-running them will not fail due to duplicate data, thanks to the `created-users.json` mechanism.
* **Error handling**: The framework filters known validation errors so UI assertions are not interrupted by app-side exceptions.
* **All test data and temp users** are easily accessible for maintenance and debugging.
* **Reports**: Share the unified HTML with your team or stakeholders for visibility.

---

## 👨‍💻 Author

Luis Montoya

---

## 🤝 Contributions

Contributions are welcome! Please open a pull request or issue for improvements.

---

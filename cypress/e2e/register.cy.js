import { RegisterPage } from '../pages/RegisterPage';

describe('User Registration E2E', () => {
    const registerPage = new RegisterPage();
      const existingUser = {
    email: 'huge.test@gmail.com', 
    name: 'Test',
    password: 'StrongPassword123'
  };
    function getRandomEmail() {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `luis${randomDigits}@lfm.com`;
    }

    beforeEach(() => {
        registerPage.visit();
    });
    it('Should show error for invalid email', () => {
        registerPage.fillEmail('a');
        registerPage.fillName('Test');
        registerPage.fillPassword('StrongPassword123');
        registerPage.fillRepeatPassword('StrongPassword123');
        registerPage.submit();
        registerPage.assertInvalidEmailMessage();
    });

    it('Should show error for password that does not meet security pattern', () => {
        const email = getRandomEmail();
        registerPage.fillEmail(email);
        registerPage.fillName('Test');
        registerPage.fillPassword('abcdefg'); 
        registerPage.fillRepeatPassword('abcdefg');
        registerPage.submit();
        registerPage.assertPasswordPatternMessage();
    });

    it('Should show error when passwords do not match', () => {
        const email = getRandomEmail();
        registerPage.fillEmail(email);
        registerPage.fillName('Test');
        registerPage.fillPassword('Password123');
        registerPage.fillRepeatPassword('DifferentPass123');
        registerPage.submit();
        registerPage.assertPasswordsDontMatchMessage();
    });

    it('Should register a new user successfully and redirect to login', () => {
        const newUser = {
            email: getRandomEmail(),
            name: 'Luis M Automation',
            password: 'StrongPassword123'
        };

        registerPage.visit();
        registerPage.fillEmail(newUser.email);
        registerPage.fillName(newUser.name);
        registerPage.fillPassword(newUser.password);
        registerPage.fillRepeatPassword(newUser.password);
        registerPage.submit();

        // Assert success modal and button
        registerPage.assertSuccessModal();
        registerPage.goToLoginFromSuccessModal();
        cy.url().should('include', '/auth/login');

        // Log user for traceability
        cy.task('saveUser', newUser);
    });

    it('Should display an error modal when trying to register an already used email', () => {
        registerPage.visit();
        registerPage.fillEmail(existingUser.email);
        registerPage.fillName(existingUser.name);
        registerPage.fillPassword(existingUser.password);
        registerPage.fillRepeatPassword(existingUser.password);
        registerPage.submit();

        registerPage.assertEmailAlreadyRegisteredModal();
        registerPage.closeErrorModal();

        // Optionally, check that you're still on the register page
        cy.url().should('include', '/auth/signup');
    });

    it('Should keep password fields masked', () => {
        registerPage.visit();
        cy.get('[name="password"]').should('have.attr', 'type', 'password');
        cy.get('[name="repeatPassword"]').should('have.attr', 'type', 'password');
    });




});

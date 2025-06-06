import { LoginPage } from '../pages/LoginPage';

describe('Login E2E', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('Should have the login button disabled when form is empty', () => {
    loginPage.isSubmitButtonDisabled();
  });

  it('Should keep password fields masked', () => {
    loginPage.assertPasswordFieldMasked();
  });

  it('Should show error for account not activated', () => {
    loginPage.fillEmail('luis2613@lfm.com');
    loginPage.fillPassword('CualquierClave123');
    loginPage.submit();
    loginPage.assertAccountNotActivatedModal();
    loginPage.closeErrorModal();
    cy.url().should('include', '/auth/login');
  });

  it('Should login successfully with an activated account', () => {
    loginPage.fillEmail('huge.test@gmail.com');
    loginPage.fillPassword('Huge2025.');
    loginPage.submit();
    loginPage.assertLoginSuccess();
  });
});

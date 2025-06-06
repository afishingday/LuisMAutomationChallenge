export class LoginPage {
  visit() {
    cy.visit('/auth/login');
  }

  fillEmail(email) {
    cy.get('[name="email"]').clear().type(email);
  }

  fillPassword(password) {
    cy.get('[name="password"]').clear().type(password);
  }

  submit() {
    cy.get('[data-at="submit-login"]').click();
  }

  assertRequiredFieldMessage(fieldOrder) {
    // fieldOrder = nth-child according to DOM, adjust as needed
    cy.get(`:nth-child(${fieldOrder}) > .text-red-500`)
      .should('contain.text', 'Este campo es requerido');
  }

  assertAccountNotActivatedModal() {
    cy.get('#swal2-title').should('have.text', 'Error');
    cy.get('#swal2-html-container').should(
      'have.text',
      'Tu cuenta no ha sido activada. Sigue las indicaciones de tu instructor para activar tu cuenta e inténtalo de nuevo'
    );
    cy.get('.swal2-confirm.swal2-styled').should('contain.text', 'Volver');
  }

  closeErrorModal() {
    cy.get('.swal2-confirm.swal2-styled').click();
  }

  assertLoginSuccess() {
    cy.get('a[href="/auth/logout"]').should('contain.text', 'Cerrar Sesión');
    cy.getCookie('__AUTH-TOKEN-APP').should('exist');
  }

  isSubmitButtonDisabled() {
  cy.get('[data-at="submit-login"]').should('be.disabled');
}

assertPasswordFieldMasked() {
  cy.get('[name="password"]').should('have.attr', 'type', 'password');
}


}

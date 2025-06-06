export class RegisterPage {
    visit() {
        cy.visit('/auth/signup');
    }

    fillEmail(email) {
        cy.get('[name="email"]').clear().type(email);
    }

    fillName(name) {
        cy.get('[name="name"]').clear().type(name);
    }

    fillPassword(password) {
        cy.get('[name="password"]').clear().type(password);
    }

    fillRepeatPassword(password) {
        cy.get('[name="repeatPassword"]').clear().type(password);
    }

    submit() {
        cy.get('[data-at="submit-signup"]').click();
    }
    assertInvalidEmailMessage() {
        cy.contains('p.text-red-500', 'Email inválido').should('be.visible');
    }

    assertRequiredFieldMessage(fieldOrder) {
        cy.get(`:nth-child(${fieldOrder}) > .text-red-500`)
            .should('contain.text', 'Este campo es requerido');
    }
    assertSuccessModal() {
        cy.get('#swal2-title').should('have.text', 'Operación Exitosa');
        cy.get('#swal2-html-container').should(
            'contain.text',
            'Tu usuario ha sido creado correctamente'
        );
        cy.get('.swal2-confirm.swal2-styled').should('contain.text', 'Ir al login');
    }

    goToLoginFromSuccessModal() {
        cy.get('.swal2-confirm.swal2-styled').click();
    }

    assertInvalidEmailMessage() {
        cy.contains('p.text-red-500', 'Email inválido').should('be.visible');
    }

    assertPasswordTooShortMessage() {
        cy.contains('p.text-red-500', 'La contraseña debe tener al menos 8 caracteres').should('be.visible');
    }

    assertPasswordsDontMatchMessage() {
        cy.contains('p.text-red-500', 'Las contraseñas no coinciden').should('be.visible');
    }

    assertPasswordPatternMessage() {
        
        cy.contains(
            'p.text-red-500',
            'La contraseña debe tener al menos 8 caracteres'
        ).should('be.visible');



    }

    assertEmailAlreadyRegisteredModal() {
        cy.get('#swal2-title').should('have.text', 'Error');
        cy.get('#swal2-html-container').should(
            'have.text',
            'Este email ya está registrado'
        );
        cy.get('.swal2-confirm.swal2-styled').should('contain.text', 'Volver');
    }

    closeErrorModal() {
        cy.get('.swal2-confirm.swal2-styled').click();
    }
}


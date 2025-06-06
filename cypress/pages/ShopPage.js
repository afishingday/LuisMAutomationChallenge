export class ShopPage {
  visit() {
    cy.visit('/');
  }

  goToFeaturedProducts() {
    cy.get('a[href="#featured"]').click();
    cy.get('#featured').should('be.visible');
  }

  clickRandomFeaturedProductCard() {
    // Toma todos los product cards y elige uno aleatorio
    cy.get('a[data-at="product-card"]')
      .then($cards => {
        const randomIndex = Math.floor(Math.random() * $cards.length);
        cy.wrap($cards[randomIndex]).click();
      });
  }

  // Validaciones en la página de producto
  assertProductPageElements() {
    // Imagen principal visible y con ancho mayor a 0
    cy.get('.grid > .relative > .object-cover')
      .should('be.visible')
      .and($img => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      });

    // Nombre del producto (título grande)
    cy.get('.text-3xl').should('be.visible');

    // Descripción y precio visibles
    cy.get('.text-2xl').should('be.visible');
    cy.get('.flex-col > :nth-child(1) > .mb-6').should('be.visible');

    // Favoritos (Agregar o Eliminar)
    cy.get('.flex-col > :nth-child(1) > .font-semibold').should('be.visible');
  }

  // Cantidad y Add to Cart
  assertDefaultQuantityIsOne() {
    cy.get('.border > .px-4').should('have.text', '1');
  }
  incrementQuantity() {
    cy.get('[data-at="increment-quantity"]').click();
  }
  decrementQuantity() {
    cy.get('[data-at="decrement-quantity"]').click();
  }

  addToCart() {
    cy.get('[data-at="add-to-cart"]').click();
  }

  assertAddToCartNotification() {
    cy.get('.ant-notification-notice-message').should('contain.text', 'Agregado al carrito');
  }

  // Validar el badge de cantidad de items en el cart (antes/después)
getCartCount() {
  // Busca el span, si no existe retorna '0'
  return cy.get('.flex.hover\\:text-gray-200').then($cart => {
    const badge = $cart.find('span.relative.rounded-full');
    return badge.length ? badge.text() : '0';
  });
}


  openCart() {
    cy.get('.flex.hover\\:text-gray-200').click();
  }

  assertCartSidebarVisible() {
    cy.get('aside.fixed').should('be.visible');
    // Validar headers
    cy.get('aside.fixed').within(() => {
      cy.contains('p', 'Imagen');
      cy.contains('p', 'Nombre');
      cy.contains('p', 'Cantidad');
      cy.contains('p', 'Precio');
      cy.contains('p', 'Eliminar');
    });
  }
}

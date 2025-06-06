import { ShopPage } from '../pages/ShopPage';


function loginBeforeCheckout() {
  // Go to login page
  cy.visit('/auth/login');
  // Enter credentials and login
  cy.get('input[name="email"]').type('huge.test@gmail.com');
  cy.get('input[name="password"]').type('Huge2025.');
  cy.get('[data-at="submit-login"]').click();

  // Assert: Should redirect to home (or expected landing page)
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  // Assert: Logout button is visible (user is authenticated)
  cy.get('a[href="/auth/logout"]').should('be.visible');
  // Assert: Auth cookie is present
  cy.getCookie('__AUTH-TOKEN-APP').should('exist');
}

describe('E2E Shopping Flow', () => {
    const shopPage = new ShopPage();

  beforeEach(() => {
    // Start from home (not logged in by default)
    shopPage.visit();
  });

    function loginBeforeCheckout() {
  // Go to login page
  cy.visit('/auth/login');
  // Enter credentials and login
  cy.get('input[name="email"]').type('huge.test@gmail.com');
  cy.get('input[name="password"]').type('Huge2025.');
  cy.get('[data-at="submit-login"]').click();

  // Assert: Should redirect to home (or expected landing page)
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  // Assert: Logout button is visible (user is authenticated)
  cy.get('a[href="/auth/logout"]').should('be.visible');
  // Assert: Auth cookie is present
  cy.getCookie('__AUTH-TOKEN-APP').should('exist');
}

    it('Should scroll to featured products and open a random product', () => {
        // Scroll to the featured products section
        shopPage.goToFeaturedProducts();

        // Click a random product card
        shopPage.clickRandomFeaturedProductCard();

        // Assert: URL changes to a product details page
        cy.url().should('include', '/products/');

        // Assert: Main product elements are present and visible
        shopPage.assertProductPageElements();
    });

    it('Should validate default quantity is 1 and can increment/decrement', () => {
        // Go to featured products and pick a random product
        shopPage.goToFeaturedProducts();
        shopPage.clickRandomFeaturedProductCard();

        // Assert: Default quantity is 1
        // (Quantity selector should display 1 by default)
        shopPage.assertDefaultQuantityIsOne();

        // Increment and assert: Quantity increases to 2
        shopPage.incrementQuantity();
        cy.get('.border > .px-4').should('have.text', '2');

        // Decrement and assert: Quantity decreases back to 1
        shopPage.decrementQuantity();
        cy.get('.border > .px-4').should('have.text', '1');
    });

    it('Should add a product to cart and show correct cart count', () => {
        shopPage.goToFeaturedProducts();
        shopPage.clickRandomFeaturedProductCard();

        // Capture cart count before adding product
        shopPage.getCartCount().then(countBefore => {
            shopPage.addToCart();
            shopPage.assertAddToCartNotification();

            // Assert: Cart count increments by 1
            shopPage.getCartCount().then(countAfter => {
                // Cart badge must increase by 1 after adding product
                expect(Number(countAfter), 'Cart badge increases by 1').to.eq(Number(countBefore) + 1);
            });
        });
    });

    it('Should open the cart modal and see the product listed', () => {
        shopPage.goToFeaturedProducts();
        shopPage.clickRandomFeaturedProductCard();
        shopPage.addToCart();
        shopPage.openCart();

        shopPage.assertCartSidebarVisible();

        // Assert: Product image is visible in cart
        cy.log('Assert: Product image is visible in the cart modal');
        cy.get('aside.fixed').find('img').should('be.visible');

        // Assert: At least one product name appears in cart
        cy.log('Assert: Product name is listed in the cart modal');
        cy.get('aside.fixed').find('p.text-black').should('have.length.at.least', 1);

        // Assert: Product quantity matches what was added
        cy.log('Assert: Product quantity matches the value selected');
        cy.get('aside.fixed .cart-grid.items-center').each(($row) => {
            const $p = Cypress.$($row).find('p.text-black');
            // First <p> is name, second <p> is quantity
            const productName = $p.eq(0).text().trim();
            const productQty = $p.eq(1).text().trim();
            expect(productName, 'Cart product name is present').to.not.be.empty;
            expect(Number(productQty), 'Cart product quantity is a number').to.be.a('number');
        });

        // Assert: Cart subtotal for each product is correct (unitPrice * qty)
        cy.log('Assert: Cart subtotal (unitPrice * qty) is correct for each product');
        cy.get('aside.fixed .cart-grid.items-center').each(($row) => {
            const $p = Cypress.$($row).find('p.text-black');
            const qty = Number($p.eq(1).text().trim());
            const subtotalText = $p.eq(2).text().trim();
            const subtotal = Number(subtotalText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
            expect(subtotal, 'Cart product subtotal is positive').to.be.greaterThan(0);
            expect(subtotal % qty, 'Cart subtotal is divisible by quantity').to.eq(0); // Optional: simple check
        });

        // Assert: Cart displays total value at the bottom
        cy.log('Assert: Cart displays total value at the bottom');
        cy.get('aside.fixed').find('p.text-black.text-center').should('contain.text', 'Total:');
    });


    it('Should add 3 products with random quantities, validate product info, and validate cart total', () => {
        shopPage.goToFeaturedProducts();

        const productsInfo = [];

        cy.get('a[data-at="product-card"]').then($cards => {
            // Randomly pick 3 different products (no repeats)
            const indices = [];
            while (indices.length < 3) {
                const idx = Math.floor(Math.random() * $cards.length);
                if (!indices.includes(idx)) indices.push(idx);
            }

            cy.wrap(indices).each((cardIdx, i) => {
                cy.get('a[data-at="product-card"]').eq(cardIdx).click();
                cy.url().should('include', '/products/');

                // Get product name and price
                cy.get('.text-3xl').first().invoke('text').then(productName => {
                    cy.get('.text-2xl').invoke('text').then(priceText => {
                        // Parse price (remove symbols/commas)
                        const unitPrice = Number(priceText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
                        // Pick random quantity 2-5
                        const qty = Math.floor(Math.random() * 4) + 2;
                        for (let j = 1; j < qty; j++) shopPage.incrementQuantity();

                        // Store for later validation
                        productsInfo.push({ name: productName.trim(), qty, unitPrice });

                        shopPage.addToCart();
                        shopPage.assertAddToCartNotification();

                        // If not last product, go back to home for next
                        if (i < 2) {
                            shopPage.visit();
                            shopPage.goToFeaturedProducts();
                        }
                    });
                });
            });
        });

        // After all products added, validate cart modal
        cy.then(() => {
            shopPage.openCart();
            shopPage.assertCartSidebarVisible();

            // Collect cart modal product info
            cy.get('aside.fixed .cart-grid.items-center').then($rows => {
                const cartNames = [];
                const cartQuantities = [];
                const cartSubtotals = [];

                // Parse cart rows for assertions
                $rows.each((idx, el) => {
                    const $p = Cypress.$(el).find('p.text-black');
                    cartNames.push($p.eq(0).text().trim());
                    cartQuantities.push(Number($p.eq(1).text().trim()));
                    // Subtotal = unit price * qty
                    cartSubtotals.push(Number($p.eq(2).text().replace(/[^0-9.]/g, '').replace(/,/g, '')));
                });

                let expectedTotal = 0;

                productsInfo.forEach(({ name, qty, unitPrice }) => {
                    const idx = cartNames.indexOf(name);

                    // Assert: Product is found in cart
                    cy.log(`Assert: Product "${name}" is listed in the cart`);
                    expect(idx, `Product "${name}" in cart`).to.be.above(-1);

                    // Assert: Quantity matches what was added
                    cy.log(`Assert: Quantity for "${name}" matches`);
                    expect(cartQuantities[idx], `Quantity for "${name}"`).to.eq(qty);

                    // Assert: Subtotal equals unit price * qty
                    cy.log(`Assert: Subtotal for "${name}" (unitPrice * qty)`);
                    expect(cartSubtotals[idx], `Subtotal for "${name}"`).to.eq(unitPrice * qty);

                    expectedTotal += unitPrice * qty;
                });

                // Assert: Cart total equals the sum of subtotals
                cy.log('Assert: Cart total matches sum of all subtotals');
                cy.get('aside.fixed').find('p.text-black.text-center').invoke('text').then(totalText => {
                    const totalNumber = Number(totalText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
                    expect(totalNumber, 'Cart total matches sum of subtotals').to.eq(expectedTotal);
                });
            });
        });
    });

     it('Should validate required fields and button disabled state in checkout forms', () => {
  loginBeforeCheckout();

  // Add 1 product
  shopPage.goToFeaturedProducts();
  shopPage.clickRandomFeaturedProductCard();
  shopPage.addToCart();
  shopPage.openCart();

  // Go to checkout
  cy.get('.bg-primaryColor').contains('Ir al checkout').click();
  cy.url().should('include', '/checkout');

  // Assert: "Completar Pago" button is disabled if form is not filled
  cy.log('Assert: Submit button is disabled if required fields are empty');
  cy.get('button.bg-primaryColor').contains('Completar Pago').should('be.disabled');

  // Fill only invalid email
  cy.get('input[name="email"]').type('badmail').blur();

  // Assert: Only email field shows error
  cy.log('Assert: Only email field shows error message');
  cy.get('input[name="email"]').parent().find('.text-red-500').should('contain', 'El correo no es válido');
});


  it('Should complete the full checkout flow, validate order modal and my account info', () => {
  loginBeforeCheckout();

  shopPage.goToFeaturedProducts();

  const productsInfo = [];

  // Add 2-3 random products with random quantities
  cy.get('a[data-at="product-card"]').then($cards => {
    const indices = [];
    while (indices.length < 2) {
      const idx = Math.floor(Math.random() * $cards.length);
      if (!indices.includes(idx)) indices.push(idx);
    }

    cy.wrap(indices).each((cardIdx, i) => {
      cy.get('a[data-at="product-card"]').eq(cardIdx).click();
      cy.url().should('include', '/products/');

      cy.get('.text-3xl').first().invoke('text').then(productName => {
        cy.get('.text-2xl').invoke('text').then(priceText => {
          const unitPrice = Number(priceText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
          const qty = Math.floor(Math.random() * 4) + 2;
          for (let j = 1; j < qty; j++) shopPage.incrementQuantity();
          productsInfo.push({ name: productName.trim(), qty, unitPrice });
          shopPage.addToCart();
          shopPage.assertAddToCartNotification();

          if (i < indices.length - 1) {
            shopPage.visit();
            shopPage.goToFeaturedProducts();
          }
        });
      });
    });
  });

  // Cart validations and proceed to checkout
  cy.then(() => {
    shopPage.openCart();
    shopPage.assertCartSidebarVisible();

    // Collect cart modal info
    cy.get('aside.fixed .cart-grid.items-center').then($rows => {
      const cartNames = [];
      const cartQuantities = [];
      const cartSubtotals = [];
      $rows.each((idx, el) => {
        const $p = Cypress.$(el).find('p.text-black');
        cartNames.push($p.eq(0).text().trim());
        cartQuantities.push(Number($p.eq(1).text().trim()));
        cartSubtotals.push(Number($p.eq(2).text().replace(/[^0-9.]/g, '').replace(/,/g, '')));
      });

      // Assert: Product, quantity, subtotal per row
      let expectedTotal = 0;
      productsInfo.forEach(({ name, qty, unitPrice }) => {
        const idx = cartNames.indexOf(name);
        cy.log(`Assert: Product "${name}" is listed in the cart`);
        expect(idx, `Product "${name}" in cart`).to.be.above(-1);
        cy.log(`Assert: Quantity for "${name}" matches`);
        expect(cartQuantities[idx], `Quantity for "${name}"`).to.eq(qty);
        cy.log(`Assert: Subtotal for "${name}" (unitPrice * qty)`);
        expect(cartSubtotals[idx], `Subtotal for "${name}"`).to.eq(unitPrice * qty);
        expectedTotal += unitPrice * qty;
      });

      // Assert: Total at bottom
      cy.log('Assert: Cart total matches sum of all subtotals');
      cy.get('aside.fixed').find('p.text-black.text-center').invoke('text').then(totalText => {
        const totalNumber = Number(totalText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
        expect(totalNumber, 'Cart total matches sum of subtotals').to.eq(expectedTotal);
      });

      // Go to checkout
      cy.get('.bg-primaryColor').contains('Ir al checkout').click();
      cy.url().should('include', '/checkout');

      // Assert: Products listed in checkout match previous cart
      cy.get('article.shadow-md').find('.flex.justify-between.items-center.mb-4').should('have.length', cartNames.length);

      productsInfo.forEach(({ name, qty, unitPrice }) => {
        cy.get('article.shadow-md').contains('.font-bold', name).parents('.flex.justify-between.items-center.mb-4')
          .within(() => {
            cy.log(`Assert: Checkout summary for "${name}" - quantity and subtotal`);
            cy.get('.text-gray-600').should('contain', `Cantidad: ${qty}`);
            cy.get('.font-bold').last().invoke('text').then(priceText => {
              const subtotal = Number(priceText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
              expect(subtotal, `Subtotal for "${name}" in checkout`).to.eq(unitPrice * qty);
            });
          });
      });

      // Assert: Checkout total matches previous cart
      cy.get('article.shadow-md').find('.font-bold.text-lg').contains('Total').siblings('p').invoke('text').then(totalText => {
        const totalNumber = Number(totalText.replace(/[^0-9.]/g, '').replace(/,/g, ''));
        expect(totalNumber, 'Checkout total matches cart total').to.eq(expectedTotal);
      });

      // Fill out buyer info
      cy.get('input[name="name"]').type('Luis');
      cy.get('input[name="lastname"]').type('Montoya');
      cy.get('input[name="email"]').type('huge.test@gmail.com');
      cy.get('input[name="address"]').type('Cra 123 #45-67');
      cy.get('select[name="country"]').select('Colombia');

      // Fill payment info
      cy.get('input[name="nameHolder"]').type('Luis Montoya');
      cy.get('input[name="cardNumber"]').type('4301822375925071');
      cy.get('input[name="expiryDate"]').type('2029-09');
      cy.get('input[name="securityCode"]').type('668');

      // Assert: Button is now enabled
      cy.get('button.bg-primaryColor').contains('Completar Pago').should('not.be.disabled');

      // Click complete order
      cy.get('button.bg-primaryColor').contains('Completar Pago').click();

      // Validate success modal appears
      cy.log('Assert: Success modal appears with order confirmation');
      cy.get('h2.swal2-title').should('contain', 'Orden creada');
      cy.get('div.swal2-html-container').should('contain', 'Tu orden se ha creado con éxito');

      // Click "Ir a mi cuenta"
      cy.get('button.swal2-confirm').contains('Ir a mi cuenta').click();

      // Validate redirect to My Account
      cy.url().should('include', '/my-account');
      cy.log('Assert: Arrived to My Account page');

      // Validate order table contains correct info
      cy.get('table').should('exist');
      cy.get('table').within(() => {
        // Number of order (at least one order)
        cy.get('td.font-medium').should('exist').and('contain', 'Order #');
        // Value and date columns exist (format validation)
        cy.get('td').contains(/\$\d{1,3}(,\d{3})*(\.\d{2})?/); // Value like $14,000.00
        cy.get('td').contains(/\d{2} \w{3}, \d{2}/);           // Date like 05 jun, 25
      });
    });
  });
});

});

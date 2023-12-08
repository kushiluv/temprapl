describe('Profile Edit', () => {
    it('item added to cart', () => {
    cy.visit('/login');
    // Visit the login page

  // Fill in the login form
  cy.get('[type="email"]').type('abhinn@gmail.com');
  cy.get('[type="password"]').type('pass');
  cy.get('button[type="submit"]').click();
  cy.wait(500);
cy.visit('/market'); 

cy.get(':nth-child(1) > .market-card > .market-card--details > .market-card--title').then($firstItem => {
    cy.get(':nth-child(1) > .market-card > .market-card--details > .market-card-actions > button').click();
    cy.wait(500)
    cy.visit('/cart');
    cy.get('li > :nth-child(2)').then($cartItem => {
        expect($firstItem.text()).to.equal($cartItem.text());
    })
    
})

});
});
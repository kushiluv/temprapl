describe('login_logout', () => {
    it('Login feature', () => {
   cy.visit('/login');
        // Visit the login page
   
      // Fill in the login form
      cy.get('[type="email"]').type('abhinn@gmail.com');
      cy.get('[type="password"]').type('pass');
      cy.get('button[type="submit"]').click();
      cy.get('.userName').contains('Abhinn').should('be.visible');
    });
    it('Logout', () => {
        cy.visit('/login');
        // Visit the login page
   
      // Fill in the login form
      cy.get('[type="email"]').type('abhinn@gmail.com');
      cy.get('[type="password"]').type('pass');
      cy.get('button[type="submit"]').click();
      cy.get('.logout-button').click();
    //   cy.visit('/logout');
    //   cy.wait(500);
    //   cy.visit('/');
      cy.get('.register-button').contains('Register').should('be.visible');
    })
});
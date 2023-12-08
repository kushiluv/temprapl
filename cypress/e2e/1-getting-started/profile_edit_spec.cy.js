// profile_edit_spec.js

describe('Profile Edit', () => {
    it('allows a user to edit their profile', () => {
   cy.visit('/login');
        // Visit the login page
   
      // Fill in the login form
      cy.get('[type="email"]').type('abhinn@gmail.com');
      cy.get('[type="password"]').type('pass');
      cy.get('button[type="submit"]').click();
      //cy.wait(1000);
      // Wait for login to complete, adjust as per your app's behavior
    //   cy.url().should('include', '/'); // Assuming the user is redirected to a dashboard after login
  
      // Navigate to the profile page
      cy.visit('/profile'); // Adjust the URL according to your application's routes
      cy.wait(500);
      // Click on edit button if needed
      cy.get('.edit-profile-btn').click(); // Uncomment and adjust if there's an Edit button
  
      // Edit the address field
      cy.get('input[name="address"]').clear().type('New Address');
  
      // Click the save button
      cy.get('button').contains('Save').click();
  
      // Verify that the address is updated
      // This might involve waiting for a confirmation message, a page reload, or checking the value of the input
      cy.get('h2').contains('New Address').should('be.visible');

      
  
      // Additional assertions to verify the change was successful
      // e.g., Check for a success message or that the page has updated information
    });

    it('Checks order history', () => {
        cy.visit('/login');
        // Visit the login page
   
      // Fill in the login form
      cy.get('[type="email"]').type('abhinn@gmail.com');
      cy.get('[type="password"]').type('pass');
      cy.get('button[type="submit"]').click();
        cy.visit('/profile'); 
        cy.wait(500);
        cy.get('.profile-container > :nth-child(3) > :nth-child(1)').click()
      cy.get(':nth-child(1) > .trigger').click()
      cy.get('.product-details > :nth-child(2)').contains('Daal').should('be.visible');
    });

    
  });
  
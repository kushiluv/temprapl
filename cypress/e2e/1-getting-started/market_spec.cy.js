// cypress/integration/market_spec.js

describe('Market Component', () => {
    it('loads products from the server', () => {
      cy.visit('/market'); // Adjust the URL based on your app's routing
  
      cy.wait(1000); // Wait for the fetch to complete. This is not ideal, better to use network stubbing or aliasing.
  
      // Check if a specific product is displayed
      cy.contains('Daal').should('be.visible');
  
      // Add more assertions and interactions as needed
    });
  
    // Additional tests for filter functionality, etc.
  });
  
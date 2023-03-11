// cypress/integration/bonus64.js

// This test fails to catch the network call
// Can you fix it? Can you make the cy.intercept command
// log a message to the Cypress Command Log
// Tip: overwrite the command
// https://on.cypress.io/custom-commands
it('registers the intercept too late', () => {
  // visit the calculator page and add two numbers
  cy.intercept('POST', '/calculate').as('calculate') // it should be here...
  cy.visit('/calculator.html')
  cy.get('#num1').type('10')
  cy.get('#num2').type('20')
  cy.get('#add').click()
  // cy.intercept('POST', '/calculate').as('calculate') // just move the intercept up
  // confirm the "POST /calculate" call is made
  cy.wait('@calculate')
})

// overwrite the cy.intercept command to log a message
// to the Cypress Command Log when the intercept is defined
Cypress.Commands.overwrite('intercept', (intercept, method, url, options) => {
  cy.log(`**adding intercept** ${method} ${url}`).then(() => {
    return intercept(method, url, options)
  })
})

it('registers the intercept too late', () => {
  // visit the calculator page and add two numbers
  cy.visit('/calculator.html')
  cy.get('#num1').type('10')
  cy.get('#num2').type('20')
  // to fix the test, define an intercept
  // before clicking the "add" button
  cy.intercept('POST', '/calculate').as('calculate')
  cy.get('#add').click()
  // confirm the "POST /calculate" call is made
  cy.wait('@calculate')
})

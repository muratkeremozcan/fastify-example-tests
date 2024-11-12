// cypress/e2e/bonus95.cy.js

// write custom command "waitForNetwork" that takes a network alias
// like "@fetches" and gets all intercepts using "alias" + ".all" cy.get command
// This yields an array of intercepts. An intercept might be already waited on
// so filter the array to leave only "responseWaited: false" items
// Then for each remaining intercept, call "cy.wait"
// and confirm its response status message is "OK"
Cypress.Commands.add('waitForNetwork', (networkAliasName) => {
  cy.get(networkAliasName + '.all')
    .invoke('filter', (x) => !x.responseWaited)
    .invoke('forEach', () => {
      cy.wait(networkAliasName)
        .its('response')
        .should('have.property', 'statusMessage', 'OK')
    })
})

it('waits for all API calls to finish successfully', () => {
  // intercept all "fetch" requests the application is making
  // https://on.cypress.io/intercept
  // Tip: use the resource type property
  // give this intercept alias "fetches"
  // https://on.cypress.io/as
  cy.intercept({ resourceType: 'fetch' }).as('fetches')
  // visit the calculator page "/calculator.html"
  // https://on.cypress.io/visit
  cy.visit('/calculator.html')
  // wait for all "@fetches" calls using your custom command
  // cy.waitForNetwork
  cy.waitForNetwork('@fetches')
  // type "20" into the first input number
  // and type "6" into the second input
  cy.get('#num1').type(20)
  cy.get('#num2').type(6)
  // wait for all "@fetches" calls using your custom command
  // cy.waitForNetwork
  cy.waitForNetwork('@fetches')
  // click on the "Add" button
  // and confirm the result shown is 26
  cy.get('#add').click()
  cy.contains('#answer', 26)
  // wait for all "@fetches" calls using your custom command
  // cy.waitForNetwork
  cy.waitForNetwork('@fetches')
})

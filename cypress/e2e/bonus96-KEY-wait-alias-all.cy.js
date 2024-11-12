// cypress/e2e/bonus96.cy.js

it('loads two CSS resources', () => {
  // spy on all stylesheet resources
  // and give the intercept alias "css"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept({ resourceType: 'stylesheet' }).as('css')
  // visit the calculator page "/calculator.html"
  // https://on.cypress.io/visit
  cy.visit('/calculator.html')
  // confirm that there are 2 css intercepts
  cy.get('@css.all').should('have.length', 2)
  // confirm there were two resources loaded by the page
  // window.performance.getEntriesByType
  // https://on.cypress.io/window
  // https://on.cypress.io/its
  // https://on.cypress.io/invoke
  cy.window()
    .its('performance')
    .invoke('getEntriesByType', 'resource')
    // filter these entries to only the resources
    // with names ending with ".css"
    .invoke('filter', (r) => r.name.endsWith('.css'))
    // there should be two of them
    .should('have.length', 2)
    // convert entries into the list of their names
    // and print the list of names
    // to the Cypress Command Log
    .invoke('map', (r) => r.name)
    .invoke('join', ',')
    .then(cy.log)
})

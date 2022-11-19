// add a custom Cypress command called "waitForSuccess"
// it should take an alias and return a chainable object
// it should confirm the response status code is 200 or 304
// and yield the response body property
// Tip: all the inner commands should log nothing
// but you can use cy.log to log the network alias
Cypress.Commands.add('waitForSuccess', (alias) => {
  cy.log(`**${alias}**`)
  return (
    cy
      .wait(alias)
      .its('response', { timeout: 0, log: false })
      .should((res) => {
        expect(res, 'status code')
          .to.have.property('statusCode')
          .and.to.be.oneOf([200, 304])
      })
      // we should yield the response body property
      .its('body', { timeout: 0, log: false })
  )
})

// the same test using cy.waitForSuccess command
// instead of cy.wait
it('waits for success', () => {
  cy.intercept('GET', '/app.js').as('app')
  cy.intercept('GET', '/main.js').as('main')
  cy.intercept('GET', '/old-bundle.js').as('bundle')
  cy.visit('/bundles.html')
  cy.waitForSuccess('@app')
  cy.waitForSuccess('@main')
  // uncomment to see the test fail on 404 status code
  // cy.waitForSuccess('@bundle')
})

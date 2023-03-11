// A common mistake is to use assertions inside the cy.intercept callback function, but NOT wait for the network call to finish
// don't use assertions inside the cy.intercept callback function then...
// but if you do, then wait for network call to finish
it.skip('fails the test when an intercept fails', () => {
  // we have defined a network spy
  // that checks if the returned fruit is "Cucumber"
  // Note: the server NEVER returns the "Cucumber"
  // thus we expect this test to fail, right?!
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      expect(res.body.fruit).to.equal('Cucumber')
    })
  }).as('network')
  // visit the "/" page, which should kick off
  // the application network call to get the fruit
  cy.visit('/')
  cy.wait('@network') // fails the test correctly
})

import { plan } from 'cypress-expect-n-assertions'

// Bonus: use cypress-expect-n-assertions to automatically wait for the assertion
it.skip('fails the test when an intercept fails using assertion counting', () => {
  // there should be 1 assertion in this test
  plan(1)
  // we have defined a network spy
  // that checks if the returned fruit is "Cucumber"
  // Note: the server NEVER returns the "Cucumber"
  // thus we expect this test to fail, right?!
  cy.intercept('GET', '/fruit', (req) => {
    req.continue((res) => {
      expect(res.body.fruit).to.equal('Cucumber')
    })
  })
  // visit the "/" page, which should kick off
  // the application network call to get the fruit
  cy.visit('/')
})

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

it('retries getting all network calls', () => {
  // spy on the "GET /random-digit" calls the application makes
  // give the network intercept alias "random"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/random-digit').as('random')
  // visit the page "lucky7.html"
  // https://on.cypress.io/visit
  cy.visit('/lucky7.html')

  // get all network calls using the alias "random"
  // and confirm the response body from at least one
  // call includes "n: 7" value
  // Tip: it might take a while for the server to return 7
  cy.get('@random.all', { timeout: 60_000 }).should((calls) => {
    const numbers = Cypress._.map(calls, 'response.body.n')
    expect(numbers, 'server responses').to.include(7)
  })
})

it('Bonus: checks all responses using cy.map', () => {
  // spy on the "GET /random-digit" calls the application makes
  // give the network intercept alias "random"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/random-digit').as('random')
  // visit the page "lucky7.html"
  // https://on.cypress.io/visit
  cy.visit('/lucky7.html')

  // get all network calls using the alias "random"
  // map each intercepted call to its response "n" property
  // confirm the list includes the value 7
  // Tip: it might take a while for the server to return 7
  cy.get('@random.all', { timeout: 60_000 })
    .map('response.body.n')
    .should('include', 7)
})

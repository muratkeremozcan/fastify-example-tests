it('shows rounded float sent by the server', () => {
  // spy on the GET /random-float network call
  // give the intercept alias "random"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/random-float').as('random')
  // visit the "random-float.html" page
  cy.visit('/random-float.html')
  // wait for the network call "@random"
  // https://on.cypress.io/wait
  cy.wait('@random')
    // and grab from the response body the property "n"
    // https://on.cypress.io/its
    .its('response.body.n')
    // the number should be between 0 and 1
    .should('within', 0, 1)
    .then((n) => {
      // the page should show a number in the format "0.<digit>"
      // https://on.cypress.io/contains
      cy.contains('#number', /^0\.\d$/)
        // grab its inner text by invoking the jQuery method "text"
        // and parse text to float
        .invoke('text')
        .then(parseFloat)
        // the result should be close to the number sent by the server
        // within +/- 0.05
        .should('be.closeTo', n, 0.05)
    })
})

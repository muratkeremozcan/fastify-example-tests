it('validates the referer header URL', () => {
  // spy on the network call the application makes
  // tip: use https://on.cypress.io/intercept
  // and give the intercept alias "fruit"
  // https://on.cypress.io/as
  cy.intercept('GET', '**/fruit*').as('fruit')
  // visit the page "/"
  // https://on.cypress.io/visit
  cy.visit('/')

  // wait for the network call to finish
  // https://on.cypress.io/wait
  // grab the "referer" request header
  // https://on.cypress.io/its
  // Tip: confirm it is a string to print it
  cy.wait('@fruit')
    .its('request.headers.referer')
    .should('eq', 'http://localhost:4200/')

  // why?... To check different parts of it separately
  // construct the URL instance from the string
  // https://developer.mozilla.org/en-US/docs/Web/API/URL
  //
  // from the URL instance, we can grab multiple properties
  // that we can check. For example the "host"
  // is our base Url without the protocol
  cy.get('@fruit')
    .its('request.headers.referer')
    .should('be.a', 'string')
    .then((s) => new URL(s))
    .its('host')
    .should('eq', 'localhost:4200')
})

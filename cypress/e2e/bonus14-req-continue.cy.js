it('successfully completes every network request', () => {
  // intercept all requests and let them continue
  // going to the server. When the server replies,
  // check the response status code. It should be either
  // 2xx or 3xx code. In our application, the response codes
  // are limited to 200 (success) and 304 (not modified)
  // https://on.cypress.io/intercept

  cy.intercept('*', (req) => {
    return req.continue((res) => {
      // console.dir(res)

      expect(res.statusCode).to.be.oneOf([200, 304])
    })
  }).as('all')

  //
  // visit the page using https://on.cypress.io/visit
  // in the Cypress command log observe the network requests
  // notice they are all successful

  cy.visit('/')
  cy.wait('@all')
  cy.wait('@all').its('response.statusCode').should('be.oneOf', [200, 304])

  //
  // reload the page to see the same behavior
  // and possible the 304 (not modified) status codes
  // https://on.cypress.io/reload

  cy.reload()
  cy.wait('@all').its('response.statusCode').should('be.oneOf', [200, 304])
})

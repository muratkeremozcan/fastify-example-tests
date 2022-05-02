it('sets a common header on all requests', () => {
  // create a random number between 1e5 and 1e6
  // using Cypress._.random function
  const id = Cypress._.random(1e5, 1e6)
  const requestId = `request-${id}`

  // intercept all requests and add a custom header
  // https://on.cypress.io/intercept
  cy.intercept('GET', '*', (req) => {
    // add a customer header:
    // set the header "request-id"
    // it will be used by our Fastify server to log the request
    req.headers['request-id'] = requestId
  }).as('interceptAll')

  // also intercept the document or style or Ajax requests
  // and give them an alias to wait later
  // intercept DOM
  cy.intercept('GET', '/').as('dom')

  // visit the page using https://on.cypress.io/visit
  cy.visit('/')
  cy.wait('@dom').as('domWait')
  cy.wait('@interceptAll').as('serverWait')

  // wait for the observed request(s)
  // and confirm the response header "x-request-id"
  // sent by the server back is the same as our
  // request ID we set above
  cy.get('@domWait')
    .its('response.headers')
    .its('x-request-id')
    .should('eq', requestId)

  cy.get('@serverWait')
    .its('response.headers')
    .its('x-request-id')
    .should('eq', requestId)
})

it('skips waiting for the aborted request', () => {
  // spy on the "GET /delay/1000" call
  // and give it an alias "api"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/delay/1000').as('api')
  // the page makes 2 calls one after another
  // 1: GET /delay/1000 which the page aborts after 500ms
  // 2: GET /delay/1000 which the page completes
  cy.visit('/aborted-call.html')
  // if we try to wait for the call the app might abort
  // then the cy.wait never resolves
  // cy.wait('@api')
  // instead get all intercepted requests via "api" alias
  // and filter out the ones that are not completed
  cy.get('@api.all')
    // Tip: all inflight / aborted requests have state "Received"
    // and we are interested in the fully completed requests
    .invoke('findLast', (req) => req.state === 'Complete')
    // keep retrying until we have at least one completed request
    .should('exist')
    // its response body should be { ok: true }
    .its('response.body')
    .should('deep.equal', { ok: true })
})

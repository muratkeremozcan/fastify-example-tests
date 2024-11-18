// SKIP: setting the intercept alias in the response callback does not work
// https://github.com/cypress-io/cypress/issues/28871
it.skip('eventually returns a number', { viewportHeight: 500 }, () => {
  // spy on the "GET /fail-first/*" calls
  // get the real response from the server
  // and if the response is 200, set the request alias to "first"
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fail-first/*', (req) => {
    req.continue((res) => {
      if (res.statusCode === 200) {
        req.alias = 'first'
      }
    })
  })
  cy.visit('/failing-initial-calls.html')

  // eventually the calls succeed
  // and you should see the ".success" element
  // confirm the response status code is 200
  // by waiting for the "@first" alias
  // https://on.cypress.io/wait
  cy.wait('@first', { timeout: 10_000 })
    .its('response.statusCode')
    .should('eq', 200)
  // confirm the ".success" element is visible
  cy.get('.success').should('be.visible')
})

// workaround: keep track of calls ourselves
it('eventually returns a number (workaround)', { viewportHeight: 500 }, () => {
  const calls = []
  // instead of setting an alias in the response callback
  // push all successful responses into an array
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/fail-first/*', (req) => {
    req.continue((res) => {
      if (res.statusCode === 200) {
        calls.push(res)
      }
    })
  })
  cy.visit('/failing-initial-calls.html')

  // wrap the calls array and confirm it has length 1
  // Tip: cy.wrap(...).should(...) retries
  cy.wrap(calls, { timeout: 10_000 })
    .should('have.length', 1)
    // grab the status code from the first call
    // and confirm it is 200
    .its('0.statusCode')
    .should('eq', 200)
  // confirm the ".success" element is visible
  cy.get('.success').should('be.visible')
})

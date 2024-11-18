it('spies on the request and makes the same request from the test', () => {
  cy.visit('/with-cookie')
  // spy on the "GET /api/with-cookie" request
  // and give it an alias "pageRequest"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/api/with-cookie').as('pageRequest')
  // click on the button "Make request"
  cy.contains('button', 'Make request').click()
  // confirm the application is making the "pageRequest" call
  // and it is successful
  // https://on.cypress.io/wait
  cy.wait('@pageRequest').its('response.statusCode').should('eq', 200)

  // confirm the "pageRequest" has response {ok: true}
  cy.get('@pageRequest').its('response.body').should('deep.equal', { ok: true })

  // try making "GET /api/with-cookie" request from the test
  // and see it fail since it does not have the same headers
  // as the application sets. The status code should be 401
  cy.request({
    method: 'GET',
    url: '/api/with-cookie',
    failOnStatusCode: false
  })
    .its('status')
    .should('eq', 401)

  // how can you make the cy.request using the same
  // request headers as the application?
  // Tip: you have the good headers in the "pageRequest"
  cy.get('@pageRequest')
    .its('request.headers')
    .then((headers) => {
      cy.request({
        method: 'GET',
        url: '/api/with-cookie',
        headers
      })
    })
})

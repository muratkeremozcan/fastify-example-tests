// cypress/e2e/bonus110.cy.js

// a better way to handle sensitive information
// is describe in my blog post "Keep passwords secret in E2E tests"
// https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
const username = 'test_cy'
const password = 'secure12$1'

it('requests a protected page', () => {
  // can you make cy.request with basic authentication
  // WITHOUT using the "auth" option in the cy.request command?
  // https://on.cypress.io/request

  // encode the username and password like the browser does
  const basicAuth = btoa(username + ':' + password)
  // set the basic auth header
  const authorization = `Basic ${basicAuth}`
  // and make the cy.request call
  cy.request({
    url: '/protected',
    headers: {
      authorization
    }
  })
    .its('status')
    .should('equal', 200)

  // can you visit the protected page '/protected'
  // WITHOUT using the "auth" option in the cy.visit command?
  // https://on.cypress.io/visit
  cy.visit('/protected', {
    headers: { authorization }
  })
  // confirm the text "Secret stuff" is visible
  // https://on.cypress.io/contains
  cy.contains('Secret stuff').should('be.visible')
})

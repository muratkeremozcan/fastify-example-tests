// https://cypress.tips/courses/network-testing/lessons/bonus89

// a better way to handle sensitive information
// is describe in my blog post "Keep passwords secret in E2E tests"
// https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
const username = 'test_cy'
const password = 'secure12$1'

it('receives 401 error', () => {
  // request the "/protected" page
  // and confirm the server responds with 401
  // https://on.cypress.io/request
  cy.request({ url: '/protected', failOnStatusCode: false })
    .its('status')
    .should('eq', 401)

  // request the same page with basic authentication
  // and the server should respond with 200

  cy.request({ url: '/protected', auth: { username, password } })
    .its('status')
    .should('eq', 200)
})

it('visits the protected page', () => {
  // visit the page with basic authentication
  // https://on.cypress.io/visit
  cy.visit('/protected', { auth: { username, password } })
  //
  // confirm the text "Secret stuff" is visible
  // https://on.cypress.io/contains
  cy.contains('Secret stuff').should('be.visible')
})

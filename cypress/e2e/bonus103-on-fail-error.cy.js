// the password probably comes from Cypress.env() object
// "Keep passwords secret in E2E tests"
// https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
const password = '63hh15xx!7A'

// register a global "fail" hook
// and replace all password strings in the error message
// with the string "[redacted]"
// https://on.cypress.io/catalog-of-events
Cypress.on('fail', (err) => {
  err.message = err.message.replaceAll(password, '[redacted]')
  throw err
})

it('hides the password from the error message', () => {
  // make a request to fetch something from the endpoint /auth
  // passing the username "My User Name" and the password
  // as the payload
  // https://on.cypress.io/request
  cy.request('/auth', {
    username: 'My User Name',
    password
  })
})

// cypress/e2e/bonus125.cy.js

beforeEach(() => {
  cy.visit('/my-profile-page.html')
})

// this is an example that catches the incorrectly encoded URL search parameters
it.skip('checks if the URL search params were encoded - fails', () => {
  cy.contains('a#login-raw', 'Log in').click()
  // validate the search parameters
  // - should include the "callback" parameter
  // - and not include any of the special characters
  // https://en.wikipedia.org/wiki/Percent-encoding
  // for example "/" or ":"
  // https://on.cypress.io/location
  cy.location('search')
    .should('include', 'callback')
    .and('not.include', '/')
    .and('not.include', ':')
})

it('checks if the URL search params were encoded - passes', () => {
  cy.contains('a#login-encoded', 'Log in').click()
  // validate the search parameters
  // - should include the "callback" parameter
  // - and not include any of the special characters
  // https://en.wikipedia.org/wiki/Percent-encoding
  // for example "/" or ":"
  // https://on.cypress.io/location
  cy.location('search')
    .should('include', 'callback')
    .and('not.include', '/')
    .and('not.include', ':')
})

// add a custom Cypress query command
// that checks the current subject string value
// for the presence of the given characters "/" and ":"
// and fails the test if they are found
// tip: attach this command after cy.location
Cypress.Commands.addQuery('noSpecialChars', () => {
  const log = Cypress.log({ name: 'noSpecialChars' })
  return (s) => {
    log.set('message', s)
    if (!s || s.includes('/') || s.includes(':')) {
      throw new Error(
        'URL search parameters should not contain / or :\n was ' + s
      )
    }
  }
})

it('uses a custom assertion to check the URL search params', () => {
  // check if your query command catches the unencoded search params
  // cy.contains('a#login-raw', 'Log in').click()
  // use noSpecialChars
  // but if you click the correct link, the test passes
  cy.contains('a#login-encoded', 'Log in').click()
  // use noSpecialChars
  cy.location('search').noSpecialChars()
})

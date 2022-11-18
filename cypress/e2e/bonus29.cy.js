import { ifElse, identity } from 'ramda'
// add a custom Cypress command to wa!t for a successful response
// given an alias. The command should log "Success" if the response
// status code is 200. Otherwise it should keep waiting
// for the same alias. What does the command yield?
// Can you make it yield the status code? Or the intercept?
// https://on.cypress.io/custom-commands
Cypress.Commands.add('waitForSuccess', (alias, n = 4) => {
  if (n === 0) {
    throw new Error('Failed to wait for success')
  }

  return cy
    .wait(alias)
    .its('response.statusCode')
    .then((statusCode) => {
      if (statusCode < 300) {
        return statusCode
      }

      return cy.waitForSuccess(alias, n - 1)
    })
})
Cypress.Commands.add('waitForSuccessR', (alias, n = 4) => {
  if (n === 0) {
    throw new Error('Failed to wait for success')
  }

  const isSuccess = (s) => s < 300
  const returnIfSuccess = ifElse(isSuccess, identity, () =>
    cy.waitForSuccessR(alias, n - 1)
  )

  return cy.wait(alias).its('response.statusCode').then(returnIfSuccess)
})

it('waits for a successful message', () => {
  cy.intercept('GET', '/unreliable').as('unreliable')
  // visit the page /retries.html
  // https://on.cypress.io/visit
  cy.visit('/retries.html')
  // confirm that it contains an element with id "result"
  cy.get('#result')

  cy.waitForSuccess('@unreliable').should('equal', 200)
  // first with the text "FAIL 1"
  // then with the text "FAIL 2"
  // and then with the text "SUCCESS"
  // https://on.cypress.io/contains
})

it('waits for a successful message Ramda', () => {
  cy.intercept('GET', '/unreliable').as('unreliable')
  cy.visit('/retries.html')
  cy.get('#result')

  cy.waitForSuccessR('@unreliable').should('equal', 200)
})

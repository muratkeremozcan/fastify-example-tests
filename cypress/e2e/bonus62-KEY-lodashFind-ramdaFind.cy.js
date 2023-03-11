import 'cypress-map'
import { find, propEq } from 'ramda'

it('includes the fruit Apples in the response array of objects', () => {
  // spy on the "GET /all-fruits" call and give it an alias "all-fruits"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/all-fruits').as('all-fruits')
  // visit the page "/all-fruits.html"
  // https://on.cypress.io/visit
  cy.visit('all-fruits.html')
  // wait for the "all-fruits" network call
  // https://on.cypress.io/wait
  // and yield its response body
  // https://on.cypress.io/its
  // find in that list an object with "fruit: Apples" property
  // and yield it to the next assertions
  // Tip: use Lodash _.find method
  // https://lodash.com/docs
  // confirm the found item is an object
  // and confirm the item has property "k: 0"
  cy.wait('@all-fruits')
    .its('response.body')
    .then((list) => Cypress._.find(list, { fruit: 'Apples' })) // vanilla version
    .then(find(propEq('fruit', 'Apples'))) // ramda version
    .print()
    .should('be.an', 'object')
    .should('have.property', 'k', 0)
  // confirm the "Apples" is shown at the first position
  // in the list on the page
  // https://on.cypress.io/contains
  cy.contains('#fruits li:first', 'Apples')
})

it('play with cypress-map', () => {
  cy.wrap(100).partial(Cypress._.add, 5).should('equal', 105)
  // same as
  cy.wrap(100)
    .apply((subject) => Cypress._.add(5, subject))
    .should('equal', 105)
})

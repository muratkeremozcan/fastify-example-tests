/// <reference types="cypress" />

const { _ } = Cypress
import { each } from 'cypress-recurse'

it('gets all interceptions', () => {
  // wait for the fruit to be shown on the page
  // need to get all network calls from the alias "fruit"
  // tip: use https://on.cypress.io/get command
  // like cy.get(alias.all)
  // confirm there are 4 responses
  // print the responses to the console using
  // cy.get(alias.all).then(console.log)
  // and inspect the available properties
  //
  // if we use cy.wait(alias) then each response
  // will mark those intercepts as "requestWaited: true"
  // confirm this is true for the first request
  cy.intercept('GET', '/fruit').as('fruit')
  cy.visit('/')
  cy.wait('@fruit')
  _.times(3, () => {
    cy.reload()
    cy.wait('@fruit')
  })

  // KEY: cy.get(alias.all) gets an array of all aliases of the same name
  cy.get('@fruit.all')
    .should('have.length.gte', 4)
    .then(console.log)
    .each((response) => cy.wrap(response.requestWaited).should('eq', true))
})

it('uses cypress-recurse each feature with optional stop condition', () => {
  cy.intercept('GET', '/fruit').as('fruit')
  cy.visit('/')
  cy.wait('@fruit')
  _.times(3, () => {
    cy.reload()
    cy.wait('@fruit')
  })

  cy.get('@fruit.all')
    .should('have.length.gte', 4)
    // https://github.com/bahmutov/cypress-recurse#each
    // cypress-recurse includes an each function that iterates over the given subject items.
    // It can optionally stop when the separate predicate function returns true.
    .then(
      each(
        // regular .each yields the responses from the original item ( the call )
        // cypress-recurse each yields original item itself (the call), kind of like what then(console.log) yielded,
        // and does something with the call every recursion

        (call) => call.response.body.fruit,
        // or lol
        // ({
        //   response: {
        //     body: { fruit }
        //   }
        // }) => fruit,

        // PERK over .each: optional stop condition
        (fruit) => fruit === 'Bananas'
      )
    )
})

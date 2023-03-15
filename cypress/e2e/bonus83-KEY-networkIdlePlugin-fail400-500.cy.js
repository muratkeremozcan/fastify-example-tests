/// <reference types="cypress-network-idle" />
// https://cypress.tips/courses/network-testing/lessons/bonus83

// another solution to the problem posed in "bonus 46" lesson ./bonus46-KEY-b4Each-all.cy.js
// we want to automatically fail the test if any of the network requests
// return the 4xx or 5xx status from the server

// import cypress-network-idle plugin
import 'cypress-network-idle'

beforeEach(() => {
  // using cypress-network-idle plugin
  // command "cy.waitForNetworkIdlePrepare"
  // spy on all network calls and fail the test
  // if any of them get the status code 4xx or 5xx
  // https://github.com/bahmutov/cypress-network-idle
  cy.waitForNetworkIdlePrepare({
    method: '*',
    alias: 'all',
    pattern: '**',
    failOn4xx: true,
    failOn5xx: true
  })
})

// enable the test to see it fail
it.skip('successfully completes every network request', () => {
  // visit the page "/bundles.html" and see if the test fails
  // https://on.cypress.io/visit
  cy.visit('/bundles.html')
})

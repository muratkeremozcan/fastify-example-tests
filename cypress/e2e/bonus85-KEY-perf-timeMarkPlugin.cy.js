// https://cypress.tips/courses/network-testing/lessons/bonus85
import 'cypress-time-marks'

it('shows how long one cy.request takes', () => {
  // make the request to "/delay/<delay ms>" endpoint
  // the server should replay after 500ms
  // https://on.cypress.io/request
  cy.request('/delay/500')
    // from the object yielded by the cy.request command
    // grab the duration property and assert
    // it is between 500ms and 600ms
    .its('duration')
    .should('be.within', 500, 600)
})

it('shows how long part of the test takes', () => {
  // use the cypress-time-marks plugin
  // to see how long 3 cy.requests take
  // each delayed by 500ms
  cy.timeMark('start')
  cy.request('/delay/500')
    .request('/delay/500')
    .request('/delay/500')
    // the total time since the start of the test
    // should be below 2 seconds
    .timeSince('start', '3 requests', 2000)
})

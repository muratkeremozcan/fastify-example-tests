// https://cypress.tips/courses/network-testing/lessons/bonus88

import 'cypress-map'

it('sends the right time', () => {
  // spy on the HTML page resource and give it an alias "page"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/time-check').as('page')
  // visit the "time-check" page
  cy.visit('/time-check')
  // wait for the "page" network call
  // https://on.cypress.io/wait
  cy.wait('@page')
    // get the "x-time-check" response header
    // https://on.cypress.io/its
    .its('response.headers.x-time-check')
    // confirm it is a string
    // Tip: it will display it in the Command Log
    .should('be.a', 'string')
    // convert the string into a Date object
    // https://on.cypress.io/then
    .then((s) => new Date(s))
    // pass the precise date into a cy.then callback
    .then((preciseDate) => {
      // confirm the rounded date is shown on the page
      // https://on.cypress.io/contains
      // Tip: use a regular expression to validate the date format
      cy.contains('[data-cy=time]', /^\d\d\d\d-\d\d-\d\d \d\d:\d\d$/)
        // extract the text and convert it to UTC string
        // because it is rounded, append the seconds part
        // "YYYY-MM-DDTHH:mm:00.000Z"
        .invoke('text')
        .invoke('replace', ' ', 'T')
        .invoke('concat', ':00.000Z')
        // convert the string into a Date object
        // and confirm its type to show it the Command Log
        // Tip: "be.a" assertion can check various types
        // including if the subject is a date instance
        .then((s) => new Date(s))
        .should('be.a', 'date')
        // convert the Date instance to the milliseconds number
        // https://on.cypress.io/invoke
        .invoke('valueOf')
        // compare both dates as milliseconds
        // Tip: use "closeTo" assertion and have both the subject
        // and the date to compare to as numbers
        .should('be.closeTo', +preciseDate, 60 * 1000)
    })
})

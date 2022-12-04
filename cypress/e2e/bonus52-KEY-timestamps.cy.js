import 'cypress-time-marks'

describe('generic time measures', () => {
  it('measures the time between the visit and returned fruit', () => {
    // spy on the network call to "GET /fruit"
    // and give the intercept alias "fruit"
    // https://on.cypress.io/intercept
    cy.intercept('GET', '/fruit').as('fruit')
    // visit the "delayed.html" page
    // https://on.cypress.io/visit
    let visitAt
    // before load save the current timestamp
    // in the variable "visitAt"
    cy.visit('/delayed.html', {
      onBeforeLoad() {
        visitAt = +new Date()
      }
    })
    // wait for the network intercept "@wait"
    // https://on.cypress.io/wait
    // then take another timestamp and compute
    // the elapsed duration in milliseconds
    // https://on.cypress.io/then
    cy.wait('@fruit').then(() => {
      const elapsed = new Date() - visitAt
      // show the elapsed time in the Command Log
      cy.log(`elapsed ${elapsed} ms`)
      // Bonus: fail the test if the elapsed duration
      // is above 1500ms
      if (elapsed > 1500) {
        throw new Error('Too slow to load the fruit')
      }
    })
  })

  it('measures the time between the visit and shown fruit', () => {
    // visit the "delayed.html" page
    // https://on.cypress.io/visit
    let visitAt
    // before load save the current timestamp
    // in the variable "visitAt"
    cy.visit('/delayed.html', {
      onBeforeLoad() {
        visitAt = +new Date()
      }
    })
    // confirm the page no longer shows the "loading" text
    // https://on.cypress.io/contains
    cy.contains('loading')
      .should('not.exist')
      .then(() => {
        // then compute the elapsed time in milliseconds
        // since the "visitAt" timestamp
        const elapsed = new Date() - visitAt
        // show the elapsed time in the Command Log
        cy.log(`elapsed ${elapsed} ms`)
        // Bonus: fail the test if the elapsed duration
        // is above 3000ms
        if (elapsed > 3000) {
          throw new Error('Too slow to load and show the fruit')
        }
      })
  })
})

describe('time marks', () => {
  it('measures the time between the visit and returned fruit', () => {
    cy.intercept('GET', '/fruit').as('fruit')
    cy.visit('/delayed.html').timeMark('visit')

    cy.wait('@fruit').timeSince('visit', 'load and show the fruit', 3000, true)
  })

  it('measures the time between the visit and shown fruit', () => {
    cy.visit('/delayed.html').timeMark('visit')

    cy.contains('loading')
      .should('not.exist')
      .timeSince('visit', 'load and show the fruit', 3000, true)
  })
})

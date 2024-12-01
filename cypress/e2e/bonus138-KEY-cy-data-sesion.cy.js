import 'cypress-data-session'

describe('data session (no plugin)', () => {
  let response
  beforeEach(() => {
    // speed up the "GET /delay/*" calls
    // the application makes in each test:
    //
    // spy on the very first "GET /delay/*" call
    // and store its response in the "response" variable
    // https://on.cypress.io/intercept
    // for other calls we will use the stored response
    // by setting it as a stub response
    if (!response) {
      cy.intercept('GET', '/delay/*').as('delay')
    } else {
      cy.intercept('GET', '/delay/*', response).as('delay')
    }
    cy.visit('/slow-page.html')
    cy.get('#loading').should('have.text', 'loading...')
    if (!response) {
      cy.wait('@delay')
        .its('response.body')
        .then((data) => {
          response = data
        })
    }
  })

  it('loads the data on the slow page (test 1)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })

  it('loads the data on the slow page (test 2)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })

  it('loads the data on the slow page (test 3)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })
})

describe('data sessio plugin', () => {
  beforeEach(() => {
    // speed up the "GET /delay/*" calls
    // the application makes in each test:
    //
    // spy on the very first "GET /delay/*" call
    // and store its response in the "response" variable
    // https://on.cypress.io/intercept
    // for other calls we will use the stored response
    // by setting it as a stub response
    cy.dataSession({
      name: 'slow api call',
      setup() {
        cy.intercept('GET', '/delay/*').as('delay')
        cy.visit('/slow-page.html')
        cy.get('#loading').should('have.text', 'loading...')
        cy.wait('@delay').its('response.body')
      },
      recreate(response) {
        cy.intercept('GET', '/delay/*', response).as('delay')
        cy.visit('/slow-page.html')
        cy.get('#loading').should('have.text', 'loading...')
      }
    })
  })

  it('loads the data on the slow page (test 1)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })

  it('loads the data on the slow page (test 2)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })

  it('loads the data on the slow page (test 3)', () => {
    cy.get('#loading').should('have.text', 'data loaded')
  })
})

beforeEach(() => {
  cy.visit('/loading.html')
})

it('shows the loading element', () => {
  cy.intercept('GET', '/fruit', (req) => {
    req.on('response', (res) => {
      res.setDelay(1500) // 1.5 seconds delay
    })
  }).as('fetchFruit')
  // once the network intercept is set up
  // visit the page which kicks off the request
  cy.visit('/loading.html')

  cy.get('div').contains('loading').should('be.visible')
  cy.wait('@fetchFruit')
  cy.get('div').contains('loading').should('not.exist')
})

it('shows the loading element (2)', () => {
  cy.intercept('GET', '/fruit', (req) => {
    req.on('response', (res) => {
      res.setDelay(1500) // 1.5 seconds delay
    })
  }).as('fetchFruit')
  cy.visit('/loading.html')

  cy.contains('#fruit', 'loading').should('be.visible')
  cy.wait('@fetchFruit')
  cy.get('#fruit').should('not.contain', 'loading')
})

it('shows the loading element (3)', () => {
  cy.intercept('GET', '/fruit', () => Cypress.Promise.delay(1500)).as(
    'fetchFruit'
  )
  cy.visit('/loading.html')

  cy.contains('#fruit', 'loading').should('be.visible')
  cy.wait('@fetchFruit')
  cy.get('#fruit').should('not.contain', 'loading')
})

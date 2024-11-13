it('does not ping if the button was not pressed', () => {
  // stop the application's clock
  // https://on.cypress.io/clock
  cy.clock()
  // spy on the "GET /random-digit" calls
  cy.intercept('GET', '/random-digit').as('random')
  // visit the periodic.html page
  cy.visit('/periodic.html')
  // without clicking the "Start" button
  // fast-forward the clock by 31 seconds
  cy.tick(31_000)
  // confirm there were no calls made
  cy.get('@random.all').should('be.empty')
  // fast-forward the clock by 31 seconds
  // confirm there were no calls made
  cy.tick(31_000)
  cy.get('@random.all').should('be.empty')
  // fast-forward the clock by 31 seconds
  // confirm there were no calls made
  cy.tick(31_000)
  cy.get('@random.all').should('be.empty')
})

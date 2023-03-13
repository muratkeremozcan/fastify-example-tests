// https://cypress.tips/courses/network-testing/lessons/bonus71

it('makes the track call before the calculate call', () => {
  // visit the "calculator.html" page
  // https://on.cypress.io/visit
  // which can fire several /track Ajax calls
  cy.visit('/calculator.html')
  // enter numbers 20 and 6 and calculate their sum
  // if we want to verify the order of the network calls, we use cy.spy on the staticResponse argument
  cy.intercept('POST', '/track', cy.spy().as('trackSpy'))
  cy.intercept('POST', '/calculate', cy.spy().as('calculateSpy'))
  cy.get('#num1').type('20')
  cy.get('#num2').type('6')
  cy.get('#add').click()

  // spy on the "POST /track" network calls
  // and spy on the "POST /calculate" network calls
  // https://on.cypress.io/intercept
  // https://on.cypress.io/spy
  // Tip: use functional spies and give them aliases

  //
  // confirm the call as made by looking at the page
  // and finding the displayed answer 26
  // https://on.cypress.io/contains
  cy.contains('#answer', '26')
  //
  // confirm the "track" call happened before "calculate" call
  // by getting the spy by its alias "track"
  // and checking that it was called.
  // Get the second spy "calculate" and confirm it was called
  // after the "track" call
  //
  // confirm the "track" call happened after "calculate" call
  // by getting the spy by its alias "track"
  // and checking that it was called.
  // Get the second spy "calculate" and confirm it was called
  // after the "track" call
  cy.get('@trackSpy').should('have.been.called')
  cy.get('@calculateSpy').should('have.been.calledBefore', '@trackSpy')
})

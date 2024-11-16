beforeEach(() => {
  cy.visit('/search.html')
})

it('confirms there are two results for search "abc"', () => {
  // type "abc" into the search input field
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  cy.get('#search').type('abc')
  // confirm there are only two search results
  // https://on.cypress.io/get
  // https://on.cypress.io/assertions
  cy.get('#results li').should('have.length', 2)
})
it('confirms the old search results are ignored', () => {
  // spy / stub the network calls made by the search
  // suggestions logic. Slow down the search for "a"
  // so it arrives _after_ searches "ab" and "abc"
  cy.intercept('/api/search/a', () => Cypress.Promise.delay(2000)).as('a')
  //
  // type the search "abc"
  // Note: there is a separate search call for every character
  cy.get('#search').type('abc')
  // wait for the first slow search for "a" to finish
  cy.wait('@a')
  // confirm there are only two search results
  // after all search calls complete
  // Tip: does the app reject obsolete search results
  // for previous searches, even if they are slow and late?
  cy.get('#results li').should('have.length.gt', 2)
  //
  // Bonus: now that you have shown the application is
  // incorrect and does not reject old results,
  // how would you fix it?
})

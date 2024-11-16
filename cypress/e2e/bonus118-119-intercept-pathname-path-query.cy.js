it('shows the parsed query returned by the server', () => {
  // spy on the "sorted.html" network call
  // under the alias "html"
  cy.intercept({
    pathname: '/sorted.html'
  }).as('html')
  cy.visit('/sorted.html')
  // confirm the "html" network call happens
  cy.wait('@html')
  // the request goes to the backend the backend sends
  // back the JSON with the query parameters
  cy.contains('pre', '"query":')
})

it('matches using a simple query parameter', () => {
  // spy on the "sorted.html" network call
  // under the alias "html"
  cy.intercept({
    pathname: '/sorted.html'
  }).as('html')
  // spy on the "page=2" query
  // under the alias "second"
  cy.intercept({
    pathname: '/sorted',
    query: {
      page: '2'
    }
  }).as('second')
  // spy on the "page=3" query
  // under the alias "third"
  cy.intercept({
    pathname: '/sorted',
    query: {
      page: '3'
    }
  }).as('third')
  cy.visit('/sorted.html')
  // confirm the "html" and the "second" aliases happen
  cy.wait(['@html', '@second'])
  // confirm the "third" network alias never happens
  cy.get('@third.all').should('have.length', 0)
})

// instead of a query object, use the "path" that includes the query
// as a simple string. Use a regular expression to
// match the "order[price]=" even if it is somewhere
// in the URL middle
it('matches the complex query parameter name using regex', () => {
  // spy on the "sorted.html" document under alias "html"
  cy.intercept({
    pathname: '/sorted.html'
  }).as('html')
  // spy on the "order[price]=asc" call under alias "asc"
  cy.intercept({
    path: /\/sorted\?.*order\[price\]=asc/
  }).as('asc')
  // spy on the "order[price]=desc" call under alias "desc"
  cy.intercept({
    path: /\/sorted\?.*order\[price\]=desc/
  }).as('desc')
  cy.visit('/sorted.html')
  // confirm the "html" and "asc" network calls happen
  cy.wait(['@html', '@asc'])
  // and the "desc" network call does not happen
  cy.get('@desc.all').should('have.length', 0)
})

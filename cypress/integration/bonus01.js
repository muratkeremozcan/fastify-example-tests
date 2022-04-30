// this test should check whatever the server returns
// by spying on the network call
it('shows zero or more fruits', () => {
  // spy on GET /fruits call and give it an alias
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  // visit the page /fruits.html
  // https://on.cypress.io/visit
  // the page loads one or more fruits
  // BUT
  // it might get no fruits back from the server
  // wait for the network call to finish
  // https://on.cypress.io/wait
  // from the server response, get the list of fruits
  // and depending on the number of fruits,
  // check the page to confirm
  //
  // if there are no fruits, confirm that
  // the page contains the text "No fruits found"
  // https://on.cypress.io/contains
  // else
  //   confirm each fruit returned by the server is shown
  // TIP: you can also verify that all fruits are unique

  cy.intercept('GET', '/fruit').as('fruit')

  cy.visit('/')
  cy.wait('@fruit')
    .its('response.body')
    .then((data) => {
      if (data.length === 0) {
        cy.contains('#fruit', 'No fruits found')
      } else {
        cy.contains('#fruit', data.fruit)
      }
    })
})

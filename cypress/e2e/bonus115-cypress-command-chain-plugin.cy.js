import 'cypress-command-chain'

// all fruits the server knows about
const fruits = ['Apples', 'Oranges', 'Bananas', 'Pears', 'Grapes']

// can you explain how Cypress executes the commands
// added inside the "Array.forEach" callback?
// Tip: https://glebbahmutov.com/blog/visualize-cypress-command-queue/
// using cy.pause command might be helpful

it('fetches a price for each fruit', () => {
  fruits.forEach((fruit) => {
    // make a call to fetch a price for each fruit
    // using "GET /fruits/price/<fruit name>" request
    // confirm from the response that the price
    // is between 1 and 100 cents
    cy.request('GET', `/fruits/price/${fruit}`)
      .its('body.price')
      .pause()
      .should('be.within', 1, 100)
  })
})

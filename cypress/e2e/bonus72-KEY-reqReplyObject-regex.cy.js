// https://cypress.tips/courses/network-testing/lessons/bonus72

// this test shows the "find-item-price" page in action
it('finds the item price', () => {
  // we add a new item to the database
  // by using an API request
  cy.request('POST', '/add-item', {
    'item-name': 'apple',
    price: 10,
    delay: 0
  })
  // if we search for the item, the price
  // is displayed
  cy.visit('/find-item-price.html')
  cy.get('#item-text').type('apple{enter}')
  cy.contains('.price', '$10')
})

it('shows an error if there is price mismatch', () => {
  cy.request('POST', '/add-item', {
    'item-name': 'apple',
    price: 10,
    delay: 0
  })

  // cy.intercept('GET', '/find-item/*') // ez mode version
  cy.intercept('GET', /\/find-item\/\w+$/, (req) => {
    req.reply({
      found: {
        price: 1
      }
    })
  }).as('item')
  // cy.intercept('GET', '/find-item/*/*') // ez mode version
  cy.intercept('GET', /\/find-item\/\w+\/price$/, (req) => {
    req.reply({ price: 2 })
  }).as('price')
  cy.visit('/find-item-price.html')

  cy.get('#item-text').type('apple{enter}')
  // the page makes two different request to double check the price
  // GET /find-item/:name
  // GET /find-item/:name/price
  // The first returns an object like
  // {found: {name: "...", price: 10}}
  // the second one returns just
  // {price: 10}
  cy.get('@item').then((i) => {
    console.log(i.response.body)
  })
  cy.get('@price').then((p) => {
    console.log(p.response.body)
  })
  // can you intercept each API call using Regexp and return objects
  // with DIFFERENT prices to see how the page handles it?
  // give each intercept its own alias
  //
  // type an item into the input field with id "item-text"
  //
  // Please confirm that each network call was made
  // by waiting for it
  //
  // confirm the error message is shown on the page
  cy.contains(/Found price mismatch \d+ vs \d+ /)
  // create a regex version of this where the numbers can vary : Found price mismatch 1 vs 2
})

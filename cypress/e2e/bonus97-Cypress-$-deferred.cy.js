it('tests the loading element and completes the intercept', () => {
  // stub the network call the application makes
  // and return this fruit AFTER checking the loading element
  const fruit = 'Kiwi'

  // assuming we have a single matching network request
  // use a variable to store the promise resolve function
  let resolve
  // intercept the "GET /fruit" requests and return a promise
  // the Promise should be resolved later
  // and the resolution callback should reply with { fruit } object
  cy.intercept('GET', '/fruit', (req) => {
    return new Promise((r) => {
      resolve = r
    }).then(() => {
      req.reply({ fruit })
    })
  })
  // visit the page
  cy.visit('/')
  // the "resolve" variable should be set
  // which we can confirm with retries using
  // cy.wrap + cy.should(callback) combination
  cy.wrap(null)
    .should(() => {
      expect(resolve).to.be.a('function')
    })
    .log('intercept started 🎬')

  // check if the loading element is visible
  cy.get('#fruit')
    .should('be.visible')
    .and('have.text', 'loading...')
    // and call the function "resolve" to let the network intercept proceed
    .then(() => resolve())
    .log('intercept finished 🏁')
  // confirm the loading text is gone
  cy.get('#fruit').should('not.contain', 'loading')
  // confirm the displayed fruit
  cy.contains('#fruit', fruit).should('be.visible')
})

it('Refactor: use an object to keep the resolve method', () => {
  // stub the network call the application makes
  // and return this fruit AFTER checking the loading element
  const fruit = 'Kiwi'

  // assuming we have a single matching network request
  // use an object to store the promise resolve function
  // in its property "resolve"
  const resolvers = {}
  // intercept the "GET /fruit" requests and return a promise
  // the Promise should be resolved later
  // store the "resolve" value in the "resolvers.resolve" property
  // and the resolution callback should reply with { fruit } object
  cy.intercept('GET', '/fruit', (req) => {
    return new Promise((r) => {
      resolvers.resolve = r
    }).then(() => {
      req.reply({ fruit })
    })
  })
  // visit the page
  cy.visit('/')
  // confirm the resolvers object has property "resolve"
  // using cy.wrap + property assertion
  cy.wrap(resolvers)
    .should('have.property', 'resolve')
    .log('intercept started 🎬')

  // check if the loading element is visible
  cy.get('#fruit').should('be.visible').and('have.text', 'loading...')

  // call the function "resolve" to let the network intercept proceed
  // https://on.cypress.io/wrap
  // https://on.cypress.io/invoke
  cy.wrap(resolvers).invoke('resolve').log('intercept finished 🏁')
  // confirm the loading text is gone
  cy.get('#fruit').should('not.contain', 'loading')
  // confirm the displayed fruit
  cy.contains('#fruit', fruit).should('be.visible')
})

it('Refactor: use jQuery deferred', () => {
  // stub the network call the application makes
  // and return this fruit AFTER checking the loading element
  const fruit = 'Kiwi'

  // assuming we have a single matching network request
  // https://api.jquery.com/category/deferred-object/
  const deferred = Cypress.$.Deferred()
  // intercept the "GET /fruit" requests and return a promise
  // from the deferred object
  // and the resolution callback should reply with { fruit } object
  cy.intercept('GET', '/fruit', (req) => {
    return deferred.promise().then(() => {
      req.reply({ fruit })
    })
  })
  // visit the page
  cy.visit('/')

  // check if the loading element is visible
  cy.get('#fruit')
    .should('be.visible')
    .and('have.text', 'loading...')
    // call the method resolve in the deferred object
    // to complete the intercept
    .then(deferred.resolve)
    .log('intercept finished 🏁')
  // confirm the loading text is gone
  cy.get('#fruit').should('not.contain', 'loading')
  // confirm the displayed fruit
  cy.contains('#fruit', fruit).should('be.visible')
})

it('waits for each response one by one', () => {
  // visit the page "burst.html"
  // https://on.cypress.io/visit
  cy.visit('/burst.html')
  // keep track of the the total number of calls
  // by "spying" on the network call GET /random-digit
  // by passing a function that increments a local variable
  // https://on.cypress.io/intercept
  // and give it an alias "api"
  let calls = 0
  cy.intercept('GET', '/random-digit', () => {
    calls += 1
  }).as('api')
  // click on the button with ID "burst"
  // https://on.cypress.io/click
  cy.get('button#burst').should('be.visible').click()
  // we know the calls will be made within 3 seconds
  // thus we "simply" wait for 3 seconds using
  // https://on.cypress.io/wait
  // after the wait is finished, then we want
  // to call the "cy.wait(api alias)" the number of times
  // our spy intercepted was called
  // https://on.cypress.io/then
  cy.wait(3000)
    .then(() => {
      for (let k = 0; k < calls; k += 1) {
        cy.wait('@api')
      }
    })
    // get the subject yielded by the last cy.wait(api alias)
    // and grab its response "n" value
    // Cypress trick - the current subject is the result of the last cy.wait!
    // https://on.cypress.io/its
    .its('response.body.n')
    // confirm the page contains the expected text output
    // something like "last call index said N"
    .then((n) => {
      cy.contains('#api-response', `${calls} said ${n}`)
    })
})

it('waits for each response one by one using a spy', () => {
  // visit the page "burst.html"
  // https://on.cypress.io/visit
  cy.visit('/burst.html')
  // keep track of the the total number of calls
  // by "spying" on the network call GET /random-digit
  // by passing a cy.stub function
  // https://on.cypress.io/intercept
  // https://on.cypress.io/stub
  // give the network intercept an alias "api"
  // give the cy.stub an alias "calls"
  // Note: even if we passed a cy.stub instance to cy.intercept
  // it does not STUB the network call, it still goes to the server
  cy.intercept('GET', '/random-digit', cy.stub().as('calls')).as('api')
  // click on the button with ID "burst"
  // https://on.cypress.io/click
  cy.get('button#burst').should('be.visible').click()
  // we know the calls will be made within 3 seconds
  // thus we "simply" wait for 3 seconds using
  // https://on.cypress.io/wait
  // after the wait is finished, then we want
  // to call the "cy.wait(api alias)" the number of times
  // our spy intercepted was called
  // https://on.cypress.io/then
  cy.wait(3000)
  // get the cy.stub using its alias
  // and its property "callCount"
  // and write a for loop waiting that number of calls
  // to the network call "@api"
  // https://on.cypress.io/its
  cy.get('@calls')
    .its('callCount')
    .then((callCount) => {
      for (let k = 0; k < callCount; k += 1) {
        cy.wait('@api')
      }
    })
    // get the subject yielded by the last cy.wait(api alias)
    // and grab its response "n" value
    // Cypress trick - the current subject is the result of the last cy.wait!
    .its('response.body.n')
    .then((n) => {
      // need to grab the number of calls again
      // using the cy.stub object aliased under "calls"
      // Get the "callCount" and use it inside cy.then callback
      cy.get('@calls')
        .its('callCount')
        .then((callCount) => {
          // confirm the page contains the expected text output
          // something like "last call index said N"
          cy.contains('#api-response', `${callCount} said ${n}`)
        })
    })
})
it('inspects the last intercepted API call', () => {
  // visit the page "burst.html"
  // https://on.cypress.io/visit
  cy.visit('/burst.html')
  // spy on the "GET /random-digit" calls
  // and give it an alias "api"
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/random-digit').as('api')
  // click on the button with ID "burst"
  // https://on.cypress.io/click
  cy.get('button#burst')
    .should('be.visible')
    .click()
    // we know the calls will be made within 3 seconds
    // thus we "simply" wait for 3 seconds using
    // https://on.cypress.io/wait
    // Tip: we could use https://github.com/bahmutov/cypress-network-idle
    .wait(3000)
  // get all intercepts at once using the "@api.all" syntax
  // and from that list (which should be final by now)
  // get the length and the last response value "n"
  // confirm the page contains the expected text output
  // something like "last call index said N"
  cy.get('@api.all').then((list) => {
    // you get a list of interceptions
    const n = Cypress._.last(list).response.body.n
    cy.contains('#api-response', `${list.length} said ${n}`)
  })
})

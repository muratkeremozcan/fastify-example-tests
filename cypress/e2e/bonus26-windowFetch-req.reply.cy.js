function ping(url, n = 3) {
  // if there are no attempts left, throw an error
  //
  if (n < 1) {
    throw new Error('No attempts left.')
  }

  // get the application's window object
  // https://on.cypress.io/window
  // and invoke the "fetch" method on it
  // https://on.cypress.io/invoke
  // with the url parameter

  // when the fetch resolves, its response
  // is automatically yielded to the next command
  //
  // Grab its "ok" property
  // https://on.cypress.io/its
  //

  cy.window()
    .invoke('fetch', url)
    .its('ok')
    .then((ok) => {
      if (ok) return
      cy.wait(300)
      ping(url, n - 1)
    })

  // if it is true, then we are done. the page is up
  // else wait 300ms and try again
  // using https://on.cypress.io/wait
  // and https://on.cypress.io/then combination
  // to call the ping recursively
  // Tip: don't forget to pass the url and n - 1 arguments
}

it(
  'simulates a server down for 1 second',
  { viewportWidth: 400, viewportHeight: 400 },
  () => {
    // create a local variable to store
    // when the first intercept happens
    let mockingStartedAt

    // intercept GET / calls and return an error
    // if the request is within the first second
    // https://on.cypress.io/intercept

    cy.intercept('GET', '/', (req) => {
      if (!mockingStartedAt) {
        mockingStartedAt = +new Date()
      }
      const now = +new Date()
      const elapsed = now - mockingStartedAt

      if (elapsed < 1000) {
        req.reply({ statusCode: 500 })
      }
    })
    //
    // if the mocking variable is not set
    // the set it to the current time,
    // starting mocking for 1 second
    //
    // determine time since the mocking started
    // if the time since the mocking started
    // is less than 1 second, reply with a 500 status error
    // otherwise let the request pass to the server

    // ping the page "/" until it responds
    // or for the maximum number of attempts, maybe 6
    //
    // then visit the page "/"
    // https://on.cypress.io/visit

    ping('/', 6)

    cy.visit('/')
  }
)

import './commands'

// bonus46.cy.js - if you want a beforeEach / before hook to run before every test
beforeEach(() => {
  cy.log('WORLD')
  // intercept all requests and let them continue
  // going to the server. When the server replies,
  // check the response status code. It should be below 400.
  // https://on.cypress.io/intercept
  cy.intercept('*', (req) => {
    return req.continue((res) => {
      // let's only report the failed network calls, rather than all the network calls.
      if (res.statusCode >= 400) {
        console.error({ req, res })
        // const msg = `${res.statusCode} ${req.url}`
        // throw new Error(msg)
      }
      // console.dir(res)
      else {
        expect(res.statusCode).to.be.oneOf([200, 304])
      }
    })
  }).as('all')
})

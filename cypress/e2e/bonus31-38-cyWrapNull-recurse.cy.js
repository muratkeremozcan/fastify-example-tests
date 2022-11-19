// the page /lucky7.html fetches a random digit every second
// until it gets {n: 7} response from the server and then stops
// This test spies on the network call and waits to see {n: 7} response
it('retries until the network intercepts sees the right data', () => {
  // a local variable will be set to the current
  // response from the server for the spy "GET /random-digit"
  let data
  cy.intercept('GET', '/random-digit', (req) =>
    req.continue((res) => {
      data = res.body
      return res
    })
  ).as('random')
  //
  // visit the "lucky7.html" page
  cy.visit('/lucky7.html')
  //
  // retry looking at the data until we see "n: 7" value inside

  // 🚨 waiting for a network request DOES NOT WORK
  // because a "should(callback)" does not retry
  // cy.wait('@random').should(() => {
  // ✅ THE CORRECT SOLUTION wrapping a null and adding
  // a "should(callback)" does retry until
  // it times out or the assertions inside the "should(callback)"
  // all pass

  cy.wrap(null, { timeout: 25000 }).should(() => {
    expect(data, 'data is set').to.be.an('object')
    expect(data).to.have.property('n', 7)
  })
  //
  // confirm the "data" variable is an object
  // confirm its has the property "n: 7"
  //
  // once we have confirmed the network call with "n: 7",
  // the page is showing 7 immediately
  // which we can verify using cy.contains with {timeout: 30} option
  // Tip: we are using 30ms to let the page update itself
  cy.contains('#number', '7').should('be.visible')
})

import { recurse } from 'cypress-recurse'

// This is another take on the bonus31 spec

// the page /lucky7.html fetches a random digit every second
// until it gets {n: 7} response from the server and then stops
// This test checks all calls to the "GET /random-digit" intercept
// and stops when any of them have the response {n: 7}
it('checks the intercepts until it gets the right response', () => {
  cy.intercept('GET', '/random-digit').as('random')
  //
  // visit the "lucky7.html" page
  cy.visit('/lucky7.html')

  // get all network intercepts for the alias "@random"
  // check if any of them have response object with "n: 7" property
  // wait up to 30 seconds, check every second
  // tip: use cypress-recurse
  recurse(
    () => cy.get('@random.all'),
    (intercepts) => intercepts.some((x) => x.response.body.n === 7),
    {
      timeout: 30_000,
      delay: 1000,
      log: 'found n=7'
    }
  )

  // once we have confirmed the network call with "n: 7",
  // the page is showing 7 immediately
  // which we can verify using cy.contains with a very short timeout
  cy.contains('#number', '7', { timeout: 100 }).should('be.visible')
})

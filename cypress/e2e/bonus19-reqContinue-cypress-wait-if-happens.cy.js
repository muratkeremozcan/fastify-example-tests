import 'cypress-wait-if-happens'

// what if we do not know the number of network calls?
// we then cannot use the cy.wait command as it
// cannot _skip_ network calls
// Instead we can define a new spy intercept just
// to "catch" the last call
it('waits for the last network call', () => {
  // We want to visit the page "/calculator.html"
  // it might fire "POST /track" events
  // one, twice, or three times on load
  // before the visit, let's spy on POST /track
  // and the first call should always be the "load" event

  // https://on.cypress.io/intercept
  // In the intercept, inspect the response,
  // it should always have status code 200
  // and the body { ok: true }
  // Give the intercept the alias "track"
  cy.intercept({ method: 'POST', url: '/track' }, (req) => {
    return req.continue((res) => {
      expect(res.statusCode).to.eq(200)
      expect(res.body).to.deep.eq({ ok: true })
    })
  }).as('track')
  //
  // now visit the /calculator.html page
  cy.visit('/calculator.html')
  cy.contains('h1', 'Calculator')
  // confirm the h1 element has the text "Calculator"
  // https://on.cypress.io/contains
  //
  // wait for the "track" alias and confirm the request
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // Tip: you can use "deep.equal" assertion
  // https://glebbahmutov.com/cypress-examples/commands/assertions.html

  // Enter two numbers into the input fields
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  // Click the plus button
  // https://on.cypress.io/click
  //
  // how do you confirm the /track request was made
  // with event name "+" and your input arguments?
  // you probably will randomly get _other_ track event calls...
  //
  // Tip: you can define _another_ intercept for POST /track
  // right before clicking the plus button
  // and give it a different alias "lastTrack"
  // It is ok for a single request to match multiple intercepts
  // validate the "lastTrack" request and response data

  cy.get('#num1').type(20)
  cy.get('#num2').type(6)
  cy.intercept('POST', '/track').as('lastTrack')
  cy.get('#add').click()

  cy.wait('@track').its('request.body').should('deep.equal', {
    eventName: 'load',
    args: {}
  })
  //
  // wait for the "lastTrack" alias and confirm the request body
  // Note: the response will still be confirmed by the "track" intercept

  cy.wait('@lastTrack')
    .its('request.body')
    .should('deep.equal', {
      eventName: '+',
      args: {
        a: 20,
        b: 6
      }
    })
})

// tip: see the entire assertion object without
// collapsing it into Object(...)
chai.config.truncateThreshold = 200

// this test revisits the "bonus 19" lesson
// showing how to wait for the last call

// what if we do not know the number of network calls?
// we then cannot use the cy.wait command as it
// cannot _skip_ network calls
// Instead we can define a new spy intercept just
// to "catch" the last call

it('waits for the last network call using cypress-wait-if-happens', () => {
  // We want to visit the page "/calculator.html"
  // it might fire "POST /track" events
  // one, twice, or three times on load
  // before the visit, let's spy on POST /track
  // and the first call should always be the "load" event
  // https://on.cypress.io/intercept
  // Give the intercept the alias "track"
  cy.intercept({ method: 'POST', url: '/track' }, (req) => {
    return req.continue((res) => {
      expect(res.statusCode).to.eq(200)
      expect(res.body).to.deep.eq({ ok: true })
    })
  }).as('track')
  // now visit the /calculator.html page
  cy.visit('/calculator.html')
  // confirm the h1 element has the text "Calculator"
  // https://on.cypress.io/contains
  cy.contains('h1', 'Calculator')
  // Enter two numbers into the input fields
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  // Click the plus button
  // https://on.cypress.io/click
  //
  // how do you confirm the /track request was made
  // with event name "+" and your input arguments?
  // you probably will randomly get _other_ track event calls before...
  cy.get('#num1').type(20)
  cy.get('#num2').type(6)
  cy.get('#add').click()
  // confirm the call as made by looking at the page
  // and finding the displayed answer 26
  // https://on.cypress.io/contains
  cy.contains('#answer', '26')
  // now grab the latest call for alias "@track"
  // using cy.waitIfHappens with lastCall: true option
  cy.waitIfHappens({
    alias: '@track',
    lastCall: true
  })
    // from the yielded intercept
    // grab the request.body and confirm
    // it has the expected properties
    .its('request.body')
    .should('deep.equal', {
      eventName: '+',
      args: {
        a: 20,
        b: 6
      }
    })
  // re-run the test several times to confirm
  // that no matter how many "POST /track" calls are made
  // we get the correct last network call
})

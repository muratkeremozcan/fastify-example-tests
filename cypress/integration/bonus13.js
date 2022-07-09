chai.config.truncateThreshold = 200
/*
When you use the cy.intercept command you must decide if you want to simply observe the network call
or stub it to prevent it going to the server.

(0) In simple cases, a declarative way lets you spy or stub every request matching the parameters in the same way.
cy.intercept(method, url) // spy on the call
cy.intercept(method, url, staticResponse) // stub the call, return the "staticResponse" object

Sometimes you need more logic to decide how to spy or stub the intercepted call, including stubbing only some calls, but not the others.
This is where the request.reply and request.continue are useful.

(1) request.reply() is similar to stubbing the call with cy.intercept(method, url, staticResponse)
(2) request.continue() lets you allow the intercepted request to continue going to the server.

Per the docs you can supply a StaticResponse to Cypress in 4 ways:
	(0) cy.intercept() with an argument to stub a response to a route - cy.intercept(method, url, staticResponse)
	(1) req.reply(): to stub a response from a request handler - again, similar to cy.intercept(method, url, staticResponse)
	(2) req.continue(): to stub a response from a request handler, while letting the request continue to the destination server; req.continue(res => {..} )
	(3) res.send(): to stub a response from a response handler; used to to make a real request and modify the response
  //  req.reply(res => res.send(staticResponse)) or req.continue(res => res.send(staticResponse))
*/

it('stubs the network call with the same object', () => {
  // mock the GET /fruit request and always return the same response: { fruit: 'crab apple' }
  const staticResponse = { fruit: 'crab apple' }
  cy.intercept('GET', '/fruit', staticResponse).as('fruit')

  // https://on.cypress.io/intercept
  // visit the home page using https://on.cypress.io/visit
  // wait for the fruit intercept to finish
  // check if the expected mock response is shown
  // https://on.cypress.io/contains
  cy.visit('/')
  cy.wait('@fruit').its('response.body').should('deep.equal', staticResponse)
  cy.contains('#fruit', 'crab apple')

  // every page reload will show the same fruit
  // https://on.cypress.io/reload
  cy.reload()
  cy.wait('@fruit').its('response.body').should('deep.equal', staticResponse)
  cy.contains('#fruit', 'crab apple')
})

// We can have more granular logic for how to stub the intercepted call.
// We can form a mock data inside the route handler code and return it to the browser using request.reply(response) method call.

it('stubs the odd and even network calls differently', () => {
  // a local variable keeping the count of intercepted requests
  let count = 0
  const oddResponse = { fruit: 'kiwi' }
  const evenResponse = { fruit: 'melon' }

  // intercept the GET /fruit request
  // and return the {fruit: "kiwi"} for odd responses
  // and return the {fruit: "melon"} for even responses
  // you can implement the response logic in the route handler
  // https://on.cypress.io/intercept
  // save the intercept under an alias "fruit"
  cy.intercept('GET', '/fruit', (req) => {
    count++
    // we use req.reply here, and the request doesn't continue to the server
    return req.reply((res) => {
      if (count % 2 === 0) {
        return res.send(evenResponse)
      }
      return res.send(oddResponse)
    })
  }).as('fruit')

  const checkFruit = (response) => {
    cy.wait('@fruit').its('response.body').should('deep.equal', response)
    return cy.contains('#fruit', response.fruit)
  }

  // visit the home page using https://on.cypress.io/visit
  // the first request should return the "kiwi" response
  // https://on.cypress.io/contains
  cy.visit('/')
  checkFruit(oddResponse)

  // the second request should return the "melon" response
  // https://on.cypress.io/reload
  cy.reload()
  checkFruit(evenResponse)

  // third request sees the "kiwi" again
  cy.reload()
  checkFruit(oddResponse)
})

// Finally, let's do something fun with the server's response by letting the call go to the server and looking at the response body object.

it('changes the real server response to upper case', () => {
  // this local variable will hold the intercepted response
  // set by the route handler callback code
  let fruitSent
  // intercept the GET /fruit request
  // let it go to the server using the req.continue() method
  // with a callback to get the server response
  // https://on.cypress.io/intercept
  //
  //
  // and then modify the response body using any logic
  // in our case, let's modify the "fruit" value
  // inside the response body object
  // and save the result in the local variable "fruitSent"
  //
  // save the network intercept as an alias "fruit"
  cy.intercept('GET', '/fruit', (req) => {
    // note: the server response has a few properties
    // like the HTTP status code, plus the parsed "body" object
    // you can assert properties of the response

    // we use req.continue here, and the request is allowed to continue to the server
    return req.continue((res) => {
      console.dir(res)
      expect(res.body.fruit).to.be.oneOf([
        'Apples',
        'Bananas',
        'Grapes',
        'Oranges',
        'Pears'
      ])
      expect(res.statusCode).to.eq(200)

      // we can still modify the response the browser receives
      res.body.fruit = res.body.fruit.toUpperCase()
      fruitSent = res.body.fruit
    })
  }).as('fruit')

  // visit the home page using https://on.cypress.io/visit
  // wait for the network intercept "fruit" to finish
  // use the cy.then callback to verify the local variable "fruitSent"
  cy.visit('/')

  // once the server has sent the response,
  // the local variable "fruitSent" will have a value
  // which should be an uppercase string
  // confirm the sent uppercase fruit is displayed
  cy.wait('@fruit').then((fruit) => {
    expect(fruit.response.body.fruit)
      .to.eq(fruitSent)
      .and.to.match(/[A-Z]+/)
    cy.contains('#fruit', fruitSent)
  })
})

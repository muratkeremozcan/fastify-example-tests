// https://cypress.tips/courses/network-testing/lessons/bonus76

// before each test generate a random test ID string
// and attach it to every GET and POST network call
// made by the application. Use the request header name "x-test-id"
// https://on.cypress.io/intercept

// let storeId
beforeEach(() => {
  const storeId = 'test-id-' + Cypress._.random(1e6)
  cy.intercept(
    {
      method: /GET|POST/
    },
    (req) => {
      req.headers['x-test-id'] = storeId
    }
  )
  // store the generated random header value
  // to be able to pass it to other places
  // that need the same value
  Cypress.env('x-test-id', storeId)
})

it('sends common X request id header on all network calls', () => {
  // observe the terminal output from the fastify-example server
  // you should see the same "x-test-id" request header
  // on multiple requests
  cy.visit('/calculator.html')
  cy.get('#num1').type('10')
  cy.get('#num2').type('5')
  cy.contains('+').click()
  cy.contains('#answer', '15')
})

it('sends common X request id header on all network calls', () => {
  // Bonus: can you attach the same custom header to
  // the API requests made using the cy.request commands?
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/calculate',
    headers: {
      'x-test-id': Cypress.env('x-test-id')
    },
    body: {
      a: 20,
      b: 30,
      operation: '-'
    }
  })
    .its('body')
    .should('deep.equal', {
      a: 20,
      b: 30,
      operation: '-',
      answer: -10
    })
})

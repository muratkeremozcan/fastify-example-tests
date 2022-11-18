import spok from 'cy-spok'

it('checks the request and response objects using cy-spok', () => {
  // visit the "/calculator.html" page
  // https://on.cypress.io/visit
  cy.visit('/calculator.html')

  // get the first number input element and type 5
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  // get the second input element and type 2

  cy.get('#num1').type('5')
  cy.get('#num2').type('2')

  // intercept the POST /calculate requests
  // https://on.cypress.io/intercept
  // and give it an alias "calculate"

  cy.intercept('POST', '/calculate').as('calculate')

  // get the "Add" button and click it
  // https://on.cypress.io/click

  cy.get('#add').click()

  // wait for the "calculate" request to be made
  // and assert the request and response fields
  // - the request should have method "POST"
  //   and body with "a: 5" and property "b" that is a number
  //   and the property "operation" being either "+" or "-"
  // - the response should have status code 200
  //   and the body object having
  //   "a: 5, b: 2, answer: 7, operation +"
  cy.wait('@calculate').should(
    spok({
      request: {
        method: 'POST',
        body: {
          a: 5,
          b: spok.number,
          operation: (o) => o === '+' || o === '-'
        }
      },
      response: {
        statusCode: 200,
        body: {
          a: 5,
          b: 2,
          answer: 7
        }
      }
    })
  )
})

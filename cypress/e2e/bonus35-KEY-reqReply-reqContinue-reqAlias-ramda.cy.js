import { ifElse } from 'ramda'

it('stubs all network API calls except allowed ones', () => {
  cy.intercept(
    {
      headers: {
        'content-type': 'application/json'
      }
    },
    (req) => {
      if (req.method === 'POST' && req.url.endsWith('/calculate')) {
        req.alias = 'calculate'
        return req.continue()
      } else {
        req.alias = 'blocked'
        return req.reply({
          statusCode: 500,
          body: {}
        })
      }
    }
  )

  cy.visit('/calculator.html')
  cy.get('#num1').type('3')
  cy.get('#num2').type('6')
  cy.get('button#add').click()
  cy.contains('#answer', '9')
  cy.wait('@blocked')
  cy.wait('@calculate')
})

it('stubs all network API calls except allowed ones Ramda', () => {
  const isCalculate = (req) =>
    req.method === 'POST' && req.url.endsWith('/calculate')
  const continueRequest = (req) => {
    req.alias = 'calculate'
    return req.continue()
  }
  const replyRequest = (req) => {
    req.alias = 'blocked'
    return req.reply({
      statusCode: 500,
      body: {}
    })
  }
  cy.intercept(
    {
      headers: {
        'content-type': 'application/json'
      }
    },
    (req) => ifElse(isCalculate, continueRequest, replyRequest)(req)
  )

  cy.visit('/calculator.html')
  cy.get('#num1').type('3')
  cy.get('#num2').type('6')
  cy.get('button#add').click()
  cy.contains('#answer', '9')
  cy.wait('@blocked')
  cy.wait('@calculate')
})

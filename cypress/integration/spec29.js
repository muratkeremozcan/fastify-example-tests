/// <reference types="cypress" />

it('hides server errors by returning stubbed response', () => {
  /*
    Per the docs you can supply a StaticResponse to Cypress in 4 ways:

    cy.intercept() with an argument: to stub a response to a route; cy.intercept('/url', staticResponse)
    req.reply(): to stub a response from a request handler; req.reply(staticResponse)
    req.continue(): to stub a response from a request handler, while letting the request continue to the destination server; req.continue(res => {..} )
    res.send(): to stub a response from a response handler; res.send(staticResponse)
  */

  // intercept the GET /fruit call and
  // look at the server response
  // if the response code is not 200
  // use res.send to send back a test response
  // with status code 200 and body: { fruit: 'Mango' }
  //
  // set the intercept again to observe
  // the real server response, give it an alias "real"
  //
  // visit the site
  //
  // wait for the "real" intercept and look at the response
  // if the response is not 200
  //    the fruit "Mango" should be visible on the page
  // else
  //    the fruit from the server response
  //    should be visible

  cy.intercept(
    {
      method: 'GET',
      url: '/fruit'
    },
    (req) =>
      req.reply((res) => {
        if (res.statusCode !== 200) {
          return res.send({
            statusCode: 201,
            body: {
              fruit: 'Mango'
            }
          })
        }
        return null
      })
  ).as('mango')

  cy.intercept('GET', '/fruit').as('real')

  cy.visit('/')

  cy.wait('@real')
    .its('response')
    .then((response) => {
      if (response.statusCode !== 200) {
        cy.log('server had an error')
        cy.contains('#fruit', 'Mango')
      } else {
        cy.contains('#fruit', response.body.fruit)
      }
    })
})

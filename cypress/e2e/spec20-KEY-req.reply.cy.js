/// <reference types="cypress" />

it('modifies the HTML responses', () => {
  // intercept the HTML document "/"
  // and change the response body by replacing a word
  // confirm the new word is shown on the page

  /*
    Per the docs you can supply a StaticResponse to Cypress in 4 ways:

    cy.intercept() with an argument: to stub a response to a route; cy.intercept('/url', staticResponse)
    req.reply(): to stub a response from a request handler; req.reply(staticResponse)
    req.continue(): to stub a response from a request handler, while letting the request continue to the destination server; req.continue(res => {..} )
    res.send(): to stub a response from a response handler; res.send(staticResponse)
  */

  cy.intercept(
    {
      method: 'GET',
      url: '/'
    },

    (req) =>
      req.reply((res) => (res.body = res.body.replace('Fastify', 'Cypress')))
  ).as('replaceWord')

  cy.visit('/')
  cy.wait('@replaceWord')
  cy.contains('Cypress Example')
})

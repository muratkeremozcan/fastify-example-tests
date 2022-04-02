/// <reference types="cypress" />

// TODO: look at this again after March 23rd
it('hides server errors by returning stubbed response', () => {
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

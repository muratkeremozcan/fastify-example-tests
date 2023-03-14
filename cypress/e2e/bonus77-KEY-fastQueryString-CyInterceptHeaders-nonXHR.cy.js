// https://cypress.tips/courses/network-testing/lessons/bonus77

const qs = require('fast-querystring')
import 'cypress-map'

it('sends the URL encoded form', () => {
  // visit the form page
  cy.visit('/form-urlencoded.html')
  // type a city name with a space in it
  cy.get('input[name=city]').type('Los Angeles')
  cy.get('input[name=guess]').type('6')
  // Todo: set up a spy on all POST requests
  // with the content type application/x-www-form-urlencoded
  // https://on.cypress.io/intercept
  cy.intercept({
    method: 'POST',
    headers: {
      // it works the same without
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
    // give the intercept alias "form"
    // https://on.cypress.io/as
    .as('form')
  // submit the form and confirm the new page loads correctly
  cy.contains('button', 'Submit').click()
  cy.location('pathname').should('equal', '/submit-urlencoded')
  // Todo: the page should display the sent values
  cy.contains('[data-city]', 'Los Angeles')
  cy.contains('[data-guess]', '6')
  // Todo: grab the form network call
  // and confirm it sent a string body
  cy.wait('@form')
    .its('request.body')
    .should('be.a', 'string')
    // Todo: the response should be something like "Los+Angeles&guess=6"
    // can you parse it into an object with "city" and "guess" fields
    // and confirm the sent object is correct?
    // Tip: use NPM module fast-querystring
    .tap((s) => {
      console.log(s)
      console.log(qs.parse(s))
    })
    // .then(qs.parse)
    .apply(qs.parse) // so that it retries (apply is like a then)
    .should('deep.equal', {
      city: 'Los Angeles',
      guess: '6'
    })
})

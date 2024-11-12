// https://github.com/bahmutov/cypress-map
import 'cypress-map'

// https://github.com/anonrig/fast-querystring#readme
const qs = require('fast-querystring')

it(
  'stubs form submission and checks the sent fields',
  { viewportWidth: 1000, viewportHeight: 500 },
  () => {
    // visit the horizontal-form page
    cy.visit('/horizontal-form.html')
    // our server does not handle "POST /my-form" calls (yet)
    // thus we need to stub such submissions and redirect the browser
    // back to the "GET /horizontal-form.html" page
    // Tip: use the "303 See Other" status
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303
    // and set the "location" header
    // The browser will use GET "location header"
    // when it receives the 303 status code
    cy.intercept('/my-form', {
      // "See Other" status that changes method to "GET"
      statusCode: 303,
      headers: {
        location: '/horizontal-form.html'
      }
    })
      // Give the intercept alias "submit"
      .as('submit')
    // get the form on the page and fill it with values
    // https://on.cypress.io/within
    // https://on.cypress.io/select
    // https://on.cypress.io/check
    cy.get('form')
      .within(() => {
        cy.get('[name=vegetable]').type('tomato')
        cy.get('[name=preparation]').select('fresh')
        cy.contains('label:has([name=eating])', 'No').find('input').check()
      })
      // submit the form using the cy.submit command
      // https://on.cypress.io/submit
      .submit()
    // confirm the page was reloaded by checking the input fields
    // the form should not be filled
    cy.get('form [name=vegetable]').should('have.value', '')
    // we should be redirected back to the form
    // confirm the location pathname
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/horizontal-form.html')
    // the form submission network call should send all fields
    // https://on.cypress.io/wait
    // which you can verify by parsing the request body
    // using the fast-querystring module
    cy.wait('@submit')
      .its('request.body')
      .should('be.a', 'string')
      .apply(qs.parse)
      // cy.print comes from cypress-map plugin
      .print('form inputs %o')
      // confirm the form fields sent
      // using the "deep.equal" assertion
      .should('deep.equal', {
        vegetable: 'tomato',
        preparation: 'fresh',
        eating: 'no'
      })
  }
)

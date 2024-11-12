// https://github.com/bahmutov/cypress-map
import 'cypress-map'

// https://github.com/anonrig/fast-querystring#readme
const qs = require('fast-querystring')

// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'

// make sure this test only runs on Chrome-like browsers (like Electron and Chrome)
it(
  'form works even with UIKit CSS not loading',
  {
    viewportWidth: 1000,
    viewportHeight: 500,
    browser: ['electron', 'chrome']
  },
  () => {
    // print the current browser to Command Log
    // https://on.cypress.io/log
    // https://on.cypress.io/browser
    cy.log(JSON.stringify(Cypress.browser))
    // disable the browser network cache
    // to force the browser to request the CSS stylesheets
    // (which are usually cached)http://localhost:4200/__/#/specs/runner?file=cypress/e2e/bonus99-POST-form-submission-chrome-remote-debugger-protocol.cy.js
    // use cy.CDP command
    cy.CDP('Network.setCacheDisabled', {
      cacheDisabled: true
    })
    // intercept all stylesheets and return 404
    cy.intercept({ resourceType: 'stylesheet' }, { statusCode: 404 })
    // the rest of the test implements the bonus98 flow
    //
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
      .then(qs.parse)
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

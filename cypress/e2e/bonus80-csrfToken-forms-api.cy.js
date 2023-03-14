// https://cypress.tips/courses/network-testing/lessons/bonus80

const qs = require('fast-querystring')
import 'cypress-map'
import spok from 'cy-spok'

it('can log in by extracting the CSRF token from the page', () => {
  // make a request to get the "csrf-form.html" page
  // https://on.cypress.io/request
  cy.request('/csrf-form.html')
    // get its body field - it is HTML text
    // and pass into cy.then callback
    // https://on.cypress.io/its
    // https://on.cypress.io/then
    .its('body')
    .then((html) => {
      // find the csrf input element in the HTML
      // returned by the server
      // Tip: use Cypress.$ to parse the HTML text
      // and get the value attribute of the csrf field
      const $input = Cypress.$('<html/>')
        .html(html)
        .find('form input[name=csrf]')
      return $input.attr('value')
    })
    // yield the CSRF string to the next command/assertion
    .should('be.a', 'string')
    .then((csrf) => {
      // make a new request to POST /submit-csrf-form
      // and include the CSRF token in the request
      cy.request({
        method: 'POST',
        url: '/submit-csrf-form',
        body: {
          username: 'Joe',
          csrf
        }
      })
        // the server should accept the CSRF token
        // and return the registration page HTML
        .its('body')
        .then((html) => {
          // write the HTML into the document
          // https://on.cypress.io/document
          // https://on.cypress.io/invoke
          cy.document().invoke(
            {
              log: false
            },
            'write',
            html
          )
        })
    })

  // confirm the registration page shows the correct username
  cy.contains('[data-cy=username]', 'Joe')
})

it('cannot log in using the request due to missing CSRF token', () => {
  // submit the form to "POST /submit-csrf-form"
  // with the { username: 'Joe' }
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/submit-csrf-form',
    body: {
      username: 'Joe'
    },
    failOnStatusCode: false
  })
    // confirm the server rejects the API call with status code 403
    .its('status')
    .should('equal', 403)
})

it('cannot log in using the request due to invalid CSRF token', () => {
  // submit the form to "POST /submit-csrf-form"
  // with the { username: 'Joe', csrf: 'your value' }
  // (made up CSRF value)
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/submit-csrf-form',
    body: {
      username: 'Joe',
      csrf: 'abc123'
    },
    failOnStatusCode: false
  })
    // confirm the server rejects the API call with status code 403
    .its('status')
    .should('equal', 403)
})

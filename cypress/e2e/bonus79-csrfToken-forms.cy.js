// https://cypress.tips/courses/network-testing/lessons/bonus79


const qs = require('fast-querystring')
import 'cypress-map'
import spok from 'cy-spok'

it('sends the CSRF token with the submitted form', () => {
  cy.visit('/csrf-form.html')
  // confirm the form has a hidden input field with CSRF token
  // the value should be a long-ish string
  // https://on.cypress.io/get
  // https://glebbahmutov.com/cypress-examples/commands/assertions.html
  cy.get('form input[type=hidden][name=csrf]')
    .should('have.attr', 'value')
    .should('be.a', 'string')
    .and('have.length.greaterThan', 10)
  // type a username into the input field
  // https://on.cypress.io/type
  cy.get('[name=username]').type('Joe')
  // spy on the submit form network call and give it an alias "submit"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('POST', '/submit-csrf-form').as('submit')
  // submit the form by clicking on the Register button
  // https://on.cypress.io/click
  cy.contains('button', 'Register').click()
  // confirm the new page is at url "/submit-csrf-form"
  cy.location('pathname').should('equal', '/submit-csrf-form')
  // confirm the page shows the submitted username
  // https://on.cypress.io/contains
  cy.contains('[data-cy=username]', 'Joe')
  // get the network "submit" intercept
  // and confirm its request body has the URL-encoded
  // username and CSRF token
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // https://on.cypress.io/should
  cy.wait('@submit')
    .its('request.body')
    .should('be.a', 'string')
    // Tip: you can use the "fast-querystring" module
    // to parse URL-encoded text
    .print(qs.parse)
    .apply(qs.parse)
    .should(
      spok({
        username: 'Joe',
        csrf: spok.string
      })
    )
})

it('rejects the form with missing CSRF token', () => {
  cy.visit('/csrf-form.html')
  // confirm the form has a hidden input field with CSRF token
  // and remove it from the page
  // Tip: invoke the jQuery method "remove"
  // https://on.cypress.io/invoke
  // https://api.jquery.com/
  cy.get('form input[type=hidden][name=csrf]').then(console.log)
  cy.get('form input[type=hidden][name=csrf]').should('exist').invoke('remove')
  // type a username into the input field
  // https://on.cypress.io/type
  cy.get('[name=username]').type('Joe')
  // spy on the submit form network call and give it an alias "submit"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('POST', '/submit-csrf-form').as('submit')
  // submit the form by clicking on the Register button
  // https://on.cypress.io/click
  cy.contains('button', 'Register').click()
  // confirm the new page is at url "/submit-csrf-form"
  cy.location('pathname').should('equal', '/submit-csrf-form')
  // confirm the network call aliased "submit"
  // received error response code 403 from the server
  cy.wait('@submit').its('response.statusCode').should('equal', 403)

  cy.contains('Bad or missing CSRF value')
})

it('rejects the form with incorrect CSRF token', () => {
  cy.visit('/csrf-form.html')
  // confirm the form has a hidden input field with CSRF token
  // and change its value to something else
  // Tip: invoke the jQuery method "val"
  // https://on.cypress.io/invoke
  cy.get('form input[type=hidden][name=csrf]')
    .should('exist')
    .invoke('val', 'abc123')
  // type a username into the input field
  // https://on.cypress.io/type
  cy.get('[name=username]').type('Joe')
  // spy on the submit form network call and give it an alias "submit"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('POST', '/submit-csrf-form').as('submit')
  // submit the form by clicking on the Register button
  // https://on.cypress.io/click
  cy.contains('button', 'Register').click()
  // confirm the new page is at url "/submit-csrf-form"
  cy.location('pathname').should('equal', '/submit-csrf-form')
  // confirm the network call aliased "submit"
  // received error response code 403 from the server
  cy.wait('@submit').its('response.statusCode').should('equal', 403)

  cy.contains('Invalid CSRF value')
})

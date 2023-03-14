// https://cypress.tips/courses/network-testing/lessons/bonus81
it('sends the CSRF cookie with the submitted form', () => {
  cy.visit('/csrf-form-cookie.html')
  // confirm the page has a cookie named "_csrf"
  // https://on.cypress.io/getcookie
  cy.getCookie('_csrf')
    .should('exist')
    .its('value')
    .should('be.a', 'string')
    .then((csrf) => {
      // type a username into the input field
      // https://on.cypress.io/type
      cy.get('[name=username]').type('Joe')
      // spy on the submit form network call and give it an alias "submit"
      // https://on.cypress.io/intercept
      // https://on.cypress.io/as
      cy.intercept('POST', '/submit-csrf-form-cookie').as('submit')
      // submit the form by clicking on the Register button
      // https://on.cypress.io/click
      cy.contains('button', 'Register').click()
      // confirm the new page is at url "/submit-csrf-form-cookie"
      cy.location('pathname').should('equal', '/submit-csrf-form-cookie')
      // confirm the page shows the submitted username
      // https://on.cypress.io/contains
      cy.contains('[data-cy=username]', 'Joe')
      // get the network "submit" intercept
      // and confirm its request has the CSRF cookie sent
      // https://on.cypress.io/wait
      cy.wait('@submit')
        .its('request.headers.cookie')
        .should('include', `_csrf=${csrf}`)
    })
})

it('rejects API requests without CSRF cookie', () => {
  // make a POST request to "/submit-csrf-form-cookie"
  // sending an object with username "Joe"
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/submit-csrf-form-cookie',
    body: {
      username: 'Joe'
    },
    failOnStatusCode: false
  })
    // confirm the server rejects the API call with status code 403
    .its('status')
    .should('equal', 403)
})

it('sends the cookie using cy.request', () => {
  // request the "csrf-form-cookie.html" page
  // using cy.request and NOT cy.visit
  // https://on.cypress.io/request
  cy.request('/csrf-form-cookie.html')
  // using cy.request should send the cookies automatically
  // confirm the cookie "_csrf" is set
  // https://on.cypress.io/getcookie
  cy.getCookie('_csrf').should('exist').its('value').should('be.a', 'string')
  // now let's make another request and it should have CSRF cookie set
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/submit-csrf-form-cookie',
    body: {
      username: 'Joe'
    }
  })
    // confirm the server accepts our API call
    .its('status')
    .should('equal', 200)
})

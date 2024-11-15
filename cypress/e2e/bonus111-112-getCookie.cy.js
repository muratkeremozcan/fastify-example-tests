// for advice how to properly pass sensitive information
// read the blog post
// https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
const email = 'test@acme.com'
const password = 'abcdef'

it(
  'sets the session cookie',
  { baseUrl: 'http://localhost:7007', viewportHeight: 500 },
  () => {
    cy.visit('/')
    // click the "Login" link
    // https://on.cypress.io/contains
    // https://on.cypress.io/click
    cy.contains('a', 'Login').click()
    // you should end up on the /login page
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/login')
    // enter email and password
    // https://on.cypress.io/type
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(password)
    // and click the "Login" button
    cy.contains('button', 'Login').click()
    // you should end up on the home page
    cy.location('pathname').should('equal', '/')
    // the page shows "logged in" message
    cy.contains('logged in').should('be.visible')
    // and the cookie "sessionId" exists
    // https://on.cypress.io/getcookie
    cy.getCookie('sessionId').should('exist')

    cy.log('**the session exists**')
    // reload the page and confirm the user
    // is still logged in
    // https://on.cypress.io/reload
    cy.reload()
    cy.contains('logged in').should('be.visible')

    cy.log('**log out**')
    // click on the "Logout" link
    cy.contains('a', 'Logout').click()
    // the page should show the "Login" text
    cy.contains('a', 'Login').should('be.visible')
    // the old session should not be restored on reload
    // https://on.cypress.io/reload
    cy.reload()
    // the page still shows the "Login" text
    cy.contains('a', 'Login').should('be.visible')
  }
)

it(
  'makes authenticated request',
  {
    baseUrl: 'http://localhost:7007',
    viewportHeight: 500
  },
  () => {
    cy.visit('/')
    // click the "Login" link
    // https://on.cypress.io/contains
    // https://on.cypress.io/click
    cy.contains('a', 'Login').click()
    // you should end up on the /login page
    // https://on.cypress.io/location
    cy.location('pathname').should('equal', '/login')
    // enter email and password
    // https://on.cypress.io/type
    cy.get('input[name=email]').type(email)
    cy.get('input[name=password]').type(password)
    // and click the "Login" button
    cy.contains('button', 'Login').click()
    // you should end up on the home page
    cy.location('pathname').should('equal', '/')
    // the page shows "logged in" message
    cy.contains('logged in').should('be.visible')
    // make the request to "POST /info" endpoint
    // https://on.cypress.io/request
    // the body of the response should be equal to
    // {username: joe, isAdmin: false}
    cy.request('POST', '/info').its('body').should('deep.equal', {
      username: 'joe',
      isAdmin: false
    })

    cy.log('**delete the session cookie**')
    // https://on.cypress.io/clearcookie
    cy.clearCookie('sessionId')
    // make the request again, but allow it to fail
    // and confirm the server responds with 401 status code
    cy.request({
      method: 'POST',
      url: '/info',
      failOnStatusCode: false
    })
      .its('status')
      .should('equal', 401)
  }
)

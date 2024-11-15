// cypress/e2e/bonus114.cy.js

// for advice how to properly pass sensitive information
// read the blog post
// https://glebbahmutov.com/blog/keep-passwords-secret-in-e2e-tests/
const email = 'test@acme.com'
const password = 'abcdef'

describe(
  'login',
  {
    baseUrl: 'http://localhost:7007',
    viewportHeight: 500
  },
  () => {
    beforeEach(() => {
      // make a "POST /login" request to log in
      // pass the email and the password object as the body
      // https://on.cypress.io/request
      cy.request('POST', '/login', { email, password })
      // the cookie "sessionId" should be set by the successful cy.request
      // https://on.cypress.io/getcookie
      cy.getCookie('sessionId').should('exist')
    })

    // Cypress resets all cookies before each test
    // thus we need to log in again and get a new session cookie
    // how do we speed things up?

    it('tests API 1', () => {
      cy.request('POST', '/info')
    })

    it('tests API 2', () => {
      cy.request('POST', '/info')
    })

    it('tests API 3', () => {
      cy.request('POST', '/info')
    })
  }
)

// cy.session version

describe(
  'cy session login',
  {
    baseUrl: 'http://localhost:7007',
    viewportHeight: 500
  },
  () => {
    beforeEach(() => {
      // wrap it with cy.session
      cy.session('login', () => {
        // make a "POST /login" request to log in
        // pass the email and the password object as the body
        // https://on.cypress.io/request
        cy.request('POST', '/login', { email, password })
        // the cookie "sessionId" should be set by the successful cy.request
        // https://on.cypress.io/getcookie
        cy.getCookie('sessionId').should('exist')
      })
    })

    // Cypress resets all cookies before each test
    // thus we need to log in again and get a new session cookie
    // how do we speed things up?

    it('tests API 1', () => {
      cy.request('POST', '/info')
    })

    it('tests API 2', () => {
      cy.request('POST', '/info')
    })

    it('tests API 3', () => {
      cy.request('POST', '/info')
    })
  }
)

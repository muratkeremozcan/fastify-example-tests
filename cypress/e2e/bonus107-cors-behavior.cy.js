import spok from 'cy-spok'

// typically you would pass this URL in the Cypress.env object
const apiUrl = 'http://localhost:6006/'

describe('The CORS page', () => {
  beforeEach(() => {
    // visit the "cors.html page"
    cy.visit('/cors.html')
  })

  it('makes pre-flight request correctly', () => {
    // spy on OPTIONS api URL, give it an alias "options"
    // spy on GET api URL, give it an alias "fetch"
    // https://on.cypress.io/intercept
    // https://on.cypress.io/as
    cy.intercept('OPTIONS', apiUrl).as('options')
    cy.intercept('GET', apiUrl).as('fetch')
    // find the CORS button on the page and click it
    // https://on.cypress.io/contains
    // https://on.cypress.io/click
    cy.contains('button', /CORS/i).click()
    // confirm the "options" network call was made
    // and the server returned 204
    cy.wait('@options').its('response.statusCode').should('equal', 204)
    // confirm the "fetch" network call was made
    // and its response had status code 200
    // and returned {hello: world} object
    // https://on.cypress.io/wait
    // Tip: use cy-spok to check complex objects
    cy.wait('@fetch')
      .its('response')
      .should(
        spok({
          statusCode: 200,
          body: {
            hello: 'world'
          }
        })
      )
    // confirm the result on the page shows "Hello world" text
    // https://on.cypress.io/contains
    cy.contains('#result', 'Hello world')
  })

  it('does not make the GET call if OPTIONS fails', () => {
    // spy on the OPTIONS api call
    // modify the server response by overwriting the header
    // "access-control-allow-origin" to "http://acme.com"
    // https://on.cypress.io/intercept
    // with req.continue and response callback
    cy.intercept('OPTIONS', apiUrl, (req) => {
      req.continue((res) => {
        res.headers['access-control-allow-origin'] = 'http://acme.co'
      })
    })
      // give the network spy alias "options"
      .as('options')
    // spy on the GET api url and give it an alias "fetch"
    cy.intercept('GET', apiUrl).as('fetch')
    // click on the CORS button
    cy.contains('button', /CORS/i).click()
    // the "options" network call should have been made
    // and its response status should be 204
    cy.wait('@options').its('response.statusCode').should('equal', 204)
    // confirm the result on the page shows "Failed to fetch" text
    // https://on.cypress.io/contains
    cy.contains('#result', 'Failed to fetch')
    // confirm the GET "fetch" network call was NOT made
    // Tip: use "@fetch.all" array
    cy.get('@fetch.all').should('have.length', 0)
  })
})

// Bonus: investigate what the server sends back for OPTIONS pre-flight request
describe('pre-flight OPTIONS request', () => {
  it('fails without origin header', () => {
    // make a network OPTIONS call to the API url
    // with the header 'Access-Control-Request-Method': 'GET'
    // the server should respond with status 400
    // because the request is missing Origin header
    // https://on.cypress.io/request
    cy.request({
      method: 'OPTIONS',
      url: apiUrl,
      headers: {
        'Access-Control-Request-Method': 'GET'
      },
      failOnStatusCode: false
    }).should('have.property', 'status', 400)
  })

  it('succeeds', () => {
    // make a network OPTIONS call to the API url
    // with the header 'Access-Control-Request-Method': 'GET'
    // and any origin header
    // the server should respond with status 204
    // and an empty body
    // the response should have header
    // 'access-control-allow-origin' equal to the baseUrl
    // https://on.cypress.io/request
    cy.request({
      method: 'OPTIONS',
      url: apiUrl,
      headers: {
        // anyone can ask the CORS server using the OPTIONS call
        origin: 'http://acme.co',
        'Access-Control-Request-Method': 'GET'
      }
    }).should(
      spok({
        status: 204,
        body: '',
        headers: {
          'access-control-allow-origin': Cypress.config('baseUrl')
        }
      })
    )
  })
})

describe('GET request', () => {
  it('cy.request is not affected by CORS', () => {
    // the browsers use pre-flight OPTIONS call
    // to check if the site is allowed to call the destination
    // Node applications and cy.request are NOT limited
    // thus if you make a GET call with a wrong origin header
    // it will be successful and will return "hello: world" object
    // https://on.cypress.io/request
    cy.request({
      method: 'GET',
      url: apiUrl,
      headers: {
        origin: 'http://acme.co',
        'Access-Control-Request-Method': 'GET'
      }
    }).should(
      spok({
        status: 200,
        body: { hello: 'world' },
        headers: {
          'access-control-allow-origin': Cypress.config('baseUrl')
        }
      })
    )
  })
})

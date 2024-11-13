import spok from 'cy-spok'

describe('ETags and caching', () => {
  it('responds with 200', () => {
    // make a request to fetch all todos from 'GET /todos'
    // https://on.cypress.io/request
    cy.request('/todos')
      // the response should have status code 200
      .should('have.property', 'status', 200)
  })

  it('returns an etag header', () => {
    // request all todos from 'GET /todos'
    // https://on.cypress.io/request
    cy.request('/todos')
      // the response header should have "etag" property
      // which is a string
      // Tip: all headers are lowercase
      .its('headers')
      .should('have.property', 'etag')
      .should('be.a', 'string')
  })

  it('returns todos with at least one object', () => {
    // request all todos from 'GET /todos'
    // https://on.cypress.io/request
    cy.request('/todos')
      // grab the response body
      // and confirm it is a non-empty array
      // https://on.cypress.io/its
      .its('body')
      .should('be.an', 'array')
      .and('not.be.empty')
      // confirm the first item has string properties "id" and "title"
      // and a boolean property "completed"
      // Tip: use the "satisfy" assertion
      // https://glebbahmutov.com/cypress-examples/
      .its(0)
      .should(
        'satisfy',
        (todo) => {
          return (
            Cypress._.isString(todo.id) &&
            Cypress._.isString(todo.title) &&
            Cypress._.isBoolean(todo.completed)
          )
        },
        'todo properties'
      )
  })

  it('Bonus: check the entire response at once using cy-spok', () => {
    // request all todos from 'GET /todos'
    // https://on.cypress.io/request
    cy.request('/todos')
      // the response should:
      // have status code 200
      // have a string response header "etag"
      // have an array body
      // with the first object having
      // id and title string properties
      // boolean completed property
      .should(
        spok({
          status: 200,
          headers: {
            etag: spok.string
          },
          body: [
            {
              id: spok.string,
              title: spok.string,
              completed: Cypress._.isBoolean
            }
          ]
        })
      )
  })

  it('sends 304 cached response for if-none-match request header', () => {
    // request all todos from 'GET /todos'
    // https://on.cypress.io/request
    cy.request('/todos')
      // and grab its response header "etag"
      .its('headers')
      .should('have.property', 'etag')
      .should('be.a', 'string')
      // pass the etag value into a cy.then callback
      .then((etag) => {
        // and make another request, this time using the "etag"
        // in the request header "if-none-match"
        cy.request({
          url: '/todos',
          headers: {
            'if-none-match': etag
          }
        })
          // the response should have status code 304
          // and an empty string response body
          .should(
            spok({
              status: 304,
              body: ''
            })
          )
      })
  })

  it('sends 200 and data if the etag does not match if-none-match', () => {
    // make a request to get all todos
    // but on purpose try sending a wrong "if-none-match" header
    cy.request({
      url: '/todos',
      headers: {
        'if-none-match': 'nope-does-not-match'
      }
    })
      // the response should have status code 200
      // and the body should be an array of data
      .should(
        spok({
          status: 200,
          body: spok.array
        })
      )
  })
})

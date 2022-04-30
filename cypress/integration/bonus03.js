describe('make the request and compare to the fixture', () => {
  // make a request to GET /sale
  // https://on.cypress.io/request
  // get its body
  // https://on.cypress.io/its
  // load the fixture from a JSON file "sale.json"
  // https://on.cypress.io/fixture
  // compare the response body to the fixture
  // Tip: always use the "deep.equal" assertion to compare the objects
  it('gives a response matching a fixture object', () => {
    cy.request('GET', '/sale')
      .its('body')
      .then((sale) => cy.fixture('sale').should('deep.eq', sale))
  })

  // load the fixture first, then make the request
  // and compare the response body to the fixture object
  it('gives a response matching a fixture object, loads the fixture first', () => {
    cy.fixture('sale').then((sale) =>
      cy.request('GET', '/sale').its('body').should('deep.eq', sale)
    )
  })
})

// import the object from the JSON fixture file
// and use it as a local variable in the spec
import sale from '../fixtures/sale.json'
describe('using JSON import', () => {
  it('gives a response matching a fixture object loaded using import keyword', () => {
    cy.request('/sale').its('body').should('deep.equal', sale)
  })
})

describe('using alias', () => {
  it('gives a response matching a fixture object loaded using import keyword', () => {
    cy.fixture('sale').as('fixture')

    cy.request('GET', '/sale')
      .its('body')
      .then((sale) => cy.get('@fixture').should('deep.eq', sale))
  })
})

describe('load fixture before each test', () => {
  // before each test, load the fixture
  // https://on.cypress.io/fixture
  // and save as an alias
  // https://on.cypress.io/as
  beforeEach(() => cy.fixture('sale').as('sale'))

  // use the "function () { ... }" test callback syntax
  // to be able to access the fixture using "this.<alias name>" syntax
  it('gives a response matching an alias set as a property', function () {
    cy.request('/sale').its('body').should('deep.equal', this.sale)
  })
})

describe('Load once into a local variable', () => {
  // define a local variable and set it value once
  // from a "before" hook that loads the fixture
  // https://on.cypress.io/fixture
  let sale
  before(() => cy.fixture('sale').then((fixture) => (sale = fixture)))

  // in the test use the local variable
  // to check the response
  it('gives a response matching a fixture loaded once', () => {
    cy.request('/sale').its('body').should('deep.equal', sale)
  })
})

describe('load once, reset the alias', () => {
  // we can use a local variable to keep the value
  // loaded just once from "before" hook
  // https://on.cypress.io/fixture
  let tempSale
  before(() => {
    cy.fixture('sale.json').then((sale) => {
      tempSale = sale
    })
  })
  // before each test, we can take the local variable
  // and define the alias using
  // https://on.cypress.io/wrap
  // https://on.cypress.io/as
  beforeEach(() => {
    cy.wrap(tempSale).as('sale')
  })

  // using the "function () { ... }" syntax
  // we can assess the alias using the "this.<alias name>" syntax
  it('gives a response matching a fixture reset from a local variable', function () {
    cy.request('/sale').its('body').should('deep.equal', this.sale)
  })
})

describe('using Cypress.env object to keep the data', () => {
  // load the fixture once using "before" hook
  // and store the data in Cypress.env object
  // https://on.cypress.io/env
  // Cypress.env('name', value)
  before(() => {
    cy.fixture('sale.json').then((sale) => {
      Cypress.env('sale', sale)
    })
  })

  // in the test use the data from Cypress.env object
  // Cypress.env('name')
  it('uses sale from Cypress.env object', () => {
    cy.request('/sale').its('body').should('deep.equal', Cypress.env('sale'))
  })
})

// install the plugin if necessary
// npm i -D cypress-data-session
// https://github.com/bahmutov/cypress-data-session
import 'cypress-data-session'
describe('using cypress-data-session plugin', () => {
  // before each test, call the cy.dataSession
  // and use cy.fixture command to load the fixture
  // Note: the fixture is loaded only once
  beforeEach(() => {
    cy.dataSession({
      name: 'sale',
      setup() {
        return cy.fixture('sale.json')
      }
    })
  })
  // use the "function () { ... }" test callback syntax
  // to access the data session data (the fixture)
  // by name using "this.<data session name>"
  it('matches the sale', function () {
    cy.request('/sale').its('body').should('deep.equal', this.sale)
  })
})

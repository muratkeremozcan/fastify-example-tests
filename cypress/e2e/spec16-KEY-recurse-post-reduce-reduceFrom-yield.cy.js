/// <reference types="cypress" />
import { recurse } from 'cypress-recurse'
import spok from 'cy-spok'

it('requests all fruits', () => {
  // request the fruit from the /fruit endpoint
  // using the https://on.cypress.io/request command
  // from the response get the body object, then the fruit
  // using the https://on.cypress.io/its command
  // store each fruit in a Set object
  // and keep requesting until we see a fruit already in the set
  // print the collected list of fruits
  const fruits = new Set()

  function addFruit() {
    cy.request('GET', '/fruit')
      .its('body.fruit')
      .then((fruit) => {
        cy.log(fruit)

        if (fruits.has(fruit)) {
          const list = [...fruits].sort()
          expect(list).to.have.length(5)
          return cy.log(list.join(', '))
        }
        fruits.add(fruit)
        cy.wait(100)
        cy.reload()
        return addFruit()
      })
  }

  addFruit()
})

it('adds all fruit using cypress recurse', () => {
  const fruits = new Set()

  recurse(
    () => cy.request('GET', '/fruit').its('body.fruit'),
    (fruit) => fruits.has(fruit),
    {
      log: false,
      limit: 15,
      timeout: 1000,
      delay: 100,
      // note: The argument that post takes is a single object with limit, value, and reduced properties.
      // https://github.com/bahmutov/cypress-recurse#post
      post({ value }) {
        fruits.add(value)
        return cy.reload()
      }
    }
    // the "recurse" from cypress-recurse
    // is chainable, so we can chain a ".then" callback
    // to check the length of the Set object and confirm
    // the collected fruit names
  ).then(() => {
    const list = [...fruits].sort()
    expect(list).to.have.length(5)
    cy.log(list.join(', '))
  })
})

it('uses reduce with cypress-recurse', () => {
  // the predicate function gives you the current reduced value as the 2nd argument
  recurse(
    () =>
      cy
        .request('GET', '/fruit')
        .should(Cypress._.noop)
        .then(spok({ body: { fruit: spok.string } }))
        .its('body.fruit'),
    // note: accumulator is that which which keeps the returned value after every iteration
    // the signature here is (item, accumulator)
    // https://github.com/bahmutov/cypress-recurse#post
    (fruit, fruits) => fruits.has(fruit),
    {
      log: false,
      limit: 15,
      timeout: 10000,
      delay: 100,
      reduceFrom: new Set(), // reduceFrom is the starting value, like []
      // reduce(accumulator, item) receives each value and the current accumulator value
      // note: The argument that post takes is a single object with limit, value, and reduced(?) properties.
      // https://github.com/bahmutov/cypress-recurse#post
      reduce: (fruits, fruit) => fruits.add(fruit),
      post: ({ value }) => {
        cy.log(`value per iteration: ${value}`)
        return cy.reload()
      },
      // yield: "value" yields the value that passed the predicate function
      // yield: "reduced" yields the accumulated value
      // yield: "both" yields an object with value and reduced properties
      yield: 'both'
    }
  ).then(({ value: lastValue, reduced: fruits }) => {
    const list = [...fruits].sort()
    expect(list).to.have.length(5)
    cy.log('Found all fruits')
    cy.log(list.join(', '))
    cy.log(`Last fruit: ${lastValue}`)
  })
})

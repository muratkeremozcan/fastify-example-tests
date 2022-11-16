/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

it('finds all fruits', () => {
  // visit the page
  // keep getting the fruit from the page
  // and storing it in a Set object
  // and reloading the page
  // until we see the fruit we have already added
  // print the collected list of fruits
  // check its length against the expected value

  // note: Why set? A set is a collection of unique values (duplicates are ignored).
  // The API for a set is similar to Map. The add(..) method takes the place of the set(..) method and there is no get(..) method.
  // A set doesn’t need a get(..) because you don’t retrieve a value from a set, but rather test if it is present or not, using has(..)
  // Unlike how Map(..) expects an entries list (array of key/ value arrays), Set(..) expects a values list (array of values)
  // You can convert a Set or Map to an array by wrapping it with [... ]

  const fruits = new Set()

  function checkFruit() {
    return cy
      .get('#fruit')
      .should('not.contain', 'loading...')
      .invoke('text')
      .then((fruit) => {
        if (fruits.has(fruit)) {
          const list = [...fruits].sort()
          expect(list).to.have.length(5)
          return cy.log(list.join(', '))
        }
        fruits.add(fruit)

        cy.wait(100)
        cy.reload()
        return checkFruit()
      })
  }

  cy.visit('/')

  checkFruit()
})

it('finds all the fruit using cypress-recurse', () => {
  // let's use the "recurse" function to reload the page
  // until we see a repeated fruit. Then we can stop
  // since we have seen all the fruits.
  //
  // First, visit the page
  // https://on.cypress.io/visit
  cy.visit('/')
  // keep track of the fruits we have seen
  // using a Set object
  const fruits = new Set()
  // call the recurse function
  // first argument is a function that gets
  // the fruit from the page
  // second argument is a predicate that returns true if we have already seen the fruit
  // the third argument is an options object
  // that can have "post" method that gets called
  // where we add the fruit to the Set object
  // and reload the page
  recurse(
    () => cy.get('#fruit').should('not.have.text', 'loading...').invoke('text'),
    (fruit) => fruits.has(fruit),
    {
      log: false,
      limit: 15,
      timeout: 1000,
      delay: 100,
      // note: The argument that post takes is a single object with limit, value, and reduced properties.
      // https://github.com/bahmutov/cypress-recurse#post
      post({ value }) {
        cy.log(`adding ${value} to the list`)
        fruits.add(value)
        return cy.reload()
      }
    }
  )
    // the "recurse" from cypress-recurse
    // is chainable, so we can chain a ".then" callback
    // to check the length of the Set object and confirm
    // the collected fruit names
    .then(() => {
      cy.log('Found all fruits')
      // we are done
      // print the collected list of fruits
      // check its length against the expected value
      const list = [...fruits].sort()
      cy.log(list.join(', '))
      expect(list).to.have.length(5)
    })
})

it('uses reduce with cypress-recurse', () => {
  cy.visit('/')

  // try writing the recurse() that adds each new fruit to a Set object
  // reducing the fruits into the set.
  // Use the "reduceFrom", "reduce", and "yield" options to update the Set with each fruit
  // and yield the fruit to the next command
  recurse(
    () => cy.get('#fruit').should('not.have.text', 'loading...').invoke('text'),
    // note: accumulator is that which which keeps the returned value after every iteration
    // the signature here is (item, accumulator)
    // https://github.com/bahmutov/cypress-recurse#post
    (fruit, fruits) => fruits.has(fruit),
    {
      log: false,
      limit: 15,
      timeout: 1000,
      delay: 100,
      reduceFrom: new Set(), // reduceFrom is the starting value, like []
      reduce: (fruits, fruit) => fruits.add(fruit), // reduce(accumulator, item) receives each value and the current accumulator value
      // note: The argument that post takes is a single object with limit, value, and reduced(?) properties.
      // https://github.com/bahmutov/cypress-recurse#post
      post: ({ value, limit /*, reduced */ }) => {
        cy.log(`value is : ${value}`)
        cy.log(`limit is : ${limit}`)
        // cy.log(`reduced is : ${reduced}`) // undefined
        return cy.reload()
      },
      // yield: "value" yields the value that passed the predicate function
      // yield: "reduced" yields the accumulated value
      // yield: "both" yields an object with value and reduced properties
      yield: 'reduced'
    }
  )
    // we have specified "yield: 'reduced' " thus we get the Set object with fruits"
    .then((fruits) => {
      // we are done
      // print the collected list of fruits
      // check its length against the expected value
      const list = [...fruits].sort()
      expect(list).to.have.length(5)
      cy.log('Found all fruits')
      cy.log(list.join(', '))
    })
})

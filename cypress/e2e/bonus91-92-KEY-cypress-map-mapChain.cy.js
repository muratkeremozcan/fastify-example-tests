// https:cypress.tips/courses/network-testing/lessons/bonus91
// https://cypress.tips/courses/network-testing/lessons/bonus92

import 'cypress-map'

// all fruits the server knows about
const fruits = ['Apples', 'Oranges', 'Bananas', 'Pears', 'Grapes']
it('fetches a price for each fruit', () => {
  // make a call to fetch a price for each fruit
  // from the array of fruits. store the fetched prices
  // in this array "prices"
  const prices = []
  // fruits.forEach((fruit) => {
  //   cy.request('GET', `/fruits/price/${fruit}`)
  //     .its('body.price')
  //     .should('be.within', 0, 100)
  //     .then((price) => prices.push(price))
  // })
  // same thing as above, just matching the cypress-map doc example
  cy.wrap(fruits).each((fruit) =>
    cy
      .request('GET', `/fruits/price/${fruit}`)
      .its('body.price')
      .should('be.within', 0, 100)
      .then((price) => prices.push(price))
  )
  // the final "prices" array should have the same length
  // as the "fruits" array
  cy.wrap(prices).should('have.length', fruits.length)
})

// fetch the users from a list of ids
// 🚨 DOES NOT WORK
// cy.get(ids).each(id => cy.request('/users/' + id)).then(users => ...)
// Nope, the yielded "users" result is ... still the "ids" subject
// ✅ CORRECT SOLUTION
// cy.get(ids).mapChain(id => cy.request('/users/' + id)).then(users => ...)

// mapChain chains all callbacks and assembles the final array

it('uses mapChain to avoid mutating a variable', () => {
  cy.wrap(fruits)
    .mapChain((fruit) =>
      cy
        .request('GET', `/fruits/price/${fruit}`)
        .its('body.price')
        .should('be.within', 0, 100)
    )
    .should('have.length', fruits.length)
})

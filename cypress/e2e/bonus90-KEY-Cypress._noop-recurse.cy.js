import { recurse } from 'cypress-recurse'

// https://cypress.tips/courses/network-testing/lessons/bonus90

describe('Each fruit', () => {
  // a utility function to find the give fruit on the page
  // and if it is not there, reload the page and try again
  function findFruit(fruit) {
    // write a function that tries to find
    // the "LI" element with the fruit text
    // inside the "#fruits" element
    // https://on.cypress.io/get
    // https://on.cypress.io/contains
    // https://on.cypress.io/should

    // if the element exists, we found it, nothing else to do
    // otherwise wait half a second and reload the page
    // https://on.cypress.io/wait
    // https://on.cypress.io/reload
    // and call the function recursively

    const findIt = () => {
      // Tip: to avoid cy retry chain failing, attach a no-op ".should(callback)" function
      cy.get('#fruits')
        .should('be.visible')
        .contains('li', fruit)
        .should(Cypress._.noop)
        .then(($fruit) => {
          if ($fruit.length) cy.log(`Found ${fruit}`)
          else {
            cy.wait(500)
            cy.reload().then(findIt)
          }
        })
    }
    findIt()
  }

  beforeEach(() => {
    cy.visit('/fruits.html')
  })

  it('shows Pears', () => {
    // there must be the fruit "Pears" on the page
    // if you reload the page often enough
    findFruit('Pears')
  })

  it('uses cypress-recurse', () => {
    const fruit = 'Pears'
    recurse(
      () =>
        cy
          .get('#fruits')
          .should('be.visible')
          .contains('li', fruit)
          .should(Cypress._.noop),
      ($fruit) => $fruit.length,
      {
        log: `Found `,
        delay: 500,
        timeout: 10000,
        post() {
          cy.wait(500)
          cy.reload()
        }
      }
    )
  })
})

// I do not like the second part that creates an axios request before every file,
// which is only used in this file for test generation

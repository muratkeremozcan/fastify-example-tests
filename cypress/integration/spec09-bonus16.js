/// <reference types="cypress" />

it('returns different fruits', () => {
  // stub the /fruit endpoint to return "apple" on the first visit
  // stub the /fruit endpoint to return "grapes" on the second visit
  // https://on.cypress.io/intercept with "times: *" option

  cy.intercept(
    {
      method: 'GET',
      url: '/fruit',
      times: 1
    },
    { fruit: 'grapes' }
  )
  cy.intercept(
    {
      method: 'GET',
      url: '/fruit',
      times: 1
    },
    { fruit: 'apple' }
  )

  // visit the site
  // confirm it shows "apple"
  cy.visit('/')
  cy.contains('apple')

  // reload the site
  // confirm it shows "grapes"
  cy.reload()
  cy.contains('grapes')
})

// bonus 16
// this is another solution the problem shown in Lesson spec09
it('returns different fruits revisited - bonus 16 alternative solution', () => {
  // write the route handler function with custom logic
  // that returns the fruit "apple" on the first call
  // and the fruit "grapes" after that
  // https://on.cypress.io/intercept
  // cy.intercept(routeMatcher, routeHandler)
  let count = 0

  cy.intercept(
    {
      method: 'GET',
      url: '/fruit'
    },
    (req) => {
      if (count === 0) {
        count++
        req.reply({
          fruit: 'apple'
        })
      } else {
        req.reply({
          fruit: 'grapes'
        })
      }
    }
  )

  // visit the site
  // confirm it shows "apple"
  // reload the site several times to check if it always
  // shows the same fruit "grapes"

  cy.visit('/')
  cy.contains('apple')

  // reload the site
  // confirm it shows "grapes"
  cy.reload()
  cy.contains('grapes')
})

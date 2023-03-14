// https://cypress.tips/courses/network-testing/lessons/bonus78

import 'cypress-map'

it('sends URL encoded form using cy.request command', () => {
  // make an API POST request to submit the URL encoded form
  // to the URL /submit-urlencoded
  // with the content type "application/x-www-form-urlencoded"
  // Send an object with a city name and a "guess: 6" property
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/submit-urlencoded',
    headers: {
      // it works the same without
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: {
      city: 'Los Angeles',
      guess: '6'
    }
  })
    .its('body')
    .tap((html) => {
      console.log(html)
    })
    // the server responds with an HTML page
    // grab the body of the yielded object - it is an HTML string
    // https://on.cypress.io/its
    // https://on.cypress.io/then
    //
    // grab the current document object
    // https://on.cypress.io/document
    // and write the HTML from the server into the document
    // https://on.cypress.io/invoke
    .then((html) => {
      cy.document().then(console.log)
      // document has a write method https://developer.mozilla.org/en-US/docs/Web/API/Document/write
      cy.document().invoke('write', html)
    })

  // the page should display the sent values
  // https://on.cypress.io/contains
  cy.contains('[data-city]', 'Los Angeles')
  cy.contains('[data-guess]', '6')
})

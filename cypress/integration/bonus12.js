it('saves the intercepted network response', () => {
  // intercept the GET /fruit request
  // https://on.cypress.io/intercept
  // and print the server response using "cy.log" command
  // https://on.cypress.io/log

  // NOTE: you cannot use "cy" commands inside the
  // intercept route handler. Instead, save the response
  // in a local closure variable "response"
  // and wait for the network call to finish
  // then print the saved response using the "cy.log"
  // command and save it into a file "response.json"
  // https://on.cypress.io/writefile

  // (1) work around the limitation of not being able to use "cy" commands alongside promises
  let response

  cy.intercept('GET', '/fruit', (req) =>
    req.continue((res) => {
      console.dir(res)
      // if we enable this, we run into the following error:
      /*
			Cypress detected that you returned a promise from a command 
			while also invoking one or more cy commands in that promise.
			*/
      // cy.writeFile('response.json', res.body)

      // (2) work around
      response = res.body
    })
  ).as('fruit')

  // visit the site using cy.visit("/")
  cy.visit('/')
  cy.wait('@fruit').then((fruit) => {
    // (3) with the workaround, no issues with these
    cy.log(fruit)
    cy.log(response)
    cy.writeFile('response.json', response)
  })
})

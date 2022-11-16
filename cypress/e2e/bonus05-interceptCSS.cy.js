it('changes the loaded CSS resource', () => {
  // intercept the the "style.css" resource
  // using https://on.cypress.io/intercept
  // let the request continue to the server
  // and get the response back.

  // Note: the CSS resources are cached by the browser
  // thus before the request is made, remove the
  // request headers "If-None-Match" and "If-Modified-Since"
  // Tip: you can dump the request headers to the console
  // to see them to make sure you are deleting the right ones
  cy.intercept('GET', /style.css/, (req) => {
    delete req.headers['if-none-match']
    delete req.headers['if-modified-since']
    expect(req.headers).not.to.have.property('if-none-match')
    expect(req.headers).not.to.have.property('if-non-match')

    // Parse the response text using any method you like
    // and add to the "#fruit" CSS style a red border line.
    // Give the network intercept an alias.
    // console.log(req)
    req.continue((res) => {
      res.body += '\n#fruit { border: 1px solid red; }'
      // console.log(JSON.stringify(res.body))
      expect(JSON.stringify(res.body)).to.include(
        '#fruit { border: 1px solid red; }'
      )
    })
  }).as('style')

  // visit the page
  // Confirm the intercept worked
  // and its response status code was 200
  // and not 304 (Not Modified)
  cy.visit('/')
  cy.wait('@style')
    .its('response.statusCode')
    .should('eq', 200)
    .and('not.eq', 304)

  // Confirm the added CSS style was applied
  // to the page element
  // the element should have CSS border
  // because the width might be a float
  // just confirm it is a solid red line
  cy.get('#fruit')
    .should('have.css', 'border')
    .and('contain', 'solid rgb(255, 0, 0)')
})

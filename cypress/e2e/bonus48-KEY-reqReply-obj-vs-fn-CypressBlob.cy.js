it('stubs the octet stream response using a PNG fixture', () => {
  // stub the "GET /tiger-octet" network call and
  // return the "bunny.png" fixture
  // give the intercept the alias "image"
  cy.intercept('GET', '/tiger-octet', (req) => {
    // req.reply((res) => {
    //   res.send({ fixture: 'bunny.png' })
    // })
    // we could also use object
    req.reply({ fixture: 'bunny.png' })
  }).as('image')

  // visit the "/tiger-fetch.html" page
  // watch for the "@image" network call
  cy.visit('/tiger-fetch.html')
  cy.wait('@image')

  // confirm the bunny image was loaded by checking
  // the resolution of the image on the page
  // it should be 1280x937 pixels
  // Tip: use the props "naturalWidth" and "naturalHeight"
  cy.get('#tiger')
    .should('have.prop', 'naturalWidth', 1280)
    .and('have.prop', 'naturalHeight', 937)
})

it('stubs the octet stream response using an array buffer', () => {
  // load the binary fixture image "bunny.png"
  // and encode the binary string as array buffer
  // https://on.cypress.io/fixture
  // https://on.cypress.io/blob
  cy.fixture('bunny.png', 'binary')
    .then(Cypress.Blob.binaryStringToArrayBuffer)
    .then((body) => {
      // stub the "GET /tiger-octet" network call and
      // respond with the array buffer object
      // give the intercept the alias "image"
      cy.intercept('GET', '/tiger-octet', {
        body
      }).as('image')
    })

  // visit the "/tiger-fetch.html" page
  // watch for the "@image" network call
  cy.visit('/tiger-fetch.html')
  cy.wait('@image')

  // confirm the bunny image was loaded by checking
  // the resolution of the image on the page
  // it should be 1280x937 pixels
  // Tip: use the props "naturalWidth" and "naturalHeight"
  cy.get('#tiger')
    .should('have.prop', 'naturalWidth', 1280)
    .and('have.prop', 'naturalHeight', 937)
})

it('spies on the octet response', () => {
  // spy on the "GET /tiger-octet" call
  // and give it an alias "image"
  cy.intercept('GET', '/tiger-octet').as('image')
  // visit the "/tiger-fetch.html" page
  cy.visit('/tiger-fetch.html')
  // watch for the "@image" network call
  cy.wait('@image')
    // confirm the response headers
    // includes the property "content-type"
    // with expected value
    .its('response.headers')
    .should('have.property', 'content-type', 'application/octet-stream')
})

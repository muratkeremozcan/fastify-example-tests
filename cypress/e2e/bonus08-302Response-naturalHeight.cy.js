it('redirects the image to another image URL', () => {
  // intercept the GET request to "/tiger.png" image
  // and return an object with the status code 302 (moved temporarily)
  // and the headers object with location "/bunny.png"
  // https://on.cypress.io/intercept

  cy.intercept('GET', /tiger.png/, {
    statusCode: 302,
    headers: {
      location: '/bunny.png'
    }
  }).as('tiger')

  // visit the page "/tiger.html"
  // there is a "tiger" image on the page
  // which you can check using the cy.get command
  // but the tiger image is really the bunny image
  // which we can check by using its natural height
  // by getting the DOM element and its "naturalHeight" property
  // https://on.cypress.io/its
  // the bunny.png the height is 937 pixels
  cy.visit('/tiger.html')
  cy.wait('@tiger')
  // cy.get('img').its(0).its('naturalHeight') // why doesn't this work?
  cy.get('img').its(0).then(console.log)
  cy.get('img').its('0.naturalHeight').should('eq', 937)
})

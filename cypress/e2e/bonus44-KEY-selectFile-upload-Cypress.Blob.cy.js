it('uploads a file', { viewportHeight: 400, viewportWidth: 300 }, () => {
  // visit the /upload-pic.html
  // https://on.cypress.io/visit
  // enter the username "test"
  // and select a png fixture "profile.png"
  // in the picture file input
  // https://on.cypress.io/selectfile
  cy.visit('/upload-pic.html')
  cy.get('[name=username]').type('test')
  cy.get('[name=pic]').selectFile('cypress/fixtures/profile.png')
  // submit the form
  // verify the URL has changed correctly
  // https://on.cypress.io/location
  cy.contains('button', 'Submit').click()
  cy.location('pathname').should('equal', '/upload-profile-picture')
  // the page should have the correct success message
  // and have the image with attribute "alt=Profile picture"
  cy.contains('Updated profile picture for test')
  cy.get('img[alt="Profile picture"]')
    .should('be.visible')
    // Bonus 1: verify the shown image has the same
    // expected dimensions
    // by checking the "naturalWidth" and "naturalHeight" props
    .and(($img) => {
      expect($img, 'profile image')
        .to.have.prop('naturalWidth', 200)
        .and.to.have.prop('naturalHeight', 231)
    })

  cy.fixture('profile.png', 'base64').then((base64) => {
    const src = `data:image/png;base64,${base64}`
    const img = Cypress.$(`<img src=${src} />`)
    expect(img, 'fixture image')
      .to.have.prop('naturalWidth', 200)
      .and.to.have.prop('naturalHeight', 231)

    // use the fixture width and height
    const width = img.prop('naturalWidth')
    const height = img.prop('naturalHeight')
    cy.get('img[alt="Profile picture"]').should(($img) => {
      expect($img, 'profile image dimensions')
        .to.have.prop('naturalWidth', width)
        .and.to.have.prop('naturalHeight', height)
    })
  })
})

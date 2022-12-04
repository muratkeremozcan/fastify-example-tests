it('downloads the tiger image file and checks the downloaded file', () => {
  // visit the "tiger-download.html" page
  // https://on.cypress.io/visit
  cy.visit('/tiger-download.html')
  // spy on the "tiger.png" network call, assign its "tiger" alias
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/tiger.png').as('tiger')
  // click on the anchor link with the download attribute
  // https://on.cypress.io/get
  // https://on.cypress.io/click
  cy.get('a[download]').click()
  // confirm the "tiger" network call happens
  cy.wait('@tiger')
  // get the attribute "download" from the anchor link
  // it will be the filename given to the downloaded image
  cy.get('a[download]')
    .should('have.attr', 'download')
    // "have.attr" assertion with a single argument
    // yields the value of the attribute
    .should('be.a', 'string')
    // yields the name of the downloaded file
    .then((filename) => {
      // confirm the file exists in the downloads folder
      // by using cy.readFile + null encoding
      // (since we are not interested in the file itself)
      // https://on.cypress.io/readfile
      // https://on.cypress.io/configuration
      cy.readFile(
        Cypress.config('downloadsFolder') + '/' + filename,
        null
      ).should('exist')
    })
})

// KEY: Use the Log event log:added to grab the "download" command event. The filename will be the "message" property.
it('bonus: get the downloaded filename from an event', () => {
  // visit the "tiger-download.html" page
  // https://on.cypress.io/visit
  cy.visit('/tiger-download.html')
  // create a new cy.stub and give it an alias "download"
  // https://on.cypress.io/download
  const download = cy.stub().as('download')
  // look at the https://on.cypress.io/catalog-of-events
  // and find the event that might give you downloaded filename
  // from the event, get the filename and call the stub
  // function, passing the filename
  cy.on('log:added', (e) => {
    if (e.name === 'download') {
      download(e.message)
    }
  })
  // click on the anchor element with the download attribute
  cy.get('a[download]').click()
  // the stub "download" should be called once
  // get its first argument
  // https://on.cypress.io/its
  // and log the filename to the Cypress Command Log
  // Confirm the downloaded file exists
  // using cy.readFile and null encoding
  // https://on.cypress.io/readfile
  cy.get('@download')
    .should('have.been.calledOnce')
    .its('firstCall.args.0')
    .then((filename) => {
      cy.log(`image downloaded **${filename.split('/').at(-1)}**`)
      cy.readFile(filename, null).should('exist')
    })
})

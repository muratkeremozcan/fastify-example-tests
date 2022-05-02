// find the name of the font first to know
// which low-level request to spy on
let fonts = {}

before(() => {
  // look at the application's /fancy.html page
  // you will see the link to download the custom font CSS resource
  //
  // Using cy.request command, get the CSS resource
  // and extract the custom font URL. Store the URL in the fonts object
  // using https://on.cypress.io/wrap
  // confirm the "fontUrl" property has been set

  cy.request('https://fonts.googleapis.com/css2?family=Satisfy&display=swap')
    .its('body')
    .then((body) => {
      const matches = body.match(/url\((?<fontUrl>[\:\.\/a-zA-Z0-9]+)\)/)
      // console.log(matches)
      fonts.fontUrl = matches.groups.fontUrl

      expect(fonts.fontUrl).to.be.a('string')
    })
})

it(
  'slows down the custom font load',
  // make the page larger to clearly see the custom cursive font
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    // log the fonts object to confirm that
    // we have the font URL to delay 2 seconds
    // https://on.cypress.io/log
    cy.log(fonts)

    // intercept the font request and slow it down by two seconds
    // by returning a delayed promise
    // give the intercept an alias "font"
    // https://on.cypress.io/intercept
    cy.intercept('GET', /fonts.gstatic.com/, (/*req*/) =>
      Cypress.Promise.delay(2000)).as('font')

    // using the cy.then callback, disable the network caching
    // Note: this automation command will only work in the Chrome-based browsers
    // like Electron, Chrome, Edge (new version)
    // and will not work in Firefox
    //
    // disable the network caching which does not let the cached font request
    // to get out of the (Chrome) browser and into our Cypress network proxy layer
    // https://glebbahmutov.com/blog/cypress-automation/
    // we are going to use the following Chrome Debugger Protocol method
    // https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-setCacheDisabled
    // which is equivalent to the checkbox "Disable cache" in the Network tab
    //
    // return Cypress.automation('remote:debugger:protocol', {
    //   command: 'Network.setCacheDisabled',
    //   params: {
    //     cacheDisabled: true,
    //   },
    // })

    cy.then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.setCacheDisabled',
        params: {
          cacheDisabled: true
        }
      })
    )
    // visit the page "/fancy.html"
    // wait for the font resource to load

    cy.visit('/fancy.html')
    cy.wait('@font')
  }
)

it('uses cypress-cdp', { viewportWidth: 500, viewportHeight: 500 }, () => {
  cy.intercept('GET', /fonts.gstatic.com/, (/*req*/) =>
    Cypress.Promise.delay(2000)).as('font')

  cy.CDP('Network.setCacheDisabled', { cacheDisabled: true })

  cy.visit('/fancy.html')
  // we can do better than just waiting for the intercept
  // cy.wait('@font')

  cy.getCDPNodeId('body').then((nodeId) => {
    cy.CDP('CSS.getPlatformFontsForNode', {
      nodeId
    }).should((result) => {
      expect(result.fonts).to.be.an('array').and.to.have.length(1)
      expect(result.fonts[0].familyName, 'font family').to.equal('Satisfy')
    })
  })
})

it('measures the total size of the page and its resources', () => {
  // important: disable caching for each resource
  // to truly download the images and other resources
  // Tip: use cy.intercept to intercept all "GET" requests
  // by using the options form
  // and remove the caching headers from the request
  // https://on.cypress.io/intercept
  cy.intercept(
    {
      method: 'GET'
    },
    (req) => {
      delete req.headers['if-modified-since']
      delete req.headers['if-none-match']
    }
  )
  // visit the "tiger.html" page
  // https://on.cypress.io/visit
  cy.visit('/tiger.html')
    // assume all images and other resources are loaded immediately
    // cy.visit yields the "window" object
    // grab its performance object and invoke the method "getEntries"
    .its('performance')
    .invoke('getEntries')
    // from each entry, take the transfer size property (bytes)
    .then((list) => Cypress._.map(list, 'transferSize'))
    .then(console.log)
    // and add them all up
    .then(Cypress._.sum)
    .then(console.log)
    // confirm the total page size is below 1MB
    .should('be.below', 1024 * 1024)
})

/**
 * extracted function to yield the total transfer size
 * of the resources on the page
 */
function getTransferSizes() {
  return (
    cy
      .window()
      .its('performance')
      .invoke('getEntries')
      // from each entry, take the transfer size property (bytes)
      .then((list) => Cypress._.map(list, 'transferSize'))
      .then(console.log)
      // optional: filter numbers to skip resources
      // that don't have the transfer size
      // and add them all up
      .then(Cypress._.sum)
  )
}

it('Bonus: disable network caching via CDP', () => {
  // https://github.com/bahmutov/cypress-cdp
  // use the cy.CDP command to disable the network caching
  // https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-setCacheDisabled
  cy.CDP('Network.setCacheDisabled', {
    cacheDisabled: true
  })
  cy.visit('/tiger.html')
  // confirm the total page size is below 1MB
  getTransferSizes().should('be.below', 1024 * 1024)
})

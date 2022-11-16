// cypress/integration/bonus04.js
// a little utility function to extract
// the resource path from the full URL
function getPath(url) {
  const parsed = new URL(url)
  return parsed.pathname
}

// PROBLEM: js bundles get loaded a bit too late and we have to wait for these js resources

it('waits for all JavaScript bundles to load', () => {
  const jsResources = {}

  // visit the "/bundles.html" page

  cy.visit('bundles.html')

  // count each JS resource loaded by the page and keep the counts in an object by pathname
  // when a resource is requested by the page, increment the count for that pathname
  // when the request is relayed to the server, decrement the count
  // https://on.cypress.io/intercept

  cy.intercept('GET', /\.js$/, (req) => {
    const path = getPath(req.url)

    // increment the count of path
    jsResources[path] = (jsResources[path] || 0) + 1
    console.log('jsResources :', jsResources)
    console.log('path', path)
    console.log('jsResources[path] / jsResources.path:', jsResources[path])

    req.continue(() => {
      jsResources[path] -= 1
    })
  }).as('js-resources')

  // wait for all JS bundles to load
  // make sure the list of resources includes "click.js"
  // KEY: if we do not wait for the js resource, the test will fail
  cy.wait('@js-resources').its('response.url').should('include', '/click.js')

  // (optional) Then check if all requests have finished loading by checking that all values in the object are zeroes.
  cy.wrap(jsResources).should((counts) => {
    // under the counts object, find all the keys with a value.
    console.log(Object.keys(counts))
    const notLoaded = Object.keys(counts).filter((path) => counts[path] > 0)
    // That list should be empty
    expect(notLoaded).to.be.empty
  })

  // now we can click on the button, since all JS should be loaded and the event handlers set
  // observe the GET /fruit call
  // using https://on.cypress.io/intercept
  // and give it an alias "fruit"
  // get the "load fruit" button and click on it
  // wait for the network call using the alias "fruit"

  cy.intercept('GET', '/fruit').as('fruit')
  cy.get('#load-fruit').click()
  cy.wait('@fruit')
    .its('response.body.fruit')
    // from the intercept, get the response body
    // and the "fruit" property of the returned object
    // then confirm the page contains the element
    // with ID "fruit" and the text sent by the server
    .then((returnedFruit) => cy.get('#fruit').contains(returnedFruit))
})

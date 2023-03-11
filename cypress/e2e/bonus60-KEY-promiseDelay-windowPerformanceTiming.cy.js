import 'cypress-map'
// What does the user see if the app.css loads slowly?
// Let's demonstrate the flash of unstyled content by slowing down the CSS resource.
// In the second part of the test, let's see how long the page takes to load by inspecting the Performance timing object.

it('loads', { viewportWidth: 800, viewportHeight: 1000 }, () => {
  // intercept the "GET /css-import/app.css" requests
  // and slow them down by 1 seconds
  // https://on.cypress.io/intercept
  cy.intercept('GET', '/css-import/app.css', () =>
    Cypress.Promise.delay(1000)
  ).as('css-import')
  // visit the page "css-import"
  // https://on.cypress.io/visit
  // observe how long the page takes to load until
  // the imported styles are applied
  // get the window object
  // using cy.window or the yielded window
  // from the cy.visit command
  // it should have an object "performance"
  // with object "timing" inside
  // https://on.cypress.io/its
  //
  // log the timing object to the DevTools console
  //
  // and compute the difference between
  // the "DOM content loaded end" and "Navigation start"
  // properties. It should be between 1 and 1.1 seconds
  cy.visit('/css-import').then((window) => {
    cy.wrap(window)
      .its('performance.timing')
      .then((timing) => {
        expect(
          timing.domContentLoadedEventEnd - timing.navigationStart
        ).to.be.within(1000, 1100)
      })
  })

  // 2nd version
  cy.window()
    .its('performance.timing')
    // .tap()
    .print()
    .then((t) => t.domContentLoadedEventEnd - t.navigationStart)
    .should('be.within', 1000, 1100)
})

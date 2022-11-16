it('checks the image load timing', () => {
  // visit the page "/tiger.html"
  // there is a tiger image on the page
  // which you can check using the cy.get command

  cy.visit('/tiger.html')

  // first, get the origin of the page
  // using https://on.cypress.io/location "origin"
  // then grab the application's window object
  // using https://on.cypress.io/window command

  // from the window object, get the "performance" object
  // https://on.cypress.io/its
  // and invoke its method "getEntriesByName"
  // https://on.cypress.io/invoke
  // with the argument origin + "/tiger.png"
  // developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByName

  // The performance.getEntriesByName method yields an array
  // with a single performance object
  // get that object and check its property "duration"
  // It should be faster than 30ms
  cy.location('origin').then((origin) =>
    cy
      .window()
      .its('performance')
      .invoke('getEntriesByName', `${origin}/tiger.png`)
      .its(0)
      .its('duration')
      .should('lte', 30)
  )
})

const measurePerf = (resource, ms) =>
  cy
    .location('origin')
    .then((origin) =>
      cy
        .window()
        .its('performance')
        .invoke('getEntriesByName', `${origin}/${resource}`)
        .its(0)
        .its('duration')
        .should('lte', ms)
    )

it('slows down the image load', () => {
  // intercept the GET /tiger request and slow it down by 2 seconds
  // (see the spec10 lesson)
  // https://on.cypress.io/intercept

  const DELAY = 1000

  // appears to work, slows things down
  // but doesn't really add the delay to the perf duration
  // cy.intercept('GET', '/tiger.html', (req) =>
  //   req.reply((res) => {
  //     // console.log(res)
  //     return res.setDelay(DELAY)
  //   })
  // ).as('tiger')

  cy.intercept('GET', '/tiger.png', (/*req*/) => Cypress.Promise.delay(DELAY))

  // visit the page "/tiger.html"
  // https://on.cypress.io/visit
  // get the location and form the resource URL
  // origin + "/tiger.png" and get the performance measurement
  // Confirm the image is loaded after 2 seconds
  cy.visit('/tiger.html')

  measurePerf('tiger.png', DELAY + 30)
})

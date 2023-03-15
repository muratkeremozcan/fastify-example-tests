// https://cypress.tips/courses/network-testing/lessons/bonus84

it('downloads a base64 embedded image', () => {
  // visit the "head.html" page
  // https://on.cypress.io/visit
  cy.visit('/head.html')
  // get the image element (the only IMG tag on the page)
  // https://on.cypress.io/get
  cy.get('img')
    // get its "src" attribute value
    // https://on.cypress.io/invoke
    .invoke('attr', 'src')
    .then((s) => {
      // confirm the image source string
      // is really the base64 encoded PNG image
      // Tip: you can use manual errors to avoid dumping
      // the very long string into the command log
      // if (!predicate) { throw new Error(...) }
      if (!s.startsWith('data:image/png;base64,')) {
        throw new Error('Expected PNG base64 image source')
      }
      // remove the base64 data source prefix from the source value
      // and save it as file "my-bunny.png"
      // https://on.cypress.io/writefile
      // the saved file should be a PNG image
      const commaAt = s.indexOf(',')
      const base64 = s.slice(commaAt)
      cy.writeFile('my-bunny.png', base64, 'base64')
    })
})

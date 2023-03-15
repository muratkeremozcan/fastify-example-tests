// https://cypress.tips/courses/network-testing/lessons/bonus87

it('sends a plain text fixture', () => {
  // read the fixture file "tale.txt"
  // https://on.cypress.file/fixture
  // trim the loaded string
  // https://on.cypress.io/invoke
  // pass the text value into the next cy.then callback
  // https://on.cypress.io/then
  cy.fixture('tale.txt')
    .invoke('trim')
    .then((text) => {
      console.log(text)
      // make a POST request to /submit-text
      // with the loaded text
      // https://on.cypress.io/request
      // Tip: you might need to ser the content type header
      //
      // grab the response body
      // https://on.cypress.io/its
      //
      // and write it to the current empty document
      // https://on.cypress.io/document
      // https://on.cypress.io/invoke
      cy.request({
        method: 'POST',
        url: '/submit-text',
        body: text,
        headers: {
          'Content-Type': 'text/plain'
        }
      })
        .its('body')
        .then((html) => cy.document().invoke('write', html))

      // confirm the server sent back the same text
      // https://on.cypress.io/contains
      cy.contains(text)
    })
})

it('sends a plain text file', () => {
  // read the fixture file "tale.txt" using cy.readFile command
  // https://on.cypress.file/readfile
  cy.readFile('cypress/fixtures/tale.txt')
    // trim the loaded string
    // https://on.cypress.io/invoke
    .invoke('trim')
    // pass the text value into the next cy.then callback
    // https://on.cypress.io/then
    .then((text) => {
      // make a POST request to /submit-text
      // with the loaded text
      // https://on.cypress.io/request
      // Tip: you might need to ser the content type header
      cy.request({
        method: 'POST',
        url: '/submit-text',
        headers: { 'content-type': 'text/plain' },
        body: text
      })
        // grab the response body
        // https://on.cypress.io/its
        .its('body')
        .then((html) => {
          // and write it to the current empty document
          // https://on.cypress.io/document
          // https://on.cypress.io/invoke
          // Question: how do you clear the document
          // if the previous test left its HTML there?
          cy.document().invoke('open')
          cy.document().invoke({ log: false }, 'write', html)
        })
      // confirm the server sent back the same text
      // https://on.cypress.io/contains
      cy.contains('pre', text)
    })
})

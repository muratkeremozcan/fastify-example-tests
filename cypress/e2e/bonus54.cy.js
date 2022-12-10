it('uploads a JSON file using a form', () => {
  // visit the page "/upload-json-file.html"
  // https://on.cypress.io/visit
  cy.visit('/upload-json-file.html')

  // find the file input element with the name "json-file"
  // and select the JSON fixture file "apple.json"
  // https://on.cypress.io/selectfile
  cy.get('input[name="json-file"]').selectFile('./cypress/fixtures/apple.json')
  // find the button with the text "Submit"
  // and click it
  // https://on.cypress.io/contains
  // https://on.cypress.io/click
  cy.contains('button', 'Submit').click()
  //
  // confirm the URL changes to /upload-json-file
  cy.location('pathname').should('eq', '/upload-json-file')
  //
  // confirm the server has received out JSON file
  // by checking the response HTML elements:
  // the page heading, the filename, the JSON output
  // Tip: you probably will need to load the fixture "apple.json"
  cy.fixture('apple.json').then((appleJson) => {
    cy.contains('h2', 'Uploaded JSON file')
    cy.contains('p', appleJson)
    cy.get('pre').should('contain', appleJson.fruit)
  })
})

it('uploads a JSON file using a cy.request', () => {
  // create a new instance of FormData
  const formData = new FormData()
  //
  // load the fixture "apple.json"
  // https://on.cypress.io/fixture
  // convert it to JSON and create a Blob
  // using Cypress.Blob.createBlob method
  // Tip: the 2nd argument should be "application/json"
  cy.fixture('apple.json', 'application/json')
    .then((appleJson) => {
      console.log(appleJson)
      return Cypress.Blob.binaryStringToBlob(appleJson, 'application/json')
    })
    .then((blob) => {
      // set the blob in the form under the form field name
      // Tip: don't forget to give the filename
      console.log(blob)
      formData.set('form', blob, 'apple.json')
    })
    .then(() => {
      console.log(formData)
    })
  //
  //
  // post the form to "/upload-json-file" endpoint
  // https://on.cypress.io/request
  cy.request({
    method: 'POST',
    url: '/upload-json-file',
    body: formData
  })
  //
  // grab the response body
  // https://on.cypress.io/its
  //
  // and convert it from ArrayBuffer to Buffer
  //
  // convert the buffer to a string
  // https://on.cypress.io/invoke
  //
  // and write the string to the current HTML document
  // https://on.cypress.io/document
  //
  // confirm the server has received out JSON file
  // by checking the response HTML elements:
  // the page heading, the filename, the JSON output
})

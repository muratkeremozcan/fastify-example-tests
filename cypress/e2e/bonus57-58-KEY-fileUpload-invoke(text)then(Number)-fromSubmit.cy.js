// cypress/integration/bonus57.js

it(
  'selects two files with contents',
  { viewportHeight: 600, viewportWidth: 1000 },
  () => {
    cy.visit('/drag-and-drop')
    // find the element with id "fileselect"
    // and select two files using "cy.selectFile"
    // https://on.cypress.io/selectfile
    // Pass two objects to simulate two files
    // 1: fileName "first.json" with contents { fruit: 'melon' }
    // 2: fileName "second.json" with contents [{ age: 1 }, { age: 2 }]
    cy.get('#fileselect').selectFile(
      ['./cypress/fixtures/first.json', './cypress/fixtures/second.json']
      // { action: 'drag-drop' } // default is select
    )
    // we can also fake the files (57)
    // cy.get('#fileselect').selectFile([
    //   {
    //     fileName: 'first.json',
    //     contents: { fruit: 'melon' }
    //   },
    //   {
    //     fileName: 'second.json',
    //     contents: [{ age: 1 }, { age: 2 }]
    //   }
    // ])

    // confirm there are two file info records
    // and the first record has the following elements
    // name: second.json
    // type: application/json
    // size: between 10 and 30 bytes
    // https://on.cypress.io/get
    // https://on.cypress.io/first
    // https://on.cypress.io/within
    cy.get('[data-cy=file-info]')
      .should('have.length', 2)
      .first()
      .within(() => {
        cy.contains('[data-cy=filename]', 'second.json')
        cy.contains('[data-cy=type]', 'application/json')
        cy.get('[data-cy=size]')
          .invoke('text')
          .then(Number)
          .should('be.within', 10, 30)
      })
    //
    // submit the upload form
    // https://on.cypress.io/submit
    cy.get('form').submit()
    //
    // confirm the uploaded files page URL
    // https://on.cypress.io/location
    cy.location('pathname').should('eq', '/upload-files')
    //
    // validate the displayed page
    // - the heading
    // - two JSON files
    // you can validate the contents of the files
    cy.contains('h2', 'Uploaded 2 JSON files')
    cy.get('[data-cy="file"]')
      .should('have.length', 2)
      .first()
      .contains('[data-cy=filename]', 'first.json')
    cy.get('[data-cy="file"]')
      .eq(1)
      .contains('[data-cy=filename]', 'second.json')
  }
)

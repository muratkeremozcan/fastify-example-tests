it('loads 3 fruits', () => {
  // visit the page /fruits-sse.html
  //
  // the fruits appear one by one
  // confirm the list of fruits contains 1 item
  // confirm the list of fruits contains 2 items
  // confirm the list of fruits contains 3 items
  cy.visit('/fruits-sse.html')
  cy.get('#fruits > ').should('have.length', 1)
  cy.get('#fruits > ').should('have.length', 2)
  cy.get('#fruits > ').should('have.length', 3)
})

it.skip('cannot spy on SSE directly', () => {
  // unskip this test to confirm that cy.intercept
  // breaks the SSE connection as it tries to spy on it
  // The page "/fruits-sse.html" connects to /fruits-sse
  // endpoint. If you try to spy on it using the cy.intercept
  // command, the events are NOT sent by the server
  //
  // visit the page /fruits-sse.html

  cy.intercept('GET', '/fruits-sse').as('sse')
  cy.visit('/fruits-sse.html')
})

it('stubs SSE', () => {
  // the SSE events sent by the server use a special
  // text format, as describe in the Mozilla docs
  // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  // Intercept the GET /fruits-sse endpoint and reply with
  // a stubbed text response mimicking the real response
  // headers: content-type: text/event-stream
  // body: text like this
  /*
    retry: 60000

    id: 0
    data: {"fruit":"Kiwi"}

    id: 1
    data: {"fruit":"Lemons"}

    id: 2
    data: {"fruit":"Mango"}

    event: end
    data: Stream closed
  */
  // important: the text should not have
  // leading or trailing whitespace
  // and the blank lines are important
  // give the above intercept the alias "sse"

  cy.intercept('GET', '/fruits-sse', (req) => {
    req.reply({
      headers: {
        'Content-Type': 'text/event-stream'
      },
      body:
        // important: the text should not have
        // leading or trailing whitespace
        // and the blank lines are important
        'retry: 60000\n\n' +
        'id: 0\n' +
        'data: {"fruit":"Kiwi"}\n\n' +
        'id: 1\n' +
        'data: {"fruit":"Lemons"}\n\n' +
        'id: 2\n' +
        'data: {"fruit":"Mango"}\n\n' +
        'event: end\n' +
        'data: Stream closed\n'
    })
  }).as('sse')

  // visit the page /fruits-sse.html
  //
  // confirm there are 3 fruits on the page
  // and the first one has the text "Kiwi"
  //
  // confirm the network alias "sse" was used
  cy.visit('/fruits-sse.html')
  cy.get('#fruits >')
    .should('have.length', 3)
    .first()
    .should('have.text', 'Kiwi')
  // confirm the network alias "sse" was used
  cy.wait('@sse')
})

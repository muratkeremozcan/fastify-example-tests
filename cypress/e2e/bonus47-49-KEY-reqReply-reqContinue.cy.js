it('intercepts the returned JSONP response', () => {
  // intercept the GET requests to "/api-jsonp" endpoint
  // that looks like /api-jsonp?callback=...
  // https://on.cypress.io/intercept
  // let the request continue going to the server
  // and print the response body to show it is a string
  // show the response from the server
  // which is something like "callbackName(list)"
  // give the call an alias "jsonp"
  //
  cy.intercept('GET', '/api-jsonp*', (req) => {
    req.continue((res) => {
      console.log({ req, res })
    })
  }).as('jsonp')
  // visit the "/jsonp.html" page
  // and confirm the call "jsonp" has happened
  cy.visit('/jsonp.html')
  cy.wait('@jsonp')
    .its('response.body')
    .then((body) => {
      expect(body).to.contain('name')
      // expect(body).to.contain('')
    })
  //
  // confirm there are two items shown in the list of names
  cy.get('#names li').should('have.length', 2)
})

it('stubs the server response', () => {
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api-jsonp'
    },
    (req) => {
      console.log({ req })
      // look at the request object
      // grab the callback name from the request query object
      const callbackName = req.query.callback
      // if there is no callback name, throw an error
      if (!callbackName) {
        console.log(req.query)
        throw new Error('No callback name found in the request query object')
      }
      // reply with a JavaScript snippet
      // that calls the function name set by the user
      // and includes the JSON object testData
      // Tip: make sure to set the appropriate "content-type" header
      const testData = [
        {
          name: 'Cy'
        }
      ]
      req.reply({
        headers: {
          'content-type': 'application/x-javascript; charset=utf-8'
        },
        body: callbackName + '(' + JSON.stringify(testData) + ')'
      })
    }
  ).as('jsonp')
  cy.visit('/jsonp.html')
  cy.wait('@jsonp')
    .its('response.body')
    .then((body) => {
      expect(body).to.contain('name')
    })

  cy.get('#names li').should('have.length', 1)
})

// KEY: change the data & stub the response after req.continue
it('replaces the first item in the JSONP response', () => {
  // intercept the GET requests to "/api-jsonp" endpoint
  // that looks like /api-jsonp?callback=...
  // https://on.cypress.io/intercept
  cy.intercept(
    {
      method: 'GET',
      pathname: '/api-jsonp'
    },
    (req) => {
      // let the request continue going to the server
      // and print the response body to show it is a string
      req.continue((res) => {
        // show the response from the server
        // which is something like "callbackName(list)"
        console.log(res.body)
        // remove the "callbackName(" + ")" from the response
        // to get just the stringified data sent by the server
        const from = res.body.indexOf('(')
        const to = res.body.indexOf(')', from)
        const text = res.body.substring(from + 1, to)
        // parse the response body to get the data JSON
        const data = JSON.parse(text)
        // confirm the server sent an array
        expect(data, 'server sends an array').to.be.an('array')
        // replace the first item in the list with "name: Cy" item
        data[0] = { name: 'Cy' }
        // construct the updated response and set "res.body"
        const callbackName = req.query.callback
        res.body = callbackName + '(' + JSON.stringify(data) + ')'
      })
    }
  ).as('jsonp')

  cy.visit('/jsonp.html')
  cy.wait('@jsonp')
    .its('response.body')
    .then((body) => {
      expect(body).to.contain('name')
      // expect(body).to.contain('')
    })
  //
  // confirm there are two items shown in the list of names
  cy.get('#names li').should('have.length', 2)
})

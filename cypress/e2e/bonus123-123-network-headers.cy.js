it('sends the Origin request header', () => {
  // spy on the "/tiger.png" image and give it an alias "img"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/tiger.png').as('img')
  cy.visit('/origin.html')
  // wait for the image to load
  // and get its request headers
  cy.wait('@img')
    .its('request.headers')
    .then((headers) => {
      // confirm the "Origin" header is set to the base url
      // and the "Host" header is set to the base url's host
      // Tip: use the URL constructor to get the host from the base url
      const baseUrl = Cypress.config('baseUrl')
      expect(headers).to.have.property('origin', baseUrl)
      const url = new URL(baseUrl)
      expect(headers).to.have.property('host', url.host)
    })
})

it('sends custom headers', () => {
  // make your own HTTP "GET" request
  // to the endpoint "/headers"
  // with custom headers
  // 'x-custom-header': 'foo'
  // 'Some-OtherKey': 'Some-OtherValue',
  // 'Age-Limit': 90
  cy.request({
    method: 'GET',
    url: '/headers',
    headers: {
      'x-custom-header': 'foo',
      'Some-OtherKey': 'Some-OtherValue',
      'Age-Limit': 90
    }
  })
    // the server should respond with a JSON object
    // that has the headers sent.
    // Confirm the 3 sent headers are in the response,
    // and ignore the rest of the headers
    // Tip: headers are lowercased and stringified
    .its('body')
    .should('deep.include', {
      'x-custom-header': 'foo',
      'some-otherkey': 'Some-OtherValue',
      'age-limit': '90'
    })
})

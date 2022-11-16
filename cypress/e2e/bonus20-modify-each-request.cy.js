// here is another Cypress tip for working with mobile testing

beforeEach(() => {
  // we want to trick our backend into serving the mobile version of the page
  // The server inspects the user agent request header to decide
  // if it should serve the mobile version
  // Set up cy.intercept to add to every request the header
  // "user-agent: my Mobile phone"
  // Tip: use the "middleware: true" option to ensure
  // the request is intercepted first

  cy.intercept(
    {
      method: 'GET',
      path: '**',
      middleware: true
    },
    (req) => {
      req.headers['user-agent'] = 'my Mobile phone'
      console.log(req)
    }
  ).as('modifier')
})

it(
  'adds x- header to every request',
  { viewportWidth: 500, viewportHeight: 700 },
  () => {
    // observe the individual requests using
    // https://on.cypress.io/intercept
    // and give them aliases
    // 1: the document itself as "doc"
    // 2: the GET /style-mobile.css as "css"
    // 3: the GET /fruit as "fruit"

    cy.intercept('GET', '/').as('doc')
    cy.intercept('GET', '/style-mobile.css').as('css')
    cy.intercept('GET', '/fruit').as('fruit')
    //
    // visit the site. Do you see the mobile stylesheet?
    // the font should be giant, and the H1 should
    // have the word "Mobile" in it

    cy.visit('/')
    cy.contains('h1', /mobile/i)

    // confirm that every outgoing request had the "user-agent" header set
    // and it includes the word "Mobile"
    cy.wrap(['@doc', '@css', '@fruit']).each((alias) => {
      cy.wait(alias)
        .its('request.headers.user-agent')
        .should('contain', 'Mobile')
      console.log(alias)
    })
  }
)

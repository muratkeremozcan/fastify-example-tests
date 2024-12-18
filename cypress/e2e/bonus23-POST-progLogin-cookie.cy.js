import spok from 'cy-spok'
it('logs in using POST request', function () {
  // log in using https://on.cypress.io/request command
  // endpoint POST /login
  // options { username: "gleb", password: "network-course" }
  //
  // from the request response, grab the
  // headers and its parsed "set-cookie" property
  // and confirm it is an array and is non-empty
  //
  // grab the cookie "userName" using
  // https://on.cypress.io/getcookie
  // confirm the object has the following properties
  // domain: "localhost"
  // path: "/"
  // name: "userName"
  // httpOnly: true
  // secure: false (because of http localhost)
  // for http localhost, the cookie is "secure: false"
  //
  // note we cannot confirm the value because the cookie
  // is encoded and has a random value at the end
  // so we should simply confirm the cookie has
  // the property "value"
  //
  // visit the page / using cy.visit
  //
  // confirm the H1 element includes the user name "gleb"

  const cookieName = 'userName'
  const userName = 'gleb'
  cy.request({
    method: 'POST',
    url: '/login',
    body: { username: userName, password: 'network-course' }
  })
    .its('headers')
    .its('set-cookie')
    .should('be.an', 'array')
    .and('have.length.gt', 0)
    .its(0)
    .then((cookie) => {
      cy.wrap(cookie).should('contain', cookieName)
      console.log(cookie)
    })
    .as('requestCookie')

  cy.getCookie(cookieName)
    .should(
      spok({
        domain: 'localhost',
        path: '/',
        name: cookieName,
        httpOnly: true,
        secure: false
      })
    )
    .should('have.property', 'value')

  cy.visit('/')

  cy.contains('h1', userName)
})

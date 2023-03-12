// For each test, can you collect all network calls made by the application
// using method "POST" and content type JSON?
// For each network call, can you save the method, the URL (without the base Url part),
// the status code, and the request and response bodies?
// Can you write these calls into a JSON file "network-calls.json"?
let calls = []

beforeEach(() => {
  const baseUrl = Cypress.config('baseUrl') || ''
  calls.length = 0
  cy.intercept(
    {
      middleware: true,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    },
    (req) => {
      req.continue((res) => {
        calls.push({
          method: req.method,
          url: req.url.replace(baseUrl, ''),
          body: JSON.stringify(req.body),
          status: res.statusCode,
          response: JSON.stringify(res.body)
        })
      })
    }
  )
})

afterEach(() => {
  console.table(calls)
  cy.writeFile('network-calls.json', calls)
})

// save network calls to a JSON file
it('saves all network calls into a file after the test', () => {
  // visit the "calculator.html" page
  // https://on.cypress.io/visit
  // which can fire several /track Ajax calls
  cy.visit('/calculator.html')
  // enter numbers 20 and 6 and calculate their sum
  cy.get('#num1').type('20')
  cy.get('#num2').type('6')
  cy.get('#add').click()
  // confirm the call as made by looking at the page
  // and finding the displayed answer 26
  // https://on.cypress.io/contains
  cy.contains('#answer', '26')
})

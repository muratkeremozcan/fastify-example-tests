// https://cypress.tips/courses/network-testing/lessons/bonus73

// let's keep all defined intercepts for the test in this object
// it will have (key, value) like (intercept parameters, count)
const intercepts = new Map()
// before each test we will clear our counters
beforeEach(() => {
  intercepts.clear()
})

// overwrite the cy.intercept command
// assume it will be called with "method /url" parameters
// insert a new counter 0 into the "intercepts" object
// spy on the intercept call and every time it is called,
// increment the intercept's counter by 1
Cypress.Commands.overwrite('intercept', (intercept, method, url) => {
  const key = `${method} ${url}`
  intercepts.set(key, 0)
  return intercept(method, url, () => {
    intercepts.set(key, intercepts.get(key) + 1)
  })
})

// modify this test to spy on several network calls
// and add some intercepts for non-existent calls
it('uses every defined intercept', () => {
  // cy.intercept('GET', '/analytics').as('analytics') // never gets called, enable to see the error
  cy.intercept('POST', '/track').as('track')
  cy.visit('/calculator.html')
  cy.intercept('POST', '/calculate').as('calculate')
  cy.get('#num1').type('10')
  cy.get('#num2').type('5')
  cy.get('#add').click()
  cy.contains('#answer', '15')
})

// fill this hook to check the "intercepts" object
// every intercept should be called at least once
// throw an error if you find any intercepts that were unused
afterEach(() => {
  const unused = []
  for (const [key, count] of intercepts) {
    console.log(`%s used %d time(s)`, key, count)
    if (count === 0) {
      unused.push(key)
    }
  }
  intercepts.clear()
  expect(unused, 'unused intercepts').to.be.empty
})

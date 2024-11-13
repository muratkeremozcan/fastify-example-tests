// it doesn't work, and I don't get why I would do this
// https://cypress.tips/courses/network-testing/lessons/bonus104

// in this test use the base url "http://calculator.com:4200"
// tip: you will need to set up "hosts" mapping in the cypress.config.js file
// to point "calculator.com" at your local web server
it('visits the calculator.com', () => {
  // { baseUrl: 'http://calculator.com:4200' },
  // visit the calculator.html page
  cy.visit('/calculator.html')
  // confirm the we are testing domain "calculator.com"
  // cy.location('hostname').should('equal', 'calculator.com')
  // spy on the "POST /calculate" call and give it an alias "calculate"
  cy.intercept('POST', '/calculate').as('calculate')
  // enter two numbers and confirm their sum is shown
  cy.get('#num1').type('5')
  cy.get('#num2').type('5')
  cy.contains('button', '+').click()
  cy.contains('#answer', '10')
  // confirm the network call "@calculate"
  // returns the correct answer
  cy.wait('@calculate')
    .its('response.body')
    .should('deep.include', { answer: 10 })
})

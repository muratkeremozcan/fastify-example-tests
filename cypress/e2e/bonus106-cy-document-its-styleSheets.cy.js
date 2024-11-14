it('loads and applies CSS resources', () => {
  // intercept the calculator.css network request
  // and give it an alias "css"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '/calculator.css').as('css')
  // visit the calculator page
  cy.visit('/calculator.html')
  // confirm the CSS intercept loads successfully
  // by checking its response status code to be 200 or 304
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // https://on.cypress.io/should
  cy.wait('@css').its('response.statusCode').should('be.oneOf', [200, 304])

  // confirm the document has a stylesheet loaded
  // from the ".../calculator.css" resource
  const isCalculatorCss = (style) => style.href.endsWith('calculator.css')
  // https://on.cypress.io/document
  // https://on.cypress.io/its
  // https://on.cypress.io/should
  cy.document()
    .its('styleSheets')
    .should((styles) => {
      const calculatorCss = Cypress._.find(styles, isCalculatorCss)
      expect(calculatorCss, 'calculator.css stylesheet').to.be.ok
    })

  // confirm some style from the calculator.css is applied
  // use the "have.css" assertion. For example, check the #answer
  // element and its text align CSS property.
  cy.get('#answer').should('have.css', 'textAlign', 'center')
})

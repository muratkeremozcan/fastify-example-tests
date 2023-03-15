// https://cypress.tips/courses/network-testing/lessons/bonus86

it('maybe waits for an intercept', () => {
  // wrap a simple value to have other types of aliased values
  // and not just a network intercept alias
  cy.wrap(42).as('answer')
  // sometimes the test has a cy.intercept aliased
  // and sometimes it does not
  if (Cypress._.random() < 0.5) {
    cy.log('**spying on /fruit**')
    cy.intercept('GET', '/fruit').as('fruit')
  } else {
    cy.log('**no intercepts**')
  }
  // visit the homepage "/", which makes an Ajax call "GET /fruit"
  cy.visit('/')
  // how to wait for "@fruit" intercept IF it was registered?
  // something like this with "intercept" being undefined if there is no alias
  // cy.waitMaybe('@fruit').then(intercept => { ... })
  //
  // Tip:
  // Look at the internal state of Cypress: cy.state('aliases') and cy.state('routes')
  // Are there alternatives to using the Cypress internal state?
  Cypress.Commands.add('waitMaybe', (alias) => {
    if (alias[0] !== '@') {
      throw new Error('Alias should start with @')
    }
    Cypress.log({ name: 'waitMaybe', message: alias })
    alias = alias.slice(1) // remove leading @
    const intercept = Cypress._.findKey(cy.state('routes'), (key, value) => {
      return key.alias === alias
    })
    if (intercept) {
      return cy.wait('@' + alias)
    }
  })
  // use the custom command to wait for the "@fruit"
  // and confirm the response (if there was an intercept) is ok
  cy.waitMaybe('@fruit').then((intercept) => {
    if (!intercept) {
      cy.log('no intercept found')
      return
    }
    expect(intercept.response, 'response is ok').to.have.property(
      'statusCode',
      200
    )
  })
})

// Solution 2:
// custom commands to avoid relying on Cypress internal state
beforeEach(function clearAliases() {
  // make sure each test starts with clean slate
  Cypress.env('aliases', {})
})

it('maybe waits for an intercept (without using internal state)', () => {
  // one command replaces "cy.intercept(method, url).as('alias')"
  // to save the network calls we can spy on
  Cypress.Commands.add(
    'network',
    { prevSubject: false },
    (method, pattern, alias) => {
      Cypress.log({
        name: 'network',
        message: `${method} ${pattern} ${alias}`
      })
      // save the alias exists flag
      const aliases = Cypress.env('aliases') || {}
      aliases['@' + alias] = true
      Cypress.env('aliases', aliases)
      cy.intercept(method, pattern).as(alias)
    }
  )

  // a custom command to wait on a network alias
  // IF it was defined. Yields undefined or the intercept
  Cypress.Commands.add('waitMaybe', (alias) => {
    if (alias[0] !== '@') {
      throw new Error('Alias should start with @')
    }
    Cypress.log({ name: 'waitMaybe', message: alias })
    const aliases = Cypress.env('aliases') || {}
    if (aliases[alias]) {
      return cy.wait(alias)
    }
  })

  // wrap a simple value to have other types of aliased values
  // and not just a network intercept alias
  cy.wrap(42).as('answer')
  // sometimes the test has a cy.intercept aliased
  // and sometimes it does not
  if (Cypress._.random() < 0.5) {
    cy.log('**spying on /fruit**')
    // use your custom command to define
    // intercept "GET /fruit" and give it alias "fruit"
    cy.network('GET', '/fruit', 'fruit')
  } else {
    cy.log('**no intercepts**')
  }
  // visit the homepage "/", which makes an Ajax call "GET /fruit"
  cy.visit('/')
  // how to wait for "@fruit" intercept IF it was registered?
  // something like this with "intercept" being undefined if there is no alias
  // cy.waitMaybe('@fruit').then(intercept => { ... })

  // use the custom command to wait for the "@fruit"
  // and confirm the response (if there was an intercept) is ok
  cy.waitMaybe('@fruit').then((intercept) => {
    if (!intercept) {
      cy.log('no intercept found')
      return
    }
    expect(intercept.response, 'response is ok').to.have.property(
      'statusCode',
      200
    )
  })
})

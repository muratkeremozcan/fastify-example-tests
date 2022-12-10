it('alerts the user twice', () => {
  // visit the page "/jquery-example"
  // https://on.cypress.io/visit

  cy.visit('/jquery-example', {
    onBeforeLoad(win) {
      cy.stub(win, 'alert').as('alert')
    }
  })

  // before the application loads, stub the "alert"
  // and give it an alias "alert"
  // https://on.cypress.io/stub

  // find the button with text "Warn" and click on it
  // https://on.cypress.io/contains
  // https://on.cypress.io/click
  cy.contains('button', 'Warn').click()

  // get the alert stub and confirm it was called twice
  // https://on.cypress.io/get
  // https://on.cypress.io/stubs-spies-and-clocks
  cy.get('@alert').should('have.been.calledTwice')
})

it('loads the jquery plugin and alerts the user', () => {
  // spy on the network calls to load "jquery.warning.js" resource
  // and give the intercept alias "plugin"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  cy.intercept('GET', '**/jquery.warning.js*').as('plugin')

  cy.visit('/jquery-example', {
    onBeforeLoad(win) {
      cy.stub(win, 'alert').as('alert')
    }
  })

  // wait for the plugin network call to complete
  // https://on.cypress.io/wait
  cy.wait('@plugin')

  cy.contains('button', 'Warn').click()
  cy.get('@alert').should('have.been.calledTwice')
})

it('delays the jquery plugin and fails', () => {
  // spy on the network calls to load "jquery.warning.js" resource
  // and delay it by 1 second
  // and give the intercept alias "plugin"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  // Tip: see "Spec 10" on how to delay a network call
  cy.intercept(
    {
      method: 'GET',
      url: '**jquery.warning.js*'
    },
    () => Cypress.Promise.delay(1000)
  ).as('plugin')

  // visit the page "/jquery-example"
  // https://on.cypress.io/visit
  // before the application loads, stub the "alert"
  // and give it an alias "alert"
  // https://on.cypress.io/stub
  // https://on.cypress.io/as
  cy.visit('/jquery-example', {
    onBeforeLoad(win) {
      cy.stub(win, 'alert').as('alert')
    }
  })

  // because the application will throw an error
  // we want to confirm it is the expected error
  // with the message that includes text
  // '$(...).warning is not a function'
  // Tip: use "uncaught:exception" callback
  // to allow only this error
  // https://on.cypress.io/catalog-of-events
  cy.on('uncaught:exception', (e) => {
    return !e.message.includes('$(...).warning is not a function')
  })
  // I usually just...
  // Cypress.on('uncaught:exception', () => false)

  // find the button with text "Warn" and click on it
  // https://on.cypress.io/contains
  // https://on.cypress.io/click
  cy.contains('button', 'Warn').click()

  // get the alert stub and confirm it was never called
  // https://on.cypress.io/get
  // https://on.cypress.io/stubs-spies-and-clocks
  cy.get('@alert').should('not.have.been.called')

  // wait for the plugin network call to complete
  // to finish the test completely
  // https://on.cypress.io/wait
  cy.wait('@plugin')
})

it('waits for the plugin to add itself to jQuery', () => {
  // spy on the network calls to load "jquery.warning.js" resource
  // and delay it by 1 second
  // and give the intercept alias "plugin"
  // https://on.cypress.io/intercept
  // https://on.cypress.io/as
  // Tip: see "Spec 10" on how to delay a network call
  cy.intercept(
    {
      method: 'GET',
      pathname: 'jquery.warning.js'
    },
    () => Cypress.Promise.delay(1000)
  ).as('plugin')

  // visit the page "/jquery-example"
  // https://on.cypress.io/visit
  // before the application loads, stub the "alert"
  // and give it an alias "alert"
  // https://on.cypress.io/stub
  // https://on.cypress.io/as
  //
  // cy.visit yields the "window" object
  // use cy.its to wait until the window object
  // gets its "jQuery.fn.warning" nested property
  // https://on.cypress.io/its
  cy.visit('/jquery-example', {
    onBeforeLoad(win) {
      cy.stub(win, 'alert').as('alert')
    }
  })
    .its('jQuery.fn.warning')
    .should('exist')

  // find the button with text "Warn" and click on it
  // https://on.cypress.io/contains
  // https://on.cypress.io/click
  cy.contains('button', 'Warn').click()

  // get the alert stub and confirm it was called twice
  // https://on.cypress.io/get
  // https://on.cypress.io/stubs-spies-and-clocks
  cy.get('@alert').should('have.been.calledTwice')
})

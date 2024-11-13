it('shows network status refactored', () => {
  // prepare the "navigator.onLine" property stub
  // visit the offline page
  // and grab the navigator property
  // from the subject yielded by cy.visit command
  // https://on.cypress.io/visit
  // https://on.cypress.io/its
  // https://on.cypress.io/then
  cy.visit('/offline.html')
    .its('navigator')
    .then((navigator) => {
      // stub the navigator onLine property
      // and give the stub an alias "status"
      cy.stub(navigator, 'onLine').as('status')
    })

  // confirm the network status is showing "online"
  cy.contains('#network-status', 'online')
    // wait a second for demo purpose
    .wait(1000)

  // set the alias "status" to value false
  cy.get('@status').invoke('value', false)
  // dispatch the "offline" event to the application's window
  // https://on.cypress.io/window
  // https://on.cypress.io/trigger
  cy.window().trigger('offline')
  // confirm the network status is showing "offline"
  cy.contains('#network-status', 'offline')
    // wait a second for demo purpose
    .wait(1000)
  // set the alias "status" to value true
  cy.get('@status').invoke('value', true)
  // dispatch the "online" event to the application's window
  // https://on.cypress.io/window
  // https://on.cypress.io/trigger
  cy.window().trigger('online')
  // confirm the network status is showing "online"
  cy.contains('#network-status', 'online')
})

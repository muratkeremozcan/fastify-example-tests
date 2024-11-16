// keep information about each network calls
// in this array
const apiCalls = []

it('detects slow API requests', () => {
  // spy on all network calls made by the application
  // (you can also limit the spy to the calls you are interested in)
  // save in a local variable the starting timestamp and call information
  // like protocol and url
  // when the server returns a response, save the object
  // with the full info in the apiCalls array
  // Note: the info object should have the duration in ms that you
  // can compute from timestamps
  cy.intercept('*', (req) => {
    const callInfo = {
      method: req.method,
      url: req.url,
      started: +new Date()
    }
    req.continue(() => {
      callInfo.finished = +new Date()
      callInfo.duration = callInfo.finished - callInfo.started
    })
    apiCalls.push(callInfo)
  }).as('apiCalls')

  // make API requests without using cy.request command
  // but by using the application's window's "fetch" function
  // https://on.cypress.io/window
  // the calls should go to "/delay/:ms" endpoint
  // make several requests, some shorter than 1 seconds
  // and some longer than 1 second
  cy.window()
    .its('fetch')
    .then(async (fetch) => {
      await fetch('/delay/100')
      await fetch('/delay/200')
      await fetch('/delay/500')
    })
})

afterEach(() => {
  // print the list of api calls you spied on
  // Tip: use console.table method to print them nicely
  console.table(apiCalls)
  // confirm there were no calls slower than 1000ms
  // throw an error if there were any slow calls
  apiCalls.forEach((callInfo, k) => {
    if (callInfo.duration > 1000) {
      throw new Error(
        `Call ${callInfo.method} ${callInfo.url} took too long: ${callInfo.duration}ms`
      )
    }
  })
})

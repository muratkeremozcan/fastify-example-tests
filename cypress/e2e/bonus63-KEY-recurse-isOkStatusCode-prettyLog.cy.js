import { recurse } from 'cypress-recurse'

it('logs ping requests to the terminal', () => {
  const getStatus = () =>
    cy.request({ url: 'unreliable', failOnStatusCode: false })
  const is200 = (res) => res.isOkStatusCode

  recurse(getStatus, is200, {
    timeout: 30_000,
    delay: 1000,
    // If the log option is a function, it receives the current value, plus a data object with main iteration properties
    // log (x, data) {
    // data is like:
    //  value: 3
    //  successful: false|true
    //  iteration: 3
    //  limit: 18
    //  elapsed: 1631
    //  elapsedDuration: "2 seconds"
    // }
    log(res, data) {
      // log a message into the Command Log
      // flagging if the call was successful or not,
      // and the current attempt number
      const str = `${data.successful ? '✅' : '🚫'} attempt ${
        data.iteration
      } after ${data.elapsedDuration}`
      cy.log(str)
      // Bonus: print the same message to the terminal
      // using cy.task "print" defines in the plugins file
      // https://on.cypress.io/task
      // cy.task('print', str)
    }
  })
})

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 400,
  viewportHeight: 300,

  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        print(s) {
          console.log(s)
          // Cypress tasks must return something
          // and cannot return undefined
          return null
        }
      })
    },
    baseUrl: 'http://localhost:4200'
  }
  // bonus 104 - mock domains using hosts
  // it doesn't work, and I don't get why I would do this
  // https://cypress.tips/courses/network-testing/lessons/bonus104
  // hosts: {
  //   'calculator.com': '127.0.0.1'
  // }
})

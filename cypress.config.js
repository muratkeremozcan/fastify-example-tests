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
})

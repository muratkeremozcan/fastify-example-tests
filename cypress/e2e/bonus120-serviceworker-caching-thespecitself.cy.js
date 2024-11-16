// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'

it('loads the updated test script', () => {
  cy.visit('/')
  // change the number and confirm the
  // updated test runs right away
  cy.log('3')
})

// after the tests are done
// delete the "build" cache that can cache the spec file
// https://chromedevtools.github.io/devtools-protocol/
// use the "CacheStorage" interface
// after(() => {
//   const baseUrl = Cypress.config('baseUrl')
//   cy.CDP('CacheStorage.requestCacheNames', {
//     securityOrigin: baseUrl
//   })
//     .its('caches')
//     .invoke('find', (cache) => cache.cacheName === 'build')
//     .then((buildCache) => {
//       if (buildCache) {
//         cy.CDP('CacheStorage.deleteCache', {
//           cacheId: buildCache.cacheId
//         })
//       }
//     })
// })

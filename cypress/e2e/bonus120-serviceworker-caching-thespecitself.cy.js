// https://cypress.tips/courses/network-testing/lessons/bonus120
// I don't really get 121 & 122, or when these would be used. Maybe a nextJs app to prevent the build cache

// https://github.com/bahmutov/cypress-cdp
import 'cypress-cdp'

it('loads the updated test script', () => {
  cy.visit('/')
  // change the number and confirm the
  // updated test runs right away
  cy.log('2')
})

// after the tests are done
// delete the "build" cache that can cache the spec file
// https://chromedevtools.github.io/devtools-protocol/
// use the "CacheStorage" interface
after(() => {
  const baseUrl = Cypress.config('baseUrl')
  cy.CDP('CacheStorage.requestCacheNames', {
    securityOrigin: baseUrl
  })
    .its('caches')
    .invoke('find', (cache) => cache.cacheName === 'build')
    .then((buildCache) => {
      if (buildCache) {
        cy.CDP('CacheStorage.deleteCache', {
          cacheId: buildCache.cacheId
        })
      }
    })
})

// https://cypress.tips/courses/network-testing/lessons/bonus74
import 'cypress-map'

it('takes a while to execute 4 slow cy.requests', () => {
  // the backend API endpoint /slow/:id takes 10 seconds to respond
  // thus this test takes 40 seconds.
  cy.request('POST', '/slow/1')
    .its('body')
    .should('deep.equal', { ok: true, id: '1' })

  cy.request('POST', '/slow/2')
    .its('body')
    .should('deep.equal', { ok: true, id: '2' })

  cy.request('POST', '/slow/3')
    .its('body')
    .should('deep.equal', { ok: true, id: '3' })

  cy.request('POST', '/slow/4')
    .its('body')
    .should('deep.equal', { ok: true, id: '4' })
})

it('makes 4 API calls in in serial with .each or .mapChain using cy.request', () => {
  const endPoints = ['/slow/1', '/slow/2', '/slow/3', '/slow/4']

  cy.wrap(endPoints).each((endpoint, index) =>
    cy
      .request('POST', endpoint)
      .its('body')
      .should('deep.equal', { ok: true, id: String(index + 1) })
  )
})

it('makes 4 API calls in parallel using the window.fetch', () => {
  // get the application "window" object
  // https://on.cypress.io/window
  // and grab its property "fetch"
  // https://on.cypress.io/its
  // pass the "fetch" function into the cy.then callback
  // and make a 4 parallel calls to "POST /slow/:id" endpoint
  // "fetch('/slow/...', {method: 'post'})"
  // convert the response to JSON
  // Q: how do you make cy.then wait for the all promises to resolve?
  // Q: how do you set the time limit on the cy.then callback?
  // https://on.cypress.io/then

  // by using "fetch" we will send all application cookies
  // just like a regular call would do
  //
  // pass the response objects into a callback
  // tp confirm each object is {ok: true, id: ...}
  // https://on.cypress.io/spread

  cy.window()
    .its('fetch')
    .then({ timeout: 11_000 }, (fetch) =>
      fetch('/slow/1', { method: 'post' })
        .then((res) => res.json())
        .then((r1) => expect(r1).to.deep.equal({ ok: true, id: '1' }))
    )

  cy.window()
    .its('fetch')
    .then({ timeout: 11_000 }, (fetch) =>
      Promise.all([
        fetch('/slow/1', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/2', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/3', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/4', { method: 'post' }).then((r) => r.json())
      ])
    )
    .spread((f1, f2, f3, f4) => {
      expect(f1, 'first fetch').to.deep.equal({
        ok: true,
        id: '1'
      })
      expect(f2, '2nd fetch').to.deep.equal({
        ok: true,
        id: '2'
      })
      expect(f3, '3rd fetch').to.deep.equal({
        ok: true,
        id: '3'
      })
      expect(f4, '4th fetch').to.deep.equal({
        ok: true,
        id: '4'
      })
    })
})

it('async await version', () => {
  cy.window()
    .its('fetch')
    .then({ timeout: 11_000 }, async (fetch) => {
      const r1 = await (await fetch('/slow/1', { method: 'post' })).json()
      expect(r1).to.deep.equal({ ok: true, id: '1' })
    })

  cy.window()
    .its('fetch')
    .then({ timeout: 11_000 }, async (fetch) => {
      // we can await within cy.then

      const promises = [
        fetch('/slow/1', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/2', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/3', { method: 'post' }).then((r) => r.json()),
        fetch('/slow/4', { method: 'post' }).then((r) => r.json())
      ]

      const results = await Promise.all(promises)
      return results
    })
    .spread((f1, f2, f3, f4) => {
      expect(f1, 'first fetch').to.deep.equal({
        ok: true,
        id: '1'
      })
      expect(f2, '2nd fetch').to.deep.equal({
        ok: true,
        id: '2'
      })
      expect(f3, '3rd fetch').to.deep.equal({
        ok: true,
        id: '3'
      })
      expect(f4, '4th fetch').to.deep.equal({
        ok: true,
        id: '4'
      })
    })
})

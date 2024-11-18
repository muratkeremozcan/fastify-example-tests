// https://github.com/bahmutov/cypress-map
import 'cypress-map'

it('checks the parsed URL search params', () => {
  cy.visit('/url-params.html')
  cy.location('search').should((search) => {
    // parse the search URL string into an object
    // using the URLSearchParams constructor
    // Note: the parameters are decoded automatically
    const params = new URLSearchParams(search)
    // then convert the object into a plain object
    const obj = Object.fromEntries(params.entries())
    // that object should have:
    // - callback "/my-profile-page.html"
    // - question "what is the meaning of life?"
    // - answer "42"
    // Note: all url parameters are strings
    expect(obj).to.deep.equal({
      callback: '/my-profile-page.html',
      question: 'what is the meaning of life?',
      answer: '42'
    })
  })
})

// can you rewrite the above test solution using cypress-map?
// Think about how the search string can be transformed
// into URLSearchParams instance and then into a plain object
// the entire chain of queries should retry until the
// final value is equal to the expected object
it('checks the parsed URL search params using cypress-map', () => {
  cy.visit('/url-params.html')
  cy.location('search')
    // convert the search string into URLSearchParams
    // then into a plain object
    // and convert the property "answer" into a number
    .make(URLSearchParams)
    .toPlainObject('entries')
    .map({
      answer: Number
    })
    // that object should have:
    // - callback "/my-profile-page.html"
    // - question "what is the meaning of life?"
    // - answer 42
    .should('deep.equal', {
      callback: '/my-profile-page.html',
      question: 'what is the meaning of life?',
      answer: 42
    })
})

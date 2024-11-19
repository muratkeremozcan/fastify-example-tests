/**
 * The server returns an object with a single field "fruit"
 * which can be one of several available fruits.
 */
type GetFruitResponse = {
  fruit: 'Apples' | 'Oranges' | 'Bananas' | 'Pears' | 'Grapes'
}

beforeEach(() => {
  cy.intercept('GET', '/fruit').as('getFruit')
  cy.visit('/')
})

// (+) Provides type safety early in the chain
// (-) Requires understanding of generics
it('Generic Type Parameters', () => {
  cy.wait<any, GetFruitResponse>('@getFruit')
    .its('response')
    .its('body')
    .then((body) => {
      expect(body.fruit).to.be.a('string')
    })
})

// (+) Simple and clear
// (-) Type safety only in callback, not throughout the chain (may not always work)
it('Type Annotation', () => {
  cy.wait('@getFruit')
    .its('response.body')
    .then((body: GetFruitResponse) => {
      expect(body.fruit).to.be.a('string')
    })
})

// (+) Flexible, can be used anywhere
//(-) Can lead to runtime errors if assertion is incorrect.
it('Type Assertion with as', () => {
  cy.wait('@getFruit')
    .its('response.body')
    .then((body) => {
      const typedBody = body as GetFruitResponse
      expect(typedBody.fruit).to.be.a('string')
    })
})

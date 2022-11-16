import spok from 'cy-spok'

it('requests an image and gets its dimensions', () => {
  // request the image ourselves using cy.request command
  // with the "encoding: base64" option
  cy.request({ method: 'GET', url: '/tiger.png', encoding: 'base64' })
    // from the response get the body and the headers fields
    // from the headers object, grab the "content-type" header
    // which gives us the correct mime type, like "image/png"
    .should(
      spok({
        status: 200,
        body: spok.string,
        headers: {
          'content-type': 'image/png'
        }
      })
    )
    .then(({ body, headers }) => {
      // form the image data URL with the mime type and the base64 encoded image
      // following the template `data:${mime};base64,${body}`
      // to parse the data URL and have an image element
      const mime = headers['content-type']
      const dataUrl = `data:${mime};base64,${body}`

      // use document.createElement and set the "src" attribute with the dataUrl
      const image = document.createElement('img')
      image.src = dataUrl

      // from the image element, get the naturalHeight property
      // and confirm its value is 914 pixels
      console.dir(image) // output it json-like instead of html-like, for convenience

      // alternative assertion
      cy.wrap(image).its('0.naturalHeight').should('eq', 914)
      expect(image).to.have.property('naturalHeight')

      // spok assertion
      cy.wrap(image).should(
        spok({
          naturalHeight: 914,
          naturalWidth: 1280
        })
      )
    })
})

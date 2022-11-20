const parseMultiPartRequest = (request) => {
  const { headers, body } = request
  // use "throw new Error" and not Chai assertions
  // to avoid lots of noise in the Cypress Command Log
  if (typeof body !== 'string') {
    throw new Error('Expected the form body to be a string')
  }
  const contentType = headers['content-type']

  // the browser sets the separator string when sending the form
  // something like
  // "multipart/form-data; boundary=----WebKitFormBoundaryiJZt6b3aUg8Jybg2"
  // we want to extract it and pass to the utility function
  // to convert the multipart text into an object of values
  if (!contentType.match(/^multipart\/form-data; boundary=/)) {
    throw new Error(`Invalid multipart boundary: ${contentType}`)
  }
  const boundary = contentType.split('boundary=')[1]
  const values = parseMultipartForm({ boundary, body })
  return values
}

/*
  Utility: parses (very simply) multipart body into string values.
  the decoded body string will be something like
  ------WebKitFormBoundaryYxsB3tlu9eJsoCeY
  Content-Disposition: form-data; name="city"
  Boston
  ------WebKitFormBoundaryYxsB3tlu9eJsoCeY
  Content-Disposition: form-data; name="value"
  28
  ------WebKitFormBoundaryYxsB3tlu9eJsoCeY--

  there are NPM packages for parsing such text into an object:
  - https://www.npmjs.com/package/parse-multipart
  - https://www.npmjs.com/package/multiparty
  - https://www.npmjs.com/package/busboy
  - https://www.npmjs.com/package/formidable
*/
const parseMultipartForm = ({ boundary, body }) => {
  const parts = body
    .split(`--${boundary}`)
    .map((s) => s.trim())
    .filter((s) => s.startsWith('Content-Disposition: form-data;'))

  const result = {}

  parts.forEach((part) => {
    const lines = part.split(/\r?\n/g)

    console.log('lines')
    console.log(lines)
    const key = lines[0].match(/name="(.+)"/)[1]

    result[key] = lines[2].trim()
  })

  return result
}

/**
 * Forms the text body to be submitted as a "multipart/form-data" request.
 * For a good explanation of the boundary
 * @see https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_forms_through_JavaScript
 */
function encodeMultiPart(fields) {
  const boundary = `Boundary${Cypress._.random(1e8)}`
  const contentType = `multipart/form-data; boundary=${boundary}`

  let body = ''
  Object.entries(fields).forEach(([name, value]) => {
    body += `--${boundary}\r\n`
    body += `content-disposition: form-data; name="${name}"\r\n`
    body += '\r\n'
    body += value + '\r\n'
  })
  body += `--${boundary}--`

  return { body, contentType }
}

it('spies on multipart/form-data submission', () => {
  // spy on the form submission
  // give the spy an alias "submit-form"
  cy.intercept('POST', '/submit-form').as('submit-form')

  // visit the "form.html" page
  cy.visit('/form.html')

  // enter "Boston" into the city input field
  // enter "1" into the value input field
  cy.get('input[name=city]').type('Boston')
  cy.get('input[name=value]').type('1')
  // click on the submit button
  cy.contains('button', 'Submit').click()
  // the browser should navigate to /submit-form page
  cy.location('pathname').should('equal', '/submit-form')

  // the page should show "Thank you for the your submission"
  // and the submitted values
  cy.contains('Thank you for your submission')
  cy.contains('[data-city]', 'Boston')
  cy.contains('[data-value]', '1')

  // wait for the network intercept
  // get its request property
  // and transform it into an object of values
  // using parseMultiPartRequest callback
  // Verify the submitted values
  cy.wait('@submit-form')
    .its('request')
    .then(parseMultiPartRequest)
    .should('deep.equal', {
      city: 'Boston',
      value: '1'
    })
})

// this test is similar to bonus41, but instead of spying
// on the call made by the browser, we make the same
// form submission ourselves using the cy.request command
it('makes a multipart/form-data cy.request', () => {
  // form values we want to submit
  // without going through the form on the page
  const fields = {
    city: 'New York City',
    value: 101
  }

  // encode the input fields into the body to be sent
  // need both the body and the content type header
  // using the helper function "encodeMultiPart"
  const { body, contentType } = encodeMultiPart(fields)
  // make a POST request using https://on.cypress.io/request
  // to the endpoint "/submit-form"
  // with the right content type header
  // and the multipart body text
  cy.request({
    method: 'POST',
    url: '/submit-form',
    headers: {
      'content-type': contentType
    },
    body
  })
    // from the response, grab the HTML body string
    // https://on.cypress.io/its
    // then get the application's document object
    // https://on.cypress.io/document
    // because it is empty, we can write the HTML we got
    // into the document using document.write method
    // https://on.cypress.io/invoke
    .its('body')
    .then((html) => {
      cy.document().invoke('write', html)
    })

  // the page should show "Thank you for the your submission"
  // and the submitted values, which we need to confirm
  cy.contains('Thank you for your submission')
  cy.contains('[data-city]', fields.city)
  cy.contains('[data-value]', fields.value)
})

// this test is similar to bonus42, but we can use
// the browser's FormData API to construct the request
it('KEY makes a multipart/form-data cy.request using FormData', () => {
  // form values we want to submit
  // without going through the form on the page
  const fields = {
    city: 'New York City',
    value: 101
  }

  // create a new instance of FormData
  // and set each field to upload
  const formData = new FormData()
  formData.set('city', fields.city)
  formData.set('value', fields.value)

  // make a POST request using https://on.cypress.io/request
  // to the endpoint "/submit-form" with the form data as the body
  // Note: cy.request encodes the multipart and sets
  // the content type with the boundary automatically
  cy.request({
    method: 'POST',
    url: '/submit-form',
    body: formData
  })
    // if you inspect the "cy.request" in the CommandLog
    // and DevTools console, it uses ArrayBuffer to send the request
    // and receive the response.
    // From the response, grab the HTML body string
    // https://on.cypress.io/its
    // and convert it from ArrayBuffer to Buffer
    // before getting it as "utf8" text
    // https://on.cypress.io/invoke
    .its('body')
    // Tip: you can use "Buffer" utility bundled with Cypress
    // to immediately convert ArrayBuffer to Buffer
    // https://on.cypress.io/buffer
    .then(Cypress.Buffer.from)
    .invoke('toString', 'utf8')
    // then get the application's document object
    // https://on.cypress.io/document
    // because it is empty, we can write the HTML we got
    // into the document using document.write method
    .then((html) => {
      cy.document().invoke('write', html)
    })

  // the page should show "Thank you for the your submission"
  // and the submitted values, which we need to confirm
  cy.contains('Thank you for your submission')
  cy.contains('[data-city]', fields.city)
  cy.contains('[data-value]', fields.value)
})

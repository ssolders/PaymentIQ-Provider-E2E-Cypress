export const visitOptions = {
  qs: {
    environment: 'test',
    merchantId: '1024'
  }
}

/**
* Function that finds an iframe and then executes an action on it
* @param    {Cypress} cy              CypressObject
* @param    {string} iframeTarget     Selector (.iframe-element or #hosted-field-single-iframe)
* @param    {function} action         Callback to be executed on the iframe
* @return   {String}                  Dummy string after promise is fullfilled
*/

export const triggerIframeAction = (cy, iframeTarget: string, action: (el) => void): PromiseLike<string> => {
  cy.get(iframeTarget).then($element => {
    const $body = $element.contents().find('body')

    let el = cy.wrap($body)
    action(el)
  })
  return new Promise((resolve) => setTimeout(() => {
    resolve('null')
  }, 500))
}
import { IVisitOptionsQs } from '../../types'

export const visitOptions: IVisitOptionsQs = {
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

const getIframeDocument = (cy, iframeTarget: string) => {
  return cy
  .get(iframeTarget)
  // Cypress yields jQuery element, which has the real
  // DOM element under property "0".
  // From the real DOM iframe element we can get
  // the "document" element, it is stored in "contentDocument" property
  // Cypress "its" command can access deep properties using dot notation
  // https://on.cypress.io/its
  .its('0.contentDocument').should('exist')
}

export const getIframeBody = (cy, iframeTarget) => {
  // get the document
  return getIframeDocument(cy, iframeTarget)
  // automatically retries until body is loaded
  .its('body').should('not.be.undefined')
  // wraps "body" DOM element to allow
  // chaining more Cypress commands, like ".find(...)"
  .then(cy.wrap)
}
/// <reference types="Cypress" />

import { triggerIframeAction, visitOptions } from '../../utils/helpers'
import { ITestCredentials, IProviderCredentials } from '../../../types'
import { getTestCredentials } from '../../service'

const paymentMethod = 'creditcard'
const provider = 'bamboraGA'
const cashierBaseParameters = {
  userId: 'TestAgentEUR',
  providerType: paymentMethod,
  amount: 200,
  showAccounts: false
}

describe("Browse the PaymentIQ Cashier and make sure it loads as it should", () => {
  let testCredentials: IProviderCredentials | null = null
  
  beforeEach(async () => {
    const data: ITestCredentials = await getTestCredentials('dummyUrl')
    testCredentials = data[provider]
  })

  it("The Cashier loads", () => {
    // baseUrl is defined in cypress.json
    cy.visit('/', {
      ...visitOptions,
      qs: {
        ...visitOptions.qs,
        ...cashierBaseParameters
      }
    });

    // We're gonna interact with iframes - give them a sec to load. This is an arbitrary timeout but
    // cypress doesn't have a better way of saying okay now the frame has loaded
    cy.wait(2000)

    const { cardHolder, cardNumber, cardExpiry, cardCVC } = testCredentials.credentials
    triggerIframeAction(cy, '#hosted-field-single-iframe', el => el.find('#frmNameCC').type(cardHolder))
    triggerIframeAction(cy, '#hosted-field-single-iframe', el => el.find('#frmCCNum').type(cardNumber))
    triggerIframeAction(cy, '#hosted-field-single-iframe', el => el.find('#frmCCExp').type(cardExpiry))
    triggerIframeAction(cy, '#hosted-field-single-iframe', el => el.find('#frmCCCVC').type(cardCVC))
    
    cy.get('button.submit-button').click()
    
    // Give the 3DS iframe time to load
    cy.wait(6000)
    triggerIframeAction(cy, '.provider-iframe', el => el.find("form").eq(0).submit())

  });
})

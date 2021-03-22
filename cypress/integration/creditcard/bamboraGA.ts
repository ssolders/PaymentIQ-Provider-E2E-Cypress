/// <reference types="Cypress" />

// import the necessary types
import { IPiqCashierConfig } from 'paymentiq-cashier-bootstrapper'
import { ITestCredentials, IProviderCredentials } from '../../../types'

import { triggerIframeAction, visitOptions } from '../../utils/helpers'
import { getTestCredentials } from '../../service'

const paymentMethod = 'creditcard'
const paymentMethodCredentials = 'bamboraGA'

describe("Load the PaymentIQ Cashier and complete a Creditcard via BamboraGA deposit", () => {
  let testCredentials: IProviderCredentials | null = null
  const cashierBaseParameters: IPiqCashierConfig = {
    ...visitOptions.qs, // base setup (merchantId, environment)
    providerType: paymentMethod,
    amount: 200,
    showAccounts: false
  }
  
  beforeEach(async () => {
    const data: ITestCredentials = await getTestCredentials('dummyUrl')
    testCredentials = data[paymentMethodCredentials]
    cashierBaseParameters.userId = testCredentials.piqUserId
  })

  it("The Cashier loads and submits a creditcard payment using the fetched test credentials for BamboraGA", () => {
    // baseUrl is defined in cypress.json
    cy.visit('/', {
      ...visitOptions,
      qs: cashierBaseParameters // build up the query parameters (?merchantId=1024&environment=test etc)
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

    cy.url().should('include', 'https://pay.paymentiq.io/cashier/master/receipt')
  });
})

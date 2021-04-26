/// <reference types="Cypress" />

// import the necessary types
import { IPiqCashierConfig } from 'paymentiq-cashier-bootstrapper'
import { ITestCredentials, IProviderCredentials } from '../../types'

import { triggerIframeAction, visitOptions } from '../utils/helpers'
import { getTestCredentials } from '../service'

const paymentMethod = 'trustly'
const paymentMethodCredentials = 'trustly'

describe("Load the PaymentIQ Cashier and complete a Trustly deposit", () => {
  let testCredentials: IProviderCredentials | null = null
  const cashierBaseParameters: IPiqCashierConfig = {
    ...visitOptions.qs, // base setup (merchantId, environment)
    merchantId: '1014',
    providerType: paymentMethod,
    amount: 200,
    showAccounts: false
  }
  
  beforeEach(async () => {
    const data: ITestCredentials = await getTestCredentials('dummyUrl')
    testCredentials = data[paymentMethodCredentials]
    cashierBaseParameters.userId = testCredentials.piqUserId
  })

  it("The Cashier loads and submits a trustly transaction using the fetched test credentials for trustly", () => {
    // baseUrl is defined in cypress.json
    cy.visit('/', {
      ...visitOptions,
      qs: cashierBaseParameters // build up the query parameters (?merchantId=1024&environment=test etc)
    });

    cy.get('button.submit-button').click()
    
    // Give the 3DS iframe time to load
    cy.wait(3000)

    const { nationalId } = testCredentials.default.credentials
    triggerIframeAction(cy, '.provider-iframe', el => el.find(".core_SelectMethod_Country_SE .core_method").first().click()) // select the first bank in sweden
    triggerIframeAction(cy, '.provider-iframe', el => el.find(".button_next").click()) // click continue
    triggerIframeAction(cy, '.provider-iframe', el => el.find("input[name='loginid']").clear()) // empty the input field to be safe
    triggerIframeAction(cy, '.provider-iframe', el => el.find("input[name='loginid']").type(nationalId)) // fill out nationalId
    triggerIframeAction(cy, '.provider-iframe', el => el.find(".button_next").click()) // click continue
    
    cy.wait(1500)

    triggerIframeAction(cy, '.provider-iframe', el => {
      el.find('.message_value').should(($element) => {
        // get the innerHTML/text from an element
        const otp = $element.text()

        // We end up here a second time - that time the otp is already set in the input but the const otp is undefined
        if (otp) {
          el.parent().parent().find("input[name='challenge_response']").type(otp) // get the otp
        }
      })
    })

    triggerIframeAction(cy, '.provider-iframe', el => el.find(".button_next").click()) // click continue
    cy.wait(3000)
    triggerIframeAction(cy, '.provider-iframe', el => el.find(".button_next").click()) // click continue
    cy.wait(6000)

    triggerIframeAction(cy, '.provider-iframe', el => {
      el.find('.message_value').should(($element) => {
        // get the innerHTML/text from an element
        const otp = $element.first().text()

        // We end up here a second time - that time the otp is already set in the input but the const otp is undefined
        if (otp) {
          el.parent().parent().find("input[name='challenge_response']").type(otp) // get the otp
        }
      })
    })

    triggerIframeAction(cy, '.provider-iframe', el => el.find(".button_next").click()) // click continue

    cy.wait(3000)
    cy.url().should('include', 'https://pay.paymentiq.io/cashier/master/receipt') // should en up on the receipt

  });
})

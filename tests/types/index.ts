// arbitrary object
interface ICredentials {
  [key: string]: string
}

interface ICredentialScenarios {
  [key: string]: ICredentials
}

interface IDefaultCredentials {
  credentials: ICredentials // arbitrary object of test credentials, cardHolder, nationalId, telephone etc
  scenarios?: ICredentialScenarios
}

export interface IProviderCredentials {
  name: string // bamboraGa, trustly etc
  piqUserId: string // userId in paymentIQ that holds the correct routing/payment method rules
  default: IDefaultCredentials
}

// Object containing all the available providers and their credentials
export interface ITestCredentials {
  [key: string]: IProviderCredentials
}

type Environment = 'production' | 'mrgreen' | 'test' | 'development'

interface IVisitOptions {
  merchantId: string,
  environment: Environment
} 

export interface IVisitOptionsQs {
  qs: IVisitOptions
}
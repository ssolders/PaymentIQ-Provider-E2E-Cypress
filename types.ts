// arbitrary object
interface ICredentials {
  [key: string]: string
}

export interface IProviderCredentials {
  name: string // bamboraGa, trustly etc
  credentials: ICredentials // arbitrary object of test credentials, cardHolder, nationalId, telephone etc
}

// Object containing all the available providers and their credentials
export interface ITestCredentials {
  [key: string]: IProviderCredentials
}
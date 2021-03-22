import { ITestCredentials } from '../../types'
import testCredentials from './../../testCredentials.json'

/*
  Mocked request for fetching test credentials for providers
  A dummy promise that resolves after 500ms and then returnes a static json (testCredentials.json)
*/
export const getTestCredentials = async (url: string): Promise<ITestCredentials> => {
  return new Promise((resolve) => setTimeout(() => {
    resolve(testCredentials)
  }, 500))
}



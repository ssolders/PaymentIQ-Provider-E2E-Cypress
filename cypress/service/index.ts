import { ITestCredentials } from './../../types'
import testCredentials from './../../testCredentials.json'

export const getTestCredentials = async (url: string): Promise<ITestCredentials> => {
  return new Promise((resolve) => setTimeout(() => {
    resolve(testCredentials)
  }, 500))
}



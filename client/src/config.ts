// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3wtlf6kl31'
const region = 'eu-west-2'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev--otter.eu.auth0.com',            // Auth0 domain
  clientId: 'Np33lWGbaBQggf9UGju5CtODcvQGbzgl',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

import graphqlClient from "../graphql";
import Cookies from "js-cookie";

export const verifyAgent = async () => {
  const query = `
      query($token: String!) {
          verifyAgentToken(token: $token){
              error
              msg
              data{
                  first_name
                  last_name
                  mobile
                  email
                  type
                  owner_address
                  national_id
                  status
                  agent_level
                  division
                  district
                  municipal
                  ward
                  upazila
                  union
                  village

              }
          }
      }
  `
  let token = Cookies.get('fja_token')
  console.log('token',token)
  let client = graphqlClient()
  let {error, data} = await client.query(query, {token}).toPromise()
  console.log("features-",data)
  if (error) {
      return {error: true, msg: 'Network Failed'}
  }
  const {verifyAgentToken} = data
  return verifyAgentToken
}
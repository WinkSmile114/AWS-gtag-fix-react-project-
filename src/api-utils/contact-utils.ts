// import 'axios'
// import axios from 'axios'
// import { components } from './swagger-schema'
// import {addBearerHeader} from './general-utils'

// type UpdateContactInfo = components["schemas"]["UpdateContactDto"]
// type CreateContactInfo = components["schemas"]["CreateContactDto"]

// const createContact= async (idToken: string, createContactDto: CreateContactInfo) => {
//   const headers = addBearerHeader(idToken, {})
//   const res = await axios.post(`${process.env.REACT_APP_API}/contacts/`, {}, {headers});
//   return res.data
// }

// const updateContact= async (idToken: string, createContactDto: CreateContactInfo) => {
//   const headers = addBearerHeader(idToken, {})
//   const res = await axios.post(`${process.env.REACT_APP_API}/contacts/`, {}, {headers});
//   return res.data
// }

// const updateAccount = async (idToken: string, updateAccountInfo: UpdateAccountInfo) => {
//   const headers = addBearerHeader(idToken, {})
//   const res = await axios.patch(`${process.env.REACT_APP_API}/accounts/`, updateAccountInfo, {headers});
//   return res.data

// }

// const getAccountDetails = async (idToken: string) => {
//   const headers = addBearerHeader(idToken, {})
//   const res = await axios.get(`${process.env.REACT_APP_API}/accounts/`, {headers})
//   console.log(res)
//   console.log(res.data)
//   return res.data
// }

// export { createAccount, getAccountDetails, updateAccount }
export {};

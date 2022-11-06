import { gql } from "@apollo/client"

const getAllCurrencies = gql`
{
    currencies{
      label
      symbol
      
    }
  }
`

export default getAllCurrencies;
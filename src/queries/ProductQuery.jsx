import { gql } from "@apollo/client";

// getting particular product from graphql endpoint
const getProduct = (id) => gql`
{
  product(id:"${id}"){
    id
    name
    brand
    description
    gallery
    attributes{
      name
      items{
        id
        value
        displayValue
      }
      
    }
    inStock
    prices{
      amount
      currency{
        symbol
        label
      }
    }
  }
}`
export default getProduct;
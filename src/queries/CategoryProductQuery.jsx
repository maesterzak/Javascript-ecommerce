import { gql } from "@apollo/client"


const getCategoryProducts = (category) => gql`
{
    category(input: {title:"${category}"}){
        name        
        products{
        id     
        name
        brand
        prices{
          amount
          currency{
            label
            symbol
          }
        }
        gallery
        inStock
        attributes{
          name
          items{
            id
            value
            displayValue
          } 
        }
      }
    }
  }
`

export default getCategoryProducts;

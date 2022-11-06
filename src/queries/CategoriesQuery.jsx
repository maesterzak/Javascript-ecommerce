import { gql } from "@apollo/client"


const getAllCategories = gql`
{
    categories{
        name
    },
    
}
`
export default getAllCategories;
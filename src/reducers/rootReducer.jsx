// import { type } from "@testing-library/user-event/dist/type"
import Cookies from 'universal-cookie';


const cookies = new Cookies();

const initState ={
    //get current value of currency symbol from localstorage or return $ 
    currentCurrencySymbol:localStorage.getItem('currency') ?? "$",
    //get current currency label
    currentCurrencyLabel:localStorage.getItem('currencylabel') ?? "USD",
    //get current value of current category from localstorage or return all 
    currentCategory: cookies.get('currentCategory') ?? 'all',
    // get current value of cart from local storage or return default cart
    cart: JSON.parse(localStorage.getItem("cart")) ?? {"content":[],"CartTotal":0}
}

const rootReducer = (state= initState, action) => {
    const {type} = action;
    
    
    switch(type){
        case 'CHANGE_CURRENCY':
            
            localStorage.setItem('currency', action.currencySymbol)
            return{
                ...state,
                currentCurrencySymbol: action.currencySymbol

            }
        case 'CHANGE_CURRENCY_LABEL':
        
            localStorage.setItem('currencyLabel', action.currencyLabel)
            return{
                ...state,
                currentCurrencyLabel: action.currencyLabel

            }    
            
        case 'CHANGE_CATEGORY': 
            
            cookies.set('currentCategory', action.categoryName, {maxAge:360})
            return{
                ...state,
                currentCategory: action.categoryName
            }
        
        case 'CHANGE_CART':
            if(action.success === true){
                return{
                    ...state,
                    
                    cart: JSON.parse(localStorage.getItem('cart'))
                }
                
            }
            else{
                break
            }
                

            
         
        default:
            return state; 
             

    }
        
    
    
}

export default rootReducer;
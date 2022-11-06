import sum from 'lodash.sum'
import CheckOut from './CheckOut';
import { UiButton } from "./UI/Button";
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CheckoutModalContext } from './checkoutContext';


//ui, prop, symbol
class CartSummary extends Component {
  static contextType = CheckoutModalContext;
  constructor(props) {
    super(props);

    this.state = {
      convertedAmount: '',
      
    };
  }

  //api request to get current conversion

  options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'b160411e94msh1aef1c1b8caa0cdp1580abjsn07519509bb38',
      'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
    }
  };

  
  //end of api for current conversion

  

  componentDidMount(){
    
  }
  
  render(){
    
    const {ui, cart, currentCurrencySymbol, currentCurrencyLabel} = this.props
    // from cart get the current cost of each product multiplied by its quantity
    const amount = cart["content"].map(
      (item) =>
        item.prices.find((price) => price.currency.symbol === currentCurrencySymbol).amount *
        item.quantity
    );
    // using loadash get sum of all costs in cart
    const total = sum(amount);
    // get tax value for total products
    const taxAmount = (21 / 100) * total;
    // get total value of cart including tax
    const cartTotal = taxAmount + total;

    // api request to convert current currency amount to naira
    const getCurrenNairaAmount =async()=>{
      try{
      const res = await fetch(`https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=${currentCurrencyLabel}&want=NGN&amount=${cartTotal.toFixed(2)}`, this.options)
      const nairaValue = await res.json()
      
      //set converted amount to value in naira
      this.setState({convertedAmount: nairaValue.new_amount})
      }
      catch(error){
        console.log("Check network connection")
      }
    }
    const CartCheckOut = (param) => {
     
      // activate the payment details modal
      
      this.context.setCheckOutModal({checkoutModal: param})
     
      //call the currency conversion api
      getCurrenNairaAmount()
      // const success = CheckOut()
      // const { changeCart } = this.props;
  
      // changeCart(success);
    }
    
  //  const {checkoutModal, setCheckOutModal} = this.context
    return(
      <>
        {ui === "mainCart" ? 
        
        <div className="item-summary">
        <p>
          Tax 21%:{" "}
          <span>
            {currentCurrencySymbol} {taxAmount.toFixed(2)}
          </span>
        </p>
        <p>
          Quantity: <span>{cart["CartTotal"]}</span>
        </p>
        <p className='main-cart-total'>Total:{" "}
        <span>
          {currentCurrencySymbol} {cartTotal.toFixed(2)} 
        </span> </p>

        
        
        <UiButton onClick={()=>CartCheckOut(true)} cart>ORDER</UiButton>
       
            <div className={this.context.checkoutModal ? "d-block":"d-none"}>
            <CheckOut amount={this.state.convertedAmount} />
            </div>
      </div>
        :
        <>
          <span className='mini-cart-total'>Total</span>
          <span className='mini-cart-total-amount'>
            {currentCurrencySymbol} {total.toFixed(2)}
          </span>
        </>
        }
      </>
    )
  }
  // if (ui === "mainCart") {
  //   return (
      // <div className="item-summary">
      //   <p>
      //     Tax 21%:{" "}
      //     <span>
      //       {symbol} {taxAmount.toFixed(2)}
      //     </span>
      //   </p>
      //   <p>
      //     Quantity: <span>{cart["CartTotal"]}</span>
      //   </p>
      //   <b>Total</b>:{" "}
      //   <span>
      //     {symbol} {cartTotal.toFixed(2)}
      //   </span>
      //   <UiButton onClick={()=>CheckOut()} cart>ORDER</UiButton>
      // </div>
  //   );
  // } else {
  //   return (
  //     <>
  //       <span>Total</span>
  //       <span>
  //         {symbol} {total.toFixed(2)}
  //       </span>
  //     </>
  //   );
  // }
};

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    currentCurrencySymbol: state.currentCurrencySymbol,
    currentCurrencyLabel: state.currentCurrencyLabel,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeCart: (success) => {
      dispatch({ type: "CHANGE_CART", success: success });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CartSummary);

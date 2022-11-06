import React, { Component } from 'react'
import styles from "../stylesheets/checkout.module.css"
import PaystackPop from '@paystack/inline-js'
import { CheckoutModalContext } from './checkoutContext';
import { connect } from 'react-redux';



class CheckOut extends Component {
  static contextType = CheckoutModalContext;
  
    state = {
        name:'',
        email:"",
        phone_number:""
      }
    
    
    
    options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b160411e94msh1aef1c1b8caa0cdp1580abjsn07519509bb38',
        'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
      }
    };
    
    
    handleClickOutside(event) {
      if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        // this.currencyToggler()
        this.context.setCheckOutModal({checkoutModal: false})
      }
    }


    render() { 
      const {amount, changeCart} = this.props
      const {name, email, phone_number} = this.state

      const payStack =(e)=>{
    
        e.preventDefault()
        const paystack = new PaystackPop()
        const modal =()=> this.context.setCheckOutModal({checkoutModal: false})
        try{
        paystack.newTransaction({
          key: "pk_test_071281aa8222388e59425233f83b36d62d317c72",
          email: email,
          name:name,
          amount: amount * 100,
          phone: phone_number,
          async onSuccess(transaction){
            modal()
            localStorage.setItem('cart', JSON.stringify({"content":[],"CartTotal":0}))
            
            let success = true;
            await changeCart(success);
            let message = `Payment Completed Successfully!!. Your transaction reference is ${transaction.reference}. Thank you for shopping with us`
            alert(message)

          },
          onCancel(){
            alert("You have canceled the transaction")
          }

        })
        }
        catch(error){
          console.log("something went wrong")
        }
        
      }
      const cloaseCheckOutModal =()=> {
        
        this.context.setCheckOutModal({checkoutModal: false})
      }
      
      
        return ( 
            <>
                <div   className={styles.modalContainer}>
                  <div onClick={()=>cloaseCheckOutModal()}  className={styles.modalOverlay}>

                  </div>
                  
                      <div className={styles.box}>
                        <form className={styles.form} onSubmit={payStack}>
                          <span className={styles.text_center}>Enter payment details</span>
                        <div className={styles.input_container}>
                          <input value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} className={styles.input} type="text" required=""/>
                          <label className={styles.label}>Full Name</label>		
                        </div>
                        <div className={styles.input_container}>		
                          <input value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} className={styles.input} type="mail" required=""/>
                          <label className={styles.label}>Email</label>
                        </div>
                        <div className={styles.input_container}>		
                          <input value={this.state.phone_number} onChange={(e)=>this.setState({phone_number:e.target.value})} className={styles.input} type={"text"} required=""/>
                          <label className={styles.label}>Phone Number</label>
                        </div>
                        <div className={styles.input_container}>		
                          <input className={styles.input} type={"number"} placeholder="calculating..." defaultValue={amount} disabled/>
                          <label style={{"marginTop":"-20px", "fontSize":"small"}}  className={styles.label}>Amount in NGN</label>
                        </div>
                        
                          <button type="submit" className={styles.btn}>Pay Now</button>
                          
                          
                      </form>	
                      </div>
                      </div>

                {/* </div> */}
            </>
         );
    }
}
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
 

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);
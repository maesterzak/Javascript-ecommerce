import React, { Component } from "react";
import "../stylesheets/navbar.css";
import AllCategories from "./AllCategories";
import AllCurrencies from "./AllCurrencies";
import { connect } from "react-redux";
import CartController from "./CartController";
import { Link } from "react-router-dom";
import CartSummary from "./CartSummary";
import CheckOut from "./CheckOut";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cart_dropdown: false,
      categories: [],
      
      navState: false,
    };
  }

  CartDropDown = () => {
    const { cart_dropdown } = this.state;
    this.setState({
      cart_dropdown: !cart_dropdown,
    });
  };
  cartHandler = (action, product) => {
    const success = CartController(
      action,
      product.id,
      product.name,
      product.brand,
      product.prices,
      product.attributes
    );
    const { changeCart } = this.props;
      
    changeCart(success);
  };

  CartCheckOut = () => {
    const success = CheckOut()
    const { changeCart } = this.props;

    changeCart(success);
  }
  

  navToggler = () => {
    const { navState } = this.state;
    this.setState({
      navState: !navState,
    });
  };

  render() {
    const { cart } = this.props;
    const { navState } = this.state;
    
   

    return (
      <div className="nav-container ">
        <div className="nav-wrapper">
          <nav>
            <AllCategories navState={navState} />

            <div className="nav-link">
              <div>
                <img alt="bag" src="/assets/bag.svg" />
              </div>
              
              <ul className="nav-dropdown-group">
                <AllCurrencies />
                <li onClick={this.CartDropDown}>
                  <img alt="cart" className="img " src="/assets/cart.svg" />
                  <sup>
                    <div className="cart-size">{cart["CartTotal"]}</div>
                  </sup>
                </li>
              </ul>
              <div onClick={() => this.navToggler()} className="nav-toggler">
                <img alt="nav taggler" src="/assets/bars.svg" />
              </div>
            </div>
          </nav>
        </div>

        <div
          className={
            this.state.cart_dropdown
              ? "dropdown-container d-block"
              : "dropdown-container"
          }
        >
          <div onClick={this.CartDropDown} className="overlay"></div>
          <div
            className={
              this.state.cart_dropdown
                ? "overlay-content d-block"
                : "overlay-content"
            }
          >
            <div className="dropdown-box">
              <div className="dropdown-cart">
                <p className="cart-font1">
                  My bag: <span>{cart["CartTotal"]} items</span>
                </p>
                <div className="cart-container">
                  {cart["content"].map((item, index) => {
                    return (
                      <div key={index} className="cart-item">
                        <div className="cart-info">
                          <p>{item.brand} </p>
                          <p>{item.name}</p>

                          {item.prices
                            .filter(
                              (price) =>
                                price.currency.symbol ===
                                this.props.currentCurrencySymbol
                            )
                            .map((price, index) => {
                              const amount = price.amount 
                              return (
                                <p key={index} className="mini-cart-price">
                                  
                                    {price.currency.symbol} {amount.toFixed(2)}
                                  
                                </p>
                              );
                            })}
                            {item.allAttributes.map((attr, index)=>{
                              return(
                                <div key={index}>
                                  <div className="cart-attr-name">
                                    {attr.name}:
                                  </div>

                                  {attr.items.map((allAttr, index)=>{
                                    return(
                                      <React.Fragment key={index}>
                                       
                                      {attr.name.toLocaleLowerCase() ==="color" ? 
                                      
                                      <button className={item.attributes.color === allAttr.value ?  "cart-color-button cart-color-button-active":'cart-color-button'}
                                       style={{background: `${allAttr.value}`}}
                                       >
                                         

                                         {attr.name.toLocaleLowerCase() ==="color" ?  '':allAttr.value}
                                       </button> 
                                      :
                                      <button key={index} className={Object.values(item.attributes)[Object.keys(item.attributes).findIndex(key => key === attr.name)] === allAttr.value ?  "cart-size-button cart-size-button-active":'cart-size-button '}
                                       
                                       >
                                         {allAttr.value}
                                         
                                         
                                       </button> 
                                       
                                      }
                                      </React.Fragment>
                                    )
                                  })}
                                </div>
                              )
                            })}
                         
                        </div>
                        <div className="cart-info2">
                          <div className="quantity-toggler">
                            <button
                              onClick={() => this.cartHandler("add", item)}
                            >
                              +
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => this.cartHandler("remove", item)}
                            >
                              -
                            </button>
                          </div>
                          <div className="img-box">
                            
                              <img
                                alt={item.name}
                                className="cart-image"
                                src={item.gallery[0]}
                              />
                            
                            
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="cart-total">
                    <CartSummary ui="miniCart" />
                  </div>

                  <div className="cart-btns">
                    <Link to="/cart">
                      <button
                        onClick={() => this.setState({ cart_dropdown: false })}
                        className="bag-btn"
                      >
                        VIEW BAG
                      </button>
                    </Link>
                    <Link to="/cart">
                      <button
                        onClick={() => this.setState({ cart_dropdown: false })}
                        className="checkout-btn"
                      >
                        CHECKOUT
                      </button>
                    </Link>
                    {/* <button onClick={()=>this.CartCheckOut()} className="checkout-btn">CHECKOUT</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    currentCurrencySymbol: state.currentCurrencySymbol,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeCart: (success) => {
      dispatch({ type: "CHANGE_CART", success: success });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

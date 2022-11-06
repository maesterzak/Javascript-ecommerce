import React, { Component } from "react";
import "../stylesheets/cartview.css";
import { connect } from "react-redux";
import CartController from "./CartController";
import CartSummary from "./CartSummary";

class CartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleImage: { id: "", index: 0, itemIndex: 0 },
    };
  }

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
  imageHandler = (action, id, galleryLength, itemIndex) => {
    if (
      (id !== this.state.toggleImage.id) |
      (itemIndex !== this.state.toggleImage.itemIndex)
    ) {
      // this is to ensure that the index for same products with different attributes are not the same 
      this.setState(
        {
          toggleImage: { id: "", index: 0, itemIndex: 0 },
        },
        () => {
          if (action === "next") {
            if (this.state.toggleImage.index < galleryLength - 1) {
              this.setState({
                toggleImage: {
                  id: id,
                  index: this.state.toggleImage.index + 1,
                  itemIndex: itemIndex,
                },
              });
            }
          } else {
            if (this.state.toggleImage.index > 0) {
              this.setState({
                toggleImage: {
                  id: id,
                  index: this.state.toggleImage.index - 1,
                  itemIndex: itemIndex,
                },
              });
            }
          }
        }
      );
    } else {
      if (action === "next") {
        if (this.state.toggleImage.index < galleryLength - 1) {
          this.setState({
            toggleImage: {
              id: id,
              index: this.state.toggleImage.index + 1,
              itemIndex: itemIndex,
            },
          });
        }
      } else {
        if (this.state.toggleImage.index > 0) {
          this.setState({
            toggleImage: {
              id: id,
              index: this.state.toggleImage.index - 1,
              itemIndex: itemIndex,
            },
          });
        }
      }
    }
  };

  render() {
    const current_index = this.state.toggleImage;
    const { cart } = this.props;
    return (
      <div className="container">
        <h1 className="h1">Cart</h1>
        <div className="new-line"></div>  
        

        {cart["content"].map((item, index) => {
          return (
            <div key={index} className="item">
              <div className="column_1">
                <h2 className="item-brand">{item.brand} </h2>
                <h2 className="item-name">{item.name}</h2>

                {item.prices
                  .filter(
                    (price) =>
                      price.currency.symbol === this.props.currentCurrencySymbol
                  )
                  .map((price, index) => {
                    const amount = price.amount;
                    return (
                      <h2 key={index} className="item-price">
                        
                          {price.currency.symbol} {amount.toFixed(2)}
                        
                      </h2>
                    );
                  })}

                                {item.allAttributes.map((attr, index)=>{
                                  return(
                                    <div key={index}>
                                      <h2 className="h3">
                                        {attr.name.toLocaleUpperCase()}:
                                      </h2>

                                      {attr.items.map((allAttr, index)=>{
                                        return(
                                          <React.Fragment key={index}>
                                          
                                          {attr.name.toLocaleLowerCase() ==="color" ? 
                                          
                                          <button className={item.attributes.color === allAttr.value ?  "main-cart-color-button main-cart-color-button-active":'main-cart-color-button'}
                                          style={{background: `${allAttr.value}`}}
                                          >
                                            

                                            {attr.name.toLocaleLowerCase() ==="color" ?  '':allAttr.value}
                                          </button> 
                                          :
                                          <button key={index} className={Object.values(item.attributes)[Object.keys(item.attributes).findIndex(key => key === attr.name)] === allAttr.value ?  "main-cart-size-button main-cart-size-button-active":'main-cart-size-button '}
                                          
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

              <div className="column_2">
                <div className="quantity-control">
                  <button className="qauntity-ctrl-btn" onClick={() => this.cartHandler("add", item)}>
                    +
                  </button>
                  <div>{item.quantity}</div>
                  <button className="qauntity-ctrl-btn" onClick={() => this.cartHandler("remove", item)}>
                    -
                  </button>
                </div>
                <div className="item-image">
                  <div className="img-box">
                    {item.id === current_index.id &&
                    index === current_index.itemIndex ? (
                      <img
                        alt={item.name}
                        className="cart-image"
                        src={item.gallery[current_index.index]}
                      />
                    ) : (
                      <img
                        alt={item.name}
                        className="cart-image"
                        src={item.gallery[0]}
                      />
                    )}
                    {item.gallery.length > 1 ? (
                      <div className="img-toggler">
                        <button
                          onClick={() =>
                            this.imageHandler(
                              "prev",
                              item.id,
                              item.gallery.length,
                              index
                            )
                          }
                        >
                          <img alt="angle" src="/assets/left-angle.svg" />
                        </button>
                        <button
                          onClick={() =>
                            this.imageHandler(
                              "next",
                              item.id,
                              item.gallery.length,
                              index
                            )
                          }
                        >
                          <img alt="angle" src="/assets/right-angle.svg" />
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <CartSummary ui="mainCart"  />
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
export default connect(mapStateToProps, mapDispatchToProps)(CartView);

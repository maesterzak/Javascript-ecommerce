import React, { Component } from "react";
import "../stylesheets/categoryview.css";
import { connect } from "react-redux";
import getCategoryProducts from "../queries/CategoryProductQuery";
import { client } from "../index";
import { Link } from "react-router-dom";
import CartController from "./CartController";


class CategoryProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      popupId:''
    };
  }

  componentDidMount() {
    this.getInitialData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentCategory !== prevProps.currentCategory) {
      this.getInitialData();
    }
  }

  getInitialData() {
    const watch = client.watchQuery({
      query: getCategoryProducts(this.props.currentCategory),
    });
    this.subobj = watch.subscribe(({ loading,error, data }) => {
      if (loading) return <p>Loading</p>;
      else if (error) return console.log('error');
      this.setState({
        products: data.category.products,
        loading: loading,
      });
    });
  }
  componentWillUnmount() {
    this.subobj.unsubscribe();
  }

  submitHandler = (e) =>{
    e.preventDefault();
    // get data from form
    var formData = new FormData(e.target);
    const form_values = Object.fromEntries(formData);
    
    const { products } = this.state;
    // get particular product by id
    const product = products.find(product => product.id === e.target.id)
    const success = CartController(
        "add",
        product.id,
        product.name,
        product.brand,
        product.prices,
        form_values,
        product.gallery,
        product.attributes
      );
    
    const { changeCart } = this.props;
    changeCart(success);   
  }
  // this is for poducts with no attributes
  AddProduct =(id) =>{
    const { products } = this.state;
    // get particular product by id
    const product = products.find(product => product.id === id)
    
    const attributes = {}
    const success = CartController(
      "add",
      product.id,
      product.name,
      product.brand,
      product.prices,
      attributes,
      product.gallery,
      product.attributes
    );
  
  const { changeCart } = this.props;
  changeCart(success);   
  }

  popupHandler =(id) =>{
      this.setState({
          popupId: id
      })
  }
  
  render() {
    
    const { loading, products, popupId } = this.state;
    
    if (loading === false) {
      return (
        <>
          <h1 className="main-category-name">{this.props.currentCategory.toUpperCase()}</h1>
          <div className="items">
            {products.map((product) => {
              return (
                <div key={product.id} onMouseLeave={()=>this.setState({popupId:''})} className="item-container">
                    
                  <Link to={`/${product.id}`}>
                    {product.inStock ? (
                      
                      <div className="img-box">
                        <img alt={"product gallery"} src={product.gallery[0]} />
                        
                        
                        </div>
                    ) : (
                      <div className="img-box">
                        <img alt={product.name} src={product.gallery[0]} />
                        <div className="light-overlay">OUT OF STOCK</div>
                      </div>
                    )}

                    <div
                      className={
                        product.inStock ? "item-info" : "item-info half-opacity"
                      }
                    >
                       
                      <span className="item_name">{product.brand} {product.name}</span>

                      {product.prices
                        .filter(
                          (price) =>
                            price.currency.symbol ===
                            this.props.currentCurrencySymbol
                        )
                        .map((price) => {
                          return (
                            <span
                              key={price.currency.label}
                              className="item_price"
                            >
                              {price.currency.symbol} {price.amount}
                            </span>
                          );
                        })}
                    </div>
                    </Link>

                    {/* begin */}
                        {product.attributes.length > 0 ?
                        <> 
                        <div className={product.id === popupId ? "plp-cart-popup-ctn": "d-none"}>
                            <div className="plp-cart-popup">
                                <form id={product.id} onSubmit={this.submitHandler}>
                                    
                                    {product.attributes.map((attribute, index)=>{
                                        return(
                                            <div key={index} className='plp-attr'>
                                                <p className="">{attribute.name.toUpperCase()}:</p>
                                                {attribute.items.map((item, ind)=>{
                                                        
                                                        if (attribute.name === "Color") {
                                                            return (
                                                              <input
                                                                key={item.id}
                                                                style={{ background: item.value }}
                                                                name="color"
                                                                type={"radio"}
                                                                className="color-button-plp"
                                                                defaultValue={item.value}
                                                                required
                                                                defaultChecked={
                                                                  attribute.items[0] === item ? "checked" : ""
                                                                }
                                                              />
                                                            );
                                                          } else {
                                                            return (
                                                              <label key={item.id} className="attr-label-plp">
                                                                <input
                                                                  style={{ background: item.value }}
                                                                  type={"radio"}
                                                                  name={attribute.name}
                                                                  defaultValue={item.value}
                                                                  required
                                                                  defaultChecked={
                                                                    attribute.items[0] === item ? "checked" : ""
                                                                  }
                                  
                                                                  // {item.displayValue}
                                                                />
                                                                <span>{item.value}</span>
                                                              </label>
                                                            );
                                                          }
                                                    
                                                })}

                                            </div>
                                        )
                                    })}
                                    <div className="plp-submit-ctn">
                                        <button type={"submit"} className="plp-submit-btn">Add to cart</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                        
                        
                        <div onClick={()=>this.popupHandler(product.id)} className={product.inStock ? "plp-cart":"d-none"}><img alt="cart" className="plp-cart-img" src="/assets/light-cart.svg" /></div>
                        </>
                        : <button onClick={()=>this.AddProduct(product.id)} className={product.inStock ? "plp-cart":"d-none"}><img alt="cart" className="plp-cart-img" src="/assets/light-cart.svg" /></button>}
                    {/* end */}
                  
                </div>
              );
            })}
          </div>
        </>
      );
    } else {
      return <p>loading</p>;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    currentCategory: state.currentCategory,
    currentCurrencySymbol: state.currentCurrencySymbol,
    cart: state.cart,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    
    changeCart: (success) => {
        dispatch({ type: "CHANGE_CART", success: success });}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryProducts);

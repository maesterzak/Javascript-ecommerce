import React, { Component } from "react";
import "../stylesheets/pdp.css";
import getProduct from "../queries/ProductQuery";
import { client } from "../index";
import { connect } from "react-redux";
import withRouter from "./withRouter";
import { UiButton } from "./UI/Button";
import parse from 'html-react-parser';

import CartController from "./CartController";
import PageNotFound from "./PageNotFound";

class PdpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_id: this.props.params.id,
      product: [],
      loading: true,
      mainImage: 0,
    };
  }
  
  componentDidMount() {
    this.getInitialData();
  }

  async getInitialData() {
    const watch = client.watchQuery({
      query: getProduct(this.state.product_id),
    });
    this.subobj = watch.subscribe(({ loading, error, data }) => {
      
      if (loading) return <p>Loading</p>;
      else if (error) return console.log('error');
      this.setState({
        product: data.product,
        loading: loading,
      });
    });
  }
  componentWillUnmount() {
    this.subobj.unsubscribe();
  }

  submitHandler = (event) => {
    // prevent form submission
    event.preventDefault();
    const { product } = this.state;
    var formData = new FormData(event.target);
    const form_values = Object.fromEntries(formData);

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
  };
  render() {
    const ImageHandler = (imageIndex) => {
      this.setState({
        mainImage: imageIndex,
      });
    };
    const { product, loading, mainImage } = this.state;
    
    if (loading === false) {
      return (
        <>
        {product !== null ? 
        <div className="container">
          <div className="column">
            <div className="column1">
              {product.gallery.map((image, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => ImageHandler(index)}
                    className={
                      mainImage === index ? "img-box active" : "img-box"
                    }
                  >
                    <img alt={product.name} src={image} />
                  </div>
                );
              })}
            </div>

            <div className="column2">
              <div className="main-img-box">
                <img alt={product.name} src={product.gallery[this.state.mainImage]} />
              </div>
            </div>

            <form onSubmit={this.submitHandler} className="column3">
              <h1 className=" mt-0 pdp-item-brand">{product.brand}</h1>

              <h2 className="pdp-item-name"> {product.name}</h2>

              <div>
                {product.attributes.map((attribute, index) => {
                  return (
                    <div className="attr-div" key={index}>
                      <h2 className="pdp-atrr-name">{attribute.name.toUpperCase()}:</h2>
                      {attribute.items.map((item) => {
                        if (attribute.name === "Color") {
                          return (
                            <input
                              key={item.id}
                              style={{ background: item.value }}
                              name="color"
                              type={"radio"}
                              className="color-button"
                              defaultValue={item.value}
                              required
                              defaultChecked={
                                attribute.items[0] === item ? "checked" : ""
                              }
                            />
                          );
                        } else {
                          return (
                            <label key={item.id} className="attr-label">
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
                  );
                })}
              </div>

              <h2 className="pdp-atrr-name">PRICE:</h2>

              {product.prices
                .filter(
                  (price) =>
                    price.currency.symbol === this.props.currentCurrencySymbol
                )
                .map((price, index) => {
                  return (
                    <p key={index} className="pdp-item-price">
                      {price.currency.symbol} {price.amount}
                    </p>
                  );
                })}

              <div>
                {product.inStock ? (
                  <UiButton type={"submit"} cart>
                    ADD TO CART
                  </UiButton>
                ) : (
                  <UiButton disabled type={"submit"} cart>
                    OUT OF STOCK
                  </UiButton>
                )}
              </div>
              <div className="item-description">
                {parse(product.description)}
              </div>
            </form>
          </div>
        </div>
        : <PageNotFound />}</>
      );
    } else {
      return <p>Loading</p>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    currentCategory: state.currentCategory,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PdpView));

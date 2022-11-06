import isEqual from "lodash.isequal";

const CartController = (
  action,
  id,
  name,
  brand,
  prices,
  attributes,
  gallery,
  allAttributes
) => {
  //get the current value of cart from localstorage
  const localCart = localStorage.getItem("cart");
  //parse the current value of cart
  const cart = JSON.parse(localCart);
  
  // check if a product with the same attributes and id exist in cart. Return it's index or return -1 if not found
  const index = cart["content"].findIndex(
    (item) => isEqual(item.id, id) && isEqual(item.attributes, attributes)
  );

  //if action is add
  if (action === "add") {
    // if index is not -1
    if (index !== -1) {
      // if (JSON.stringify(cart["content"][index]["attributes"]) === JSON.stringify(attributes)) {
      //if the attributes of the product at the returned index is the same with the value of attributes for new product
      if (isEqual(cart["content"][index]["attributes"], attributes)) {
        // increase its quantity and the overall cart total
        cart["content"][index]["quantity"] += 1;
        cart["CartTotal"] += 1;
      } else {
        // else add new product to cart
        cart["content"].push({ id: id, attributes: attributes, quantity: 1 });
        cart["CartTotal"] += 1;
      }
    }
    //if index is -1 then add new product to cart
    else {
      cart["content"].push({
        id: id,
        name: name,
        brand: brand,
        prices: prices,
        attributes: attributes,
        gallery: gallery,
        allAttributes:allAttributes,
        quantity: 1,
      });
      cart["CartTotal"] += 1;
    }

    // set value of cart in localstorage to current cart
    localStorage.setItem("cart", JSON.stringify(cart));

    //return true if code above executed successfully
    return true;
  }
  // if action is remove
  else if (action === "remove") {
    // and index is not -1
    if (index !== -1) {
      // reduce the quantity of product at returned index
      cart["content"][index]["quantity"] -= 1;
      cart["CartTotal"] -= 1;

      if (cart["content"][index]["quantity"] <= 0) {
        //delete cart item if the quantity in cart is less than or equal to zero
        cart["content"].splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));

      //return true if code above executed successfully
      return true;
    }
  } else {
  }
};
export default CartController;

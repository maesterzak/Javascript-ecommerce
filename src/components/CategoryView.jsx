import React, { Component } from "react";
import CategoryProducts from "./CategoryProducts";

class CategoryView extends Component {
  render() {
    return (
      <div className="container">
        <CategoryProducts />
      </div>
    );
  }
}

export default CategoryView;

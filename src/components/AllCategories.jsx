import React, { Component } from "react";
import getAllCategories from "../queries/CategoriesQuery";
import { client } from "../index";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.getInitialData();
  }

  async getInitialData() {
    const watch = client.watchQuery({
      query: getAllCategories,
    });
    this.subobj = watch.subscribe(({ loading, data }) => {
      this.setState({
        categories: data.categories,
        loading: loading,
      });
    });
  }
  componentWillUnmount() {
    this.subobj.unsubscribe();
  }

  render() {
    const Handler = (categoryName) => {
      this.props.changeCategory(categoryName);
    };
    const { loading, categories } = this.state;
    const { navState } = this.props;
    
    if (loading === false) {
      return (
        <>
          <ul
            className={
              navState ? "category-links open" : "category-links collapse"
            }
          >
            {categories.map((category) => {
              return (
                <li key={category.name}>
                  <Link
                    to={"/"}
                    onClick={() => Handler(category.name)}
                    className={
                      this.props.currentCategory === category.name
                        ? "active"
                        : ""
                    }
                  >
                    {category.name.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      );
    } else {
      return <p>loading</p>;
    }
  }
}

// add the value of current category from redux to component props
const mapStateToProps = (state) => {
  return {
    currentCategory: state.currentCategory,
  };
};
// notify redux of change in current category
const mapDispatchToProps = (dispatch) => {
  return {
    changeCategory: (categoryName) => {
      dispatch({ type: "CHANGE_CATEGORY", categoryName: categoryName });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Categories);

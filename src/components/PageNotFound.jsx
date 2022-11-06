import React, { Component } from "react";
import styles from '../stylesheets/test.module.css'

class PageNotFound extends Component {
  

  render() {
    return (
      <>
        <div className="page-not-found">
            <h1 className={styles.test}>404</h1>
            <p>Page not found</p>
        </div>
      </>
    );
  }
}

export default PageNotFound;


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryView from './components/CategoryView';
import PdpView from './components/PdpView';
import './App.css';
import Navbar from './components/Navbar';
import CartView from './components/CartView';
import { Component } from 'react';
import PageNotFound from './components/PageNotFound';
import Cookies from 'universal-cookie';
import React from 'react'
import { CheckoutModalContext } from './components/checkoutContext';


const cookies = new Cookies();
class App extends Component{

  constructor(props) {
    super(props);

    this.state = {
      
      checkoutModal: false
    };
  }

  
 
  componentDidMount(){
    // create cart in local storage if it does not exist
    if(localStorage.getItem('cart') === null){
      localStorage.setItem('cart', JSON.stringify({"content":[],"CartTotal":0}))
      
    }
    if(cookies.get('currentCategory') === undefined){
      cookies.set('currentCategory', 'all', {maxAge:360})
    }
    
  }
  
  render() {
  const  mData = {
      checkoutModal: this.state.checkoutModal,
      setCheckOutModal:this.setState.bind(this)
    }
  return (
    <div className="app-body">

      
      <Router>
        <Navbar />
        <CheckoutModalContext.Provider value={mData}>
        <Routes>
          <Route path='/' element={<CategoryView />} />
          <Route path='/:id' element={<PdpView />} />
          <Route path='/cart' element={<CartView />} />
          <Route path="*" element={<PageNotFound />} />
          
        </Routes>
        </CheckoutModalContext.Provider>
      </Router>
    
      
    </div>
  );

}
}

export default App;

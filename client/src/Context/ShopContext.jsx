import React, { createContext, useEffect } from 'react'
import { useState } from 'react'

export const ShopContext = createContext(null)

const getDefaultCart = () => {
  let cart = {}
  for (let index = 1; index < 300 + 1; index++) {
    cart[index] = 0
  }
  return cart
}

const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([])
  const [cartItems, setCartItems] = useState(getDefaultCart())

  useEffect(() => {
    fetch('https://e-commerce-backend-7r7i.onrender.com/allproducts')
      .then((res) => res.json())
      .then((data) => {
        setAllProduct(data)
      })

    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-7r7i.onrender.com/getcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: '',
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data))
    }
  }, [])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-7r7i.onrender.com/addtocart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'itemId': itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
    if (localStorage.getItem('auth-token')) {
      fetch('https://e-commerce-backend-7r7i.onrender.com/removefromcart', {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'itemId': itemId }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
    }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        )
        totalAmount += itemInfo.new_price * cartItems[item]
      }
    }
    return totalAmount
  }

  const getTotalCartItems = () => {
    let totalItems = 0
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItems += cartItems[item]
      }
    }
    return totalItems
  }

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  }

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider

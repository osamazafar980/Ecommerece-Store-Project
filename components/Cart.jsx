import React from 'react'
import Link from 'next/link'
import { useRef } from 'react'
import { AiOutlineLeft, AiOutlineMinus } from 'react-icons/ai'
import { AiOutlinePlus } from 'react-icons/ai'
import { AiOutlineShopping } from 'react-icons/ai'
import {TiDeleteOutline} from 'react-icons/ti'
import  toast  from 'react-hot-toast'
import { useStateContext } from 'context/stateContext'
import { urlFor } from 'Lib/client'
import getStripe from 'Lib/getStripe'

const Cart = () => {
  const cartRef = useRef();
  const {totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove} = useStateContext();
  const handleCheckout = async () => {
    const stripe = await getStripe();
    const response = await fetch('/api/stripe',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({cartItems}),
    })

    if(response.status === 500) return;

    const data = await response.json();
    
    toast.loading('Redirecting...');

    stripe.redirectToCheckout({
      sessionId: data.id
    });
  }
  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button type='button' className='cart-heading'
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft/>
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>{totalQuantities} Items</span>
        </button>

        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty.</h3>
            <Link href='/'>
              <button type='button' onClick={() => setShowCart(false)}
                className = 'btn'
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className='product-container'>
          {console.log(cartItems)}
          {
            cartItems.length >= 1 && cartItems.map(
              (item, index) => (
                <div className='product' key={item._id}>
                  <img src={urlFor(item?.image[0])} 
                    className = 'cart-product-image'
                  />
                  <div className='item-desc'>
                    <div className='flex top'>
                      <h5>{item.name}</h5>
                      <h4>${item.price}</h4>
                    </div>
                    <div className='flex bottom'>
                      <div>
                        <p className='quantity-desc'>
                        <span className='minus' onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                          <AiOutlineMinus/>
                        </span>
                        <span className='num' >
                          {item.quantity}
                        </span>
                        <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'inc')}>
                          <AiOutlinePlus/>
                        </span>
                        </p>
                      </div>
                      <button type='button' className='remove-item' onClick={() => onRemove(item)}>
                        <TiDeleteOutline/>
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          }
        </div>
        {cartItems.length>=1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal: </h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className='btn-container'>
              <button className='btn' type='button' onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>)}
      </div>
    </div>
  )
}

export default Cart
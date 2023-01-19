import product from 'ecommerceproject/schemas/product';
import React, {createContext, useContext, useState, useEffect} from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item)=> item._id === product._id);
        
        setTotalPrice((prev) => prev + product.price * quantity);
        setTotalQuantities((prev) => prev + quantity);
        
        if( checkProductInCart){
            const updateCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity : cartProduct.quantity + quantity
                    }
                }else{
                    return {...cartProduct}
                }
            })
            console.log(updateCartItems)
            setCartItems(updateCartItems);
        }else{
            product.quantity = quantity;
            setCartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        if(value == 'inc'){
            let newCartItems = [...cartItems]
            newCartItems[index] = {...foundProduct, quantity: foundProduct.quantity + 1}
            setCartItems(newCartItems)
            setTotalPrice((prev) => prev + foundProduct.price)
            setTotalQuantities((prev) => prev + 1)
        }else if( value = 'dec'){
            if(foundProduct.quantity > 1){
                let newCartItems = [...cartItems]
                newCartItems[index] = {...foundProduct, quantity: foundProduct.quantity - 1}
                setCartItems(newCartItems)
                setTotalPrice((prev) => prev - foundProduct.price)
                setTotalQuantities((prev) => prev - 1)
            }
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        let newCartItems = cartItems.filter((item) => item._id !== product._id);
        setTotalPrice((prev) => prev - foundProduct.price * foundProduct.quantity)
        setTotalQuantities((prev) => prev - foundProduct.quantity)
        console.log(newCartItems)
        setCartItems(newCartItems)
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }
    
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1){
                return 1;
            }else{
                return prevQty - 1
            }
        } 
        )
    }

    return(
        <Context.Provider
            value={{
                showCart, cartItems, totalPrice, totalQuantities, qty,
                incQty, decQty, onAdd , setShowCart, setCartItems, setTotalPrice, setTotalQuantities, toggleCartItemQuantity, onRemove
            }}
        >
            {children}
        </Context.Provider>
    )

}

export const useStateContext = () => useContext(Context);
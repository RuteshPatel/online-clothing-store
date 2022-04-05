import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BsFillXCircleFill } from "react-icons/bs";
import CartService from "../services/CartService"


function Cart(props) {
    const { getCartDetails, removeFromCart } = CartService
    const [CartData, SetCartData] = useState([])
    const [TotalAmount, SetTotalAmount] = useState(0)

    function MyCartList() {
        getCartDetails()
            .then((response) => {
                SetCartData(response.data['cart_data'])
                SetTotalAmount(response.data['total_amount'])
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    useEffect(() => {
        MyCartList()
    }, [])

    function RemoveItem(cart_id) {
        removeFromCart(cart_id)
            .then((response) => {
                props.setToaster(response.data['status'], response.data['message']);
                MyCartList()
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    return (
        <>
            {/* Bread Crumb */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>My Cart</h4>
                                <div className="breadcrumb__links">
                                    <NavLink to="/">
                                        Home
                                    </NavLink>
                                    <span>My Cart</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="shopping-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="shopping__cart__table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            CartData.length > 0 ?
                                                CartData.map((cart, index) => (
                                                    <tr>
                                                        <td className="product__cart__item">
                                                            <div className="product__cart__item__pic">
                                                                <img src={cart.product_image} alt="" />
                                                            </div>
                                                            <div className="product__cart__item__text">
                                                                <h6>{cart.product_name}</h6>
                                                                {/* <h5>${cart.product_price}</h5> */}
                                                            </div>
                                                        </td>
                                                        <td className="cart__price">${cart.product_price}</td>
                                                        <td className="cart__close" title='Remove from Cart' style={{ 'color': 'red', 'cursor': 'pointer' }} onClick={() => RemoveItem(cart.cart_id)} ><BsFillXCircleFill /></td>
                                                    </tr>
                                                ))
                                                :
                                                <tr style={{ 'text-align': 'center' }}><td colSpan="3">Your Cart is Empty</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cart__total">
                                <h6>Cart total</h6>
                                <ul>
                                    <li>Total <span>$ {TotalAmount}</span></li>
                                </ul>
                                <Link className="primary-btn" to="/checkout">Proceed to checkout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default Cart

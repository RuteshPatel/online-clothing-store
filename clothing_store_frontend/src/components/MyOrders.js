import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillXCircleFill } from "react-icons/bs";
import MyOrderService from "../services/MyOrderService"


function MyOrders(props) {
    const { getMyOrdersList } = MyOrderService
    const [OrdersData, SetOrdersData] = useState([])
    
    function MyOrdersList() {
        getMyOrdersList()
            .then((response) => {
                SetOrdersData(response.data['cart_data'])
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    useEffect(() => {
        MyOrdersList()
    }, [])
    return (
        <>
            {/* Bread Crumb */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>My Orders</h4>
                                <div className="breadcrumb__links">
                                    <NavLink to="/">
                                        Home
                                    </NavLink>
                                    <span>My Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="shopping-cart spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="shopping__cart__table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            OrdersData?.length > 0 ?
                                                OrdersData.map((orders, index) => (
                                                    <tr>
                                                        <td className="product__cart__item">
                                                            <div className="product__cart__item__pic">
                                                                <img src={orders.image} alt="" />
                                                            </div>
                                                            <div className="product__cart__item__text">
                                                                <h6>{orders.product_name}</h6>
                                                                <h5>{orders.brand}</h5>
                                                                <h5>{orders.category}</h5>
                                                            </div>
                                                        </td>
                                                        <td className="cart__status">{orders.status}</td>
                                                        <td className="cart__price">$ {orders.price}</td>
                                                        <td className="cart__close"><BsFillXCircleFill /></td>
                                                    </tr>
                                                ))
                                                :
                                                <tr style={{ 'text-align': 'center' }}><td colSpan="3">No Orders Found</td></tr>
                                        }
                                        {/* <tr>
                                            <td className="product__cart__item">
                                                <div className="product__cart__item__pic">
                                                    <img src="assets/img/shopping-cart/cart-1.jpg" alt="" />
                                                </div>
                                                <div className="product__cart__item__text">
                                                    <h6>T-shirt Contrast Pocket</h6>
                                                    <h5>$98.49</h5>
                                                </div>
                                            </td>
                                            <td className="cart__status">Delivered</td>
                                            <td className="cart__price">$ 30.00</td>
                                            <td className="cart__close"><i className="fa fa-close"></i></td>
                                        </tr>
                                        <tr>
                                            <td className="product__cart__item">
                                                <div className="product__cart__item__pic">
                                                    <img src="assets/img/shopping-cart/cart-2.jpg" alt="" />
                                                </div>
                                                <div className="product__cart__item__text">
                                                    <h6>Diagonal Textured Cap</h6>
                                                    <h5>$98.49</h5>
                                                </div>
                                            </td>
                                            <td className="cart__status">Delivered</td>
                                            <td className="cart__price">$ 32.50</td>
                                        </tr>
                                        <tr>
                                            <td className="product__cart__item">
                                                <div className="product__cart__item__pic">
                                                    <img src="assets/img/shopping-cart/cart-3.jpg" alt="" />
                                                </div>
                                                <div className="product__cart__item__text">
                                                    <h6>Basic Flowing Scarf</h6>
                                                    <h5>$98.49</h5>
                                                </div>
                                            </td>
                                            <td className="cart__status">Delivered</td>
                                            <td className="cart__price">$ 47.00</td>
                                        </tr>
                                        <tr>
                                            <td className="product__cart__item">
                                                <div className="product__cart__item__pic">
                                                    <img src="assets/img/shopping-cart/cart-4.jpg" alt="" />
                                                </div>
                                                <div className="product__cart__item__text">
                                                    <h6>Basic Flowing Scarf</h6>
                                                    <h5>$98.49</h5>
                                                </div>
                                            </td>
                                            <td className="cart__status">Delivered</td>
                                            <td className="cart__price">$ 30.00</td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default MyOrders

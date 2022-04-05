import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useForm } from "react-hook-form";
import CartService from "../services/CartService"
import CheckOutService from "../services/CheckOutService"



function Checkout() {
    const { getCartDetails } = CartService
    const { getUserAddresses } = CheckOutService
    const [CartData, SetCartData] = useState([])
    const [TotalAmount, SetTotalAmount] = useState(0)

    const [BillingAddress, SetBillingAddress] = useState([])
    const [DeliveryAddress, SetDeliveryAddress] = useState([])


    const { register, handleSubmit, formState: { errors } } = useForm();


    function MyCartList() {
        getCartDetails()
            .then((response) => {
                SetCartData(response.data['cart_data'])
                SetTotalAmount(response.data['total_amount'])
            })
    }
    function MyAddress() {
        getUserAddresses()
            .then((response) => {
                SetBillingAddress(response.data['billing_address'])
                SetDeliveryAddress(response.data['delivery_address'])
            })
    }
    useEffect(() => {
        MyCartList()
        MyAddress()
    }, [])
    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <>
            {/* Breadcrumb */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Check Out</h4>
                                <div className="breadcrumb__links">
                                    <NavLink to="/">
                                        Home
                                    </NavLink>
                                    <span>Check Out</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="checkout spad">
                <div className="container">
                    <div className="checkout__form">
                        <form onSubmit={handleSubmit(onSubmit)} >
                            <div className="row">
                                <div className="col-lg-8 col-md-6">
                                    <h6 className="checkout__title">Billing Details</h6>
                                    <div className="shopping__cart__table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Billing Address</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="product__cart__item" style={{ 'display': 'inline-flex' }}>
                                                        <div>
                                                            <input type="radio" />
                                                        </div>
                                                        {
                                                            BillingAddress.map((address, index) => (
                                                                <div style={{'margin-left': '20px'}}>
                                                                    <p>{address.address_1}, {address.address_2}, </p>
                                                                    <p>{address.city} {address.pincode}, </p>
                                                                    <p>{address.state}, {address.country}</p>
                                                                </div>

                                                            ))
                                                        }
                                                    </td>
                                                    {/* <td className="cart__price">${cart.product_price}</td> */}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="shopping__cart__table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Delivery Address</th>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <div style={{ 'display': 'inline-flex' }}>
                                                            <div>
                                                                <input type="radio" name='delivery_address' />
                                                            </div>
                                                            <div style={{'margin-left': '20px'}}>
                                                                <span>Same As Billing Address</span>
                                                            </div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    DeliveryAddress.map((address, index) => (
                                                        <tr>
                                                            <td className="product__cart__item" style={{ 'display': 'inline-flex' }}>
                                                                <div>
                                                                    <input type="radio" name='delivery_address' value={address.address_id} id={address.address_id} />
                                                                </div>
                                                                <div htmlFor={address.address_id} style={{'margin-left': '20px'}}>
                                                                    <p>{address.address_1}, {address.address_2}, </p>
                                                                    <p>{address.city} {address.pincode}, </p>
                                                                    <p>{address.state}, {address.country}</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        <div>
                                            <button className='btn btn-primary'>Add New Delivery Address</button>
                                        </div>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-lg-6">
                                            <div className="checkout__input">
                                                <p>Fist Name<span>*</span></p>
                                                <input type="text" className='form-control' name='firstname' id='firstname' />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="checkout__input">
                                                <p>Last Name<span>*</span></p>
                                                <input type="text" className='form-control' name='lastname' id='lastname' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="checkout__input">
                                        <p>Address<span>*</span></p>
                                        <input type="text" className='form-control' name='address' id='address' />
                                    </div>
                                    <div className="checkout__input">
                                        <p>Town/City<span>*</span></p>
                                        <input type="text" className='form-control' name='city' id='city' />
                                    </div>
                                    <div className="checkout__input">
                                        <p>Country/State<span>*</span></p>
                                        <input type="text" className='form-control' name='country' id='country' />
                                    </div>
                                    <div className="checkout__input">
                                        <p>Postcode / ZIP<span>*</span></p>
                                        <input type="text" className='form-control' name='zip_code' id='zip_code' />
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="checkout__input">
                                                <p>Phone<span>*</span></p>
                                                <input type="text" className='form-control' name='phone_no' id='phone_no' />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="checkout__input">
                                                <p>Email<span>*</span></p>
                                                <input type="text" className='form-control' name='email' id='email' />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="checkout__order">
                                        <h4 className="order__title">Your order</h4>
                                        <div className="checkout__order__products">Product <span>Total</span></div>
                                        <ul className="checkout__total__products">
                                            {CartData.map((cart, index) => (
                                                <li>{index + 1}. {cart.product_name}<span>$ {cart.product_price}</span></li>

                                            ))}
                                        </ul>
                                        <ul className="checkout__total__all">
                                            <li>Total <span>${TotalAmount}</span></li>
                                        </ul>
                                        <button type="submit" className="site-btn">PLACE ORDER</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Checkout

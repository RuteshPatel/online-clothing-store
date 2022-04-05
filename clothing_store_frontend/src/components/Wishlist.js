import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { BsFillHeartFill } from "react-icons/bs";
import WishlistService from "../services/WishlistService"



function Wishlist(props) {
    const { getWhishListDetails, removeFromWishList } = WishlistService
    const [WishlistData, SetWishlistData] = useState([])
    function MyWishlist() {
        getWhishListDetails()
            .then((response) => {
                SetWishlistData(response.data['wishlist_data'])
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function RemoveWishlist(wishlist_id) {
        removeFromWishList(wishlist_id)
            .then((response) => {
                props.setToaster(response.data['status'], response.data['message']);
                MyWishlist()
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    useEffect(() => {
        MyWishlist()
    }, [])
    return (
        <>
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Wishlist</h4>
                                <div className="breadcrumb__links">
                                    <NavLink to="/">
                                        Home
                                    </NavLink>
                                    <span>Wishlist</span>
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
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            WishlistData.length > 0 ?
                                                WishlistData.map((wishlist, index) => (
                                                    <tr>
                                                        <td className="product__cart__item">
                                                            <div className="product__cart__item__pic">
                                                                <img src={wishlist.product_image} alt="" />
                                                            </div>
                                                            <div className="product__cart__item__text">
                                                                <h6>{wishlist.product_name}</h6>
                                                            </div>
                                                        </td>
                                                        <td className="cart__price">$ {wishlist.product_price}</td>
                                                        <td className="cart__close" title='Remove from Wishlist' style={{ 'color': 'red', 'cursor': 'pointer' }} onClick={() => RemoveWishlist(wishlist.wishlist_id)}  ><BsFillHeartFill /></td>
                                                    </tr>
                                                ))
                                                :
                                                <tr style={{ 'text-align': 'center' }}><td colSpan="3">Your Wishlist is Empty</td></tr>
                                        }
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

export default Wishlist

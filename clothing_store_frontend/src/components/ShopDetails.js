import React, { useEffect, useState, Component } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useAuth } from "../store/userContext";
import ProductDetailService from "../services/ProductDetailService"


function ShopDetails(props) {
    const { getProductDetailList, getColorPriceStock, getPriceStock, addCart, addWishlist } = ProductDetailService

    const [getProductInfo, setProductInfo] = useState([])
    const [getProductDetails, setProductDetails] = useState([])
    const [getSizeDetails, setSizeDetails] = useState([])
    const [getColorDetails, setColorDetails] = useState([])
    const [getImageDetails, setImageDetails] = useState([])
    const [isSizeActive, setIsSizeActive] = useState(0);
    const [isColorActive, setColorActive] = useState(0);
    const [isImageState, setImageState] = useState(0);
    const [isCart, setCart] = useState('btn btn-outline-dark');
    const [CartText, setCartText] = useState('Add to Cart');

    const [isWishlist, setWishlist] = useState('btn btn-outline-dark');
    const [WishlistText, setWishlistText] = useState('Add to Wishlist');

    const auth = useAuth();
    let { id } = useParams();


    function ProductDetails() {
        getProductDetailList(id)
            .then((response) => {
                setProductInfo(response.data['product_info'])
                setProductDetails(response.data['product_details']);
                if (response.data['size_details'] && response.data['size_details'].length > 0) {
                    response.data['size_details'][0].active = true;
                }
                setSizeDetails(response.data['size_details']);
                setColorDetails(response.data['colors_details'])
                setImageDetails(response.data['image_details'])
                if (response.data['product_details']['cart'] == true) {
                    setCart('btn btn-dark')
                    setCartText('Remove from Cart')
                }
                else {
                    setCart('btn btn-outline-dark')
                    setCartText('Add to Cart')
                }
                if (response.data['product_details']['wishlist'] == true) {
                    setWishlist('btn btn-dark')
                    setWishlistText('Remove from Wishlist')
                }
                else {
                    setWishlist('btn btn-outline-dark')
                    setWishlistText('Add to Wishlist')
                }
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }

    useEffect(() => {
        ProductDetails()
    }, [])


    function changeSize(size_id, index) {
        getColorPriceStock(id, size_id)
            .then((response) => {
                setProductDetails(response.data['product_details']);
                setColorDetails(response.data['colors_details']);
                setImageDetails(response.data['image_details'])
                setIsSizeActive(index);
                if (response.data['product_details']['cart'] == true) {
                    setCart('btn btn-dark')
                    setCartText('Remove from Cart')
                }
                else {
                    setCart('btn btn-outline-dark')
                    setCartText('Add to Cart')
                }
                if (response.data['product_details']['wishlist'] == true) {
                    setWishlist('btn btn-dark')
                    setWishlistText('Remove from Wishlist')
                }
                else {
                    setWishlist('btn btn-outline-dark')
                    setWishlistText('Add to Wishlist')
                }
                localStorage.setItem("size_id", String(size_id))
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }

    function changeColor(color_id, index) {
        let size_id = parseInt(localStorage.getItem("size_id"))

        getPriceStock(id, size_id, color_id)
            .then((response) => {
                setProductDetails(response.data['product_details']);
                setImageDetails(response.data['image_details'])
                setColorActive(index);
                if (response.data['product_details']['cart'] == true) {
                    setCart('btn btn-dark')
                    setCartText('Remove from Cart')
                }
                else {
                    setCart('btn btn-outline-dark')
                    setCartText('Add to Cart')
                }
                if (response.data['product_details']['wishlist'] == true) {
                    setWishlist('btn btn-dark')
                    setWishlistText('Remove from Wishlist')
                }
                else {
                    setWishlist('btn btn-outline-dark')
                    setWishlistText('Add to Wishlist')
                }
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }

    function addToCart(product_combination_id) {
        let data = {
            'product_combination_id': product_combination_id
        }
        addCart(data)
            .then((response) => {
                props.setToaster(response.data['status'], response.data['message']);
                let cart_counter = document.getElementById('cart_counter');
                let counter_value =  cart_counter.innerHTML;
                if (response.data['is_cart']) {
                    setCart('btn btn-dark')
                    setCartText('Remove from Cart');
                    counter_value = parseInt(counter_value) + 1;
                } else {
                    setCart('btn btn-outline-dark')
                    setCartText('Add to Cart')
                    counter_value = parseInt(counter_value) - 1;
                }
                cart_counter.innerHTML = counter_value;
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function addToWishlist(product_combination_id) {
        let data = {
            'product_combination_id': product_combination_id
        }
        addWishlist(data)
            .then((response) => {
                props.setToaster(response.data['status'], response.data['message']);

                if (response.data['is_wishlist']) {
                    setWishlist('btn btn-dark')
                    setWishlistText('Remove from Wishlist')
                } else {
                    setWishlist('btn btn-outline-dark')
                    setWishlistText('Add to Wishlist')
                }
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function changeImage(index) {
        setImageState(index)
    }
    return (
        <>
            <section className="shop-details">
                <div className="product__details__pic">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="product__details__breadcrumb">
                                    <NavLink to='/'>
                                        Home
                                    </NavLink>
                                    <NavLink to='/shop'>
                                        Shop
                                    </NavLink>
                                    <span>Product Details</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-3">
                                <ul className="nav nav-tabs" role="tablist">
                                    {getImageDetails.map((images, index) => (
                                        <li className="nav-item">
                                            <a className={`nav-link ${isImageState == index ? 'active' : ''}`} data-toggle="tab" href="javascript:void(0)" onClick={() => changeImage(index)} role="tab">
                                                <div className="product__thumb__pic">
                                                    <img src={images} />
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-lg-6 col-md-9">
                                <div className="tab-content">
                                    {getImageDetails.map((images, index) => (
                                        <div className={`tab-pane ${isImageState == index ? 'active' : ''}`} id={index} role="tabpanel">
                                            <div className="product__details__pic__item">
                                                <img src={images} alt="" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product__details__content">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <div className="product__details__text">
                                    <h4>{getProductInfo['product_name']}</h4>
                                    <div className="product__details__option">
                                        <div className="product__details__option__size">
                                            <span>Size:</span>
                                            {getSizeDetails.map((sizes, index) => (
                                                <label htmlFor={sizes.size_id} className={isSizeActive == index ? 'active' : ''} onClick={() => changeSize(sizes.size_id, index)} >{sizes.short_code}
                                                </label>
                                            ))}
                                        </div>
                                        <div className="product__details__option__color">
                                            <span>Color:</span>
                                            {getColorDetails.map((colors, index) => (
                                                <label htmlFor={colors.color_id} style={{ 'backgroundColor': colors.color_code }} className={isColorActive == index ? 'active' : ''} onClick={() => changeColor(colors.color_id, index)} >
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="product__details__cart__option">
                                        <div className="quantity">
                                            <div>
                                                <h5>Price: <strong>${getProductDetails['prices']}</strong></h5>
                                            </div>
                                            <div>
                                                <h5>Available Stocks: <strong>{getProductDetails['stock']}</strong></h5>
                                            </div>
                                        </div>
                                        <div className="product__details__btns__option">
                                            <a href="javascript:void(0)" className={isCart} onClick={() => addToCart(getProductDetails['product_combination_id'])} style={auth.user ? { 'pointer-events': 'unset', 'opacity': 'unset' } : { 'pointer-events': 'none', 'opacity': '0.5' }} >{CartText}</a>
                                            <a href="javascript:void(0)" className={isWishlist} onClick={() => addToWishlist(getProductDetails['product_combination_id'])} style={auth.user ? { 'pointer-events': 'unset', 'opacity': 'unset' } : { 'pointer-events': 'none', 'opacity': '0.5' }} >{WishlistText}</a>
                                        </div>
                                    </div>
                                    <div className="product__details__last__option">
                                        <ul>
                                            <li><span>SKU:</span> {getProductInfo['product_id']}</li>
                                            <li><span>Categories:</span> {getProductInfo['category']}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="product__details__tab">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" data-toggle="tab" href="#tabs-5"
                                                role="tab">Description</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#tabs-6" role="tab">&nbsp;</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#tabs-7" role="tab">&nbsp;</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="tabs-5" role="tabpanel">
                                            <div className="product__details__tab__content">
                                                <div className="product__details__tab__content__item">
                                                    <h5>Products Infomation</h5>
                                                    <p>{getProductInfo['description']}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ShopDetails;


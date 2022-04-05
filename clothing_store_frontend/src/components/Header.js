import React, { Component, useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from "../store/userContext";
import { BsHeartFill, BsCartPlus } from "react-icons/bs";
import HeaderService from "../services/HeaderService"



function Header(props) {
    const { getUserCartInfo } = HeaderService


    const [selectdTabName, setSelectedTab] = useState([])
    const [subSelectdTabName, setSubSelectedTab] = useState()
    const [CartValue, setCartValue] = useState(0)
    const [HideSubMenu, setHideSubMenu] = useState(true)
    const auth = useAuth();
    useEffect(() => {
        setSelectedTab('home');
        setSubSelectedTab('')
        setHideSubMenu(false)
    }, [])

    useEffect(() => {
        if (auth.user) {
            getUserCartInfo()
                .then((response) => {
                    setCartValue(response.data['total_items']);
                })
                .catch((error) => {
                    props.setToaster('danger', error.response.data.message);
                });
        }
    }, [auth?.user])

    function ChangeTab(tab_name) {
        setSelectedTab(tab_name)
        if (tab_name != "dropdown") {
            setSubSelectedTab('')
            setHideSubMenu(false)
        }
    }
    function ChangeSubTab(sub_tab_name) {
        setSubSelectedTab(sub_tab_name)
        setHideSubMenu(true)
    }

    return (
        <header className="header">
            <div className="header__top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-7"></div>
                        <div className="col-lg-6 col-md-5">
                            <div className="header__top__right">
                                <div className="header__top__links">
                                    {auth.user && <Link to="/logout" onClick={() => ChangeTab('login')}>Log Out</Link>}
                                    {
                                        !auth.user &&
                                        <>
                                            <Link to="/login">Sign In</Link>
                                            <Link to="/signup">Sign Up</Link>
                                        </>
                                    }

                                    <a href="/">FAQs</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <div className="header__logo">
                            <NavLink to='/' >
                                <h3 onClick={() => setSelectedTab('home')}><strong>Clothing Store<span style={{ 'color': 'crimson' }}>.</span></strong></h3>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <nav className="header__menu mobile-menu">
                            <ul>
                                <li className={selectdTabName == 'home' ? 'active' : ''} onClick={() => ChangeTab('home')}>
                                    <NavLink activeClassName="active" to='/'>
                                        Home
                                    </NavLink>
                                </li>
                                <li className={selectdTabName == 'shop' ? 'active' : ''} onClick={() => ChangeTab('shop')}>
                                    <NavLink to='/shop'>
                                        Shop
                                    </NavLink>
                                </li>
                                {
                                    auth.user &&
                                    <li className={selectdTabName == 'dropdown' ? 'active' : ''} onClick={() => ChangeTab('dropdown')} onMouseOver={() => setHideSubMenu(false)}><Link to="/orders">Account</Link>
                                        <ul className={HideSubMenu ? 'dropdown selected' : 'dropdown'}>
                                            <li className={subSelectdTabName == 'order' ? 'actives' : ''} onClick={() => ChangeSubTab('order')}>
                                                <Link to='/orders'>My Orders</Link>
                                            </li>
                                            <li className={subSelectdTabName == 'cart' ? 'actives' : ''} onClick={() => ChangeSubTab('cart')}>
                                                <Link to='/cart'>My Cart {HideSubMenu}</Link>
                                            </li>
                                            <li className={subSelectdTabName == 'wishlist' ? 'actives' : ''} onClick={() => ChangeSubTab('wishlist')}>
                                                <Link to='/wishlist'>Wishlist</Link>
                                            </li>
                                            <li className={subSelectdTabName == 'checkout' ? 'actives' : ''} onClick={() => ChangeSubTab('checkout')}>
                                                <Link to='/checkout'>Checkout</Link>
                                            </li>
                                        </ul>
                                    </li>
                                }
                            </ul>
                        </nav>
                    </div>
                    <div className="col-lg-3 col-md-3">
                        {auth.user &&
                            <div className="header__nav__option">
                                <Link to='/wishlist' title='My Wishlist'>
                                    <BsHeartFill />
                                </Link>
                                <Link to='/cart' title='My Cart'>
                                    <BsCartPlus />
                                    <span className='cart_counter' id="cart_counter">{CartValue}</span>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
                <div className="canvas__open"><i className="fa fa-bars"></i></div>
            </div>
        </header>
    )
}

export default Header

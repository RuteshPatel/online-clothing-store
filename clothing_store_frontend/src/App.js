import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { Component, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header'
import Footer from './components/Footer'
import Shop from './components/Shop';
import ShopDetails from './components/ShopDetails';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import MyOrders from './components/MyOrders';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { AuthProvider } from './store/userContext'
import Logout from './components/Logout';
import Toaster from './Toaster/toaster'
const App = () => {
    const [showToaster, setShowToaster] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [toasterClassName, setToasterClassName] = useState();

    const updateToaster = (className, message) => {
        setToasterMessage(message);
        setToasterClassName(className);
        setShowToaster(true);
    }
    return (
        <>
            <AuthProvider>
                <Header setToaster={updateToaster} />
                <Toaster show={showToaster} setShow={setShowToaster} message={toasterMessage} className={toasterClassName} />
                <Routes>
                    <Route path="/login" element={<Login setToaster={updateToaster} />} />
                    <Route path="/signup" element={<SignUp setToaster={updateToaster} />} />
                    <Route path="/logout" element={<Logout setToaster={updateToaster} />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop-details/:id" element={<ShopDetails setToaster={updateToaster} />} />
                    <Route path="/cart" element={
                        <RequireAuth>
                            <Cart setToaster={updateToaster} />
                        </RequireAuth>
                    } />
                    <Route path="/wishlist" element={
                        <RequireAuth>
                            <Wishlist setToaster={updateToaster} />
                        </RequireAuth>
                    } />
                    <Route path="/checkout" element={
                        <RequireAuth>
                            <Checkout />
                        </RequireAuth>
                    } />
                    <Route path="/orders" element={
                        <RequireAuth>
                            <MyOrders />
                        </RequireAuth>
                    } />
                </Routes>
                <Footer />
            </AuthProvider>
        </>
    )
}


export default App;




function RequireAuth({ children }) {
    let access_token = '';
    let location = useLocation();
    if (!localStorage.getItem("access_token")) {
        // access_token = localStorage.getItem("access_token");
        // return <Navigator 
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    access_token = localStorage.getItem("access_token");
    return children;
}
import React, { Component } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { useAuth } from "../store/userContext";
import LoginService from '../services/LoginService';

function Login(props) {
    const { getLoggedIn } = LoginService

    let navigate = useNavigate()
    const auth = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        let login_details = {
            'username': data.username,
            'password': data.password,
        }
        getLoggedIn(login_details)
            .then((response) => {
                props.setToaster('success', response.data.message);
                localStorage.setItem("access_token", response.data['data']['token'])
                navigate('/')
                auth.login(response.data['data']['token'])
            })
            .catch((error) => {
                navigate('/login')
                props.setToaster('danger', error.response.data.message);
            });
    }
    return (
        <>
            <section className="spad">
                <div className="container">
                    <form onSubmit={handleSubmit(onSubmit)} className='login_form'>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 offset-3">
                                <h6 className="checkout__title">Login</h6>
                                <div className="checkout__input">
                                    <p>Username <span>*</span></p>
                                    <input type="text" placeholder='Username' {...register("username", { required: true })} id='username' />
                                    {errors.username && <label className='error'>Please enter Username</label>}
                                </div>
                                <div className="checkout__input">
                                    <p>Password<span>*</span></p>
                                    <input type="password" placeholder='Password' {...register("password", { required: true })} id='password' />
                                    {errors.password && <label className='error'>Please enter Password</label>}
                                </div>
                                <button type="submit" className="site-btn">LOGIN</button>
                                <Link to="/signup" className="site-btn" style={{ 'float': 'right' }}>
                                    Create an Account
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}


export default Login

import React, { useEffect, useState, Component } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";



function SignUp() {
    let navigate = useNavigate()


    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isConfirmPasswordError, setConfirmPasswordError] = useState(0);
    const onSubmit = (data) => {
        if (data.password != data.confirm_password) {
            setConfirmPasswordError(1);
        }
        else {
            let final_data = {}
            final_data['personal_data'] = {
                'first_name': data.first_name,
                'password': data.password,
                'phone': data.phone,
                'username': data.username,
                'email': data.email,
            }
            final_data['address_data'] = {
                "address_1": data.address_1,
                "address_2": data.address_2,
                "city": data.city,
                "pin_code": data.pin_code,
                "state": data.state,
                "country": data.country
            }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(final_data)
            };
            fetch('http://127.0.0.1:8000/api/registration/', requestOptions)
                .then(response => response.json())
                .then(
                    (result) => {
                        if(result.status == "Success")
                        {
                            alert(result.message)
                            navigate('/login')
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }
    return (
        <>
            <section className="spad">
                <div className="container">
                    <h4 className="checkout__title">Sign Up</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className='signup_form'>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <h5 className="checkout__title">Personal Information</h5>
                                <div class="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Fist Name<span>*</span></p>
                                            <input
                                                placeholder='First Name'
                                                type="text" id="first_name"
                                                {...register("first_name", { required: true })}
                                            />
                                            {errors.first_name && <label className='error'>Please enter First Name</label>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Last Name<span>*</span></p>
                                            <input type="text" placeholder='Last Name' {...register("last_name", { required: true })} id='last_name' />
                                            {errors.last_name && <label className='error'>Please enter Last Name</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout__input">
                                    <p>Username<span>*</span></p>
                                    <input type="text" placeholder='Username' {...register("username", { required: true })} id='username' />
                                    {errors.username && <label className='error'>Please enter Username</label>}
                                </div>
                                <div class="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Password<span>*</span></p>
                                            <input type="password" placeholder='Password' {...register("password", { required: true })} id='password' />
                                            {errors.password && <label className='error'>Please enter Password</label>}
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Confirm Password<span>*</span></p>
                                            <input type="password" placeholder='Confirm Password' {...register("confirm_password", { required: true })} id='confirm_password' />
                                            {errors.confirm_password && <label className='error'>Please enter Confirm Password</label>}
                                            <label className='error' style={{ 'display': isConfirmPasswordError ? '' : 'none' }}>Password and Confirm Password must be same</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout__input">
                                    <p>Phone No.<span>*</span></p>
                                    <input type="text" placeholder='Phone No.' {...register("phone", { required: true })} id='phone' />
                                    {errors.phone && <label className='error'>Please enter Phone No.</label>}
                                </div>
                                <div className="checkout__input">
                                    <p>Email<span>*</span></p>
                                    <input type="text" placeholder='Email' {...register("email", { required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} id='email' />
                                    {errors.email && errors.email.type == "required" && <label className='error'>Please enter Email</label>}
                                    {errors.email && errors.email.type == "pattern" && <label className='error'>Please enter proper Email</label>}
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-sm-12">
                                <h5 className="checkout__title">Address Information</h5>
                                <div class="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Address Line 1<span>*</span></p>
                                            <input type="text" placeholder='Address Line 1' {...register("address_1", { required: true })} id='address_1' />
                                            {errors.address_1 && <label className='error'>Please enter Address Line 1</label>}

                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <div className="checkout__input">
                                            <p>Address Line 2<span>*</span></p>
                                            <input type="text" placeholder='Address Line 2' {...register("address_2", { required: true })} id='address_2' />
                                            {errors.address_2 && <label className='error'>Please enter Address Line 2</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="checkout__input">
                                    <p>City<span>*</span></p>
                                    <input type="text" placeholder='City' {...register("city", { required: true })} name='city' id='city' />
                                    {errors.city && <label className='error'>Please enter City</label>}
                                </div>
                                <div className="checkout__input">
                                    <p>Pincode<span>*</span></p>
                                    <input type="text" placeholder='Pincode' {...register("pin_code", { required: true })} id='pin_code' />
                                    {errors.pin_code && <label className='error'>Please enter Pincode</label>}
                                </div>
                                <div className="checkout__input">
                                    <p>State<span>*</span></p>
                                    <input type="text" placeholder='State' {...register("state", { required: true })} id='state' />
                                    {errors.state && <label className='error'>Please enter State</label>}
                                </div>
                                <div className="checkout__input">
                                    <p>Country<span>*</span></p>
                                    <input type="text" placeholder='Country' {...register("country", { required: true })} id='country' />
                                    {errors.country && <label className='error'>Please enter Country</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ 'margin-top': ' 20px' }}>
                            <div className='col-lg-6 col-md-6 col-sm-6' style={{ 'text-align': 'right' }}>
                                <button type="submit" className="site-btn">Sign Up</button>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <Link to="/login" className="site-btn">
                                    Already have an account? Sign In
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section >
        </>
    )
}

export default SignUp

import React, { Component } from 'react'

class Banner extends Component {
    render() {
        return (
            <section className="banner spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 offset-lg-4">
                            <div className="banner__item">
                                <div className="banner__item__pic">
                                    <img src="assets/img/product/home_mens.jpeg" alt="" />
                                </div>
                                <div className="banner__item__text">
                                    <h2>Mens Collections</h2>
                                    <a href="/">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="banner__item banner__item--middle">
                                <div className="banner__item__pic">
                                    <img src="assets/img/product/home_women.jpg" alt="" />
                                </div>
                                <div className="banner__item__text">
                                    <h2>Women Collections</h2>
                                    <a href="/">Shop now</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="banner__item banner__item--last">
                                <div className="banner__item__pic">
                                    <img src="assets/img/product/home_kid.jpeg" alt="" />
                                </div>
                                <div className="banner__item__text">
                                    <h2>Kids Collections</h2>
                                    <a href="/">Shop now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Banner

import React, { Component } from 'react'

class Product extends Component {
    render() {
        return (
            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <ul className="filter__controls">
                                <li className="active" data-filter="*">Best Sellers</li>
                                <li data-filter=".new-arrivals">New Arrivals</li>
                                <li data-filter=".hot-sales">Hot Sales</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row product__filter">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals">
                            <div className="product__item">
                                <div className="product__item__pic set-bg">
                                    <img src="assets/img/product/product-1.jpg" />
                                    <span className="label">New</span>
                                    <ul className="product__hover">
                                        <li><a href="#"><img src="assets/img/icon/heart.png" alt="" /></a></li>
                                    </ul>
                                </div>
                                <div className="product__item__text">
                                    <h6>Piqué Biker Jacket</h6>
                                    <h5>$67.24</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix hot-sales">
                            <div className="product__item">
                                <div className="product__item__pic set-bg">
                                    <img src="assets/img/product/product-2.jpg" />
                                    <ul className="product__hover">
                                        <li><a href="#"><img src="assets/img/icon/heart.png" alt="" /></a></li>
                                    </ul>
                                </div>
                                <div className="product__item__text">
                                    <h6>Piqué Biker Jacket</h6>
                                    <h5>$67.24</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Product

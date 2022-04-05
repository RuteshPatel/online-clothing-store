import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="footer__about">
                                <div className="footer__logo">
                                    <a href="#"><h3 style={{ 'color': '#FFFF' }}><strong>Clothing Store<span style={{ 'color': 'crimson' }}>.</span></strong></h3></a>
                                </div>
                                <p>The customer is at the heart of our unique business model, which includes design.</p>
                                <a href="#"><img src="assets/img/payment.png" alt="" /></a>
                            </div>
                        </div>
                        <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
                            <div className="footer__widget">
                                <h6>Shopping</h6>
                                <ul>
                                    <li><a href="#">Men Store</a></li>
                                    <li><a href="#">Women Store</a></li>
                                    <li><a href="#">Kid Store</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-3 col-sm-6">
                            <div className="footer__widget">
                                <h6>Shopping</h6>
                                <ul>
                                    <li><a href="#">Contact Us</a></li>
                                    <li><a href="#">Payment Methods</a></li>
                                    <li><a href="#">Delivery</a></li>
                                    <li><a href="#">Return & Exchanges</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="footer__copyright__text">
                                <p>Copyright ©
                                    <script>
                                        document.write(new Date().getFullYear());
                                    </script>2020
                                    All rights reserved | This template is made with <i className="fa fa-heart-o"
                                        aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer

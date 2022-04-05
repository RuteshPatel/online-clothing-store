import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ShopService from '../services/ShopService';
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";




function Shop(props) {
    const { getCategoryList, getBrandList, getColorList, getSizeList, getProductList, getProductFilter } = ShopService;

    const [getCategories, setCategoryList] = useState([])
    const [getBrands, setBrandList] = useState([])
    const [getSizes, setSizeList] = useState([])
    const [getColors, setColorList] = useState([])
    const [getProducts, setProductList] = useState([])
    const [getTotalPages, setTotalPages] = useState()

    const [getSelectedCategory, setSelectedCategory] = useState([])
    const [getSelectedBrand, setSelectedBrand] = useState([])
    const [getSelectedSize, setSelectedSize] = useState([])
    const [getSelectedColor, setSelectedColor] = useState([])

    const [getPaginationArray, setPaginationArray] = useState([])
    const [getCurrentPageLink, setCurrentPageLink] = useState()
    const [getNextPageLink, setNextPageLink] = useState(null)
    const [getPreviousPageLink, setPreviousPageLink] = useState(null)

    const [getNextPage, setNextPage] = useState()
    const [getPreviousPage, setPreviousPage] = useState()


    const filter_data = []

    function categoryList() {
        getCategoryList()
            .then((response) => {
                setCategoryList(response.data)
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function brandList() {
        getBrandList()
            .then((response) => {
                setBrandList(response.data)
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function colorList() {
        getColorList()
            .then((response) => {
                setColorList(response.data)
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function sizeList() {
        getSizeList()
            .then((response) => {
                setSizeList(response.data)
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    function productList(page_num = 1) {
        getProductList(page_num)
            .then((response) => {
                console.log(response.data)
                setProductList(response.data['product_details'])
                setTotalPages(response.data['total_pages'])
                setCurrentPageLink(page_num)
                setNextPageLink(response.data['next'])
                setPreviousPageLink(response.data['previous'])

                setNextPage(parseInt(page_num) + 1)
                setPreviousPage(parseInt(page_num) - 1)

                const pageArray = new Array(response.data['total_pages'])?.fill(0);
                setPaginationArray(pageArray.map((x, i) => { return i + 1; }));
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }

    useEffect(() => {
        productList(1)
        categoryList()
        brandList()
        colorList()
        sizeList()
    }, [])

    function selectCategory(event, category_id) {
        if (event.target.classList.contains('active')) {
            event.target.classList.remove('active')
            // selected_category.pop(category_id);
        } else {
            event.target.classList.add('active');
            setSelectedCategory(getSelectedCategory => [...getSelectedCategory, category_id])
        }

        console.log(getSelectedCategory)
        
        // filter_data['category'] = getSelectedCategory
        // console.log(filter_data);
        // getFilteredData(filter_data)
    }
    function selectBrand(event, brand_id) {
        if (event.target.classList.contains('active')) {
            event.target.classList.remove('active')
            getSelectedBrand.pop(brand_id);
        } else {
            event.target.classList.add('active');
            getSelectedBrand.push(brand_id);
        }
        console.log(getSelectedBrand);
        filter_data['brand'] = getSelectedBrand
        getFilteredData(filter_data)
    }
    function selectSize(event, size_id) {
        if (event.target.classList.contains('active')) {
            event.target.classList.remove('active')
            getSelectedSize.pop(size_id);
        } else {
            event.target.classList.add('active');
            getSelectedSize.push(size_id);
        }
        console.log(getSelectedSize);
        filter_data['size'] = getSelectedSize
        getFilteredData(filter_data)

    }
    function selectColor(event, color_id) {
        if (event.target.classList.contains('active')) {
            event.target.classList.remove('active')
            getSelectedColor.pop(color_id);
        } else {
            event.target.classList.add('active');
            getSelectedColor.push(color_id);
        }
        console.log(getSelectedColor);
        filter_data['color'] = getSelectedColor
        getFilteredData(filter_data)
    }

    function getFilteredData(filter_data) {
        console.log(filter_data)
        getProductFilter(filter_data)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                props.setToaster('danger', error.response.data.message);
            });
    }
    return (
        <>
            {/* Bread Crumb */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Shop</h4>
                                <div className="breadcrumb__links">
                                    <NavLink to='/'>
                                        Home
                                    </NavLink>
                                    <span>Shop</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="shop spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="shop__sidebar">
                                <div className="shop__sidebar__search">
                                    <form action="/">
                                        <span className="icon_search"></span>
                                    </form>
                                </div>
                                <div className="shop__sidebar__accordion">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseOne">Categories</a>
                                            </div>
                                            <div id="collapseOne" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__categories">
                                                        <ul className="nice-scroll">
                                                            {getCategories.map((category) => (
                                                                <li>
                                                                    <a href="javascript:void(0)" onClick={(event) => selectCategory(event, category.id)} >{category.name}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseTwo">Branding</a>
                                            </div>
                                            <div id="collapseTwo" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__brand">
                                                        <ul>
                                                            {getBrands.map((brand) => (
                                                                <li><a href="javascript:void(0)" onClick={(event) => selectBrand(event, brand.id)} >{brand.name}</a></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseThree">Filter Price</a>
                                            </div>
                                            <div id="collapseThree" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__price">
                                                        <ul>
                                                            <li><a href="/">$0.00 - $50.00</a></li>
                                                            <li><a href="/">$50.00 - $100.00</a></li>
                                                            <li><a href="/">$100.00 - $150.00</a></li>
                                                            <li><a href="/">$150.00 - $200.00</a></li>
                                                            <li><a href="/">$200.00 - $250.00</a></li>
                                                            <li><a href="/">250.00+</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseFour">Size</a>
                                            </div>
                                            <div id="collapseFour" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">selectSize
                                                    <div className="shop__sidebar__size">
                                                        {getSizes.map((size) => (
                                                            <label for={size.short_code} onClick={(event) => selectSize(event, size.id)}>{size.short_code}</label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-heading">
                                                <a data-toggle="collapse" data-target="#collapseFive">Colors</a>
                                            </div>
                                            <div id="collapseFive" className="collapse show" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <div className="shop__sidebar__color">
                                                        {getColors.map((color) => (
                                                            <label onClick={(e) => selectColor(e, color.id)} for={color.id} style={{ 'background-color': color.color_code }}></label>

                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="shop__product__option">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="shop__product__option__left">
                                            <p>Showing 1–12 of 126 results</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <div className="shop__product__option__right">
                                            <p>Sort by Price:</p>
                                            <select>
                                                <option value="">Low To High</option>
                                                <option value="">$0 - $55</option>
                                                <option value="">$55 - $100</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {getProducts.map((products) => (
                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="">
                                            <Link to={`/shop-details/${products.product_id}`}>
                                                <div className="product__item__pic">
                                                    <img src={products.images} height="260px" width="260px" alt={products.product_name} style={{ 'object-fit': 'cover' }} />
                                                </div>
                                                <div className="product__item__text">
                                                    <h6>{products.product_name}</h6>
                                                    <h5>${products.prices}</h5>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="product__pagination">
                                        <a className={getPreviousPageLink ? '' : 'link_disabled'} href="javascript:void(0)" onClick={() => productList(getPreviousPage)}><BsChevronLeft /></a>
                                        {
                                            getPaginationArray?.length > 0 &&
                                            getPaginationArray.map((data) => {
                                                return <a className={getCurrentPageLink == data ? 'active' : ''} href="javascript:void(0)" onClick={() => productList(data)}>{data}</a>
                                            })
                                        }
                                        <a className={getNextPageLink ? '' : 'link_disabled'} href="javascript:void(0)" onClick={() => productList(getNextPage)}><BsChevronRight /></a>
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

export default Shop

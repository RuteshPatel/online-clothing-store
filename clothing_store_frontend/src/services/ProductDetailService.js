import API from "../Axios/AxiosService"

/*
    Get All Details of Particular Product Based on Product ID
    @param {*} id
    @return axios promise object
*/
const getProductDetailList = (id) => API.get(`product-details/${id}`)

/*
    Get All Details of Particular Product Color, Price & Stock Based on Product ID & Size ID
    @param {*} id, size_id
    @return axios promise object
*/
const getColorPriceStock = (id, size_id) => API.get(`product-detail-info/${id}/${size_id}`)


/*
    Get All Details of Particular Product Price & Stock Based on Product ID, Size ID & Color ID
    @param {*} id, size_id, color_id
    @return axios promise object
*/
const getPriceStock = (id, size_id, color_id) => API.get(`product-detail-info/${id}/${size_id}/${color_id}`)

/*
    Add to Cart
    @param {*} data
    @return axios promise object
*/
const addCart = (data) => API.post(`add-cart/`, data)

/*
    Add to Wishlist
    @param {*} data
    @return axios promise object
*/
const addWishlist = (data) => API.post(`add-wishlist/`, data)



export default { getProductDetailList, getColorPriceStock, getPriceStock, addCart, addWishlist }

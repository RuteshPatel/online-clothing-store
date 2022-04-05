import API from "../Axios/AxiosService"

/*
    Get all Products available in Cart
    @param {}
    @return axios promise object
*/
const getCartDetails = () => API.get(`my-cart`)

/*
    Delete Products from Cart [Remove from Cart]
    @param {*} cart_id
    @return axios promise object
*/
const removeFromCart = (cart_id) => API.delete(`remove-cart/${cart_id}`)

export default { getCartDetails, removeFromCart }

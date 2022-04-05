import API from "../Axios/AxiosService"

/*
    Get all Products available in Wishlist
    @param {}
    @return axios promise object
*/
const getWhishListDetails = () => API.get(`my-wishlist`)


/*
    Delete Products from Wishlist [Remove from Wishlist]
    @param {*} wishlist_id
    @return axios promise object
*/
const removeFromWishList = (wishlist_id) => API.delete(`remove-wishlist/${wishlist_id}`)


export default { getWhishListDetails, removeFromWishList }

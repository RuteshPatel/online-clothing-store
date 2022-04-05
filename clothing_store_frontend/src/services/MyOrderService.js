import API from "../Axios/AxiosService"

/*
    Get My Orders
    @param {}
    @return axios promise object
*/
const getMyOrdersList = () => API.get(`my-orders`)

export default { getMyOrdersList }

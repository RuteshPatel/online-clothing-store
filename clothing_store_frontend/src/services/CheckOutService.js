import API from "../Axios/AxiosService"

/*
    Get User Billing and Deliery Address
    @param {}
    @return axios promise object
*/
const getUserAddresses = () => API.get(`get-address`)


export default { getUserAddresses }

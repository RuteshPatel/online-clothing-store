import API from "../Axios/AxiosService"

/*
    Get Cart Counter
    @param {}
    @return axios promise object
*/
const getUserCartInfo = () => API.get(`home-info`)

export default { getUserCartInfo }
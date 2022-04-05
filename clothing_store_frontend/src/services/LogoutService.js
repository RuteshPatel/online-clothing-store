import API from "../Axios/AxiosService"

/*
    User Logout
    @param {*} data
    @return axios promise object
*/
const getLoggedOut = (data) => API.post(`logout/`, data)


export default { getLoggedOut }
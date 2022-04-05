import API from "../Axios/AxiosService"

/*
    User Login
    @param {*} data
    @return axios promise object
*/
const getLoggedIn = (data) => API.post(`login/`, data)


export default { getLoggedIn }
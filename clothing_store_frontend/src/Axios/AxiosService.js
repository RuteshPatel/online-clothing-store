import axios from "axios";
const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
};
if (localStorage.getItem("access_token")) {
    requestOptions['headers'] = { "Authorization": "Token " + localStorage.getItem("access_token") }
}


export default axios.create({
    baseURL: `http://127.0.0.1:8000/api/`,
    headers: requestOptions['headers'],
});

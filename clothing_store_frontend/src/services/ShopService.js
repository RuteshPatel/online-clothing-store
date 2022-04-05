import API from "../Axios/AxiosService"


/*
    Get Category List
    @param {}
    @return axios promise object
*/
const getCategoryList = () => API.get(`category-list`)

/*
    Get Brand List
    @param {}
    @return axios promise object
*/
const getBrandList = () => API.get(`brands-list`)

/*
    Get Color List
    @param {}
    @return axios promise object
*/
const getColorList = () => API.get(`color-list`)

/*
    Get Size List
    @param {}
    @return axios promise object
*/
const getSizeList = () => API.get(`sizes-list`)

/*
    Get Product List
    @param {}
    @return axios promise object
*/
const getProductList = (page_num=1) => API.get(`products-list?p=${page_num}`)

/*
    Get Product based on Filter values passed in data
    @param {*} data
    @return axios promise object
*/
const getProductFilter = (data) => API.post(`filter-product/`, data)

export default { getCategoryList, getBrandList, getColorList, getColorList, getSizeList, getProductList, getProductFilter }
import React, { useEffect } from 'react'
import { useAuth } from "../store/userContext";
import LogoutService from '../services/LogoutService';
import { Link, useNavigate } from 'react-router-dom'


function Logout(props) {
    const { getLoggedOut } = LogoutService

    let navigate = useNavigate()
    const auth = useAuth();

    function userLogout() {
        let logout_details = {
            'token': localStorage.getItem("access_token"),
        }
        getLoggedOut(logout_details)
            .then((response) => {
                props.setToaster(response.data.status, response.data.message);
                localStorage.clear();
                auth.logout()
            })
            .catch((error) => {
                navigate('/home')
                props.setToaster('danger', error.response.data.message);
            });
    }

    useEffect(() => {
        userLogout()
    }, [])
    return (
        <></>
    )
}
export default Logout

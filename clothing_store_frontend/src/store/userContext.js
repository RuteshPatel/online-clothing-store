import React, { useState, createContext, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState();
	let navigate = useNavigate();
	useEffect(() => {
		if (!localStorage.getItem("access_token")) {
			setUser(null);
		} else {
			let access_token = localStorage.getItem("access_token");
			setUser(access_token);
		}
	}, [])

	const login = user => {
		setUser(user)
	}

	const logout = () => {
		setUser(null);
		navigate('/login');
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	return useContext(AuthContext)
}

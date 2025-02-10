import axios from "axios";
import { createContext, useEffect, useState } from "react"
import { toast } from "react-toastify";

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials=true;
    const apiUrl = import.meta.env.VITE_API_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(apiUrl + '/api/auth/is-auth')
            if (data.status) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(apiUrl + '/api/user/data')
            data.status ? setUserData(data.userData) : toast.error(data.error)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])
    const value = {
        apiUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(); 

const UserProvider = ({ children }) => {  
    // Initialize user state from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Update localStorage when user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // console.log('User data from localStorage:', parsedUser);
            setUser(parsedUser);
        }
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
    };

    const clearUser = () => {  
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>  
            {children}  
        </UserContext.Provider>
    );
};

export default UserProvider;

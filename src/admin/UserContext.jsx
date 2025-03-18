import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cUSer, setCUSer] = useState(null);

  useEffect(() => {
    // Try to get user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCUSer(storedUser);
    } else {
      // If no user in local storage, fetch from backend
      axios.get('/api/current_user')
        .then(response => {
          setCUSer(response.data);
          localStorage.setItem('currentUser', JSON.stringify(response.data));
        })
        .catch(err => console.error('Failed to fetch user:', err));
    }
  }, []);

  return (
    <UserContext.Provider value={{ cUSer }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;                  

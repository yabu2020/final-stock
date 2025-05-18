import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cUSer, setCUSer] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;

    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCUSer(storedUser);
    } else {
      axios.get("http://localhost:3001/api/current_user")
        .then(res => {
          setCUSer(res.data);
          localStorage.setItem("currentUser", JSON.stringify(res.data));
        })
        .catch(err => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ cUSer, setCUSer }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

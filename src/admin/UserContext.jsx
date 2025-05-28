import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cUSer, setCUSer] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;

    const storedUser = JSON.parse(localStorage.getItem('currentUser'));

    // If user exists in localStorage, fetch latest data from DB
    if (storedUser && storedUser._id) {
      fetchFullUser(storedUser._id);
    } else {
      // Otherwise, get current session user
      axios.get("http://localhost:3001/api/current_user")
        .then(res => {
          const user = res.data;
          localStorage.setItem("currentUser", JSON.stringify(user));
          fetchFullUser(user._id); // Now fetch full user details
        })
        .catch(err => {
          console.error("Failed to fetch user session:", err);
        });
    }
  }, []);

  const fetchFullUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`);
      const fullUser = response.data;
      setCUSer(fullUser);
      localStorage.setItem("currentUser", JSON.stringify(fullUser));
    } catch (err) {
      console.error("Failed to fetch full user info:", err);
    }
  };

  return (
    <UserContext.Provider value={{ cUSer, setCUSer }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:7000/auth/signup', userData);
      setUser(response.data.user); // Assuming response returns user data
      toast.success('Signup successful!');
  
      // Automatically log in the user after signup
      const loginResponse = await login({ email: userData.email, password: userData.password });
      if (loginResponse) {
        // User is logged in successfully
        console.log('logged in successfully')
        toast.success('Logged in successfully after signup!');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      console.error(error); // Log the error for debugging
    }
  };
  

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:7000/auth/login', credentials);
      // Directly check if the response contains a token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        console.log(response.data); // Log the response
        return true; // Return true on successful login
      } else {
        toast.error('Invalid email or password. Please try again.');
        return false; // Return false if login fails
      }
    } catch (error) {
      toast.error('Login failed. Please try again.'); // Show error message
      console.error(error); // Log the error for debugging
      return false; // Return false in case of error
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

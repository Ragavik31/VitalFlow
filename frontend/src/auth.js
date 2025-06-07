// src/auth.js

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Match App.js key
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};
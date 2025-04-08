// src/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Match App.js key
};

export const logout = () => {
  localStorage.removeItem('authToken'); // Match App.js key
};
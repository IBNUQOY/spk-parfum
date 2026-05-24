import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already logged in (from localStorage)
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simple authentication - in production use real backend
    if (username === 'admin' && password === 'admin123') {
      const storedProfile = localStorage.getItem('adminProfile');
      const baseProfile = storedProfile
        ? JSON.parse(storedProfile)
        : {
            id: 1,
            username,
            name: 'Admin SPK Parfum',
            email: 'admin@spkparfum.com',
            role: 'administrator',
            avatar: 'https://i.pravatar.cc/150?img=1',
          };

      const adminData = {
        ...baseProfile,
        username,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('adminProfile', JSON.stringify(adminData));
      setAdmin(adminData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsLoggedIn(false);
  };

  const updateProfile = (profileData) => {
    const updated = { ...admin, ...profileData };
    localStorage.setItem('admin', JSON.stringify(updated));
    localStorage.setItem('adminProfile', JSON.stringify(updated));
    setAdmin(updated);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, admin, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

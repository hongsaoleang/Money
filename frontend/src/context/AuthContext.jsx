import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      const customAvatar = parsed.email ? localStorage.getItem(`user_avatar_${parsed.email}`) : null;
      if (customAvatar !== undefined) {
        parsed.avatar = customAvatar || parsed.avatar || null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const data = res.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      let message = err.response?.data?.message;
      const status = err.response?.status;
      if (
        !message ||
        status === 401 ||
        status === 403 ||
        message.toLowerCase() === 'forbidden' ||
        message.toLowerCase().includes('bad credentials')
      ) {
        message = 'Incorrect email or password. Please try again.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const sendRegistrationOtp = async (email, fullName) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register/send-otp', { email, fullName });
      return { success: true, message: res.data?.message || 'Verification code sent to your email.' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send verification code. Please try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', userData);
      const data = res.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      let message = err.response?.data?.message;
      if (!message || message.toLowerCase() === 'forbidden') {
        message = 'Registration failed. Please verify your information.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleEmail = 'hongsaoleang@gmail.com', fullName = 'Hong Saoleang') => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/google', { email: googleEmail, fullName });
      const data = res.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      let message = err.response?.data?.message;
      if (!message || message.toLowerCase() === 'forbidden') {
        message = 'Google sign-in failed. Please try again.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateAvatar = async (avatarData) => {
    try {
      let newAvatarUrl = avatarData;
      if (avatarData instanceof File) {
        const formData = new FormData();
        formData.append('image', avatarData);
        if (user?.email) formData.append('email', user.email);
        const res = await api.post('/api/auth/avatar/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newAvatarUrl = res.data?.avatar || null;
      } else {
        const res = await api.put('/api/auth/avatar', {
          email: user?.email,
          avatar: avatarData || null
        });
        newAvatarUrl = res.data?.avatar || avatarData || null;
      }
      const updatedUser = { ...user, avatar: newAvatarUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (user?.email) {
        if (newAvatarUrl) {
          localStorage.setItem(`user_avatar_${user.email}`, newAvatarUrl);
        } else {
          localStorage.removeItem(`user_avatar_${user.email}`);
        }
      }
      return { success: true, avatar: newAvatarUrl };
    } catch (err) {
      if (typeof avatarData === 'string' || avatarData === null) {
        const updatedUser = { ...user, avatar: avatarData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (user?.email) {
          if (avatarData) {
            localStorage.setItem(`user_avatar_${user.email}`, avatarData);
          } else {
            localStorage.removeItem(`user_avatar_${user.email}`);
          }
        }
        return { success: true, avatar: avatarData };
      }
      return { success: false, error: err.message };
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isClient = user?.role === 'ROLE_CLIENT' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, sendRegistrationOtp, loginWithGoogle, logout, updateAvatar, isAdmin, isClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

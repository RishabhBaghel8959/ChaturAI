// frontend/src/services/authService.js

const API_BASE = 'http://localhost:8000/api';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} isSignup - Whether this is signup or login
 * @returns {Promise} - Contains token and user data
 */
export const loginUser = async (email, password, isSignup = false) => {
  try {
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        email, 
        password 
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Authentication failed');
    }

    const data = await response.json();
    
    // Store in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error(error.message || 'Authentication error');
  }
};

/**
 * Logout user - clear stored credentials
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

/**
 * Get stored user from localStorage
 * @returns {Object|null} - User object or null
 */
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

/**
 * Get stored authentication token
 * @returns {string|null} - JWT token or null
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getStoredToken();
  const user = getStoredUser();
  return !!(token && user);
};

/**
 * Get authorization header for API requests
 * @returns {Object} - Headers object with Bearer token
 */
export const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Refresh user data from server
 * @returns {Promise} - Updated user data
 */
export const refreshUserData = async () => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh user data');
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Success message
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to change password');
    }

    return await response.json();
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

/**
 * Validate token with server
 * @returns {Promise<boolean>} - True if token is valid
 */
export const validateToken = async () => {
  try {
    const token = getStoredToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE}/auth/validate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Logout from server (optional cleanup)
 * @returns {Promise} - Server response
 */
export const serverLogout = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    logoutUser(); // Clear local storage regardless of server response
    
    return response.ok;
  } catch (error) {
    console.error('Server logout error:', error);
    logoutUser(); // Still clear local storage
    return false;
  }
};
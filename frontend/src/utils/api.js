// ============================================================================
// API Helper Utility
// Standard fetch wrapper with automatic JWT token attachment
// ============================================================================

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const getAuthToken = () => {
  return localStorage.getItem('hrm_token');
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      return { success: false, message: errorMsg, status: response.status };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error(`[API Error] ${API_BASE_URL}${endpoint}:`, err);
    return {
      success: false,
      message: 'Network error or server unreachable. Please make sure backend is running.'
    };
  }
};

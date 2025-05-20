import api from './axiosConfig';

export const authAPI = {
  // تسجيل الدخول
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل تسجيل الدخول';
    }
  },

  // تسجيل مستخدم جديد
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل إنشاء الحساب';
    }
  },

  // تسجيل مهني جديد
  registerProfessional: async (proData) => {
    try {
      const response = await api.post('/auth/register-pro', proData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل إنشاء حساب مهني';
    }
  },

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل جلب بيانات المستخدم';
    }
  },

  // تحديث بيانات المستخدم
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/update-profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل تحديث الملف الشخصي';
    }
  }
};
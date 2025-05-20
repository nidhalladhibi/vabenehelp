import api from './axiosConfig';

export const servicesAPI = {
  // جلب جميع أنواع الخدمات
  getAllCategories: async () => {
    try {
      const response = await api.get('/services/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل جلب تصنيفات الخدمات';
    }
  },

  // جلب الخدمات الشائعة
  getPopularServices: async () => {
    try {
      const response = await api.get('/services/popular');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل جلب الخدمات الشائعة';
    }
  },

  // جلب الخدمات حسب التصنيف
  getByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/services/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل جلب الخدمات حسب التصنيف';
    }
  },

  // إنشاء خدمة جديدة (للمهنيين)
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل إنشاء الخدمة';
    }
  },

  // تحديث خدمة
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل تحديث الخدمة';
    }
  },

  // حذف خدمة
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'فشل حذف الخدمة';
    }
  }
};
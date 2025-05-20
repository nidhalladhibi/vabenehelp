import api from './axiosConfig';

export const getProfessionals = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) params.append(key, filters[key]);
    }

    const response = await api.get(`/professionals?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل جلب قائمة المهنيين';
  }
};

export const getProfessionalById = async (id) => {
  try {
    const response = await api.get(`/professionals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل جلب بيانات المهني';
  }
};

export const getProfessionalServices = async (proId) => {
  try {
    const response = await api.get(`/professionals/${proId}/services`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل جلب خدمات المهني';
  }
};

export const getProfessionalReviews = async (proId) => {
  try {
    const response = await api.get(`/professionals/${proId}/reviews`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل جلب التقييمات';
  }
};

export const addProfessionalReview = async (proId, reviewData) => {
  try {
    const response = await api.post(`/professionals/${proId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل إضافة التقييم';
  }
};

export const searchProfessionals = async (query, location) => {
  try {
    const response = await api.get('/professionals/search', {
      params: { q: query, location },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل البحث عن المهنيين';
  }
};

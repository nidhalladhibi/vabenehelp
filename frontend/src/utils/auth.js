// حفظ التوكن في localStorage
export const saveToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // استرجاع التوكن من localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // حذف التوكن عند تسجيل الخروج
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // التحقق مما إذا كان المستخدم مسجل الدخول
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
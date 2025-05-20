// التحقق من صحة البريد الإلكتروني
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // التحقق من قوة كلمة المرور (على الأقل 6 حروف)
  export const isStrongPassword = (password) => {
    return password.length >= 6;
  };
  
  // التحقق من رقم الهاتف (بسيط)
  export const isValidPhone = (phone) => {
    const regex = /^[0-9]{8,15}$/;
    return regex.test(phone);
  };
  
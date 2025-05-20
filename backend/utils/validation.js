/**
 * validation.js
 * Utility functions for validating data
 */

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param {*} value - The value to check
 * @returns {boolean} - True if empty, false otherwise
 */
function isEmpty(value) {
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Validate an email address format
   * @param {string} email - The email address to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  function isValidEmail(email) {
    if (isEmpty(email)) return false;
    
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate a phone number format
   * @param {string} phone - The phone number to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  function isValidPhone(phone) {
    if (isEmpty(phone)) return false;
    
    // Simple regex for international phone number validation
    // Accepts formats like +1234567890, 123-456-7890, (123) 456-7890
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }
  
  /**
   * Validate a URL format
   * @param {string} url - The URL to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  function isValidUrl(url) {
    if (isEmpty(url)) return false;
    
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Validate a date format
   * @param {string|Date} date - The date to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  function isValidDate(date) {
    if (isEmpty(date)) return false;
    
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }
    
    return false;
  }
  
  /**
   * Validate if a value is a number or can be converted to a number
   * @param {*} value - The value to check
   * @returns {boolean} - True if valid number, false otherwise
   */
  function isValidNumber(value) {
    if (isEmpty(value)) return false;
    
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  
  /**
   * Validate if a value is within a specified range
   * @param {number} value - The value to check
   * @param {number} min - The minimum allowed value
   * @param {number} max - The maximum allowed value
   * @returns {boolean} - True if within range, false otherwise
   */
  function isInRange(value, min, max) {
    if (!isValidNumber(value)) return false;
    
    const num = parseFloat(value);
    return num >= min && num <= max;
  }
  
  /**
   * Validate if a string has a minimum length
   * @param {string} value - The string to check
   * @param {number} minLength - The minimum required length
   * @returns {boolean} - True if valid, false otherwise
   */
  function hasMinLength(value, minLength) {
    if (typeof value !== 'string') return false;
    
    return value.length >= minLength;
  }
  
  /**
   * Validate if a string has a maximum length
   * @param {string} value - The string to check
   * @param {number} maxLength - The maximum allowed length
   * @returns {boolean} - True if valid, false otherwise
   */
  function hasMaxLength(value, maxLength) {
    if (typeof value !== 'string') return false;
    
    return value.length <= maxLength;
  }
  
  /**
   * Validate if a password meets security requirements
   * @param {string} password - The password to validate
   * @param {Object} options - Validation options
   * @returns {boolean} - True if valid, false otherwise
   */
  function isValidPassword(password, options = {}) {
    const defaultOptions = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecial: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    if (!hasMinLength(password, finalOptions.minLength)) {
      return false;
    }
    
    if (finalOptions.requireUppercase && !/[A-Z]/.test(password)) {
      return false;
    }
    
    if (finalOptions.requireLowercase && !/[a-z]/.test(password)) {
      return false;
    }
    
    if (finalOptions.requireNumbers && !/[0-9]/.test(password)) {
      return false;
    }
    
    if (finalOptions.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }
    
    return true;
  }
  
  module.exports = {
    isEmpty,
    isValidEmail,
    isValidPhone,
    isValidUrl,
    isValidDate,
    isValidNumber,
    isInRange,
    hasMinLength,
    hasMaxLength,
    isValidPassword
  };
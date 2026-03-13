export const validateEmail = (email: string): string => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return '';
};

export const validatePasswordMatch = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return '';
};

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 2) {
    return { score, label: 'Weak', color: 'bg-red-500' };
  } else if (score <= 4) {
    return { score, label: 'Fair', color: 'bg-yellow-500' };
  } else if (score <= 5) {
    return { score, label: 'Good', color: 'bg-blue-500' };
  } else {
    return { score, label: 'Strong', color: 'bg-green-500' };
  }
};

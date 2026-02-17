export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email address";
  }
  return null;
};

export const validateUsername = (username) => {
  if (!username) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
};

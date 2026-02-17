export const API_ENDPOINTS = {
  // Public endpoints
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  VERIFY_EMAIL: "/auth/verify-email",
  REFRESH_TOKEN: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // Secured endpoints
  LOGOUT: "/auth/logout",
  CURRENT_USER: "/auth/current-user",
  CHANGE_PASSWORD: "/auth/change-password",
  RESEND_VERIFICATION: "/auth/resend-email-verification",

  // Admin endpoints
  USERS_LIST: "/auth/users",
};

export const TASK_ENDPOINTS = {
  TASKS: "/tasks",
  TASK_BY_ID: (id) => `/tasks/${id}`,
  TASK_MEMBERS: (id) => `/tasks/${id}/members`,
  TASK_MEMBER: (taskId, userId) => `/tasks/${taskId}/members/${userId}`,
};

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const USER_ROLES = {
  ADMIN: "global-admin",
  USER: "user",
};

export const VALIDATION_RULES = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  username: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
};

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "primetrade_access_token",
  REFRESH_TOKEN: "primetrade_refresh_token",
};

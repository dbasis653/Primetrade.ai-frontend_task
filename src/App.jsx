import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, TaskProvider } from "./contexts";
import { ProtectedRoute, PublicRoute } from "./components";
import {
  Login,
  Register,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  Dashboard,
  ChangePassword,
  ResendVerification,
  Tasks,
  TaskDetail,
} from "./pages";
import { api } from "./utils";
import { LOCAL_STORAGE_KEYS, TASK_ENDPOINTS, API_ENDPOINTS } from "./constants";

function App() {
  // ─── AUTH STATE ───────────────────────────────────────────────────────────
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // ─── TASK STATE ───────────────────────────────────────────────────────────
  const [taskState, setTaskState] = useState({
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    users: [],
    usersLoading: false,
  });

  // ─── AUTH ACTIONS ─────────────────────────────────────────────────────────

  const register = async (userData) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post("/auth/register", userData);
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const login = async (credentials) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post("/auth/login", credentials);
      const { user, accessToken, refreshToken } = response.data.data;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      setAuthState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      setAuthState({ user: null, loading: false, error: null, isAuthenticated: false });
      setTaskState({ tasks: [], currentTask: null, loading: false, error: null });
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Email verification failed";
      return { success: false, message: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset email";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const resetPassword = async (token, newPassword) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post("/auth/change-password", { oldPassword, newPassword });
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const resendVerification = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post("/auth/resend-email-verification");
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification email";
      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    if (!storedRefreshToken) throw new Error("No refresh token available");
    try {
      const response = await api.post("/auth/refresh-token", {
        refreshToken: storedRefreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      return { success: true };
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  // ─── TASK ACTIONS ─────────────────────────────────────────────────────────

  const getTasks = async () => {
    setTaskState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.get(TASK_ENDPOINTS.TASKS);
      setTaskState((prev) => ({
        ...prev,
        tasks: response.data.data || [],
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch tasks";
      setTaskState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const getTaskById = async (taskId) => {
    setTaskState((prev) => ({ ...prev, loading: true, error: null, currentTask: null }));
    try {
      const response = await api.get(TASK_ENDPOINTS.TASK_BY_ID(taskId));
      setTaskState((prev) => ({
        ...prev,
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch task";
      setTaskState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const createTask = async (taskData) => {
    setTaskState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post(TASK_ENDPOINTS.TASKS, taskData);
      const newTask = response.data.data;
      setTaskState((prev) => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
        loading: false,
      }));
      return { success: true, data: newTask };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create task";
      setTaskState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const updateTask = async (taskId, taskData) => {
    setTaskState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.put(TASK_ENDPOINTS.TASK_BY_ID(taskId), taskData);
      const updatedTask = response.data.data;
      setTaskState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
        currentTask: prev.currentTask?._id === taskId ? updatedTask : prev.currentTask,
        loading: false,
      }));
      return { success: true, data: updatedTask };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update task";
      setTaskState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const deleteTask = async (taskId) => {
    setTaskState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await api.delete(TASK_ENDPOINTS.TASK_BY_ID(taskId));
      setTaskState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t._id !== taskId),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete task";
      setTaskState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      return { success: false, message: errorMessage };
    }
  };

  const getMembers = async (taskId) => {
    try {
      const response = await api.get(TASK_ENDPOINTS.TASK_MEMBERS(taskId));
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch members";
      return { success: false, message: errorMessage };
    }
  };

  const addMember = async (taskId, email) => {
    try {
      const response = await api.post(TASK_ENDPOINTS.TASK_MEMBERS(taskId), { email });
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add member";
      return { success: false, message: errorMessage };
    }
  };

  const removeMember = async (taskId, userId) => {
    try {
      await api.delete(TASK_ENDPOINTS.TASK_MEMBER(taskId, userId));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove member";
      return { success: false, message: errorMessage };
    }
  };

  const clearTaskError = () => {
    setTaskState((prev) => ({ ...prev, error: null }));
  };

  const getUsers = async () => {
    setTaskState((prev) => ({ ...prev, usersLoading: true }));
    try {
      const response = await api.get(API_ENDPOINTS.USERS_LIST);
      setTaskState((prev) => ({
        ...prev,
        users: response.data.data || [],
        usersLoading: false,
      }));
      return { success: true };
    } catch (error) {
      setTaskState((prev) => ({ ...prev, usersLoading: false }));
      return { success: false, message: error.response?.data?.message || "Failed to fetch users" };
    }
  };

  // ─── INIT: Restore session on refresh ────────────────────────────────────
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        const response = await api.post("/auth/current-user");
        setAuthState((prev) => ({
          ...prev,
          user: response.data.data,
          isAuthenticated: true,
          loading: false,
        }));
      } catch (error) {
        try {
          await refreshToken();
          const response = await api.post("/auth/current-user");
          setAuthState((prev) => ({
            ...prev,
            user: response.data.data,
            isAuthenticated: true,
            loading: false,
          }));
        } catch (refreshError) {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
          setAuthState({ user: null, loading: false, error: null, isAuthenticated: false });
        }
      }
    };
    initializeAuth();
  }, []);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <AuthProvider
      value={{
        ...authState,
        register,
        login,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        changePassword,
        resendVerification,
        refreshToken,
        clearError,
      }}
    >
      <TaskProvider
        value={{
          ...taskState,
          getTasks,
          getTaskById,
          createTask,
          updateTask,
          deleteTask,
          getMembers,
          addMember,
          removeMember,
          getUsers,
          clearTaskError,
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* Public Routes - redirect to dashboard if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:resetToken"
                element={<ResetPassword />}
              />
            </Route>

            {/* Email verification - public (accessed via email link) */}
            <Route
              path="/verify-email/:verificationToken"
              element={<VerifyEmail />}
            />

            {/* Protected Routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route
                path="/resend-verification"
                element={<ResendVerification />}
              />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:taskId" element={<TaskDetail />} />
            </Route>

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;

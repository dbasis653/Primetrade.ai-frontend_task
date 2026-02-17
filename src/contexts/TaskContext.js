import { createContext, useContext } from "react";

export const TaskContext = createContext({
  // State stubs
  tasks: [],
  currentTask: null,
  taskMembers: [],
  loading: false,
  error: null,
  users: [],
  usersLoading: false,

  // Action stubs
  getTasks: () => {},
  getTaskById: (taskId) => {},
  createTask: (taskData) => {},
  updateTask: (taskId, taskData) => {},
  deleteTask: (taskId) => {},
  addMember: (taskId, email) => {},
  getMembers: (taskId) => {},
  removeMember: (taskId, userId) => {},
  getUsers: () => {},
  clearTaskError: () => {},
});

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = TaskContext.Provider;

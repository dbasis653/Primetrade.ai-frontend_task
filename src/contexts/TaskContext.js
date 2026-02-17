import { createContext, useContext } from "react";

export const TaskContext = createContext({
  // State stubs
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  users: [],
  usersLoading: false,
  members: [],
  membersLoading: false,

  // Action stubs
  getTasks: () => {},
  getTaskById: (taskId) => {},
  createTask: (taskData) => {},
  updateTask: (taskId, taskData) => {},
  deleteTask: (taskId) => {},
  addMember: (taskId, userId) => {},
  getMembers: (taskId) => {},
  removeMember: (taskId, userId) => {},
  getUsers: () => {},
  clearTaskError: () => {},
});

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskProvider = TaskContext.Provider;

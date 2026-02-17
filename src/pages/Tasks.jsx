import { useState, useEffect } from "react";
import { useTaskContext } from "../contexts";
import { useAuthContext } from "../contexts";
import { TaskCard, TaskForm } from "../components";
import { Header } from "../components/layout";
import { TASK_STATUS, USER_ROLES } from "../constants";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Todo", value: TASK_STATUS.TODO },
  { label: "In Progress", value: TASK_STATUS.IN_PROGRESS },
  { label: "Done", value: TASK_STATUS.DONE },
];

function Tasks() {
  const { tasks, getTasks, createTask, updateTask, deleteTask, loading, error, clearTaskError } =
    useTaskContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const [activeFilter, setActiveFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getTasks();
  }, []);

  const filteredTasks = (() => {
    if (isAdmin) {
      return activeFilter === "all"
        ? tasks
        : tasks.filter((t) => t.status === activeFilter);
    }
    // Regular user: "All" = all tasks where they are a member
    // Status tabs = tasks assigned to current user with that status
    if (activeFilter === "all") return tasks;
    return tasks.filter(
      (t) => t.status === activeFilter && String(t.assignedTo) === String(user?._id),
    );
  })();

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setFormError("");
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError("");
    let result;
    if (editingTask) {
      result = await updateTask(editingTask._id, payload);
    } else {
      result = await createTask(payload);
    }
    setFormLoading(false);

    if (result?.success) {
      handleCloseForm();
      getTasks();
    } else {
      setFormError(result?.message || "Something went wrong");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setDeleteError("");
    const result = await deleteTask(taskId);
    if (!result?.success) {
      setDeleteError(result?.message || "Failed to delete task");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isAdmin ? "Manage all tasks" : "Your assigned tasks"}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-lg leading-none">+</span> New Task
            </button>
          )}
        </div>

        {/* Error banners */}
        {(error || deleteError || formError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
            <span>{error || deleteError || formError}</span>
            <button
              onClick={() => {
                clearTaskError();
                setDeleteError("");
                setFormError("");
              }}
              className="ml-3 text-red-400 hover:text-red-600 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No tasks found
            </h3>
            <p className="text-sm text-gray-400">
              {activeFilter === "all"
                ? isAdmin
                  ? "Create your first task to get started."
                  : "You haven't been assigned any tasks yet."
                : `No tasks with status "${activeFilter}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task form modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        loading={formLoading}
      />
    </div>
  );
}

export default Tasks;

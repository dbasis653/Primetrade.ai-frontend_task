import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskContext } from "../contexts";
import { useAuthContext } from "../contexts";
import { TaskForm, TaskMembersPanel } from "../components";
import { Header } from "../components/layout";
import { TASK_STATUS, USER_ROLES } from "../constants";

const STATUS_STYLES = {
  [TASK_STATUS.TODO]: "bg-gray-100 text-gray-700",
  [TASK_STATUS.IN_PROGRESS]: "bg-amber-100 text-amber-700",
  [TASK_STATUS.DONE]: "bg-green-100 text-green-700",
};

const STATUS_LABELS = {
  [TASK_STATUS.TODO]: "Todo",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
};

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask, currentTask, loading, error, clearTaskError } =
    useTaskContext();
  const { user } = useAuthContext();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (taskId) {
      getTaskById(taskId);
    }
  }, [taskId]);

  const handleOpenEdit = () => {
    setFormError("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormError("");
  };

  const handleFormSubmit = async (payload) => {
    setFormLoading(true);
    setFormError("");
    const result = await updateTask(taskId, payload);
    setFormLoading(false);

    if (result?.success) {
      handleCloseForm();
      getTaskById(taskId);
    } else {
      setFormError(result?.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !currentTask) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Task not found"}
          </h2>
          <button
            onClick={() => {
              clearTaskError();
              navigate("/tasks");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const task = currentTask;
  const assignee = task.assignedTo;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Back to Tasks
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main task info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Title + status row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <h1 className="text-xl font-bold text-gray-900 flex-1 leading-snug">
                  {task.title}
                </h1>
                <span
                  className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${
                    STATUS_STYLES[task.status] || STATUS_STYLES[TASK_STATUS.TODO]
                  }`}
                >
                  {STATUS_LABELS[task.status] || task.status}
                </span>
              </div>

              {/* Description */}
              {task.description ? (
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic mb-5">
                  No description provided.
                </p>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={assignee.avatar?.url || "https://placehold.co/32x32"}
                        alt={assignee.username}
                        className="w-6 h-6 rounded-full object-cover bg-gray-100"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {assignee.username || assignee.fullName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Created</p>
                  <p className="text-sm text-gray-700">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Admin edit button */}
              {isAdmin && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleOpenEdit}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Task
                  </button>
                </div>
              )}
            </div>

            {/* Form error */}
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {formError}
              </div>
            )}
          </div>

          {/* Members panel */}
          <div className="lg:col-span-1">
            <TaskMembersPanel taskId={taskId} isAdmin={isAdmin} />
          </div>
        </div>
      </div>

      {/* Edit form modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={task}
        loading={formLoading}
      />
    </div>
  );
}

export default TaskDetail;

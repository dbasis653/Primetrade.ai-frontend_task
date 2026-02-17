import { useState, useEffect } from "react";
import { TASK_STATUS } from "../../constants";
import { useTaskContext } from "../../contexts";

function TaskForm({ isOpen, onClose, onSubmit, initialData, loading }) {
  const { users, usersLoading, getUsers } = useTaskContext();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: TASK_STATUS.TODO,
  });
  const [errors, setErrors] = useState({});

  // Load users list whenever the form opens (admin-only form, safe to call)
  useEffect(() => {
    if (isOpen) {
      getUsers();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
        status: initialData.status || TASK_STATUS.TODO,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: TASK_STATUS.TODO,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      assignedTo: formData.assignedTo || undefined,
      status: formData.status,
    };

    await onSubmit(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Assign To — dropdown populated from /auth/users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={usersLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">— Unassigned —</option>
              {usersLoading ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))
              )}
            </select>
            {!usersLoading && users.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No users found.</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={TASK_STATUS.TODO}>Todo</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.DONE}>Done</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Saving...
                </span>
              ) : initialData ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

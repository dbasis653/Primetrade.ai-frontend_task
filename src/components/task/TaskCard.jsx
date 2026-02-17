import { useNavigate } from "react-router-dom";
import { TASK_STATUS } from "../../constants";

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

function TaskCard({ task, onEdit, onDelete, isAdmin }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tasks/${task._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[task.status] || STATUS_STYLES[TASK_STATUS.TODO]}`}
        >
          {STATUS_LABELS[task.status] || task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          {task.assignedTo ? (
            <span>
              Assigned to{" "}
              <span className="font-medium text-gray-600">
                {task.assignedTo.username || task.assignedTo.fullName || "User"}
              </span>
            </span>
          ) : (
            <span>Unassigned</span>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;

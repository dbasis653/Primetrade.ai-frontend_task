import { useState, useEffect } from "react";
import { useTaskContext } from "../../contexts";

function TaskMembersPanel({ taskId, isAdmin }) {
  const { getMembers, addMember, removeMember, members, membersLoading, users, getUsers } =
    useTaskContext();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    getMembers(taskId);
    if (isAdmin && users.length === 0) getUsers();
  }, [taskId]);

  const memberUserIds = new Set(members.map((m) => m.user?._id));
  const availableUsers = users.filter((u) => !memberUserIds.has(u._id));

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setAddError("Please select a user");
      return;
    }
    setAddError("");
    setAddLoading(true);
    const result = await addMember(taskId, selectedUserId);
    setAddLoading(false);
    if (result?.success) {
      setSelectedUserId("");
      getMembers(taskId);
    } else {
      setAddError(result?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    const result = await removeMember(taskId, userId);
    if (result?.success) {
      getMembers(taskId);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Members</h3>

      {/* Add member form — admin only */}
      {isAdmin && (
        <form onSubmit={handleAddMember} className="flex gap-2 mb-4">
          <select
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              setAddError("");
            }}
            className={`flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
              addError ? "border-red-400" : "border-gray-300"
            }`}
          >
            <option value="">— Select user —</option>
            {availableUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={addLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {addLoading ? "Adding..." : "Add"}
          </button>
        </form>
      )}
      {addError && <p className="text-xs text-red-500 mb-3">{addError}</p>}

      {/* Members list */}
      {membersLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No members yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member, idx) => {
            const user = member.user || member;
            return (
              <li
                key={user._id || idx}
                className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar?.url || "https://placehold.co/40x40"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.username || user.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleRemoveMember(user._id)}
                    className="text-xs px-2.5 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TaskMembersPanel;

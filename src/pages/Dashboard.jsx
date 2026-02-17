import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { useTaskContext } from "../contexts";
import { Header } from "../components/layout";
import { TASK_STATUS, USER_ROLES } from "../constants";

function StatChip({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className={`rounded-lg px-4 py-3 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-0.5">{label}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuthContext();
  const { tasks, getTasks, loading } = useTaskContext();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    getTasks();
  }, []);

  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length,
    done: tasks.filter((t) => t.status === TASK_STATUS.DONE).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.username || "User"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's a quick overview of your workspace.
          </p>
        </div>

        {/* Email not verified banner */}
        {!user?.isEmailVerified && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Email not verified
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Verify your email to unlock all features.
              </p>
            </div>
            <Link
              to="/resend-verification"
              className="shrink-0 text-xs font-medium px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Resend Email
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Account</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Username</span>
                <span className="font-medium text-gray-800">{user?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-800">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span
                  className={`font-medium ${isAdmin ? "text-blue-600" : "text-gray-800"}`}
                >
                  {isAdmin ? "Admin" : "Member"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email Verified</span>
                <span
                  className={`font-medium ${user?.isEmailVerified ? "text-green-600" : "text-amber-600"}`}
                >
                  {user?.isEmailVerified ? "Yes" : "No"}
                </span>
              </div>
            </div>
            <Link
              to="/change-password"
              className="mt-5 inline-block text-xs font-medium text-blue-600 hover:underline"
            >
              Change Password →
            </Link>
          </div>

          {/* Tasks summary card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Tasks</h2>
              <Link
                to="/tasks"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <StatChip label="Total" value={taskCounts.total} color="blue" />
                <StatChip label="Todo" value={taskCounts.todo} color="gray" />
                <StatChip label="In Progress" value={taskCounts.inProgress} color="amber" />
                <StatChip label="Done" value={taskCounts.done} color="green" />
              </div>
            )}

            <Link
              to="/tasks"
              className="mt-5 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

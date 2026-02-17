import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts";
import { Button } from "../ui";

function Header() {
  const { user, logout } = useAuthContext();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <h1 className="text-xl font-bold text-blue-600 shrink-0">Primetrade</h1>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`
              }
            >
              Tasks
            </NavLink>
          </nav>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {!user.isEmailVerified && (
                  <p className="text-xs text-amber-500 font-medium">Email not verified</p>
                )}
              </div>
            )}
            <Button onClick={logout} variant="danger">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

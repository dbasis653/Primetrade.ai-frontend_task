function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {title && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
        <p className="text-center mt-6 text-sm text-gray-600">
          &copy; 2026 Primetrade. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;

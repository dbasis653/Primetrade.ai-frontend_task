import { useState } from "react";
import { useAuthContext } from "../contexts";
import { Input, Button, ErrorMessage } from "../components/ui";
import { Header } from "../components/layout";
import { validatePassword, validateConfirmPassword } from "../utils";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { changePassword, error, loading, clearError } = useAuthContext();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.newPassword,
      formData.confirmPassword
    );
    if (confirmPasswordError)
      newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    if (!validateForm()) return;

    const result = await changePassword(
      formData.oldPassword,
      formData.newPassword
    );

    if (result.success) {
      setSuccess(true);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Change Password
          </h1>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Password changed successfully!
              </p>
            </div>
          )}

          <ErrorMessage message={error} onClose={clearError} />

          <form onSubmit={handleSubmit}>
            <Input
              label="Current Password"
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              error={errors.oldPassword}
              placeholder="Enter current password"
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              placeholder="Enter new password"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm new password"
              required
            />

            <div className="flex gap-4">
              <Button type="submit" loading={loading} disabled={loading}>
                Change Password
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

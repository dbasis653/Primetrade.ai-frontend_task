import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { Input, Button, ErrorMessage } from "../components/ui";
import { AuthLayout } from "../components/layout";
import { validatePassword, validateConfirmPassword } from "../utils";

function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { resetPassword, error, loading, clearError } = useAuthContext();

  useEffect(() => {
    if (!resetToken) {
      navigate("/login");
    }
  }, [resetToken, navigate]);

  const validateForm = () => {
    const newErrors = {};

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

    const result = await resetPassword(resetToken, formData.newPassword);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password"
    >
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Password reset successful! Redirecting to login...
          </p>
        </div>
      )}

      <ErrorMessage message={error} onClose={clearError} />

      <form onSubmit={handleSubmit}>
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

        <Button type="submit" loading={loading} disabled={loading || success}>
          Reset Password
        </Button>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;

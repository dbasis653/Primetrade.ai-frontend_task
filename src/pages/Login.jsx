import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { Input, Button, ErrorMessage } from "../components/ui";
import { AuthLayout } from "../components/layout";
import { validateEmail, validatePassword } from "../utils";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { login, error, loading, clearError } = useAuthContext();

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    await login(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to your account">
      <ErrorMessage message={error} onClose={clearError} />

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} disabled={loading}>
          Login
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;

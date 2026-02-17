import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { Input, Button, ErrorMessage } from "../components/ui";
import { AuthLayout } from "../components/layout";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
} from "../utils";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { register, error, loading, clearError } = useAuthContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
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

    const result = await register({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });

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
    <AuthLayout title="Create Account" subtitle="Register to get started">
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Registration successful! Check your email for verification.
            Redirecting to login...
          </p>
        </div>
      )}

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
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Choose a username"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Choose a password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          required
        />

        <Button type="submit" loading={loading} disabled={loading || success}>
          Register
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Register;

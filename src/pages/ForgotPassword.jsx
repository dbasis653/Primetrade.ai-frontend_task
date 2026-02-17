import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { Input, Button, ErrorMessage } from "../components/ui";
import { AuthLayout } from "../components/layout";
import { validateEmail } from "../utils";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { forgotPassword, error, loading, clearError } = useAuthContext();

  const validateForm = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    if (!validateForm()) return;

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
      setEmail("");
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
    >
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Password reset link sent! Check your email.
          </p>
        </div>
      )}

      <ErrorMessage message={error} onClose={clearError} />

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({});
          }}
          error={errors.email}
          placeholder="Enter your email"
          required
        />

        <Button type="submit" loading={loading} disabled={loading}>
          Send Reset Link
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

export default ForgotPassword;

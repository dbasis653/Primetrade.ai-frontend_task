import { useState } from "react";
import { useAuthContext } from "../contexts";
import { Button, ErrorMessage } from "../components/ui";
import { Header } from "../components/layout";

function ResendVerification() {
  const [success, setSuccess] = useState(false);
  const { user, resendVerification, error, loading, clearError } =
    useAuthContext();

  const handleResend = async () => {
    clearError();
    setSuccess(false);

    const result = await resendVerification();

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Resend Verification Email
          </h1>

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Verification email sent successfully! Check your inbox.
              </p>
            </div>
          )}

          <ErrorMessage message={error} onClose={clearError} />

          {user?.isEmailVerified ? (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Your email is already verified!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Click the button below to receive a new verification email at{" "}
                  <span className="font-medium">{user?.email}</span>
                </p>
                <p className="text-sm text-gray-600">
                  If you don't see the email, please check your spam folder.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleResend}
                  loading={loading}
                  disabled={loading}
                >
                  Resend Verification Email
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResendVerification;

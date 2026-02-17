import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts";
import { AuthLayout } from "../components/layout";
import { LoadingSpinner } from "../components/ui";

function VerifyEmail() {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const { verifyEmail } = useAuthContext();

  useEffect(() => {
    const verify = async () => {
      if (!verificationToken) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      const result = await verifyEmail(verificationToken);

      if (result.success) {
        setStatus("success");
        setMessage("Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(result.message || "Verification failed");
      }
    };

    verify();
  }, [verificationToken, verifyEmail]);

  if (status === "verifying") {
    return <LoadingSpinner />;
  }

  return (
    <AuthLayout title="Email Verification">
      {status === "success" ? (
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {message}
          </h2>
          <p className="text-gray-600 mb-6">
            Your email has been verified. You can now login to your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default VerifyEmail;

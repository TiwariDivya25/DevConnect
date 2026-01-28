import { useState, type FormEvent } from "react";
import { useAuth } from '../hooks/useAuth';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        showSuccess("Password reset email sent !");
      }
    } catch (err) {
      console.error('Password reset error:', err);
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="alert-error">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="alert-success">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-light dark:input-dark"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-light dark:btn-primary-dark"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex-gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

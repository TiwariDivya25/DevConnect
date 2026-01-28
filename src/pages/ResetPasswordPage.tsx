import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isBackendAvailable } from "../supabase-client";
import { useAuth } from "../hooks/useAuth";
import { Lock } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Skip session check in demo mode or when backend is unavailable
    if (!isBackendAvailable || !supabase) {
      showError("Password reset is not available in demo mode.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        showError("Invalid or expired reset link. Please request a new password reset.");
      }
    }).catch((err) => {
      console.error("Session check error:", err);
      showError("Failed to verify reset link. Please try again.");
    });
  }, [navigate]);

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if backend is available
    if (!isBackendAvailable) {
      setError("Password reset is not available in demo mode.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
      } else {
        showSuccess("Password updated successfully! Redirecting.");
        setSuccess("Password updated successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError("Something went wrong. Please try again.");
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div>
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below
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

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-light dark:input-dark"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-light dark:input-dark"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-light dark:btn-primary-dark"
            >
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

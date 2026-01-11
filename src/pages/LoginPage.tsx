import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { Github } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          showError("Please verify your email address before signing in." );

        } else if (error.message.includes("Invalid login credentials")) {
          showError("Invalid email or password.");

        } else {
          showError(error.message);
        }
      } else {
        showSuccess("Logged in successfully!");
        navigate("/");
      }
    } catch {
      showError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    try {
      await signInWithGithub();
      showSuccess("Logged in successfully!");
    } catch {
      showError("Github login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to DevConnect
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-500">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-500">{error}</p>
          </div>
        )}

        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-3 px-4 py-3
                     border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800
                     text-sm font-medium text-gray-800 dark:text-gray-200
                     hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        {/* Divider – same as Register */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-500 whitespace-nowrap">
            Or continue with email
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Email form */}
        <form
          onSubmit={handleEmailLogin}
          className="space-y-4 [&_input]:!text-white [&_input]:caret-white"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full px-3 py-2 rounded-md
                         border border-gray-300 dark:border-gray-600
                         bg-gray-900 dark:bg-gray-800
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full px-3 py-2 rounded-md
                         border border-gray-300 dark:border-gray-600
                         bg-gray-900 dark:bg-gray-800
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-right">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md
                       text-sm font-medium text-white
                       bg-blue-600 hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

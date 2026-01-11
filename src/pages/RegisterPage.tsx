import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import { Github } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);



  const { signUpWithEmail, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const { error } = await signUpWithEmail(email, password, {
        full_name: fullName,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          showError("Email already registered. Please sign in.");
        
        } else {
          showError(error.message);
          
        }
      } else {
        showSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    }
     catch {
      showError("Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError("");
    try {
      await signInWithGithub();
    } catch {
      showError("GitHub signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Create your DevConnect account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-400">
              {success}
            </p>
            <p className="text-xs text-green-700 dark:text-green-500 mt-2">
              Note: If email confirmation is enabled in Supabase, please check
              your email.
            </p>
          </div>
        )}

        <button
          onClick={handleGithubSignup}
          className="w-full flex items-center justify-center gap-3 px-4 py-3
                     border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-800
                     text-sm font-medium text-gray-800 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        {/* Divider */}
<div className="flex items-center gap-4 my-6">
  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
  <span className="text-sm font-medium text-gray-600 dark:text-gray-500 whitespace-nowrap">
    Or continue with email
  </span>
  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
</div>


        {/* Email form */}
        <form
          onSubmit={handleEmailSignup}
          className="space-y-4 [&_input]:!text-white [&_input]:caret-white"
        >
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="block w-full px-3 py-2 rounded-md
                         border border-gray-300 dark:border-gray-600
                         bg-gray-900 dark:bg-gray-800
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full px-3 py-2 rounded-md
                         border border-gray-300 dark:border-gray-600
                         bg-gray-900 dark:bg-gray-800
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-600 dark:text-gray-600">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

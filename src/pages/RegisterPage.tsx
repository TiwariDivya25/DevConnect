import { useState, type FormEvent, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from "react-router-dom";
import { Github, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, X, User, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, speed: number}>>([]);
  const { signUpWithEmail, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  // Initialize theme and particles
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme = 'dark';
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (!systemPrefersDark) {
      initialTheme = 'light';
    }
    
    setTheme(initialTheme as 'light' | 'dark');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);

    const initialParticles = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));
    setParticles(initialParticles);

    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail;
      setTheme(newTheme);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    const event = new CustomEvent('themeChanged', { detail: newTheme });
    window.dispatchEvent(event);
  };

  // Handle close/back button
  const handleClose = () => {
    navigate(-1);
  };

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
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(error.message);
        }
      } else {
        setSuccess("Account created successfully! You can now sign in with your credentials.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setError("");
    try {
      await signInWithGithub();
    } catch (err) {
      console.error('GitHub signup error:', err);
      setError("Failed to sign up with GitHub");
    }
  };

  // Theme-based classes
  const isDark = theme === 'dark';
  
  const themeClasses = {
    light: {
      background: 'from-blue-50 via-gray-50 to-purple-50',
      card: 'bg-white/80 backdrop-blur-lg',
      text: 'text-gray-900',
      subtext: 'text-gray-700',
      border: 'border-gray-200',
      input: 'bg-white/90 border-gray-300',
      inputText: 'text-gray-900',
      button: 'from-blue-500 to-indigo-600',
      buttonHover: 'from-blue-600 to-indigo-700',
      socialButton: 'bg-white border-gray-300',
      socialText: 'text-gray-700',
      error: 'bg-red-50 border-red-200 text-red-700',
      success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      glow: 'from-blue-400/20 via-indigo-400/20 to-blue-400/20',
      particle: 'bg-blue-400/20',
      iconColor: 'text-blue-600',
      iconColor300: 'text-blue-500',
      textColor: 'text-gray-600',
      textColorLight: 'text-gray-700',
      borderColor: 'border-gray-200',
      inputBg: 'bg-white/80 border-gray-300',
      successGlow: 'from-emerald-400/20 via-green-400/20 to-emerald-400/20'
    },
    dark: {
      background: 'from-gray-900 via-black to-gray-900',
      card: 'bg-gray-900/30 backdrop-blur-lg',
      text: 'text-white',
      subtext: 'text-gray-400',
      border: 'border-white/10',
      input: 'bg-gray-800/30 border-white/10',
      inputText: 'text-gray-300',
      button: 'from-cyan-600 to-blue-600',
      buttonHover: 'from-cyan-500 to-blue-500',
      socialButton: 'bg-gray-800/50 border-white/10',
      socialText: 'text-gray-300',
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      glow: 'from-cyan-500/10 via-blue-500/10 to-cyan-500/10',
      particle: 'bg-cyan-500/30',
      iconColor: 'text-cyan-400',
      iconColor300: 'text-cyan-300',
      textColor: 'text-gray-400',
      textColorLight: 'text-gray-300',
      borderColor: 'border-gray-800',
      inputBg: 'bg-gray-800/50 border-gray-700',
      successGlow: 'from-emerald-500/10 via-green-500/10 to-emerald-500/10'
    }
  };

  const t = themeClasses[theme];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden transition-all duration-500 ${isDark ? 'dark' : ''}`}>
      
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${t.background} transition-all duration-500`}>
        {/* Animated Particles */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${t.particle}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${3 + particle.speed * 10}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
        
        {/* Floating Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${
          isDark ? 'bg-cyan-500/5' : 'bg-blue-400/10'
        } rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 ${
          isDark ? 'bg-blue-500/5' : 'bg-indigo-400/10'
        } rounded-full blur-3xl animate-pulse delay-1000`}></div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
                           linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Glass Container */}
        <div className="relative group">
          {/* Outer Glow */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${t.glow} rounded-2xl blur opacity-50 group-hover:opacity-70 transition-all duration-500`}></div>
          
          {/* Glass Card */}
          <div 
            className={`relative ${t.card} border ${t.border} rounded-2xl shadow-2xl`}
            onMouseEnter={() => setHoveredCard('main')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Animated Top Border */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
              isDark ? 'via-cyan-500/30' : 'via-blue-500/50'
            } to-transparent animate-border`}></div>
            
            {/* Cross Button - Positioned inside container at top-right */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg backdrop-blur-sm border transition-all duration-300 hover:scale-110 active:scale-95 group ${
                  isDark 
                    ? 'bg-gray-900/40 border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-gray-300 hover:text-white' 
                    : 'bg-white/60 border-gray-300 hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                {/* Animated Title */}
                <h1 className={`text-2xl font-bold ${t.text} mb-2 animate-fade-in`}>
                  Join DevConnect
                </h1>
                <p className={`text-sm ${t.subtext}`}>
                  Start your journey with our developer community
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <div className="animate-fade-in mb-4">
                  <div className={`relative ${t.success} border rounded-xl p-4`}>
                    {/* Success Glow */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${t.successGlow} rounded-xl blur opacity-50`}></div>
                    <div className="relative">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 ${
                          isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                        } rounded-full flex items-center justify-center animate-pulse`}>
                          <CheckCircle className={`w-4 h-4 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isDark ? 'text-emerald-400' : 'text-emerald-700'
                          } text-sm`}>Account Created Successfully!</p>
                          <p className={`text-xs ${
                            isDark ? 'text-emerald-500/80' : 'text-emerald-600/80'
                          } mt-1`}>Redirecting to login page...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={`space-y-5 ${success ? 'opacity-50' : 'opacity-100'}`}>
                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    onClick={handleGithubSignup}
                    onMouseEnter={() => setHoveredCard('github')}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`w-full group relative ${t.socialButton} backdrop-blur-sm border rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] ${
                      isDark ? 'hover:border-cyan-500/30' : 'hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      } group-hover:bg-gray-700 transition-colors`}>
                        <Github className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <span className={`${t.socialText} font-medium group-hover:${
                        isDark ? 'text-white' : 'text-gray-900'
                      } transition-colors`}>Continue with GitHub</span>
                    </div>
                  </button>

                  <button
                    disabled
                    className={`w-full group relative ${t.socialButton} backdrop-blur-sm border rounded-xl p-3 opacity-60 cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-gray-100'
                      }`}>
                        <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <span className={`${t.socialText} font-medium`}>Continue with Google</span>
                      <span className={`text-xs ${
                        isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                      } px-2 py-1 rounded-full`}>Soon</span>
                    </div>
                  </button>
                </div>

                {/* Animated Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${t.border}`}></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className={`px-3 ${
                      isDark ? 'bg-gray-900/30' : 'bg-white/50'
                    } ${t.subtext} text-xs font-medium`}>
                      Or with email
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`animate-shake rounded-xl ${t.error} border p-3`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 ${
                        isDark ? 'bg-red-500/20' : 'bg-red-100'
                      } rounded-full flex items-center justify-center`}>
                        <div className={`w-2 h-2 ${
                          isDark ? 'bg-red-500' : 'bg-red-600'
                        } rounded-full`}></div>
                      </div>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className={`block text-sm font-medium ${t.subtext} mb-1`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.textColor}`} />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 ${t.input} rounded-xl ${t.inputText} placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 ${
                            isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                          } transition-all duration-300`}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium ${t.subtext} mb-1`}>
                        Email
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.textColor}`} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 ${t.input} rounded-xl ${t.inputText} placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 ${
                            isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                          } transition-all duration-300`}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className={`block text-sm font-medium ${t.subtext} mb-1`}>
                        Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.textColor}`} />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full pl-10 pr-10 py-2.5 ${t.input} rounded-xl ${t.inputText} placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 ${
                            isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                          } transition-all duration-300`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className={`w-4 h-4 ${t.textColor} hover:${
                              isDark ? 'text-cyan-400' : 'text-blue-600'
                            } transition-colors`} />
                          ) : (
                            <Eye className={`w-4 h-4 ${t.textColor} hover:${
                              isDark ? 'text-cyan-400' : 'text-blue-600'
                            } transition-colors`} />
                          )}
                        </button>
                      </div>
                      <p className={`text-xs mt-1 ${t.textColor}`}>
                        Must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className={`block text-sm font-medium ${t.subtext} mb-1`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.textColor}`} />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-10 py-2.5 ${t.input} rounded-xl ${t.inputText} placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 ${
                            isDark ? 'focus:ring-blue-500/30' : 'focus:ring-blue-400/30'
                          } transition-all duration-300`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className={`w-4 h-4 ${t.textColor} hover:${
                              isDark ? 'text-cyan-400' : 'text-blue-600'
                            } transition-colors`} />
                          ) : (
                            <Eye className={`w-4 h-4 ${t.textColor} hover:${
                              isDark ? 'text-cyan-400' : 'text-blue-600'
                            } transition-colors`} />
                          )}
                        </button>
                      </div>
                      {password && confirmPassword && password === confirmPassword && (
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-600'
                        }`}>
                          ✓ Passwords match
                        </p>
                      )}
                    </div>

                    {/* Terms and Privacy */}
                    <div className="flex items-start space-x-2 pt-2">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className={`h-3.5 w-3.5 mt-0.5 rounded ${
                          isDark ? 'bg-gray-800 border-white/10 text-cyan-500' : 'bg-white border-gray-300 text-blue-600'
                        } focus:${
                          isDark ? 'ring-cyan-500/20' : 'ring-blue-400/30'
                        }`}
                      />
                      <label htmlFor="terms" className={`text-xs ${t.subtext}`}>
                        I agree to the{" "}
                        <Link to="/terms" className={`font-medium ${
                          isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                        } transition-colors`}>
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className={`font-medium ${
                          isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                        } transition-colors`}>
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || success}
                    className={`w-full group relative overflow-hidden py-3 px-4 bg-gradient-to-r ${t.button} hover:${t.buttonHover} rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    <div className="relative flex items-center justify-center space-x-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Sign in link */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-white/10">
                  <p className={`text-sm ${t.subtext}`}>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className={`font-medium ${
                        isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
                      } transition-colors`}
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${t.subtext}`}>
            Join thousands of developers in our growing community
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes gridMove {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(50px) translateX(50px); }
        }
        
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-border {
          animation: borderFlow 2s linear infinite;
          background-size: 200% 100%;
          background-image: linear-gradient(to right, 
            transparent 0%, 
            ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(59, 130, 246, 0.5)'} 50%, 
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}
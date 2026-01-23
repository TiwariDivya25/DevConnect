import { Link } from "react-router-dom";
import { 
  Code2, Github, Mail, Heart, Twitter, Linkedin, MessageCircle, 
  Send, Zap, Cpu, Shield, Cloud, Database, Code, 
  TrendingUp, Calendar, ShieldCheck, CpuIcon, RadioTower, MessageSquare,
  Users, Users2, Server, Globe, CheckCircle, X, Sparkles, Rocket,
  Activity, Clock, Wifi, Terminal, Layers, ChevronUp, Home,
  Users as UsersIcon, Plus, User, LogIn, UserPlus, GitMerge,
  Sun, Moon
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme = 'dark';
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (!systemPrefersDark) {
      initialTheme = 'light';
    }
    
    setTheme(initialTheme as 'light' | 'dark');
    // Set initial class on HTML element
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubscriptionSuccess(true);
    setEmail("");
    setTimeout(() => setSubscriptionSuccess(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Remove both classes and add the new one
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Force re-render of all components by triggering a state change
    // This ensures the theme updates immediately
    const event = new CustomEvent('themeChanged', { detail: newTheme });
    window.dispatchEvent(event);
  };

  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail;
      setTheme(newTheme);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  // Theme based classes
  const isDark = theme === 'dark';
  
  const footerClasses = isDark 
    ? "relative bg-gradient-to-b from-gray-900 via-gray-900 to-black border-t border-cyan-900/30 text-gray-300 overflow-hidden pt-12"
    : "relative bg-gradient-to-b from-white via-gray-50 to-gray-100 border-t border-blue-200 text-gray-700 overflow-hidden pt-12";

  const scrollTopButtonClasses = isDark
    ? "fixed right-6 bottom-6 z-50 p-3 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group"
    : "fixed right-6 bottom-6 z-50 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group";

  const statsBarClasses = isDark
    ? "relative z-10 py-4 border-b border-cyan-900/50 bg-gray-900/30 backdrop-blur-sm"
    : "relative z-10 py-4 border-b border-blue-100 bg-white/50 backdrop-blur-sm";

  const cardClasses = isDark
    ? "bg-gray-800/30 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50 hover:shadow-cyan-500/10"
    : "bg-gray-100/50 border-gray-300 hover:border-blue-400/50 hover:bg-gray-200/50 hover:shadow-blue-500/10";

  const textGradient = isDark
    ? "bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300"
    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600";

  const iconColor = isDark ? "text-cyan-400" : "text-blue-600";
  const iconColor300 = isDark ? "text-cyan-300" : "text-blue-500";
  const textColor = isDark ? "text-gray-400" : "text-gray-600";
  const textColorLight = isDark ? "text-gray-300" : "text-gray-700";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const inputBg = isDark ? "bg-gray-800/50 border-gray-700" : "bg-white/80 border-gray-300";

  return (
    <>
      <footer className={footerClasses}>
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className={scrollTopButtonClasses}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Theme Toggle Button - FIXED */}
        <button
          onClick={toggleTheme}
          className={`fixed left-6 bottom-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300 border border-gray-700' 
              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
          }`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(90deg, ${isDark ? '#0ea5e9' : '#3b82f6'} 1px, transparent 1px),
                                linear-gradient(180deg, ${isDark ? '#0ea5e9' : '#3b82f6'} 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          ></div>
          
          {/* Animated Orbs */}
          {isDark ? (
            <>
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
                   style={{ animationDelay: '2s' }}></div>
            </>
          ) : (
            <>
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" 
                   style={{ animationDelay: '2s' }}></div>
            </>
          )}
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${30 + Math.sin(i) * 40}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                backgroundColor: isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(59, 130, 246, 0.2)'
              }}
            ></div>
          ))}
          
          {/* Scan Line */}
          <div 
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent animate-scan"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${isDark ? '#06b6d4' : '#3b82f6'}, transparent)`
            }}
          ></div>
        </div>

        {/* Live Stats Bar */}
        <div className={statsBarClasses}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                isDark 
                  ? 'bg-gray-800/50 border-green-900/30' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">All Systems Operational</span>
              </div>
              <div className={`text-sm px-3 py-1.5 rounded-lg ${
                isDark 
                  ? 'text-gray-400 bg-gray-800/30' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                Last updated: <span className={`${isDark ? 'text-cyan-300' : 'text-blue-600'} font-medium`}>Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-cyan-500 to-blue-500' : 'from-blue-500 to-indigo-500'} rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className={`relative p-2 ${isDark ? 'bg-gray-900 border-cyan-500/20' : 'bg-white border-blue-200'} rounded-xl border group-hover:scale-105 transition-all duration-300 ${isDark ? 'group-hover:border-cyan-500/40' : 'group-hover:border-blue-300'}`}>
                    <Code2 className={`w-8 h-8 ${iconColor300} group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                </div>
                <div>
                  <h2 className={`text-2xl font-bold bg-clip-text text-transparent ${textGradient}`}>
                    DevConnect
                  </h2>
                  <p className={`text-sm ${textColor}`}>Next Generation Dev Community</p>
                </div>
              </div>
              
              <p className={`text-sm leading-relaxed ${isDark ? 'group-hover:text-gray-300' : 'group-hover:text-gray-800'} transition-colors duration-300 ${textColor}`}>
                Connect, collaborate, and build with developers worldwide. Join the fastest-growing developer ecosystem.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Github, color: "hover:bg-green-800 hover:text-white", label: "GitHub", url: "https://github.com/TiwariDivya25/DevConnect" },
                  { icon: X, color: "hover:bg-black hover:text-white", label: "X", url: "https://twitter.com/devconnect" },
                  { icon: Linkedin, color: "hover:bg-blue-600 hover:text-white", label: "LinkedIn", url: "https://www.linkedin.com/in/tiwari-divya-in/" },
                  { icon: MessageCircle, color: "hover:bg-purple-500 hover:text-white", label: "Discord", url: "https://discord.gg/devconnect" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg border ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 text-gray-400' 
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2 group`}>
                <Zap className={`w-5 h-5 ${iconColor} group-hover:rotate-45 transition-transform duration-300`} />
                Quick Navigation
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Home", icon: Home, path: "/" },
                  { label: "Create Post", icon: Plus, path: "/create" },
                  { label: "Communities", icon: Users2, path: "/communities" },
                  { label: "New Community", icon: GitMerge, path: "/communities/create" },
                  { label: "Events", icon: Calendar, path: "/events" },
                  { label: "Messages", icon: MessageSquare, path: "/messages" },
                  { label: "Profile", icon: User, path: "/profile" },
                  { label: "Contributors", icon: UsersIcon, path: "/contributors" },
                ].map((link, i) => (
                  <Link
                    key={i}
                    to={link.path}
                    className={`group p-3 rounded-lg border transition-all duration-300 hover:translate-x-1 hover:shadow-lg relative overflow-hidden ${cardClasses}`}
                    style={{ transform: `translate(${parallaxX * 0.05}px, ${parallaxY * 0.05}px)` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-cyan-500/0 via-cyan-500/10 to-blue-500/0' : 'from-blue-500/0 via-blue-500/5 to-indigo-500/0'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative flex items-center gap-2">
                      <link.icon className={`w-4 h-4 ${iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      <span className={`text-sm font-medium ${isDark ? 'group-hover:text-white' : 'group-hover:text-blue-700'} transition-colors duration-300 ${textColorLight}`}>{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2 group`}>
                <CpuIcon className={`w-5 h-5 ${iconColor} group-hover:animate-spin transition-all duration-300`} />
                Tech Stack
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: RadioTower, label: "React 18", desc: "Frontend", color: isDark ? "text-cyan-400" : "text-blue-500" },
                  { icon: Server, label: "TypeScript", desc: "Type Safety", color: isDark ? "text-blue-400" : "text-indigo-500" },
                  { icon: Database, label: "Supabase", desc: "Backend & DB", color: isDark ? "text-green-400" : "text-emerald-500" },
                  { icon: Shield, label: "Tailwind", desc: "Styling", color: isDark ? "text-purple-400" : "text-violet-500" },
                  { icon: Cloud, label: "Vite", desc: "Build Tool", color: isDark ? "text-orange-400" : "text-orange-500" },
                  { icon: GitMerge, label: "TanStack", desc: "Data Fetching", color: isDark ? "text-pink-400" : "text-pink-500" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className={`group p-3 rounded-lg border transition-all duration-300 hover:shadow-lg relative overflow-hidden ${cardClasses}`}
                    style={{ 
                      transform: `translate(${parallaxX * (0.1 - i * 0.01)}px, ${parallaxY * (0.1 - i * 0.01)}px)`,
                      transitionDelay: `${i * 0.05}s`
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-cyan-500/0 via-cyan-500/5 to-blue-500/0' : 'from-blue-500/0 via-blue-500/3 to-indigo-500/0'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white border border-gray-200'} group-hover:scale-110 transition-transform duration-300 ${tech.color}`}>
                        <tech.icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${isDark ? 'group-hover:text-white' : 'group-hover:text-gray-900'} transition-colors duration-300 ${textColorLight}`}>{tech.label}</div>
                        <div className={`text-xs ${isDark ? 'group-hover:text-gray-300' : 'group-hover:text-gray-600'} transition-colors duration-300 ${textColor}`}>{tech.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Links & Newsletter */}
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2 group`}>
                <Rocket className={`w-5 h-5 ${iconColor} group-hover:rotate-45 transition-transform duration-300`} />
                Join DevConnect
              </h3>
              
              <p className={`text-sm ${isDark ? 'group-hover:text-gray-300' : 'group-hover:text-gray-700'} transition-colors duration-300 ${textColor}`}>
                Get exclusive access to new features, beta programs, and community insights.
              </p>
              
              {/* Newsletter */}
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group/input">
                  <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-cyan-500/10 to-blue-500/10' : 'from-blue-500/5 to-indigo-500/5'} rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300`}></div>
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${isDark ? 'group-hover/input:text-cyan-400' : 'group-hover/input:text-blue-500'} transition-colors duration-300 z-10`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className={`relative w-full pl-10 pr-4 py-3 ${inputBg} rounded-xl ${isDark ? 'text-white' : 'text-gray-900'} placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 focus:shadow-lg z-10 ${
                      isDark 
                        ? 'focus:ring-cyan-500/50 focus:shadow-cyan-500/20'
                        : 'focus:ring-blue-500/50 focus:shadow-blue-500/20'
                    }`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || subscriptionSuccess}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/button ${
                    subscriptionSuccess 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : isDark
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  } hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                    isDark 
                      ? 'hover:shadow-cyan-500/25'
                      : 'hover:shadow-blue-500/25'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="relative z-10">Subscribing...</span>
                    </>
                  ) : subscriptionSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Subscribed! ✓</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 relative z-10 group-hover/button:translate-x-1 transition-transform duration-300" />
                      <span className="relative z-10">Subscribe Now</span>
                    </>
                  )}
                </button>
                
                <p className={`text-xs text-center ${isDark ? 'group-hover:text-gray-400' : 'group-hover:text-gray-600'} transition-colors duration-300 ${textColor}`}>
                  No spam, unsubscribe anytime
                </p>
              </form>
              
              {/* Live Activity */}
              <div className={`pt-4 border-t ${borderColor} mt-6 group/activity`}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover/activity:scale-150 transition-transform duration-300"></div>
                    <span className={`${isDark ? 'group-hover/activity:text-gray-300' : 'group-hover/activity:text-gray-700'} transition-colors duration-300 ${textColor}`}>Live Activity</span>
                  </div>
                  <div className={`${isDark ? 'text-cyan-300 group-hover/activity:text-cyan-400' : 'text-blue-600 group-hover/activity:text-blue-700'} font-medium group-hover/activity:scale-105 transition-all duration-300`}>
                    15 online • 3 new
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className={`pt-8 border-t ${borderColor} relative group/bottom`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDark ? 'via-cyan-500/10' : 'via-blue-500/5'} to-transparent opacity-0 group-hover/bottom:opacity-100 transition-opacity duration-500`}></div>
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm group/copyright">
                  <span className={`${isDark ? 'group-hover/copyright:text-white' : 'group-hover/copyright:text-gray-900'} transition-colors duration-300 ${textColorLight}`}>© {year} DevConnect. All rights reserved.</span>
                  <span className={`hidden sm:inline ${isDark ? 'text-gray-500' : 'text-gray-400'} ${isDark ? 'group-hover/copyright:text-gray-400' : 'group-hover/copyright:text-gray-500'} transition-colors duration-300`}>•</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm group/passion">
                  <Heart className="w-4 h-4 text-red-400 group-hover/passion:animate-pulse transition-all duration-300" />
                  <span className={`${isDark ? 'group-hover/passion:text-gray-400' : 'group-hover/passion:text-gray-600'} transition-colors duration-300 ${textColor}`}>
                    Made with passion for developers worldwide
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm group/links">
                {["Privacy", "Terms", "Cookies", "Security", "Status", "Careers", "Docs"].map((item, i) => (
                  <a
                    key={i}
                    href={item === "Docs" ? "/docs" : "#"}
                    className={`transition-all duration-300 relative group/link overflow-hidden ${
                      isDark 
                        ? 'text-gray-400 hover:text-cyan-300' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="relative z-10 group-hover/link:translate-x-1 transition-transform duration-300">
                      {item}
                    </span>
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover/link:w-full transition-all duration-300 ${
                      isDark ? 'bg-cyan-400' : 'bg-blue-500'
                    }`}></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Trending Element */}
        <div className="absolute bottom-24 right-6 lg:right-10 hidden lg:block">
          <div className="relative group">
            <div className={`absolute inset-0 rounded-full blur-xl ${
              isDark ? 'bg-cyan-500/20' : 'bg-blue-500/10'
            }`}></div>
            <div className={`relative p-3 backdrop-blur-sm border rounded-2xl shadow-lg group-hover:scale-105 transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30 group-hover:border-cyan-500/50'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 group-hover:border-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Trending: 150+ new posts today</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Separate style tag for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-10px) translateX(5px); }
          }
          
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-scan {
            animation: scan 4s linear infinite;
          }
        `}
      </style>
    </>
  );
}
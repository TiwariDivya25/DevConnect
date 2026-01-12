import { Link } from "react-router-dom";
import { 
  Code2, Github, Mail, Heart, Twitter, Linkedin, MessageCircle, 
  Send, Zap, Cpu, Shield, Cloud, Database, Code, 
  TrendingUp, Calendar, ShieldCheck, CpuIcon, RadioTower, MessageSquare,
  Users, Users2, Server, Globe, CheckCircle, X, Sparkles, Rocket,
  Activity, Clock, Wifi, Terminal, Layers, ChevronUp, Home,
  Users as UsersIcon, Plus, User, LogIn, UserPlus, GitMerge
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
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

  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <>
      <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black border-t border-cyan-900/30 text-gray-300 overflow-hidden pt-12">
        
        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 z-50 p-3 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 active:scale-95 group"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5"
               style={{
                 backgroundImage: `linear-gradient(90deg, #0ea5e9 1px, transparent 1px),
                                 linear-gradient(180deg, #0ea5e9 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }}></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '2s' }}></div>
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${30 + Math.sin(i) * 40}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            ></div>
          ))}
          
          {/* Scan Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
        </div>

        {/* Live Stats Bar */}
        <div className="relative z-10 py-4 border-b border-cyan-900/50 bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-green-900/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">All Systems Operational</span>
              </div>
              <div className="text-sm text-gray-400 bg-gray-800/30 px-3 py-1.5 rounded-lg">
                Last updated: <span className="text-cyan-300 font-medium">Just now</span>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-2 bg-gray-900 rounded-xl border border-cyan-500/20 group-hover:border-cyan-500/40 transition-all duration-300 group-hover:scale-105">
                    <Code2 className="w-8 h-8 text-cyan-300 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    DevConnect
                  </h2>
                  <p className="text-sm text-gray-400">Next Generation Dev Community</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Connect, collaborate, and build with developers worldwide. Join the fastest-growing developer ecosystem.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Github, color: "hover:bg-gray-800 hover:text-white", label: "GitHub", url: "https://github.com/TiwariDivya25/DevConnect" },
                  { icon: X, color: "hover:bg-black hover:text-white", label: "X", url: "https://twitter.com/devconnect" },
                  { icon: Linkedin, color: "hover:bg-blue-600 hover:text-white", label: "LinkedIn", url: "https://linkedin.com/company/devconnect" },
                  { icon: MessageCircle, color: "hover:bg-purple-500 hover:text-white", label: "Discord", url: "https://discord.gg/devconnect" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links (Navbar ke links ke hisab se) */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 group">
                <Zap className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
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
                    className="group p-3 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden"
                    style={{ transform: `translate(${parallaxX * 0.05}px, ${parallaxY * 0.05}px)` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center gap-2">
                      <link.icon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tech Stack (Readme file ke hisab se) */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 group">
                <CpuIcon className="w-5 h-5 text-cyan-400 group-hover:animate-spin transition-all duration-300" />
                Tech Stack
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: RadioTower, label: "React 18", desc: "Frontend", color: "text-cyan-400" },
                  { icon: Server, label: "TypeScript", desc: "Type Safety", color: "text-blue-400" },
                  { icon: Database, label: "Supabase", desc: "Backend & DB", color: "text-green-400" },
                  { icon: Shield, label: "Tailwind", desc: "Styling", color: "text-purple-400" },
                  { icon: Cloud, label: "Vite", desc: "Build Tool", color: "text-orange-400" },
                  { icon: GitMerge, label: "TanStack", desc: "Data Fetching", color: "text-pink-400" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="group p-3 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden"
                    style={{ 
                      transform: `translate(${parallaxX * (0.1 - i * 0.01)}px, ${parallaxY * (0.1 - i * 0.01)}px)`,
                      transitionDelay: `${i * 0.05}s`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-900 group-hover:scale-110 transition-transform duration-300 ${tech.color}`}>
                        <tech.icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium group-hover:text-white transition-colors duration-300">{tech.label}</div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{tech.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Links & Newsletter */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 group">
                <Rocket className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
                Join DevConnect
              </h3>
              
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                Get exclusive access to new features, beta programs, and community insights.
              </p>
              
              {/* Auth Links */}
              {/* <div className="grid grid-cols-2 gap-3 mb-4">
                <Link
                  to="/login"
                  className="group p-3 rounded-lg bg-cyan-900/30 border border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-900/50 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <LogIn className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="group p-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-500/50 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <UserPlus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-white">Sign Up</span>
                </Link>
              </div> */}
              
              {/* Newsletter */}
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-hover/input:text-cyan-400 transition-colors duration-300 z-10" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@example.com"
                    className="relative w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300 focus:shadow-lg focus:shadow-cyan-500/20 z-10"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || subscriptionSuccess}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/button ${
                    subscriptionSuccess 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                  } hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                
                <p className="text-xs text-gray-500 text-center group-hover:text-gray-400 transition-colors duration-300">
                  No spam, unsubscribe anytime
                </p>
              </form>
              
              {/* Live Activity */}
              <div className="pt-4 border-t border-gray-800 mt-6 group/activity">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover/activity:scale-150 transition-transform duration-300"></div>
                    <span className="text-gray-400 group-hover/activity:text-gray-300 transition-colors duration-300">Live Activity</span>
                  </div>
                  <div className="text-cyan-300 font-medium group-hover/activity:text-cyan-400 group-hover/activity:scale-105 transition-all duration-300">
                    15 online • 3 new
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 relative group/bottom">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover/bottom:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm group/copyright">
                  <span className="group-hover/copyright:text-white transition-colors duration-300">© {year} DevConnect. All rights reserved.</span>
                  <span className="hidden sm:inline text-gray-500 group-hover/copyright:text-gray-400 transition-colors duration-300">•</span>
                  {/* <span className="text-cyan-300 group-hover/copyright:text-cyan-400 group-hover/copyright:scale-105 transition-all duration-300 bg-cyan-900/20 px-3 py-1 rounded-lg border border-cyan-500/20">
                    v2.8.1 • Build #421
                  </span> */}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 group/passion">
                  <Heart className="w-4 h-4 text-red-400 group-hover/passion:animate-pulse transition-all duration-300" />
                  <span className="group-hover/passion:text-gray-400 transition-colors duration-300">
                    Made with passion for developers worldwide
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm group/links">
                {["Privacy", "Terms", "Cookies", "Security", "Status", "Careers", "Docs"].map((item, i) => (
                  <a
                    key={i}
                    href={item === "Docs" ? "/docs" : "#"}
                    className="text-gray-400 hover:text-cyan-300 transition-all duration-300 relative group/link overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="relative z-10 group-hover/link:translate-x-1 transition-transform duration-300">
                      {item}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover/link:w-full transition-all duration-300"></span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Trending Element */}
        <div className="absolute bottom-24 right-6 lg:right-10 hidden lg:block">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
            <div className="relative p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-2xl shadow-lg group-hover:border-cyan-500/50 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Trending: 150+ new posts today</span>
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
          
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-scan {
            animation: scan 4s linear infinite;
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          
          .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
          }
        `}
      </style>
    </>
  );
}
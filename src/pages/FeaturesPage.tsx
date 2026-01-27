import { Users, MessageSquare, Zap, Code2, Rocket, Globe, ArrowRight } from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 pt-32 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/5 via-transparent to-blue-900/5"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-cyan-400 text-sm font-mono mb-4">
              <Zap className="w-4 h-4" />
              Features
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              Everything You Need to <span className="text-cyan-400">Thrive</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A complete ecosystem for developers to collaborate, learn, and grow together
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Join Communities",
                description: "Connect with like-minded developers in communities focused on specific technologies and interests. Share knowledge, collaborate on projects, and build lasting professional relationships.",
                color: "cyan",
                features: [
                  "Technology-specific groups",
                  "Private and public communities",
                  "Community moderation tools",
                  "Member rankings and badges"
                ]
              },
              {
                icon: MessageSquare,
                title: "Real-time Chat",
                description: "Instant messaging, voice channels, and collaborative coding sessions. Stay connected with your team and community members in real-time.",
                color: "blue",
                features: [
                  "Direct messaging",
                  "Group conversations",
                  "File sharing",
                  "Code snippet formatting"
                ]
              },
              {
                icon: Code2,
                title: "Share & Learn",
                description: "Post code snippets, ask questions, and learn from experienced developers. Get feedback on your code and help others grow.",
                color: "purple",
                features: [
                  "Syntax-highlighted code blocks",
                  "Q&A discussions",
                  "Tutorial sharing",
                  "Code reviews"
                ]
              },
              {
                icon: Zap,
                title: "Discover Events",
                description: "Find hackathons, meetups, and tech events to expand your network. Stay updated with the latest tech events in your area and beyond.",
                color: "emerald",
                features: [
                  "Local and virtual events",
                  "RSVP and calendar integration",
                  "Event notifications",
                  "Post-event networking"
                ]
              },
              {
                icon: Rocket,
                title: "Build Projects",
                description: "Collaborate on open source projects and bring your ideas to life. Find team members, showcase your work, and contribute to the community.",
                color: "orange",
                features: [
                  "Project showcases",
                  "Collaboration tools",
                  "Git integration",
                  "Project roadmaps"
                ]
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Connect with developers worldwide and build a diverse professional network. Learn from different perspectives and expand your horizons.",
                color: "pink",
                features: [
                  "International community",
                  "Multi-language support",
                  "Time zone friendly",
                  "Cultural exchange programs"
                ]
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses: Record<string, string> = {
                cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400",
                blue: "from-blue-500/20 to-blue-600/10 text-blue-400",
                purple: "from-purple-500/20 to-purple-600/10 text-purple-400",
                emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-400",
                orange: "from-orange-500/20 to-orange-600/10 text-orange-400",
                pink: "from-pink-500/20 to-pink-600/10 text-pink-400"
              };

              return (
                <div 
                  key={index}
                  className="group relative bg-linear-to-br from-slate-900/50 to-slate-900/30 border border-slate-700/30 rounded-xl p-8 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 backdrop-blur-sm"
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${colorClasses[feature.color]} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
                  
                  <div className="relative space-y-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-linear-to-br ${colorClasses[feature.color].split(' ')[0]} rounded-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <ArrowRight className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-900 to-cyan-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who are already using DevConnect to build amazing things
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a 
                href="/signup"
                className="px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                Sign Up Free
              </a>
              <a 
                href="/communities"
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-gray-200 font-medium transition-colors duration-300 backdrop-blur-sm"
              >
                Explore Communities
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;

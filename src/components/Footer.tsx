import { Link } from "react-router-dom";
import { Code2, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            className="border-t"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[color:var(--text-primary)]">
                            <Code2 className="w-5 h-5 text-cyan-400" />
                            <span className="font-mono font-semibold">Dev<span className="text-cyan-400">Connect</span></span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Share ideas, build together, and connect with developers worldwide. Crafted for collaboration and meaningful discussions.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[color:var(--text-tertiary)]">
                            <Heart className="w-4 h-4 text-cyan-400" />
                            <span>Community-driven & open to contributors</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:gap-4 text-sm">
                        <div className="space-y-2">
                            <h3 className="font-mono text-[color:var(--text-primary)]">Navigate</h3>
                            <div className="flex flex-col gap-1">
                                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                                <Link to="/create" className="hover:text-cyan-400 transition-colors">Create Post</Link>
                                <Link to="/communities" className="hover:text-cyan-400 transition-colors">Communities</Link>
                                <Link to="/communities/create" className="hover:text-cyan-400 transition-colors">New Community</Link>
                                <Link to="/messages" className="hover:text-cyan-400 transition-colors">Messages</Link>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-mono text-[color:var(--text-primary)]">Stay connected</h3>
                            <div className="flex flex-col gap-2">
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    Contribute on GitHub
                                </a>
                                <a
                                    href="mailto:hello@devconnect.io"
                                    className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                    Contact the team
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-mono text-[color:var(--text-primary)]">Release notes</h3>
                        <p className="leading-relaxed">
                            Be the part of the journey. Be Connected with Dev Connect.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-300 border border-cyan-400/40">Realtime chat</span>
                            <span className="px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-300 border border-cyan-400/40">Supabase auth</span>
                            <span className="px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-300 border border-cyan-400/40">Theme toggle</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[color:var(--text-tertiary)]">
                        <span>© {year} DevConnect. Built for developers.</span>
                        <div className="flex items-center gap-4">
                            <span className="hover:text-cyan-400 transition-colors">Privacy</span>
                            <span className="hover:text-cyan-400 transition-colors">Terms</span>
                            <span className="hover:text-cyan-400 transition-colors">Status</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
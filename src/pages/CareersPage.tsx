import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Clock, Briefcase, ChevronRight, Search, Filter,
    Star, Globe, Heart, BookOpen, Laptop, Calendar, Users,
    X, Building2, Sparkles, ArrowRight, Mail, Zap, Rocket,
    Code2, CheckCircle2
} from 'lucide-react';
import { careers, teams, jobTypes, companyPerks, type Career, type JobType } from '../data/careers';

const iconMap: Record<string, React.ElementType> = {
    Globe,
    Heart,
    BookOpen,
    Laptop,
    Calendar,
    Users
};

const CareersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [selectedType, setSelectedType] = useState<JobType | ''>('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        document.title = 'Careers — DevConnect | Join Our Team';
    }, []);

    const filteredCareers = careers.filter(career => {
        const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.team.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = !selectedTeam || career.team === selectedTeam;
        const matchesType = !selectedType || career.type === selectedType;
        return matchesSearch && matchesTeam && matchesType;
    });

    const featuredCareers = filteredCareers.filter(c => c.featured);
    const regularCareers = filteredCareers.filter(c => !c.featured);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedTeam('');
        setSelectedType('');
    };

    const hasActiveFilters = searchQuery || selectedTeam || selectedType;

    const formatJobType = (type: JobType): string => {
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
    };

    const getTypeColor = (type: JobType): string => {
        switch (type) {
            case 'full-time': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'part-time': return 'bg-sky-100 text-sky-700 border-sky-200';
            case 'contract': return 'bg-violet-100 text-violet-700 border-violet-200';
            case 'internship': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const JobCard = ({ career, featured = false }: { career: Career; featured?: boolean }) => (
        <div
            className={`group relative bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${featured
                    ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/10'
                    : 'border border-gray-200 shadow-lg hover:shadow-gray-200/50 hover:border-blue-200'
                }`}
        >
            {featured && (
                <div className="absolute -top-3 left-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-xs font-bold text-white shadow-lg shadow-blue-500/30">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                    </div>
                </div>
            )}

            <div className="p-6 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {career.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                <Building2 className="w-4 h-4 text-blue-500" />
                                {career.team}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {career.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                <Clock className="w-4 h-4 text-blue-500" />
                                {new Date(career.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border uppercase tracking-wide shrink-0 ${getTypeColor(career.type)}`}>
                        {formatJobType(career.type)}
                    </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-5 line-clamp-2">
                    {career.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                    {career.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {req.split(' ').slice(0, 3).join(' ')}
                        </span>
                    ))}
                    {career.requirements.length > 3 && (
                        <span className="px-3 py-1.5 text-sm text-blue-600 font-semibold">
                            +{career.requirements.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                    <a
                        href={career.applyLink}
                        className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                    >
                        <Mail className="w-4 h-4" />
                        Apply Now
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 font-semibold">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-semibold mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>We're Hiring!</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            Build the Future of
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-200">
                                Developer Community
                            </span>
                        </h1>

                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join a passionate team building tools that connect developers worldwide. Shape how developers learn, share, and grow together.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="#openings"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105"
                            >
                                View Open Positions
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300"
                            >
                                <Code2 className="w-5 h-5" />
                                Learn About Us
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-12 mt-16">
                            {[
                                { number: '50+', label: 'Team Members', icon: Users },
                                { number: '100K+', label: 'Active Developers', icon: Code2 },
                                { number: '30+', label: 'Countries', icon: Globe },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <stat.icon className="w-6 h-6 text-cyan-300" />
                                        <span className="text-4xl font-black">{stat.number}</span>
                                    </div>
                                    <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#EFF6FF" />
                    </svg>
                </div>
            </section>

            {/* Company Perks */}
            <section className="py-20 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-4">
                            <Heart className="w-4 h-4" />
                            Benefits & Culture
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Why Join DevConnect?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We believe in creating an environment where you can do your best work while living your best life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companyPerks.map((perk, idx) => {
                            const IconComponent = iconMap[perk.icon];
                            const colors = [
                                { bg: 'bg-gradient-to-br from-cyan-500 to-blue-600', light: 'bg-cyan-50', text: 'text-cyan-600' },
                                { bg: 'bg-gradient-to-br from-rose-500 to-pink-600', light: 'bg-rose-50', text: 'text-rose-600' },
                                { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', light: 'bg-amber-50', text: 'text-amber-600' },
                                { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
                                { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-600' },
                                { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600' },
                            ];
                            const color = colors[idx];

                            return (
                                <div
                                    key={idx}
                                    className="group bg-white rounded-2xl p-7 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{perk.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{perk.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="openings" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-600 text-sm font-semibold mb-4">
                                <Briefcase className="w-4 h-4" />
                                Join Our Team
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-3">Open Positions</h2>
                            <p className="text-lg text-gray-600">
                                {filteredCareers.length} {filteredCareers.length === 1 ? 'role' : 'roles'} waiting for talented people like you
                            </p>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search roles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-72 pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 border rounded-xl font-semibold transition-all ${showFilters || hasActiveFilters
                                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                                {hasActiveFilters && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-500 font-medium">Team:</label>
                                    <select
                                        value={selectedTeam}
                                        onChange={(e) => setSelectedTeam(e.target.value)}
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">All Teams</option>
                                        {teams.map(team => (
                                            <option key={team} value={team}>{team}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-500 font-medium">Type:</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value as JobType | '')}
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{formatJobType(type)}</option>
                                        ))}
                                    </select>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Job Listings */}
                    {filteredCareers.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No positions found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Featured Jobs */}
                            {featuredCareers.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {featuredCareers.map(career => (
                                        <JobCard key={career.id} career={career} featured />
                                    ))}
                                </div>
                            )}

                            {/* Regular Jobs */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {regularCareers.map(career => (
                                    <JobCard key={career.id} career={career} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
                        <Rocket className="w-4 h-4" />
                        General Applications
                    </div>
                    <h2 className="text-4xl font-black mb-6">Don't See Your Role?</h2>
                    <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                        We're always looking for talented people. Send us your resume and tell us how you'd like to contribute to DevConnect.
                    </p>
                    <a
                        href="mailto:careers@devconnect.io?subject=General Application"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
                    >
                        <Mail className="w-5 h-5" />
                        Send General Application
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;

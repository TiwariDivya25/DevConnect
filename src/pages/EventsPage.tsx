import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Clock, Filter, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import type { EventFilters as EventFiltersType } from '../types/events';

const EventsPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events = [], isLoading, error } = useEvents({
    ...filters,
    search: searchQuery,
  });

  const handleFilterChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sign-in Banner for unauthenticated users */}
      {!user && (
        <div className="bg-cyan-900/20 border-b border-cyan-400/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <p className="text-cyan-300 text-sm">
                Sign in to create events and register for events
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-cyan-400" />
                Events
              </h1>
              <p className="text-gray-400 mt-1">
                Discover and join developer events in your community
              </p>
            </div>
            
            {user && (
              <Link
                to="/events/create"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-medium transition"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition
                ${showFilters
                  ? 'bg-cyan-900/30 border-cyan-400/50 text-cyan-300'
                  : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/50'
                }
              `}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Clear Filters */}
            {(Object.keys(filters).length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-gray-300 transition"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4">
              <EventFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-4"></div>
                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-4"></div>
                <div className="h-8 bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Error loading events</h3>
            <p className="text-gray-500">Please try again later</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : user 
                  ? 'Be the first to create an event in your community'
                  : 'Sign in to create events'
              }
            </p>
            {user && (
              <Link
                to="/events/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-medium transition"
              >
                <Plus className="w-5 h-5" />
                Create First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {events.length > 0 && (
        <div className="bg-slate-900/30 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {events.length}
                </div>
                <div className="text-sm text-gray-400">Total Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {events.filter(e => e.type === 'meetup').length}
                </div>
                <div className="text-sm text-gray-400">Meetups</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {events.filter(e => e.type === 'hackathon').length}
                </div>
                <div className="text-sm text-gray-400">Hackathons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {events.filter(e => e.type === 'webinar').length}
                </div>
                <div className="text-sm text-gray-400">Webinars</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
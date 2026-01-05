import { useState } from 'react';
import { useCreateNetworkingConnection } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { Users, MessageCircle, UserPlus, Search } from 'lucide-react';
import type { EventRegistration } from '../types/events';

interface EventAttendeesProps {
  attendees: EventRegistration[];
}

const EventAttendees = ({ attendees }: EventAttendeesProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const createConnection = useCreateNetworkingConnection();

  const filteredAttendees = attendees.filter(attendee => {
    if (!searchQuery) return true;
    
    const name = attendee.user?.user_metadata?.full_name || 
                 attendee.user?.user_metadata?.user_name || 
                 attendee.user?.email || '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleConnect = async (targetUserId: string, eventId: number) => {
    try {
      await createConnection.mutateAsync({
        eventId,
        targetUserId,
        message: 'Hi! I saw you\'re attending the same event. Would love to connect!',
      });
    } catch (error) {
      console.error('Failed to create connection:', error);
    }
  };

  const getUserDisplayName = (attendee: EventRegistration) => {
    return attendee.user?.user_metadata?.full_name || 
           attendee.user?.user_metadata?.user_name || 
           attendee.user?.email || 
           'Unknown User';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">
            Attendees ({attendees.length})
          </h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>
      </div>

      {/* Attendees Grid */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery ? 'No attendees found matching your search' : 'No attendees yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {attendee.user?.user_metadata?.avatar_url ? (
                  <img
                    src={attendee.user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full ring-2 ring-cyan-400/50"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-lg text-gray-300">
                      {getUserDisplayName(attendee)[0]?.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">
                    {getUserDisplayName(attendee)}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">
                    {attendee.user?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Registered {new Date(attendee.registered_at).toLocaleDateString()}
                  </p>

                  {/* Connect Button */}
                  {user && attendee.user_id !== user.id && (
                    <button
                      onClick={() => handleConnect(attendee.user_id, attendee.event_id)}
                      disabled={createConnection.isPending}
                      className="mt-2 flex items-center gap-1 px-3 py-1 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded text-xs text-cyan-300 transition disabled:opacity-50"
                    >
                      <UserPlus className="w-3 h-3" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              {attendees.length}
            </div>
            <div className="text-sm text-gray-400">Total Registered</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              {attendees.filter(a => a.status === 'attended').length}
            </div>
            <div className="text-sm text-gray-400">Attended</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              {attendees.filter(a => 
                new Date(a.registered_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className="text-sm text-gray-400">Recent Signups</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              {Math.round((attendees.filter(a => a.status === 'attended').length / attendees.length) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-400">Attendance Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;
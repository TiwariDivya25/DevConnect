import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent, useEventRegistration, useEventAttendees, useNetworkingConnections } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, MapPin, Users, Clock, Globe, Video, Tag, 
  UserPlus, MessageCircle, Share2, Edit, ArrowLeft,
  CheckCircle, XCircle, Bell, BellOff
} from 'lucide-react';
import EventAttendees from '../components/EventAttendees';
import NetworkingPanel from '../components/NetworkingPanel';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const eventId = parseInt(id || '0');
  
  const { data: event, isLoading, error } = useEvent(eventId);
  const { data: attendees = [] } = useEventAttendees(eventId);
  const { data: connections = [] } = useNetworkingConnections(eventId);
  const { register, unregister } = useEventRegistration();
  
  const [activeTab, setActiveTab] = useState<'details' | 'attendees' | 'networking'>('details');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meetup':
        return 'bg-blue-900/30 text-blue-300 border-blue-400/50';
      case 'hackathon':
        return 'bg-purple-900/30 text-purple-300 border-purple-400/50';
      case 'webinar':
        return 'bg-green-900/30 text-green-300 border-green-400/50';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-400/50';
    }
  };

  const handleRegistration = async () => {
    if (!event) return;
    
    try {
      if (event.is_registered) {
        await unregister.mutateAsync(eventId);
      } else {
        await register.mutateAsync(eventId);
      }
      setShowRegistrationModal(false);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const isEventFull = event?.max_attendees && attendees.length >= event.max_attendees;
  const isRegistrationClosed = event?.registration_deadline && 
    new Date(event.registration_deadline) < new Date();
  const isEventPast = event && new Date(event.date) < new Date();
  const isOrganizer = event?.organizer_id === user?.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Event not found</h2>
          <Link
            to="/events"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/events"
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                  ${getEventTypeColor(event.type)}
                `}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {event.is_virtual && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-300 border border-cyan-400/50">
                    <Globe className="w-3 h-3" />
                    Virtual
                  </span>
                )}
                {isEventPast && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-900/30 text-gray-300 border border-gray-400/50">
                    Completed
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {isOrganizer && (
                <Link
                  to={`/events/${event.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-gray-300 transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              )}
              
              <button className="p-2 hover:bg-slate-800 rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.image_url && (
              <div className="mb-8">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-lg border border-slate-800"
                />
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
              {[
                { id: 'details', label: 'Details', icon: Calendar },
                { id: 'attendees', label: `Attendees (${attendees.length})`, icon: Users },
                { id: 'networking', label: `Networking (${connections.length})`, icon: MessageCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 border-b-2 transition
                    ${activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">About This Event</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/50 text-gray-300 text-sm rounded-full border border-slate-700"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attendees' && (
              <EventAttendees attendees={attendees} />
            )}

            {activeTab === 'networking' && (
              <NetworkingPanel eventId={eventId} connections={connections} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="space-y-4">
                {/* Event Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="font-medium">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-400">{formatTime(event.time)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span>{event.duration} minutes</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span>{event.is_virtual ? 'Online Event' : event.location || 'Location TBA'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>
                      {attendees.length} registered
                      {event.max_attendees && ` / ${event.max_attendees} max`}
                    </span>
                  </div>
                </div>

                {/* Registration Button */}
                {!user ? (
                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-center mb-3">
                      <p className="text-gray-400 text-sm mb-2">Sign in to register for this event</p>
                    </div>
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-gray-500 cursor-not-allowed"
                    >
                      Sign In Required
                    </button>
                  </div>
                ) : !isOrganizer && (
                  <div className="pt-4 border-t border-slate-800">
                    {event.is_registered ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">You're registered!</span>
                        </div>
                        <button
                          onClick={handleRegistration}
                          disabled={unregister.isPending}
                          className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 transition disabled:opacity-50"
                        >
                          {unregister.isPending ? 'Cancelling...' : 'Cancel Registration'}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleRegistration}
                        disabled={register.isPending || isEventFull || isRegistrationClosed || isEventPast}
                        className="w-full px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {register.isPending ? 'Registering...' : 
                         isEventPast ? 'Event Completed' :
                         isEventFull ? 'Event Full' :
                         isRegistrationClosed ? 'Registration Closed' :
                         'Register for Event'}
                      </button>
                    )}
                  </div>
                )}

                {/* Virtual Link */}
                {event.is_virtual && event.virtual_link && event.is_registered && (
                  <div className="pt-4 border-t border-slate-800">
                    <a
                      href={event.virtual_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-full px-4 py-2 bg-green-900/30 hover:bg-green-900/50 border border-green-400/50 rounded-lg text-green-300 font-medium transition text-center justify-center"
                    >
                      <Video className="w-4 h-4" />
                      Join Virtual Event
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Organizer</h3>
              <div className="flex items-center gap-3">
                {event.organizer?.user_metadata?.avatar_url ? (
                  <img
                    src={event.organizer.user_metadata.avatar_url}
                    alt="Organizer"
                    className="w-12 h-12 rounded-full ring-2 ring-cyan-400/50"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-lg text-gray-300">
                      {event.organizer?.user_metadata?.full_name?.[0] || 
                       event.organizer?.user_metadata?.user_name?.[0] || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">
                    {event.organizer?.user_metadata?.full_name || 
                     event.organizer?.user_metadata?.user_name || 
                     event.organizer?.email}
                  </div>
                  <div className="text-sm text-gray-400">Event Organizer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
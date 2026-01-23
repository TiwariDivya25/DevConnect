import { useParams } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { useEventAttendance } from '../hooks/useEvents';
import { showSuccess, showError } from "../utils/toast";
import { 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  Clock, 
  Tag, 
  Share2, 
  Heart, 
  CheckCircle, 
  XCircle,
  Monitor,
  Building,
  Gauge
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ? parseInt(id) : 0;
  
  const { data: event, isLoading, error } = useEvent(eventId);
  const { user } = useAuth();
  const { register, isRegistering } = useEventAttendance();
  const [attendanceStatus, setAttendanceStatus] = useState<'attending' | 'maybe' | 'not_attending'>('attending');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Event Not Found</h1>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/events" 
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
          >
            Browse Events
          </a>
        </div>
      </div>
    );
  }

  const handleAttendance = (status: 'attending' | 'maybe' | 'not_attending') => {
    if (!user) {
      showError('Please sign in to register for events');
      return;
    }
    
    setAttendanceStatus(status);
    register({ eventId, status }, {
      onSuccess: () => {
        showSuccess(`You are now ${status} this event`);
      },
      onError: (error: any) => {
        showError(error.message || 'Failed to register for event');
      }
    });
  };

  const handleShareEvent = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Event link copied to clipboard");
    } catch {
      showError("Failed to copy event link");
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const eventDate = new Date(event.event_date);
  const isPastEvent = eventDate < new Date();
  const isFull = event.max_attendees ? (event.attendee_count || 0) >= event.max_attendees : false;
  
  const currentUserAttendance = event.user_attendance?.status || null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-slate-400">No image available</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        
        {/* Floating badge for past events */}
        {isPastEvent && (
          <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
            PAST EVENT
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-8">
            {/* Event Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {event.Communities && (
                    <span className="px-3 py-1 bg-cyan-900/30 text-cyan-400 rounded-full text-sm font-mono">
                      {event.Communities.name}
                    </span>
                  )}
                  {event.is_virtual && (
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm font-mono">
                      Virtual
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={() => window.history.back()}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    aria-label="Go back"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                  </button>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white">
                    {event.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Event Stats */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-w-[280px]">
                <h3 className="font-bold text-slate-300 mb-4 font-mono">EVENT STATS</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Attendees</span>
                    <span className="text-cyan-400 font-mono">
                      {event.attendee_count || 0}{event.max_attendees ? `/${event.max_attendees}` : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="font-mono">
                      {isFull ? (
                        <span className="text-red-400">FULL</span>
                      ) : (
                        <span className="text-green-400">OPEN</span>
                      )}
                    </span>
                  </div>
                  
                  {event.max_attendees && (
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Capacity</span>
                        <span className="text-slate-400">{Math.round(((event.attendee_count || 0) / event.max_attendees) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, ((event.attendee_count || 0) / event.max_attendees) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Details */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Details
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-300 mb-1">Date & Time</h3>
                        <p className="text-white">{formatDate(event.event_date)}</p>
                        <p className="text-slate-400 text-sm">{formatTime(event.event_date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-300 mb-1">Duration</h3>
                        <p className="text-white">2 hours</p>
                        <p className="text-slate-400 text-sm">Estimated</p>
                      </div>
                    </div>
                    
                    {!event.is_virtual ? (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-slate-300 mb-1">Location</h3>
                          <p className="text-white">{event.location}</p>
                          <p className="text-slate-400 text-sm">Physical venue</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Monitor className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-slate-300 mb-1">Meeting Link</h3>
                          <a 
                            href={event.meeting_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline"
                          >
                            Join Virtual Event
                          </a>
                          <p className="text-slate-400 text-sm">Online via Zoom</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-300 mb-1">Organizer</h3>
                        <p className="text-white">{event.organizer_id}</p>
                        <p className="text-slate-400 text-sm">Event coordinator</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 text-cyan-400">About This Event</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </div>
                
                {/* Attendees */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Attendees ({event.attendee_count || 0})
                  </h2>
                  
                  <div className="flex flex-wrap gap-3">
                    {event.EventAttendees.slice(0, 10).map((attendee, index) => (
                      <div key={attendee.id} className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
                        <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm">User {index + 1}</span>
                      </div>
                    ))}
                    {(event.EventAttendees.length > 10) && (
                      <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-2">
                        <span className="text-sm text-slate-400">+{event.EventAttendees.length - 10} more</span>
                      </div>
                    )}
                    {event.EventAttendees.length === 0 && (
                      <p className="text-slate-500 italic">No attendees yet. Be the first to join!</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">Register</h3>
                  
                  {!isPastEvent && (
                    <>
                      {currentUserAttendance ? (
                        <div className="mb-4 p-4 bg-slate-700/50 rounded-lg">
                          <p className="text-center text-slate-300 mb-2">You are registered as:</p>
                          <p className="text-center font-semibold capitalize text-cyan-400">
                            {currentUserAttendance}
                          </p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <p className="text-slate-400 text-sm mb-3">How are you attending?</p>
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <button
                              onClick={() => handleAttendance('attending')}
                              disabled={isRegistering || isFull}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                                attendanceStatus === 'attending' 
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                              } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <CheckCircle className="w-5 h-5 mb-1" />
                              <span className="text-xs">Going</span>
                            </button>
                            <button
                              onClick={() => handleAttendance('maybe')}
                              disabled={isRegistering || isFull}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                                attendanceStatus === 'maybe' 
                                  ? 'border-amber-500 bg-amber-500/10 text-amber-400' 
                                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                              } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <User className="w-5 h-5 mb-1" />
                              <span className="text-xs">Maybe</span>
                            </button>
                            <button
                              onClick={() => handleAttendance('not_attending')}
                              disabled={isRegistering}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                                attendanceStatus === 'not_attending' 
                                  ? 'border-red-500 bg-red-500/10 text-red-400' 
                                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              <XCircle className="w-5 h-5 mb-1" />
                              <span className="text-xs">Can't</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {isFull && (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-center">
                          <p className="text-red-400 font-medium">This event is full</p>
                        </div>
                      )}
                      
                      <button
                        onClick={handleShareEvent}
                        disabled={isRegistering}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-slate-300 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Event
                      </button>
                    </>
                  )}
                  
                  {isPastEvent && (
                    <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                      <p className="text-slate-400">This event has ended</p>
                    </div>
                  )}
                </div>
                
                {/* Event Info Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">Event Info</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Created</span>
                      <span className="text-slate-300">{format(new Date(event.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Updated</span>
                      <span className="text-slate-300">{format(new Date(event.updated_at), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="text-slate-300 capitalize">{event.is_virtual ? 'Virtual' : 'In-person'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
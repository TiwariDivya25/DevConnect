import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Globe, Video, Tag } from 'lucide-react';
import type { Event } from '../types/events';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meetup':
        return <Users className="w-4 h-4" />;
      case 'hackathon':
        return <Calendar className="w-4 h-4" />;
      case 'webinar':
        return <Video className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Link to={`/events/${event.id}`}>
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group">
        {/* Event Image */}
        {event.image_url ? (
          <div className="h-48 overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center">
            {getEventTypeIcon(event.type)}
          </div>
        )}

        <div className="p-6">
          {/* Event Type Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
              ${getEventTypeColor(event.type)}
            `}>
              {getEventTypeIcon(event.type)}
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            
            {event.is_virtual && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-cyan-900/30 text-cyan-300 border border-cyan-400/50">
                <Globe className="w-3 h-3" />
                Virtual
              </span>
            )}
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Event Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{event.duration} minutes</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="truncate">
                {event.is_virtual ? 'Online Event' : event.location || 'Location TBA'}
              </span>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>
                {event.attendees_count || 0} registered
                {event.max_attendees && ` / ${event.max_attendees} max`}
              </span>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800/50 text-gray-300 text-xs rounded border border-slate-700"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{event.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Organizer */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
            {event.organizer?.user_metadata?.avatar_url ? (
              <img
                src={event.organizer.user_metadata.avatar_url}
                alt="Organizer"
                className="w-6 h-6 rounded-full ring-2 ring-cyan-400/50"
              />
            ) : (
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-300">
                  {event.organizer?.user_metadata?.full_name?.[0] || 
                   event.organizer?.user_metadata?.user_name?.[0] || '?'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-400">
              by {event.organizer?.user_metadata?.full_name || 
                   event.organizer?.user_metadata?.user_name || 
                   event.organizer?.email}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
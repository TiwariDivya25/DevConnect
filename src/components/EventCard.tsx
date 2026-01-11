import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EventWithDetails } from '../types/events';

interface EventCardProps {
  event: EventWithDetails;
  showCommunity?: boolean;
  showAttendeeCount?: boolean;
  className?: string;
}

export const EventCard = ({ 
  event, 
  showCommunity = true, 
  showAttendeeCount = true, 
  className = '' 
}: EventCardProps) => {
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString();
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition-colors ${className}`}>
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      
      <h3 className="text-xl font-semibold mb-2 text-white">{event.title}</h3>
      <p className="text-slate-300 mb-4 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-400">
          <Calendar className="w-4 h-4 mr-2" />
          {formattedDate} at {formattedTime}
        </div>
        
        {event.location && (
          <div className="flex items-center text-sm text-slate-400">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        )}
        
        {showAttendeeCount && (
          <div className="flex items-center text-sm text-slate-400">
            <Users className="w-4 h-4 mr-2" />
            {event.attendee_count || 0}
            {event.max_attendees ? `/${event.max_attendees}` : ''} attendees
          </div>
        )}
      </div>

      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        {showCommunity && event.Communities && (
          <span className="text-sm text-slate-400">
            in {event.Communities.name}
          </span>
        )}
        
        <Link
          to={`/events/${event.id}`}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
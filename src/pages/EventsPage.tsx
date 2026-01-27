import { Calendar, MapPin, Users } from 'lucide-react'
import { useEvents } from '../hooks/useEvents';

export default function EventsPage() {
  const { data: events, isLoading, error } = useEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Developer Events</h1>
        <a
          href="/events/create"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Event
        </a>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-slate-400">Loading events...</span>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 text-lg mb-2">Error loading events</div>
          <div className="text-slate-400">{error instanceof Error ? error.message : String(error)}</div>
          <p className="text-slate-500 mt-2 text-sm">Try refreshing the page or check your connection</p>
        </div>
      )}
      
      {!isLoading && !error && events && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            // Format the date for display
            const eventDate = new Date(event.event_date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            const formattedTime = eventDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            
            return (
              <div
                key={event.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-slate-300 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formattedDate} at {formattedTime}
                  </div>
                  {!event.is_virtual ? (
                    <div className="flex items-center text-sm text-slate-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-slate-400">
                      <Users className="w-4 h-4 mr-2" />
                      Virtual Event
                    </div>
                  )}
                  <div className="flex items-center text-sm text-slate-400">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendee_count || 0}{event.max_attendees ? `/${event.max_attendees}` : ''} attendees
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">in {event.Communities?.name || 'General'}</span>
                  <a
                    href={`/events/${event.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    View Details
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!isLoading && !error && (!events || events.length === 0) && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg">No events found</div>
          <p className="text-slate-500 mt-2">Be the first to create an event for the community!</p>
        </div>
      )}
    </div>
  )
}
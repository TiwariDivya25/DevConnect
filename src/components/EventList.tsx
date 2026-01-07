import { EventCard } from './EventCard';
import type { EventWithDetails, EventFilters } from '../types/events';

interface EventListProps {
  events: EventWithDetails[];
  filters?: EventFilters;
  showFilters?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const EventList = ({ 
  events, 
  emptyMessage = "No events found", 
  className = "" 
}: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
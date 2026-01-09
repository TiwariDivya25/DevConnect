import { useState } from 'react';
import { useEventAttendance } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import type { EventWithDetails } from '../types/events';

interface EventActionsProps {
  event: EventWithDetails;
  className?: string;
}

export const EventActions = ({ event, className = '' }: EventActionsProps) => {
  const { user } = useAuth();
  const { register, isRegistering } = useEventAttendance();
  const [isSharing, setIsSharing] = useState(false);

  const handleRegister = () => {
    if (!user) return;
    register({ eventId: event.id, status: 'attending' });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!user) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-slate-400 mb-4">Please sign in to register for events</p>
      </div>
    );
  }

  const isRegistered = event.user_attendance;
  const isFull = event.max_attendees && event.attendee_count >= event.max_attendees;

  return (
    <div className={`flex gap-4 ${className}`}>
      {!isRegistered && !isFull && (
        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isRegistering ? 'Registering...' : 'Join Event'}
        </button>
      )}
      
      {isRegistered && (
        <div className="bg-green-600/20 text-green-400 px-6 py-3 rounded-lg font-medium">
          ✓ Registered
        </div>
      )}
      
      {isFull && !isRegistered && (
        <div className="bg-slate-600 text-slate-300 px-6 py-3 rounded-lg font-medium">
          Event Full
        </div>
      )}
      
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="border border-slate-600 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {isSharing ? 'Sharing...' : 'Share Event'}
      </button>
    </div>
  );
};
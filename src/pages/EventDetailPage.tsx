import { Calendar, MapPin, Users, User } from 'lucide-react'
import { showSuccess, showError } from "../utils/toast";

interface Event {
  id: number
  title: string
  description: string
  fullDescription: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  organizer: string
  imageUrl?: string
}

const mockEvent: Event = {
  id: 1,
  title: "React Workshop 2024",
  description: "Learn the latest React features and best practices in this hands-on workshop.",
  fullDescription: "Join us for an intensive React workshop where you'll learn the latest features including React 18, Concurrent Features, Suspense, and more. This hands-on workshop is perfect for developers who want to stay up-to-date with the React ecosystem. We'll cover practical examples, best practices, and real-world applications.",
  date: "2024-02-15",
  time: "10:00 AM",
  location: "Tech Hub, Downtown",
  attendees: 25,
  maxAttendees: 50,
  organizer: "DevConnect Team"
}

export default function EventDetailPage() {
  // In real app, fetch event by id: const event = await fetchEventById(id)
  const event = mockEvent

  const handleJoinEvent = () => {
  if (event.attendees >= event.maxAttendees) {
    showError("This event is already full");
    return;
  }
  showSuccess("You have successfully joined the event");
};

const handleShareEvent = () => {
  try {
    navigator.clipboard.writeText(window.location.href);
    showSuccess("Event link copied to clipboard");
  } catch {
    showError("Failed to copy event link");
  }
};


  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-slate-400">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-slate-300">
                    <Calendar className="w-5 h-5 mr-3 text-cyan-400" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-slate-300">
                    <MapPin className="w-5 h-5 mr-3 text-cyan-400" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Users className="w-5 h-5 mr-3 text-cyan-400" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>
                  <div className="flex items-center text-slate-300">
                    <User className="w-5 h-5 mr-3 text-cyan-400" />
                    Organized by {event.organizer}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="text-slate-300 leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Join Event
              </button>
              <button className="border border-slate-600 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors">
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
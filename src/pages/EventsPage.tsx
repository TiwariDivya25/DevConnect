import { useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  organizer: string
  imageUrl?: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "React Workshop 2024",
    description: "Learn the latest React features and best practices in this hands-on workshop.",
    date: "2024-02-15",
    time: "10:00 AM",
    location: "Tech Hub, Downtown",
    attendees: 25,
    maxAttendees: 50,
    organizer: "DevConnect Team"
  },
  {
    id: 2,
    title: "JavaScript Meetup",
    description: "Monthly meetup for JavaScript developers to share knowledge and network.",
    date: "2024-02-20",
    time: "6:00 PM",
    location: "Community Center",
    attendees: 40,
    maxAttendees: 60,
    organizer: "JS Community"
  }
]

export default function EventsPage() {
  const [events] = useState<Event[]>(mockEvents)

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-slate-300 mb-4">{event.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-slate-400">
                <Calendar className="w-4 h-4 mr-2" />
                {event.date} at {event.time}
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <Users className="w-4 h-4 mr-2" />
                {event.attendees}/{event.maxAttendees} attendees
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">by {event.organizer}</span>
              <a
                href={`/events/${event.id}`}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
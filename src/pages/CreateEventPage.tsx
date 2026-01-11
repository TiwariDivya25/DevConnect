import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Image } from 'lucide-react'
import {showError,showSuccess} from "../utils/toast";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    imageUrl: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    showSuccess("Event created successfully!");
    console.log('Event created:', formData);
    // Redirect to events page or show success message
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Event Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="Brief description of your event"
                />
              </div>
              
              <div>
                <label htmlFor="fullDescription" className="block text-sm font-medium mb-2">
                  Full Description
                </label>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="Detailed description of your event"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Event location or venue"
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="maxAttendees" className="block text-sm font-medium mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Maximum Attendees
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Leave empty for unlimited"
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                Event Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-slate-600 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
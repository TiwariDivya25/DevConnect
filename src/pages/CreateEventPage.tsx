import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvent } from '../hooks/useEvents';
import { Calendar, MapPin, Users, Clock, Image, Hash, Monitor } from 'lucide-react'
import {showError,showSuccess} from "../utils/toast";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    time: '',
    location: '',
    is_virtual: false,
    meeting_link: '',
    max_attendees: '',
    image_url: '',
    tags: '' // Comma-separated tags
  })
  
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.event_date || !formData.time) {
      showError('Please fill in all required fields');
      return;
    }
    
    // Prepare event data
    const eventData = {
      title: formData.title,
      description: formData.description,
      event_date: `${formData.event_date}T${formData.time}`, // Combine date and time
      location: formData.location || undefined,
      is_virtual: formData.is_virtual,
      meeting_link: formData.meeting_link || undefined,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
      image_url: formData.image_url || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      community_id: undefined // Optional community association
    };
    
    mutate(eventData, {
      onSuccess: (data) => {
        showSuccess('Event created successfully!');
        navigate(`/events/${data.id}`);
      },
      onError: (error: any) => {
        showError(error.message || 'Failed to create event');
      }
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  const handleVirtualToggle = () => {
    setFormData(prev => ({
      ...prev,
      is_virtual: !prev.is_virtual
    }));
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.checked
    }));
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
                  Description *
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
            </div>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date" className="block text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
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
            
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="is_virtual"
                name="is_virtual"
                checked={formData.is_virtual}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
              />
              <label htmlFor="is_virtual" className="text-sm font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Virtual Event
              </label>
            </div>
            
            {!formData.is_virtual && (
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
                  required={!formData.is_virtual}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="Event location or venue"
                />
              </div>
            )}
            
            {formData.is_virtual && (
              <div className="mt-4">
                <label htmlFor="meeting_link" className="block text-sm font-medium mb-2">
                  <Monitor className="w-4 h-4 inline mr-1" />
                  Meeting Link
                </label>
                <input
                  type="url"
                  id="meeting_link"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            )}
            
            <div className="mt-4">
              <label htmlFor="max_attendees" className="block text-sm font-medium mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Maximum Attendees
              </label>
              <input
                type="number"
                id="max_attendees"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="Leave empty for unlimited"
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="image_url" className="block text-sm font-medium mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                Event Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500"
                placeholder="react,workshop,javascript"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="border border-slate-600 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-lg font-medium transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
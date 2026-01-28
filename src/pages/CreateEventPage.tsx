import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvent } from '../hooks/useEvents';
import { Calendar, MapPin, Users, Clock, Image, Hash, Monitor } from 'lucide-react'
import { showError, showSuccess } from "../utils/toast";

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
      onError: (error: Error) => {
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
                <label htmlFor="title" className="form-label">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-slate"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-slate"
                  placeholder="Brief description of your event"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date" className="form-label-icon">
                  <Calendar className="w-4 h-4" />
                  Date *
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  className="input-slate"
                />
              </div>

              <div>
                <label htmlFor="time" className="form-label-icon">
                  <Clock className="w-4 h-4" />
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="input-slate"
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
                <label htmlFor="location" className="form-label-icon">
                  <MapPin className="w-4 h-4" />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required={!formData.is_virtual}
                  className="input-slate"
                  placeholder="Event location or venue"
                />
              </div>
            )}

            {formData.is_virtual && (
              <div className="mt-4">
                <label htmlFor="meeting_link" className="form-label-icon">
                  <Monitor className="w-4 h-4" />
                  Meeting Link
                </label>
                <input
                  type="url"
                  id="meeting_link"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleChange}
                  className="input-slate"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="max_attendees" className="form-label-icon">
                <Users className="w-4 h-4" />
                Maximum Attendees
              </label>
              <input
                type="number"
                id="max_attendees"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleChange}
                min="1"
                className="input-slate"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="image_url" className="form-label-icon">
                <Image className="w-4 h-4" />
                Event Image URL
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-slate"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="tags" className="form-label-icon">
                <Hash className="w-4 h-4" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-slate"
                placeholder="react,workshop,javascript"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary-dark px-6 py-3"
            >
              {isPending ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary-dark px-6 py-3"
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
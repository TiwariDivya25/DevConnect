import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateEvent, useUploadEventImage } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, MapPin, Clock, Users, Globe, Video, 
  Image as ImageIcon, Tag, ArrowLeft, Save, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CreateEventData } from '../types/events';

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createEvent = useCreateEvent();
  const uploadImage = useUploadEventImage();

  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    type: 'meetup',
    date: '',
    time: '',
    duration: 60,
    location: '',
    virtual_link: '',
    is_virtual: false,
    max_attendees: undefined,
    registration_deadline: '',
    tags: [],
    image_url: '',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CreateEventData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image_url;
      
      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      // Create event
      const event = await createEvent.mutateAsync({
        ...formData,
        image_url: imageUrl,
      });

      navigate(`/events/${event.id}`);
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    { value: 'meetup', label: 'Meetup', description: 'Local community gathering' },
    { value: 'hackathon', label: 'Hackathon', description: 'Coding competition or collaborative project' },
    { value: 'webinar', label: 'Webinar', description: 'Online presentation or workshop' },
  ];

  const commonTags = [
    'JavaScript', 'React', 'Python', 'AI/ML', 'Web Development',
    'Mobile', 'DevOps', 'Blockchain', 'Data Science', 'UI/UX',
    'Networking', 'Career', 'Startup', 'Open Source'
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to create events</h2>
          <p className="text-gray-400">You need to be signed in to organize events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              to="/events"
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Event</h1>
              <p className="text-gray-400 mt-1">
                Organize a meetup, hackathon, or webinar for the developer community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter event title"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eventTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        p-4 border rounded-lg cursor-pointer transition
                        ${formData.type === type.value
                          ? 'border-cyan-400/50 bg-cyan-900/20'
                          : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-white font-medium">{type.label}</div>
                      <div className="text-sm text-gray-400 mt-1">{type.description}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your event, what attendees can expect, agenda, etc."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  max="1440"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Location</h2>
            
            <div className="space-y-6">
              {/* Virtual/In-Person Toggle */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="location_type"
                    checked={!formData.is_virtual}
                    onChange={() => handleInputChange('is_virtual', false)}
                    className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 focus:ring-cyan-400"
                  />
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">In-Person</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="location_type"
                    checked={formData.is_virtual}
                    onChange={() => handleInputChange('is_virtual', true)}
                    className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 focus:ring-cyan-400"
                  />
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Virtual</span>
                </label>
              </div>

              {/* Location/Virtual Link */}
              {formData.is_virtual ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Video className="w-4 h-4 inline mr-1" />
                    Virtual Meeting Link
                  </label>
                  <input
                    type="url"
                    value={formData.virtual_link}
                    onChange={(e) => handleInputChange('virtual_link', e.target.value)}
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Venue Address *
                  </label>
                  <input
                    type="text"
                    required={!formData.is_virtual}
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter venue address"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Additional Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_attendees || ''}
                  onChange={(e) => handleInputChange('max_attendees', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Tags</h2>
            
            <div className="space-y-4">
              {/* Add Custom Tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition"
                >
                  Add
                </button>
              </div>

              {/* Common Tags */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!formData.tags.includes(tag)) {
                          handleInputChange('tags', [...formData.tags, tag]);
                        }
                      }}
                      disabled={formData.tags.includes(tag)}
                      className="px-3 py-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-full text-sm text-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-900/30 text-cyan-300 text-sm rounded-full border border-cyan-400/50"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-cyan-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Image */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Event Image</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/30 file:text-cyan-300 hover:file:bg-cyan-900/50"
                />
              </div>

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover rounded-lg border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-900/80 hover:bg-red-900 rounded-full text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              to="/events"
              className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-gray-300 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
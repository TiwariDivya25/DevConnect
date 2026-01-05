import { useState } from 'react';
import { Calendar, MapPin, Tag, X } from 'lucide-react';
import type { EventFilters as EventFiltersType } from '../types/events';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

const EventFilters = ({ filters, onFiltersChange }: EventFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<EventFiltersType>(filters);

  const handleFilterChange = (key: keyof EventFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (key: keyof EventFiltersType) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const eventTypes = [
    { value: 'meetup', label: 'Meetups', color: 'text-blue-300' },
    { value: 'hackathon', label: 'Hackathons', color: 'text-purple-300' },
    { value: 'webinar', label: 'Webinars', color: 'text-green-300' },
  ];

  const commonTags = [
    'JavaScript', 'React', 'Python', 'AI/ML', 'Web Development',
    'Mobile', 'DevOps', 'Blockchain', 'Data Science', 'UI/UX'
  ];

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Event Type
          </label>
          <select
            value={localFilters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="">All Types</option>
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date From
          </label>
          <input
            type="date"
            value={localFilters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date To
          </label>
          <input
            type="date"
            value={localFilters.date_to || ''}
            onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
          />
        </div>

        {/* Virtual/In-Person */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Format
          </label>
          <select
            value={localFilters.is_virtual === undefined ? '' : localFilters.is_virtual.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('is_virtual', value === '' ? undefined : value === 'true');
            }}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
          >
            <option value="">All Formats</option>
            <option value="true">Virtual Only</option>
            <option value="false">In-Person Only</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => {
            const isSelected = localFilters.tags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  const currentTags = localFilters.tags || [];
                  const newTags = isSelected
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  handleFilterChange('tags', newTags.length > 0 ? newTags : undefined);
                }}
                className={`
                  px-3 py-1 rounded-full text-sm border transition
                  ${isSelected
                    ? 'bg-cyan-900/30 border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/50'
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(localFilters).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-300">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {localFilters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded border border-blue-400/50">
                {eventTypes.find(t => t.value === localFilters.type)?.label}
                <button
                  onClick={() => removeFilter('type')}
                  className="hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.date_from && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-900/30 text-cyan-300 text-sm rounded border border-cyan-400/50">
                From: {new Date(localFilters.date_from).toLocaleDateString()}
                <button
                  onClick={() => removeFilter('date_from')}
                  className="hover:text-cyan-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.date_to && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-900/30 text-cyan-300 text-sm rounded border border-cyan-400/50">
                To: {new Date(localFilters.date_to).toLocaleDateString()}
                <button
                  onClick={() => removeFilter('date_to')}
                  className="hover:text-cyan-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.is_virtual !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-300 text-sm rounded border border-green-400/50">
                {localFilters.is_virtual ? 'Virtual' : 'In-Person'}
                <button
                  onClick={() => removeFilter('is_virtual')}
                  className="hover:text-green-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 text-purple-300 text-sm rounded border border-purple-400/50"
              >
                {tag}
                <button
                  onClick={() => {
                    const newTags = localFilters.tags?.filter(t => t !== tag);
                    handleFilterChange('tags', newTags?.length ? newTags : undefined);
                  }}
                  className="hover:text-purple-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
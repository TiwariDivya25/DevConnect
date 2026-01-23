import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isBackendAvailable } from '../supabase-client';
import { useAuth } from './useAuth';
import type { Event, EventWithDetails, CreateEventData, EventFilters, EventAttendee } from '../types/events';
import { mockEvents } from '../utils/mockEvents';

export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      try {
        if (!isBackendAvailable || !supabase) {
          // Return mock data in demo mode or when backend is unavailable
          let filteredEvents = [...mockEvents];
          
          if (filters?.community_id) {
            filteredEvents = filteredEvents.filter(event => event.community_id === filters.community_id);
          }
          
          if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredEvents = filteredEvents.filter(event => 
              event.title.toLowerCase().includes(searchTerm) || 
              event.description.toLowerCase().includes(searchTerm)
            );
          }
          
          // Convert to the expected format
          return filteredEvents.map(event => ({
            ...event,
            attendee_count: event.max_attendees ? Math.floor((event.max_attendees || 100) * 0.6) : 30, // Calculate approximate attendee count
            Communities: { name: `Community ${event.community_id || 'General'}` },
            EventAttendees: [], // Mock attendees
            is_organizer: false,
            user_attendance: undefined
          })) as unknown as EventWithDetails[];
        }
        
        let query = supabase
          .from('Events')
          .select(`
            *,
            Communities(name),
            EventAttendees(id, user_id, status)
          `)
          .order('event_date', { ascending: true });

        if (filters?.community_id) {
          query = query.eq('community_id', filters.community_id);
        }
        
        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as EventWithDetails[];
      } catch (error) {
        console.warn('Supabase query failed, falling back to mock data:', error);
        // If Supabase fails, fall back to mock data
        let filteredEvents = [...mockEvents];
        
        if (filters?.community_id) {
          filteredEvents = filteredEvents.filter(event => event.community_id === filters.community_id);
        }
        
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) || 
            event.description.toLowerCase().includes(searchTerm)
          );
        }
        
        // Convert to the expected format
        return filteredEvents.map(event => ({
          ...event,
          attendee_count: event.max_attendees ? Math.floor((event.max_attendees || 100) * 0.6) : 30, // Calculate approximate attendee count
          Communities: { name: `Community ${event.community_id || 'General'}` },
          EventAttendees: [], // Mock attendees
          is_organizer: false,
          user_attendance: undefined
        })) as unknown as EventWithDetails[];
      }
    }
  });
};

export const useEvent = (eventId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      try {
        if (!isBackendAvailable || !supabase) {
          // Return mock data in demo mode or when backend is unavailable
          const mockEvent = mockEvents.find(e => e.id === eventId);
          if (!mockEvent) {
            throw new Error('Event not found');
          }
          
          const event: EventWithDetails = {
            ...mockEvent,
            attendee_count: mockEvent.max_attendees ? Math.floor((mockEvent.max_attendees || 100) * 0.6) : 30, // Calculate approximate attendee count
            Communities: { name: `Community ${mockEvent.community_id || 'General'}` },
            EventAttendees: [], // Mock attendees
            is_organizer: user?.id === mockEvent.organizer_id,
            user_attendance: undefined
          };
          
          return event;
        }
        
        const { data, error } = await supabase
          .from('Events')
          .select(`
            *,
            Communities(name),
            EventAttendees(id, user_id, status, registered_at)
          `)
          .eq('id', eventId)
          .single();

        if (error) throw error;

        const event = data as EventWithDetails;
        event.attendee_count = event.EventAttendees.length;
        event.is_organizer = user?.id === event.organizer_id;
        event.user_attendance = event.EventAttendees.find(a => a.user_id === user?.id);

        return event;
      } catch (error) {
        console.warn('Supabase event query failed, falling back to mock data:', error);
        // If Supabase fails, fall back to mock data
        const mockEvent = mockEvents.find(e => e.id === eventId);
        if (!mockEvent) {
          throw new Error('Event not found');
        }
        
        const event: EventWithDetails = {
          ...mockEvent,
          attendee_count: mockEvent.max_attendees ? Math.floor((mockEvent.max_attendees || 100) * 0.6) : 30, // Calculate approximate attendee count
          Communities: { name: `Community ${mockEvent.community_id || 'General'}` },
          EventAttendees: [], // Mock attendees
          is_organizer: user?.id === mockEvent.organizer_id,
          user_attendance: undefined
        };
        
        return event;
      }
    },
    enabled: !!eventId
  });
};

export const useCreateEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventData) => {
      if (!isBackendAvailable || !supabase) {
        // Simulate event creation in demo mode
        const newEvent = {
          id: Math.floor(Math.random() * 1000),
          ...data,
          organizer_id: user!.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          attendee_count: 0,
          is_organizer: true,
          user_attendance: undefined,
          Communities: { name: data.community_id ? `Community ${data.community_id}` : 'General' },
          EventAttendees: []
        };
        
        // Update the query cache
        queryClient.setQueryData(['events'], (old: any) => {
          if (Array.isArray(old)) {
            return [newEvent, ...old];
          }
          return [newEvent];
        });
        
        return newEvent;
      }
      
      const { data: event, error } = await supabase
        .from('Events')
        .insert({
          ...data,
          organizer_id: user!.id
        })
        .select()
        .single();

      if (error) throw error;
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
};

export const useEventAttendance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const register = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: number; status: 'attending' | 'maybe' | 'not_attending' }) => {
      if (!isBackendAvailable || !supabase) {
        // Simulate event registration in demo mode
        // In a real app, this would update the local state
        return;
      }
      
      const { error } = await supabase
        .from('EventAttendees')
        .insert({
          event_id: eventId,
          user_id: user!.id,
          status
        });

      if (error) throw error;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  return {
    register: register.mutate,
    isRegistering: register.isPending,
    error: register.error
  };
};
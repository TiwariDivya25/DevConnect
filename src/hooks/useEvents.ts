import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from './useAuth';
import type { Event, EventWithDetails, CreateEventData, EventFilters, EventAttendee } from '../types/events';

export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
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
    }
  });
};

export const useEvent = (eventId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
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
    },
    enabled: !!eventId
  });
};

export const useCreateEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventData) => {
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';
import type { 
  Event, 
  EventRegistration, 
  CreateEventData, 
  EventFilters,
  NetworkingConnection 
} from '../types/events';

// Hook for fetching events with filters
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('Events')
        .select('*')
        .eq('status', 'published')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Apply filters
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.date_from) {
        query = query.gte('date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('date', filters.date_to);
      }
      if (filters?.is_virtual !== undefined) {
        query = query.eq('is_virtual', filters.is_virtual);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data as Event[];
    },
  });
};

// Hook for fetching a single event
export const useEvent = (eventId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Events')
        .select(`
          *,
          organizer:auth.users(id, email, user_metadata),
          attendees_count:EventRegistrations(count),
          is_registered:EventRegistrations!inner(user_id)
        `)
        .eq('id', eventId)
        .eq('EventRegistrations.user_id', user?.id || '')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Event;
    },
    enabled: !!eventId,
  });
};

// Hook for fetching user's events (organized)
export const useMyEvents = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-events', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Events')
        .select(`
          *,
          attendees_count:EventRegistrations(count)
        `)
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user,
  });
};

// Hook for fetching user's registered events
export const useRegisteredEvents = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['registered-events', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('EventRegistrations')
        .select(`
          *,
          event:Events(
            *,
            organizer:auth.users(id, email, user_metadata)
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'registered')
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return data.map(reg => reg.event) as Event[];
    },
    enabled: !!user,
  });
};

// Hook for creating events
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('Events')
        .insert({
          ...eventData,
          organizer_id: user.id,
          status: 'published',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
  });
};

// Hook for updating events
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, updates }: { eventId: number; updates: Partial<CreateEventData> }) => {
      const { data, error } = await supabase
        .from('Events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
  });
};

// Hook for event registration
export const useEventRegistration = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const register = useMutation({
    mutationFn: async (eventId: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('EventRegistrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['registered-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const unregister = useMutation({
    mutationFn: async (eventId: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('EventRegistrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['registered-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return { register, unregister };
};

// Hook for event attendees
export const useEventAttendees = (eventId: number) => {
  return useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('EventRegistrations')
        .select(`
          *,
          user:auth.users(id, email, user_metadata)
        `)
        .eq('event_id', eventId)
        .eq('status', 'registered')
        .order('registered_at', { ascending: true });

      if (error) throw error;
      return data as EventRegistration[];
    },
    enabled: !!eventId,
  });
};

// Hook for networking connections
export const useNetworkingConnections = (eventId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['networking-connections', eventId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('NetworkingConnections')
        .select(`
          *,
          user1:auth.users!user1_id(id, user_metadata),
          user2:auth.users!user2_id(id, user_metadata)
        `)
        .eq('event_id', eventId)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NetworkingConnection[];
    },
    enabled: !!eventId && !!user,
  });
};

// Hook for creating networking connections
export const useCreateNetworkingConnection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      targetUserId, 
      message 
    }: { 
      eventId: number; 
      targetUserId: string; 
      message?: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('NetworkingConnections')
        .insert({
          event_id: eventId,
          user1_id: user.id,
          user2_id: targetUserId,
          connection_type: 'interested',
          message,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['networking-connections', eventId] });
    },
  });
};

// Hook for event reminders
export const useEventReminders = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      reminderTypes 
    }: { 
      eventId: number; 
      reminderTypes: ('1_day' | '1_hour' | '15_min')[]; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const reminders = reminderTypes.map(type => ({
        event_id: eventId,
        user_id: user.id,
        reminder_type: type,
      }));
      
      const { data, error } = await supabase
        .from('EventReminders')
        .upsert(reminders)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-reminders'] });
    },
  });
};

// Hook for uploading event images
export const useUploadEventImage = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    },
  });
};
```typescript
// useEvents Hook
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('Events')
        .select('*, Communities(name), EventAttendees(id, user_id, status)')
        .order('event_date', { ascending: true });

      if (filters?.community_id) query = query.eq('community_id', filters.community_id);
      if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return data as EventWithDetails[];
    }
  });
};

// useEvent Hook
export const useEvent = (eventId: number) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Events')
        .select('*, Communities(name), EventAttendees(*)')
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

// useCreateEvent Hook
export const useCreateEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventData) => {
      const { data: event, error } = await supabase
        .from('Events')
        .insert({ ...data, organizer_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return event;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] })
  });
};

// EventsPage Component
export const EventsPage = () => {
  const [filters, setFilters] = useState<EventFilters>({});
  const { data: events, isLoading, error } = useEvents(filters);

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <Link to="/events/create" className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg">
          Create Event
        </Link>
      </div>
      <EventList events={events || []} />
    </div>
  );
};

// CreateEventPage Component
export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { createEvent, isCreating } = useCreateEvent();

  const handleSubmit = async (data: CreateEventData) => {
    try {
      const event = await createEvent(data);
      navigate(`/events/${event.id}`);
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Create Event</h1>
      <CreateEventForm onSubmit={handleSubmit} isSubmitting={isCreating} />
    </div>
  );
};
```
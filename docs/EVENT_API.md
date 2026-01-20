```typescript
// Get Events
const { data, error } = await supabase
  .from('Events')
  .select('*, Communities(name), EventAttendees(count)')
  .order('event_date', { ascending: true });

// Get Event by ID
const { data, error } = await supabase
  .from('Events')
  .select('*, Communities(name), EventAttendees(*)')
  .eq('id', eventId)
  .single();

// Create Event
const { data, error } = await supabase
  .from('Events')
  .insert({
    title,
    description,
    event_date,
    location,
    is_virtual,
    meeting_link,
    max_attendees,
    image_url,
    tags,
    organizer_id: user.id,
    community_id
  })
  .select()
  .single();

// Update Event
const { data, error } = await supabase
  .from('Events')
  .update({ title, description, event_date })
  .eq('id', eventId)
  .eq('organizer_id', user.id);

// Delete Event
const { error } = await supabase
  .from('Events')
  .delete()
  .eq('id', eventId)
  .eq('organizer_id', user.id);

// Register for Event
const { data, error } = await supabase
  .from('EventAttendees')
  .insert({
    event_id: eventId,
    user_id: user.id,
    status: 'attending'
  });

// Filter Events
const { data, error } = await supabase
  .from('Events')
  .select('*')
  .gte('event_date', startDate)
  .contains('tags', [tag])
  .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
```## Event Attendance Management

### Register/Update Attendance Status
```typescript
// Register or update attendance with specific status
const { data, error } = await supabase
  .from('EventAttendees')
  .upsert({
    event_id: eventId,
    user_id: user.id,
    status: 'attending' // 'attending' | 'maybe' | 'not_attending'
  }, {
    onConflict: 'event_id,user_id'
  })
  .select()
  .single();
```

### Get User's Current Attendance Status
```typescript
const { data, error } = await supabase
  .from('EventAttendees')
  .select('status')
  .eq('event_id', eventId)
  .eq('user_id', user.id)
  .maybeSingle();

// Returns: { status: 'attending' | 'maybe' | 'not_attending' } or null
```

### Check Event Capacity Before Registration
```typescript
// Validate if event is full before allowing registration
const { data: event, error } = await supabase
  .from('Events')
  .select('max_attendees, EventAttendees(count)')
  .eq('id', eventId)
  .single();

const attendeeCount = event.EventAttendees?.[0]?.count || 0;
const isFull = event.max_attendees && attendeeCount >= event.max_attendees;

if (isFull) {
  throw new Error('Event is at full capacity');
}
```

### Get Event with Attendance Details
```typescript
// Fetch event with all attendees and user's status
const { data, error } = await supabase
  .from('Events')
  .select(
    *,
    Communities(name),
    EventAttendees(id, user_id, status, registered_at)
  )
  .eq('id', eventId)
  .single();

// Calculate attendee count
const attendeeCount = data.EventAttendees.length;

// Find current user's attendance
const userAttendance = data.EventAttendees.find(
  a => a.user_id === currentUserId
);
```

### Cancel Event Registration
```typescript
// Remove user from event attendees
const { error } = await supabase
  .from('EventAttendees')
  .delete()
  .eq('event_id', eventId)
  .eq('user_id', user.id);
```

### Get Attendees by Status
```typescript
// Get all confirmed attendees
const { data, error } = await supabase
  .from('EventAttendees')
  .select('*, user:auth.users(id, email, user_metadata)')
  .eq('event_id', eventId)
  .eq('status', 'attending')
  .order('registered_at', { ascending: true });
```

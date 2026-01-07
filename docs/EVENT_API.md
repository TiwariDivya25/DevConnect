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
```
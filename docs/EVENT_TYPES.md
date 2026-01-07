```typescript
export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location?: string;
  is_virtual: boolean;
  meeting_link?: string;
  max_attendees?: number;
  image_url?: string;
  tags: string[];
  organizer_id: string;
  community_id?: number;
  created_at: string;
  updated_at: string;
}

export interface EventWithDetails extends Event {
  Communities?: { name: string };
  EventAttendees: EventAttendee[];
  attendee_count?: number;
  is_organizer?: boolean;
  user_attendance?: EventAttendee;
}

export interface EventAttendee {
  id: number;
  event_id: number;
  user_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  registered_at: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  event_date: string;
  location?: string;
  is_virtual: boolean;
  meeting_link?: string;
  max_attendees?: number;
  image_url?: string;
  tags: string[];
  community_id?: number;
}

export interface EventFilters {
  community_id?: number;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  is_virtual?: boolean;
  search?: string;
  organizer_id?: string;
}
```
// Event management system types

export interface Event {
  id: number;
  title: string;
  description: string;
  type: 'meetup' | 'hackathon' | 'webinar';
  date: string;
  time: string;
  duration: number; // in minutes
  location?: string;
  virtual_link?: string;
  is_virtual: boolean;
  max_attendees?: number;
  registration_deadline?: string;
  tags: string[];
  image_url?: string;
  organizer_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  organizer?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
  attendees_count?: number;
  is_registered?: boolean;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: string;
  registered_at: string;
  status: 'registered' | 'attended' | 'cancelled';
  user?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
}

export interface EventReminder {
  id: number;
  event_id: number;
  user_id: string;
  reminder_type: '1_day' | '1_hour' | '15_min';
  sent_at?: string;
  created_at: string;
}

export interface NetworkingConnection {
  id: number;
  event_id: number;
  user1_id: string;
  user2_id: string;
  connection_type: 'interested' | 'connected' | 'collaborated';
  message?: string;
  created_at: string;
  user1?: {
    id: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
  user2?: {
    id: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  type: 'meetup' | 'hackathon' | 'webinar';
  date: string;
  time: string;
  duration: number;
  location?: string;
  virtual_link?: string;
  is_virtual: boolean;
  max_attendees?: number;
  registration_deadline?: string;
  tags: string[];
  image_url?: string;
}

export interface EventFilters {
  type?: 'meetup' | 'hackathon' | 'webinar';
  date_from?: string;
  date_to?: string;
  location?: string;
  is_virtual?: boolean;
  tags?: string[];
  search?: string;
}
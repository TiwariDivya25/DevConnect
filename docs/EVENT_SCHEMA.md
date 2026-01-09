```sql
CREATE TABLE Events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  max_attendees INTEGER,
  image_url TEXT,
  tags TEXT[],
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  community_id BIGINT REFERENCES Communities(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE EventAttendees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_events_date ON Events(event_date);
CREATE INDEX idx_events_organizer ON Events(organizer_id);
CREATE INDEX idx_events_community ON Events(community_id);

ALTER TABLE Events ENABLE ROW LEVEL SECURITY;
ALTER TABLE EventAttendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON Events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON Events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can register for events" ON EventAttendees FOR INSERT WITH CHECK (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
```
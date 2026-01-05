-- Event Management System Database Schema
-- Add these tables to your Supabase database

-- Events table
CREATE TABLE Events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('meetup', 'hackathon', 'webinar')),
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60, -- in minutes
  location TEXT,
  virtual_link TEXT,
  is_virtual BOOLEAN DEFAULT false,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE EventRegistrations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  registered_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  UNIQUE(event_id, user_id)
);

-- Event reminders table
CREATE TABLE EventReminders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('1_day', '1_hour', '15_min')),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id, reminder_type)
);

-- Networking connections table
CREATE TABLE NetworkingConnections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES auth.users(id),
  user2_id UUID NOT NULL REFERENCES auth.users(id),
  connection_type TEXT DEFAULT 'interested' CHECK (connection_type IN ('interested', 'connected', 'collaborated')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user1_id, user2_id)
);

-- Event feedback table
CREATE TABLE EventFeedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_events_type ON Events(type);
CREATE INDEX idx_events_date ON Events(date);
CREATE INDEX idx_events_organizer ON Events(organizer_id);
CREATE INDEX idx_events_status ON Events(status);
CREATE INDEX idx_events_tags ON Events USING GIN(tags);
CREATE INDEX idx_event_registrations_event ON EventRegistrations(event_id);
CREATE INDEX idx_event_registrations_user ON EventRegistrations(user_id);
CREATE INDEX idx_event_reminders_event ON EventReminders(event_id);
CREATE INDEX idx_networking_connections_event ON NetworkingConnections(event_id);

-- Enable Row Level Security (RLS)
ALTER TABLE Events ENABLE ROW LEVEL SECURITY;
ALTER TABLE EventRegistrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE EventReminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE NetworkingConnections ENABLE ROW LEVEL SECURITY;
ALTER TABLE EventFeedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Events
CREATE POLICY "Anyone can view published events" ON Events
  FOR SELECT USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Organizers can view their own events" ON Events
  FOR SELECT USING (organizer_id = auth.uid());

CREATE POLICY "Authenticated users can create events" ON Events
  FOR INSERT WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can update their own events" ON Events
  FOR UPDATE USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete their own events" ON Events
  FOR DELETE USING (organizer_id = auth.uid());

-- RLS Policies for EventRegistrations
CREATE POLICY "Anyone can view registrations for published events" ON EventRegistrations
  FOR SELECT USING (
    event_id IN (SELECT id FROM Events WHERE status = 'published')
  );

CREATE POLICY "Users can register for published events" ON EventRegistrations
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    event_id IN (SELECT id FROM Events WHERE status = 'published')
  );

CREATE POLICY "Users can update their own registrations" ON EventRegistrations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can cancel their own registrations" ON EventRegistrations
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for EventReminders
CREATE POLICY "Users can manage their own reminders" ON EventReminders
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for NetworkingConnections
CREATE POLICY "Users can view networking connections for events they're registered for" ON NetworkingConnections
  FOR SELECT USING (
    event_id IN (
      SELECT event_id FROM EventRegistrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create networking connections" ON NetworkingConnections
  FOR INSERT WITH CHECK (
    user1_id = auth.uid() AND
    event_id IN (
      SELECT event_id FROM EventRegistrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own networking connections" ON NetworkingConnections
  FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- RLS Policies for EventFeedback
CREATE POLICY "Users can view feedback for published events" ON EventFeedback
  FOR SELECT USING (
    event_id IN (SELECT id FROM Events WHERE status = 'published')
  );

CREATE POLICY "Users can create feedback for events they attended" ON EventFeedback
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    event_id IN (
      SELECT event_id FROM EventRegistrations 
      WHERE user_id = auth.uid() AND status = 'attended'
    )
  );

CREATE POLICY "Users can update their own feedback" ON EventFeedback
  FOR UPDATE USING (user_id = auth.uid());

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_event_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_timestamp
  BEFORE UPDATE ON Events
  FOR EACH ROW
  EXECUTE FUNCTION update_event_timestamp();

-- Function to automatically set event status to completed
CREATE OR REPLACE FUNCTION update_completed_events()
RETURNS void AS $$
BEGIN
  UPDATE Events 
  SET status = 'completed'
  WHERE status = 'published' 
    AND date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to get event statistics
CREATE OR REPLACE FUNCTION get_event_stats(event_id_param BIGINT)
RETURNS TABLE(
  total_registrations BIGINT,
  attended_count BIGINT,
  networking_connections BIGINT,
  average_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM EventRegistrations WHERE event_id = event_id_param),
    (SELECT COUNT(*) FROM EventRegistrations WHERE event_id = event_id_param AND status = 'attended'),
    (SELECT COUNT(*) FROM NetworkingConnections WHERE event_id = event_id_param),
    (SELECT AVG(rating) FROM EventFeedback WHERE event_id = event_id_param);
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for event images
CREATE POLICY "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own event images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own event images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );Optimization', 'JavaScript'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)),

('DevOps Best Practices Workshop', 'Hands-on workshop covering CI/CD pipelines, containerization with Docker, Kubernetes deployment, and monitoring strategies for modern applications.', 'meetup', CURRENT_DATE + INTERVAL '10 days', '10:00', 240, 'DevOps Training Center, 789 Cloud St', false, 30, ARRAY['DevOps', 'Docker', 'Kubernetes', 'CI/CD'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)),

('Blockchain Development Bootcamp', 'Intensive bootcamp covering smart contract development, DeFi protocols, and Web3 integration. Perfect for developers looking to enter the blockchain space.', 'hackathon', CURRENT_DATE + INTERVAL '21 days', '09:00', 1440, NULL, true, 75, ARRAY['Blockchain', 'Web3', 'Smart Contracts', 'DeFi'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)),

('Mobile App Security Webinar', 'Essential security practices for mobile application development. Learn about common vulnerabilities, secure coding practices, and security testing methodologies.', 'webinar', CURRENT_DATE + INTERVAL '5 days', '16:00', 60, NULL, true, NULL, ARRAY['Mobile', 'Security', 'iOS', 'Android'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)),

('Startup Pitch Night', 'Monthly startup pitch event where entrepreneurs present their ideas to investors and fellow developers. Great networking opportunity for the startup community.', 'meetup', CURRENT_DATE + INTERVAL '12 days', '19:00', 180, 'Startup Incubator, 321 Innovation Blvd', false, 80, ARRAY['Startup', 'Networking', 'Entrepreneurship', 'Pitching'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1)),

('Data Science with Python Workshop', 'Comprehensive workshop covering data analysis, visualization, and machine learning using Python. Includes hands-on exercises with real datasets.', 'meetup', CURRENT_DATE + INTERVAL '8 days', '13:00', 300, 'Data Science Lab, 654 Analytics Way', false, 40, ARRAY['Data Science', 'Python', 'Machine Learning', 'Analytics'], 'published', (SELECT id FROM auth.users ORDER BY created_at LIMIT 1));

-- Insert sample registrations (this will create some registered attendees)
-- Note: This assumes you have at least 2 users in your auth.users table
INSERT INTO EventRegistrations (event_id, user_id, status) 
SELECT 
  e.id,
  u.id,
  CASE 
    WHEN RANDOM() < 0.8 THEN 'registered'
    ELSE 'attended'
  END
FROM Events e
CROSS JOIN (SELECT id FROM auth.users LIMIT 3) u
WHERE e.status = 'published'
AND RANDOM() < 0.6; -- 60% chance each user registers for each event

-- Insert sample networking connections
INSERT INTO NetworkingConnections (event_id, user1_id, user2_id, connection_type, message)
SELECT 
  er1.event_id,
  er1.user_id,
  er2.user_id,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'interested'
    WHEN RANDOM() < 0.7 THEN 'connected'
    ELSE 'collaborated'
  END,
  CASE 
    WHEN RANDOM() < 0.5 THEN 'Looking forward to connecting at this event!'
    ELSE 'Would love to discuss potential collaboration opportunities.'
  END
FROM EventRegistrations er1
JOIN EventRegistrations er2 ON er1.event_id = er2.event_id AND er1.user_id < er2.user_id
WHERE RANDOM() < 0.3; -- 30% chance of networking connections

-- Insert sample event feedback
INSERT INTO EventFeedback (event_id, user_id, rating, feedback)
SELECT 
  er.event_id,
  er.user_id,
  FLOOR(RANDOM() * 3 + 3)::INTEGER, -- Random rating between 3-5
  CASE 
    WHEN RANDOM() < 0.33 THEN 'Great event! Learned a lot and made valuable connections.'
    WHEN RANDOM() < 0.66 THEN 'Well organized event with excellent speakers and content.'
    ELSE 'Fantastic networking opportunities and high-quality presentations.'
  END
FROM EventRegistrations er
WHERE er.status = 'attended'
AND RANDOM() < 0.7; -- 70% of attendees leave feedback2024', 'A 48-hour hackathon focused on artificial intelligence and machine learning solutions. Build innovative projects, learn from experts, and compete for amazing prizes!', 'hackathon', CURRENT_DATE + INTERVAL '14 days', '09:00', 2880, 'Innovation Center, 456 Tech Ave', false, 100, ARRAY['AI', 'Machine Learning', 'Python', 'Competition'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('Web Performance Optimization Webinar', 'Learn advanced techniques for optimizing web application performance. Topics include Core Web Vitals, lazy loading, code splitting, and modern optimization strategies.', 'webinar', CURRENT_DATE + INTERVAL '3 days', '14:00', 90, NULL, true, NULL, ARRAY['Performance', 'Web Development', 'Optimization', 'JavaScript'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('DevOps Best Practices Workshop', 'Hands-on workshop covering CI/CD pipelines, containerization with Docker, Kubernetes deployment, and monitoring strategies for modern applications.', 'meetup', CURRENT_DATE + INTERVAL '10 days', '10:00', 240, 'DevOps Training Center, 789 Cloud St', false, 30, ARRAY['DevOps', 'Docker', 'Kubernetes', 'CI/CD'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('Blockchain Development Bootcamp', 'Intensive bootcamp covering smart contract development, DeFi protocols, and Web3 integration. Perfect for developers looking to enter the blockchain space.', 'hackathon', CURRENT_DATE + INTERVAL '21 days', '09:00', 1440, NULL, true, 75, ARRAY['Blockchain', 'Web3', 'Smart Contracts', 'DeFi'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('Mobile App Security Webinar', 'Essential security practices for mobile application development. Learn about common vulnerabilities, secure coding practices, and security testing methodologies.', 'webinar', CURRENT_DATE + INTERVAL '5 days', '16:00', 60, NULL, true, NULL, ARRAY['Mobile', 'Security', 'iOS', 'Android'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('Startup Pitch Night', 'Monthly startup pitch event where entrepreneurs present their ideas to investors and fellow developers. Great networking opportunity for the startup community.', 'meetup', CURRENT_DATE + INTERVAL '12 days', '19:00', 180, 'Startup Incubator, 321 Innovation Blvd', false, 80, ARRAY['Startup', 'Networking', 'Entrepreneurship', 'Pitching'], 'published', (SELECT id FROM auth.users LIMIT 1)),

('Data Science with Python Workshop', 'Comprehensive workshop covering data analysis, visualization, and machine learning using Python. Includes hands-on exercises with real datasets.', 'meetup', CURRENT_DATE + INTERVAL '8 days', '13:00', 300, 'Data Science Lab, 654 Analytics Way', false, 40, ARRAY['Data Science', 'Python', 'Machine Learning', 'Analytics'], 'published', (SELECT id FROM auth.users LIMIT 1));

-- Insert sample registrations (this will create some registered attendees)
-- Note: This assumes you have at least 2 users in your auth.users table
INSERT INTO EventRegistrations (event_id, user_id, status) 
SELECT 
  e.id,
  u.id,
  CASE 
    WHEN RANDOM() < 0.8 THEN 'registered'
    ELSE 'attended'
  END
FROM Events e
CROSS JOIN (SELECT id FROM auth.users LIMIT 3) u
WHERE e.status = 'published'
AND RANDOM() < 0.6; -- 60% chance each user registers for each event

-- Insert sample networking connections
INSERT INTO NetworkingConnections (event_id, user1_id, user2_id, connection_type, message)
SELECT 
  er1.event_id,
  er1.user_id,
  er2.user_id,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'interested'
    WHEN RANDOM() < 0.7 THEN 'connected'
    ELSE 'collaborated'
  END,
  CASE 
    WHEN RANDOM() < 0.5 THEN 'Looking forward to connecting at this event!'
    ELSE 'Would love to discuss potential collaboration opportunities.'
  END
FROM EventRegistrations er1
JOIN EventRegistrations er2 ON er1.event_id = er2.event_id AND er1.user_id < er2.user_id
WHERE RANDOM() < 0.3; -- 30% chance of networking connections

-- Insert sample event feedback
INSERT INTO EventFeedback (event_id, user_id, rating, feedback)
SELECT 
  er.event_id,
  er.user_id,
  FLOOR(RANDOM() * 3 + 3)::INTEGER, -- Random rating between 3-5
  CASE 
    WHEN RANDOM() < 0.33 THEN 'Great event! Learned a lot and made valuable connections.'
    WHEN RANDOM() < 0.66 THEN 'Well organized event with excellent speakers and content.'
    ELSE 'Fantastic networking opportunities and high-quality presentations.'
  END
FROM EventRegistrations er
WHERE er.status = 'attended'
AND RANDOM() < 0.7; -- 70% of attendees leave feedback
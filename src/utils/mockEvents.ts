import type { Event } from '../types/events';

const eventImages = [
  "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557187666-47dfabb235c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2712b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-4349e88e544f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
];

// Helper function to get a random image
const getRandomEventImage = () => {
  return eventImages[Math.floor(Math.random() * eventImages.length)];
};

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "React Advanced Workshop",
    description: "Join us for an intensive workshop on advanced React patterns and techniques. We'll cover hooks, context, performance optimization, and state management strategies.",
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "TechHub Conference Center, San Francisco",
    is_virtual: false,
    max_attendees: 50,
    image_url: getRandomEventImage(),
    tags: ["react", "workshop", "frontend"],
    organizer_id: "demo-user-1",
    community_id: 1,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "JavaScript Meetup: ES2024 Features",
    description: "Learn about the latest JavaScript features coming in ES2024. We'll explore new syntax, performance improvements, and practical applications.",
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Google Campus, Mountain View",
    is_virtual: false,
    max_attendees: 100,
    image_url: getRandomEventImage(),
    tags: ["javascript", "es2024", "meetup"],
    organizer_id: "demo-user-2",
    community_id: 2,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "Virtual Python for Data Science",
    description: "Online session covering Python libraries for data science including pandas, numpy, and matplotlib. Perfect for beginners and intermediate developers.",
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: undefined,
    is_virtual: true,
    meeting_link: "https://meet.google.com/abc-defg-hij",
    max_attendees: 200,
    image_url: getRandomEventImage(),
    tags: ["python", "datascience", "virtual"],
    organizer_id: "demo-user-3",
    community_id: 3,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
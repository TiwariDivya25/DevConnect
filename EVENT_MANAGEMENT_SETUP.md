# Event Management System Setup Guide

This guide will help you set up the comprehensive event management system for DevConnect.

## 📋 Prerequisites

- Existing DevConnect project setup
- Supabase project with authentication configured
- Node.js and npm installed

## 🗄️ Database Setup

### Step 1: Run the Database Schema

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database-schema-events.sql`
4. Execute the SQL script

This will create all necessary tables:
- `Events` - Stores event information
- `EventRegistrations` - Manages event registrations
- `EventReminders` - Handles reminder notifications
- `NetworkingConnections` - Facilitates attendee networking
- `EventFeedback` - Collects post-event feedback

### Step 2: Set Up Storage

1. In Supabase dashboard, go to Storage
2. Create a new bucket named `event-images`
3. Set the bucket to **public**
4. The SQL script already includes the necessary storage policies

### Step 3: Enable Real-time (Optional)

1. Go to Database → Replication in your Supabase dashboard
2. Enable real-time for these tables (for live updates):
   - `EventRegistrations`
   - `NetworkingConnections`

## 🚀 Features Included

### ✅ Event Management
- **Create Events** - Organize meetups, hackathons, and webinars
- **Event Types** - Support for different event categories
- **Virtual & In-Person** - Flexible location options
- **Event Images** - Upload and display event banners
- **Tags & Categories** - Organize events with tags

### ✅ Registration System
- **Easy Registration** - One-click event registration
- **Capacity Management** - Set maximum attendee limits
- **Registration Deadlines** - Control registration periods
- **Attendee Lists** - View registered participants
- **Registration Status** - Track attendance

### ✅ Event Discovery
- **Advanced Filtering** - Filter by type, date, location, tags
- **Search Functionality** - Find events by keywords
- **Event Calendar** - Visual event timeline
- **Responsive Design** - Works on all devices

### ✅ Networking Features
- **Attendee Connections** - Connect with other participants
- **Networking Panel** - Dedicated networking interface
- **Connection Types** - Different relationship levels
- **Messaging Integration** - Connect with messaging system

### ✅ Organizer Tools
- **Event Dashboard** - Manage your events
- **Attendee Management** - View and manage registrations
- **Event Analytics** - Track event performance
- **Event Editing** - Update event details

## 📱 Navigation

The event management system is accessible via:
- Desktop: `~/events` in the top navigation
- Mobile: `~/events` in the hamburger menu
- Direct links to create events and view details

## 🎨 UI/UX Features

### Design Consistency
- Matches existing DevConnect dark theme
- Cyan accent colors throughout
- Professional developer-focused design
- Responsive layout for mobile/desktop

### User Experience
- Intuitive event browsing and filtering
- Smooth registration process
- Real-time updates for registrations
- Loading states and error handling
- Keyboard shortcuts and accessibility

## 🔧 Component Architecture

### Core Components
- `EventsPage` - Main events listing with filters
- `EventDetailPage` - Individual event view with registration
- `CreateEventPage` - Event creation form
- `EventCard` - Event display card
- `EventFilters` - Advanced filtering interface
- `EventAttendees` - Attendee management
- `NetworkingPanel` - Networking features

### Hooks
- `useEvents` - Event fetching and filtering
- `useEvent` - Single event details
- `useEventRegistration` - Registration management
- `useEventAttendees` - Attendee data
- `useNetworkingConnections` - Networking features
- `useCreateEvent` - Event creation
- `useUploadEventImage` - Image uploads

### Types
- Complete TypeScript interfaces in `src/types/events.ts`
- Type safety for all event operations

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only see published events
- Organizers can manage their own events
- Registration access control
- Secure file uploads with user scoping
- Networking connections limited to attendees

### Data Privacy
- Event visibility controls
- Secure attendee information
- Private networking connections
- Proper authentication checks

## 🚀 Getting Started

1. **Run the database schema** (Step 1 above)
2. **Set up storage bucket** (Step 2 above)
3. **Enable real-time** (Step 3 above - optional)
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Navigate to `/events`** in your browser
6. **Sign in** and start creating events!

## 📊 Event Types

### Meetups
- Local community gatherings
- Networking events
- Tech talks and presentations
- Casual developer meetups

### Hackathons
- Coding competitions
- Collaborative projects
- Innovation challenges
- Team building events

### Webinars
- Online presentations
- Educational workshops
- Remote training sessions
- Virtual conferences

## 🔄 Event Lifecycle

1. **Creation** - Organizer creates event
2. **Publication** - Event becomes visible to users
3. **Registration** - Users register for the event
4. **Networking** - Attendees connect before/during event
5. **Attendance** - Event takes place
6. **Feedback** - Post-event feedback collection
7. **Completion** - Event marked as completed

## 📈 Analytics & Insights

### Event Metrics
- Registration counts
- Attendance rates
- Networking connections
- User engagement
- Popular event types

### Organizer Dashboard
- Event performance tracking
- Attendee demographics
- Registration timeline
- Feedback summaries

## 🔮 Future Enhancements

The system is designed to be extensible. Potential additions:

- Calendar integration (Google Calendar, Outlook)
- Payment processing for paid events
- Live streaming integration
- Event check-in system
- Advanced analytics dashboard
- Email notification system
- Social media integration
- Event templates
- Recurring events
- Waitlist management

## 🐛 Troubleshooting

### Common Issues

1. **Events not displaying**
   - Check if database schema is properly set up
   - Verify RLS policies are correctly applied
   - Ensure user is authenticated

2. **Image uploads failing**
   - Ensure `event-images` bucket exists and is public
   - Check storage policies are correctly applied
   - Verify file size limits

3. **Registration not working**
   - Check EventRegistrations table exists
   - Verify user authentication
   - Check for duplicate registrations

4. **Networking features not available**
   - Ensure NetworkingConnections table exists
   - Check user is registered for the event
   - Verify RLS policies

### Debug Mode

Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('supabase.debug', 'true');
```

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database setup is complete
3. Ensure all environment variables are set
4. Check Supabase dashboard for any service issues

The event management system is now ready to use! Users can discover events, register for them, network with other attendees, and organize their own events.
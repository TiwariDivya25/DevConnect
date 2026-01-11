# DevConnect Architecture

## Tech Stack

### Frontend
- **React 18** – UI components and rendering  
- **TypeScript** – Type safety and better developer experience  
- **Tailwind CSS** – Utility-first styling framework  
- **React Router** – Client-side navigation  
- **TanStack Query** – Data fetching, caching, and state management  
- **Supabase Client** – Database access and real-time communication  

---

### Backend & Infrastructure
- **Supabase** – PostgreSQL database, authentication, and storage  
- **GitHub OAuth** – Social authentication provider  

---

### Development Tools
- **Vite** – Fast build tool and development server  
- **ESLint** – Code quality and consistency  
- **Prettier** – Code formatting  

---

## How It Works

### Authentication Flow
1. User clicks **Sign in with GitHub**  
2. App redirects to GitHub OAuth page  
3. GitHub returns authorization code to Supabase  
4. Supabase exchanges code for JWT token  
5. Token stored in `localStorage` / session  
6. All subsequent API calls include JWT token  
7. Supabase RLS policies validate user permissions

### Profile Management Flow
1. User navigates to **Profile** page
2. Profile data fetched from **Profiles** table
3. User clicks **Edit Profile** button
4. Form allows updating bio, location, website, social links, and avatar
5. Image upload handled via file input with preview
6. Updated data saved to **Profiles** table with RLS validation

### Dashboard & Real-time Activity Flow
1. User navigates to **Dashboard** page
2. Dashboard fetches user's recent activity from multiple tables (Posts, Comments, Votes, CommunityMembers)
3. Real-time subscriptions monitor for new activities
4. Activity feed updates automatically when new events occur
5. Supabase real-time channels push updates to the dashboard
6. Query invalidation refreshes the activity feed with new data  

---

### Posts & Communities

#### Posts Flow
- User creates a post with content and images  
- Post saved to Supabase **Posts** table  
- Images uploaded to Supabase Storage  
- Posts displayed with real-time updates  
- Users can like, comment, and share posts  

#### Communities Flow
- Users create or join communities  
- Posts can be associated with communities  
- Community pages show filtered posts  
- Members engage in community discussions  

---

### Messaging System
- Users start direct or group conversations  
- Messages stored in **Messages** table  
- Real-time subscriptions notify participants  
- File attachments stored in `message-files` bucket  
- Typing indicators show active users  
- Presence system tracks online users  

---

## Key Database Tables

### Core Tables
- **Posts** – User-created content with metadata  
- **Comments** – Nested comments on posts  
- **Communities** – Developer interest groups  
- **Votes** – Post likes and interactions  

### Messaging Tables
- **Conversations** – Chat threads (direct/group)  
- **Messages** – Individual chat messages  
- **ConversationParticipants** – Chat memberships  
- **UserPresence** – Online/offline status  

### Authentication
- **auth.users** – Supabase-managed user accounts  
- **Profiles** – Extended user profile information (bio, location, social links)  
- User profiles derived from GitHub OAuth metadata  

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx                 # Navigation bar
│   ├── PostItem.tsx               # Individual post card
│   ├── PostList.tsx               # List of all posts
│   ├── PostDetail.tsx             # Full post view
│   ├── CommentItem.tsx            # Individual comment
│   ├── CommentSection.tsx         # Comments container
│   ├── LikeButton.tsx             # Like/vote button
│   ├── CommunityList.tsx          # List of communities
│   ├── CommunityDisplay.tsx       # Posts in a community
│   ├── CreatePost.tsx             # Post creation form
│   ├── CreateCommunity.tsx        # Community creation form
│   ├── MessagingInterface.tsx     # Main messaging layout
│   ├── ConversationList.tsx       # Conversation sidebar
│   ├── MessageList.tsx            # Message display area
│   ├── MessageInput.tsx           # Message composition
│   ├── ConversationHeader.tsx     # Chat header with actions
│   ├── CreateConversationModal.tsx # New chat creation
│   ├── MessageNotificationBadge.tsx # Unread message indicator
│   ├── EventCard.tsx              # Individual event card
│   ├── EventList.tsx              # List of events
│   ├── EventDetail.tsx            # Full event view
│   ├── CreateEventForm.tsx        # Event creation form
│   ├── EventFilters.tsx           # Event filtering controls
│   ├── AttendeeList.tsx           # Event attendees display
│   └── EventActions.tsx           # Event interaction buttons
├── pages/
│   ├── Home.tsx                   # Home page
│   ├── PostPage.tsx               # Post detail page
│   ├── CommunitiesPage.tsx        # Communities listing page
│   ├── CommunityPage.tsx          # Single community page
│   ├── CreatePostPage.tsx         # Post creation page
│   ├── CreateCommunityPage.tsx    # Community creation page
│   ├── MessagesPage.tsx           # Messaging interface page
│   ├── EventsPage.tsx             # Events listing page
│   ├── CreateEventPage.tsx        # Event creation page
│   └── EventDetailPage.tsx        # Single event page
├── context/
│   ├── AuthContext.tsx            # Authentication context
|   └── ThemeContext.tsx           # Dark/light theme context 
├── hooks/
│   └── useMessaging.ts            # Messaging-related hooks
├── types/
│   ├── messaging.ts               # TypeScript interfaces for messaging
│   └── events.ts                  # TypeScript interfaces for events
├── supabase-client.ts             # Supabase configuration
├── theme.css                      # Theme-related global styles
├── App.tsx                        # Main app component
└── index.css                      # Global styles

```

---

## Data Flow

**User Action → React Component → TanStack Query Hook → Supabase API Call → Database → Real-time Update → UI Update**

---

## Security Features
- **Row Level Security (RLS)** – Database-level permission control  
- **JWT Authentication** – Secure token-based auth  
- **GitHub OAuth** – Trusted third-party authentication  
- **Storage Policies** – File access control  
- **Input Validation** – Client and server-side validation  

---

## Real-time Features
- Live post updates  
- Instant messaging  
- Typing indicators  
- Online presence  
- Notification badges  
- Comment threads  

---

## References
- Database schema: [DATABASE.md](DATABASE.md)  
- Setup instructions: [SETUP.md](SETUP.md)

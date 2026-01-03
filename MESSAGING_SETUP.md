# Real-Time Messaging System Setup Guide

This guide will help you set up the real-time messaging system for DevConnect.

## 📋 Prerequisites

- Existing DevConnect project setup
- Supabase project with authentication configured
- Node.js and npm installed

## 🗄️ Database Setup

### Step 1: Run the Database Schema

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database-schema-messaging.sql`
4. Execute the SQL script

This will create all necessary tables:
- `Conversations` - Stores conversation metadata
- `ConversationParticipants` - Manages conversation membership
- `Messages` - Stores all messages
- `MessageReactions` - Handles message reactions
- `UserPresence` - Tracks online/offline status
- `TypingIndicators` - Real-time typing indicators
- `PinnedMessages` - Pinned messages in groups

### Step 2: Set Up Storage

1. In Supabase dashboard, go to Storage
2. Create a new bucket named `message-files`
3. Set the bucket to **private** (not public)
4. The SQL script already includes the necessary storage policies

### Step 3: Enable Real-time

1. Go to Database → Replication in your Supabase dashboard
2. Enable real-time for these tables:
   - `Messages`
   - `TypingIndicators` 
   - `UserPresence`
   - `ConversationParticipants`

## 📦 Dependencies

The following dependency has been added:

```bash
npm install date-fns
```

All other dependencies are already included in the existing project.

## 🚀 Features Included

### ✅ Direct Messaging
- 1-on-1 conversations
- Real-time message delivery
- Message history
- Online/offline status indicators
- Last seen timestamps

### ✅ Group Chats
- Create public/private groups
- Add/remove members
- Group admin roles
- Member management
- Group settings

### ✅ Real-Time Features
- Live message updates
- Typing indicators ("User is typing...")
- Presence indicators (online/offline)
- Real-time notifications
- Message delivery status

### ✅ Message Features
- Text messages with emoji support
- File sharing (documents, images)
- Image previews
- Message reactions (👍, ❤️, 😂, etc.)
- Reply to messages
- Edit/Delete messages
- Message search (UI ready)

### ✅ Advanced Features
- Pin important messages
- Unread message counts
- Message notifications in navbar
- Conversation search
- File upload with progress
- Link previews (UI ready)

## 🎨 UI/UX Features

### Design Consistency
- Matches existing DevConnect dark theme
- Cyan accent colors throughout
- Professional developer-focused design
- Responsive layout for mobile/desktop

### User Experience
- Intuitive conversation list
- Real-time updates without page refresh
- Smooth animations and transitions
- Loading states and error handling
- Keyboard shortcuts (Enter to send)

## 📱 Navigation

The messaging system is accessible via:
- Desktop: `~/messages` in the top navigation
- Mobile: `~/messages` in the hamburger menu
- Notification badge shows unread count

## 🔧 Component Architecture

### Core Components
- `MessagingInterface` - Main messaging layout
- `ConversationList` - Sidebar with conversations
- `MessageList` - Message display area
- `MessageInput` - Message composition
- `ConversationHeader` - Chat header with actions
- `CreateConversationModal` - New chat creation

### Hooks
- `useMessaging` - All messaging-related hooks
- `useConversations` - Fetch and manage conversations
- `useMessages` - Message operations
- `useRealtimeMessages` - Real-time subscriptions
- `useTypingIndicator` - Typing status
- `useUserPresence` - Online/offline status

### Types
- Complete TypeScript interfaces in `src/types/messaging.ts`
- Type safety for all messaging operations

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only see conversations they participate in
- Message access restricted to conversation members
- File uploads scoped to user folders
- Admin-only operations for group management

### Data Privacy
- Private conversations by default
- Secure file storage with access controls
- No data leakage between conversations
- Proper authentication checks

## 🚀 Getting Started

1. **Run the database schema** (Step 1 above)
2. **Set up storage bucket** (Step 2 above)
3. **Enable real-time** (Step 3 above)
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Navigate to `/messages`** in your browser
6. **Sign in** and start messaging!

## 🔄 Real-Time Updates

The system uses Supabase real-time subscriptions for:
- New messages appear instantly
- Typing indicators update in real-time
- Online status changes immediately
- Conversation list updates automatically

## 📊 Performance Optimizations

- **TanStack Query** for efficient data caching
- **Optimistic updates** for instant UI feedback
- **Lazy loading** for message history
- **Debounced typing indicators** to reduce API calls
- **Efficient re-renders** with proper React patterns

## 🐛 Troubleshooting

### Common Issues

1. **Messages not appearing in real-time**
   - Check if real-time is enabled for the Messages table
   - Verify WebSocket connection in browser dev tools

2. **File uploads failing**
   - Ensure `message-files` bucket exists and is private
   - Check storage policies are correctly applied

3. **Users not showing in conversation creation**
   - Verify RLS policies allow reading user data
   - Check if users have completed authentication

4. **Typing indicators not working**
   - Enable real-time for TypingIndicators table
   - Check if cleanup function is running (removes old indicators)

### Debug Mode

Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('supabase.debug', 'true');
```

## 🔮 Future Enhancements

The system is designed to be extensible. Potential additions:

- Voice/Video calling integration
- Message encryption
- Advanced file sharing
- Message scheduling
- Custom emoji reactions
- Message threads
- Conversation templates
- Integration with GitHub notifications

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database setup is complete
3. Ensure all environment variables are set
4. Check Supabase dashboard for any service issues

The messaging system is now ready to use! Users can create conversations, send messages, share files, and collaborate in real-time.
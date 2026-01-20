# Event Detail Page UI Features

## Overview
The Event Detail Page provides a comprehensive, interactive interface for viewing event information, managing registration, and tracking attendance. Built with a modern dark theme and responsive design.

## Key Features

### 1. Event Information Display

#### Hero Section
- **Full-width banner** with event image or gradient background
- **Gradient overlay** for better text readability (slate-950 with transparency)
- **Floating badge** for past events (red, top-right corner)
- **Responsive height**: 400px on desktop, adapts on mobile

#### Event Header
- **Large title** with prominent typography
- **Back navigation button** with arrow icon
- **Tag system** displaying event categories with slate-800 background
- **Breadcrumb context** for easy navigation

#### Event Stats Card
- **Real-time metrics**:
  - Current attendee count vs. maximum capacity
  - Event status (Available/Full)
  - Capacity percentage
- **Visual progress bar** showing fill percentage
- **Color-coded indicators**:
  - Cyan for active/available
  - Red for full/unavailable

### 2. Attendance Registration System

#### Three-State Registration
Users can indicate their attendance with three distinct options:

| Status | Description | Icon | Color |
|--------|-------------|------|-------|
| **Going** | Confirmed attendance | ✓ CheckCircle | Cyan (#06b6d4) |
| **Maybe** | Tentative interest | 👤 User | Amber (#f59e0b) |
| **Not Attending** | Declined | ✗ XCircle | Red (#ef4444) |

#### Registration Flow
```typescript
// Validation checks performed:
1. User authentication status
2. Event capacity (if max_attendees is set)
3. Event date (past events disabled)
4. Current registration status

// User feedback mechanisms:
- Success toast: "You are now [status] this event"
- Error toast: Authentication or capacity errors
- Visual status indicator in registration card
- Button state changes (active/disabled)
```

#### Registration UI States

**Not Registered (Default)**
```
┌─────────────────────────────┐
│ How are you attending?      │
├─────────┬─────────┬─────────┤
│ Going   │ Maybe   │  Not    │
│   ✓     │   👤    │   ✗     │
└─────────┴─────────┴─────────┘
```

**Already Registered**
```
┌─────────────────────────────┐
│ You are registered as:      │
│      ✓ ATTENDING            │
└─────────────────────────────┘
```

**Event Full**
```
┌─────────────────────────────┐
│ ⚠ This event is full        │
│ [Disabled buttons]          │
└─────────────────────────────┘
```

### 3. Capacity Management

#### Visual Capacity Indicator
```typescript
// Capacity calculation
const attendeeCount = event.attendee_count || 0;
const maxAttendees = event.max_attendees;
const capacityPercent = (attendeeCount / maxAttendees) * 100;
const isFull = maxAttendees && attendeeCount >= maxAttendees;
```

**Progress Bar Design**:
- Background: slate-700
- Fill: cyan-500 (bg-cyan-500)
- Height: 8px (h-2)
- Rounded corners (rounded-full)
- Percentage displayed above bar

#### Full Event Handling
When event reaches capacity:
1. **Registration buttons disabled** for "Going" option
2. **Warning message** displayed: "This event is full"
3. **Red background** alert box (bg-red-900/20)
4. **"Maybe" and "Not Attending"** remain available
5. **Share functionality** stays active

### 4. Event Details Grid

#### Main Content (2/3 width on desktop)

**Event Details Card**
- Date & Time with Calendar icon
- Duration with Clock icon
- Location with MapPin icon (physical events)
- Meeting Link with Monitor icon (virtual events)
- Organizer info with User icon

**About Section**
- Full event description
- Preserved line breaks (whitespace-pre-line)
- Prose styling for rich content

**Attendees Section**
- First 10 attendees displayed with numbered avatars
- "+X more" indicator for additional attendees
- Empty state: "No attendees yet. Be the first to join!"
- Cyan circular avatars with index numbers

#### Sidebar (1/3 width on desktop)

**Registration Card**
- Attendance options (three buttons)
- Current status display
- Share event button
- Conditional rendering based on event state

**Event Info Card**
- Created date
- Last updated date
- Event type (Virtual/In-person)
- Formatted dates (MMM d, yyyy)

### 5. Error Handling & Edge Cases

#### Event Not Found
```
┌─────────────────────────────────────┐
│                                     │
│        🚫 Event Not Found           │
│                                     │
│  The event you're looking for       │
│  doesn't exist or has been removed. │
│                                     │
│      [Browse Events Button]         │
│                                     │
└─────────────────────────────────────┘
```

**Features**:
- Full-screen centered layout
- Clear error messaging
- Call-to-action button to browse events
- Red accent color for error state

#### Loading State
```
┌─────────────────────────────────────┐
│                                     │
│          ⏳ Loading...              │
│                                     │
└─────────────────────────────────────┘
```

#### Authentication Required
```typescript
// Toast notification triggered on registration attempt
if (!user) {
  showError('Please sign in to register for events');
  return;
}
```

#### Past Event State
- **"PAST EVENT" badge** on hero image
- **All registration disabled**
- **Message**: "This event has ended"
- **Share button** still available

### 6. Responsive Design

#### Desktop (lg: 1024px+)
- Two-column layout (2/3 + 1/3)
- Side-by-side event stats
- Full-width hero banner

#### Tablet (md: 768px - 1023px)
- Stacked layout
- Full-width cards
- Condensed event details grid

#### Mobile (< 768px)
- Single column layout
- Vertical button groups
- Optimized touch targets (min 44px)
- Reduced padding and margins

### 7. Interactive Elements

#### Share Event Button
```typescript
const handleShareEvent = () => {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: event.title,
      text: event.description,
      url: url
    });
  } else {
    navigator.clipboard.writeText(url);
    showSuccess('Link copied to clipboard!');
  }
};
```

**Features**:
- Native share API support
- Fallback to clipboard copy
- Toast notification on success
- Share2 icon from Lucide

### 8. Date & Time Formatting

```typescript
// Display formats using date-fns
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  // Example: "Monday, December 25, 2023"
};

const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'h:mm a');
  // Example: "3:30 PM"
};
```

### 9. Color System

| Element | Color | Hex |
|---------|-------|-----|
| Primary Action | Cyan | #06b6d4 |
| Success (Attending) | Cyan | #06b6d4 |
| Warning (Maybe) | Amber | #f59e0b |
| Danger (Not Attending) | Red | #ef4444 |
| Background Primary | Slate-950 | #020617 |
| Background Card | Slate-900 | #0f172a |
| Border | Slate-800 | #1e293b |
| Text Primary | White | #ffffff |
| Text Secondary | Slate-300 | #cbd5e1 |
| Text Muted | Slate-400 | #94a3b8 |

### 10. Component Structure

```
EventDetailPage
├── Loading State
├── Error State (Event Not Found)
└── Main Layout
    ├── Hero Section
    │   ├── Image/Gradient Background
    │   ├── Gradient Overlay
    │   └── Past Event Badge (conditional)
    ├── Container (max-w-6xl)
    │   └── Card (bg-slate-900/80)
    │       ├── Header Section
    │       │   ├── Event Stats (right float)
    │       │   └── Event Info (left)
    │       │       ├── Back Button
    │       │       ├── Title
    │       │       └── Tags
    │       └── Content Grid (lg:grid-cols-3)
    │           ├── Main Content (lg:col-span-2)
    │           │   ├── Event Details Card
    │           │   ├── Description Section
    │           │   └── Attendees Section
    │           └── Sidebar
    │               ├── Registration Card
    │               └── Event Info Card
```

### 11. Accessibility Features

- **Semantic HTML**: Proper heading hierarchy (h1, h2, h3)
- **ARIA labels**: Button actions clearly labeled
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Color contrast**: WCAG AA compliant contrast ratios
- **Focus indicators**: Visible focus states on interactive elements
- **Screen reader friendly**: Descriptive text for icons and buttons

### 12. Performance Optimizations

- **Lazy loading**: Event data fetched on demand
- **Query caching**: TanStack Query caches event details
- **Optimistic updates**: UI updates immediately on registration
- **Image optimization**: Responsive images with proper sizing
- **Code splitting**: Page-level code splitting with React Router

## Implementation Checklist

✅ Hero section with image/gradient  
✅ Three-state attendance system (Going/Maybe/Not Attending)  
✅ Capacity tracking with visual progress bar  
✅ Real-time attendee count updates  
✅ Authentication guards  
✅ Past event handling  
✅ Event not found error state  
✅ Share functionality  
✅ Responsive design (mobile/tablet/desktop)  
✅ Toast notifications for user feedback  
✅ Loading and error states  
✅ Attendee list with avatars  
✅ Date/time formatting  
✅ Virtual vs. in-person event handling  

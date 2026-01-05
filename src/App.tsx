import { Routes, Route } from 'react-router'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import Navbar from './components/Navbar.tsx'
import PostPage from './pages/PostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import {CommunityPage} from './pages/CommunityPage.tsx'
import { CommunitiesPage } from './pages/CommunitiesPage.tsx'
import MessagesPage from './pages/MessagesPage.tsx'
import EventsPage from './pages/EventsPage.tsx'
import EventDetailPage from './pages/EventDetailPage.tsx'
import CreateEventPage from './pages/CreateEventPage.tsx'

function App() {
  return (
    <>
      <div>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/communities/create" element={<CreateCommunityPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App

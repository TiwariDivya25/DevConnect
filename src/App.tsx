import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import PostPage from './pages/PostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import {CommunityPage} from './pages/CommunityPage.tsx'
import { CommunitiesPage } from './pages/CommunitiesPage.tsx'
import MessagesPage from './pages/MessagesPage.tsx'
import NotFound from './components/NotFound.tsx'  // Import the 404 page

function App() {
  return (
    <>
      <div>
        <Router>  {/* Wrap everything with Router */}
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
              {/* Add 404 route at the end - catches all undefined routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
    </>
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/communities/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:id" element={<CommunityPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
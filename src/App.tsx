import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import LoginPage from './pages/LoginPage.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import Navbar from './components/Navbar.tsx'
import PostPage from './pages/PostPage.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import {CommunityPage} from './pages/CommunityPage.tsx'
import { CommunitiesPage } from './pages/CommunitiesPage.tsx'
import EditPostPage from './pages/EditPostPage.tsx'


function App() {
  return (
    <>
      <div>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit-post/:id" element={<EditPostPage />} />
            <Route path="/communities/create" element={<CreateCommunityPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

          </Routes>
        </div>
      </div>
    </>
  )
}

export default App

import { useState } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import Navbar from './components/Navbar.tsx'
import PostPage from './pages/PostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import CommunityList from './components/CommunityList.tsx'
import {CommunityPage} from './pages/CommunityPage.tsx'

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
            <Route path="/communities" element={<CommunityList />} />
            <Route path="/communities/:id" element={<CommunityPage />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App

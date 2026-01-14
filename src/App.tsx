import { Routes, Route } from 'react-router'
import Home from './pages/Home.tsx'
import CreatePostPage from './pages/CreatePostPage.tsx'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import PostPage from './pages/PostPage.tsx'
import CreateCommunityPage from './pages/CreateCommunityPage.tsx'
import {CommunityPage} from './pages/CommunityPage.tsx'
import { CommunitiesPage } from './pages/CommunitiesPage.tsx'
import MessagesPage from './pages/MessagesPage.tsx'
import EventsPage from './pages/EventsPage.tsx'
import EventDetailPage from './pages/EventDetailPage.tsx'
import CreateEventPage from './pages/CreateEventPage.tsx'
import ScrollToTop from "./components/ScrollToTop";
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import ForgetPasswordPage from './pages/ForgotPasswordPage.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import PublicRoute from './components/PublicRoute.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ProfilePage from './pages/ProfilePage.tsx'
import Contributors from './pages/Contributors.tsx'
import DashboardPage from './pages/DashboardPage.tsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:id" element={<CommunityPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contributors" element={<Contributors />} />


          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgetPasswordPage /></PublicRoute>} />

          {/* Reset password route */}
          <Route path='reset-password' element={<ResetPasswordPage />} />

          {/* protected routes */}
          <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/communities/create" element={<ProtectedRoute><CreateCommunityPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/events/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default App

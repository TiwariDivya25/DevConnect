import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import { CommunityPage } from "./pages/CommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";

function App() {
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route
            path="/communities/create"
            element={<CreateCommunityPage />}
          />
          <Route path="/communities/:id" element={<CommunityPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;



import CreatePost from '../components/CreatePost';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CreatePostPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-2">
          <Link
            to="/"
            className="back-btn-link"
          >
            <ArrowLeft className="w-4 h-4" />
            back to home
          </Link>
        </div>
        <CreatePost />
      </div>
    </div>
  )
}

export default CreatePostPage
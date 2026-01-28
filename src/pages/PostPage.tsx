import PostDetail from '../components/PostDetail';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header - visually lighter, transparent, shifted left */}
      <div
        className="sticky top-16 z-40"
        style={{
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(8,145,178,0.3)',
        }}
      >
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
          style={{ marginLeft: '-32px', maxWidth: 'calc(100% - 32px)' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex-gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(15,23,42,0.5)',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
              backdropFilter: 'blur(4px)',
              opacity: 0.92,
              pointerEvents: 'auto',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostDetail postId={Number(id)} />
      </div>
    </div>
  )
}

export default PostPage
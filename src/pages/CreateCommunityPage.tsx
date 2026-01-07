
import CreateCommunity from '../components/CreateCommunity'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CreateCommunityPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link 
            to="/communities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-cyan-300 font-mono text-sm transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/30"
          >
            <ArrowLeft className="w-4 h-4" />
            back to communities
          </Link>
        </div>
        <CreateCommunity />
      </div>
    </div>
  )
}

export default CreateCommunityPage
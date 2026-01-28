import { useParams, useNavigate } from "react-router-dom";
import CommunityDisplay from "../components/CommunityDisplay";
import { ArrowLeft } from "lucide-react";

export const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-cyan-900/30 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="back-btn-link"
          >
            <ArrowLeft className="w-4 h-4" />
            back
          </button>
        </div>
      </div>

      {/* Content Area: Defines the centered 4xl container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CommunityDisplay communityId={Number(id)} />
      </div>
    </div>
  );
};
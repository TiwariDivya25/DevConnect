import type { Repository } from "../../types/repository";
import { Star, GitFork, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Props {
  repositories: Repository[];
  isLoading?: boolean;
  error?: string | null;
}

const GitHubRepositories = ({ repositories, isLoading, error }: Props) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-slate-700 rounded w-16"></div>
                <div className="h-3 bg-slate-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!repositories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-slate-800/50"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
              {repo.name}
            </h3>
            {repo.private && (
              <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                Private
              </span>
            )}
          </div>

          {repo.description && (
            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-4">
              {repo.language && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <span>{repo.language}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{repo.stargazers_count}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <GitFork className="w-4 h-4" />
                <span>{repo.forks_count}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(repo.updated_at), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium">View on GitHub</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default GitHubRepositories;
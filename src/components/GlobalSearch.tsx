import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { Search, Users, User } from "lucide-react";

interface Community {
  id: number;
  name: string;
  description?: string;
}

interface Person {
  id?: string | null;
  name: string;
  username?: string | null;
  avatar_url?: string | null;
}

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface SearchResult {
  communities: Community[];
  people: Person[];
}

const DUMMY_PEOPLE: Person[] = [
  {
    id: "sdras",
    name: "Sarah Drasner",
    username: "sdras",
    avatar_url: "https://github.com/sdras.png",
  },
  {
    id: "gaearon",
    name: "Dan Abramov",
    username: "gaearon",
    avatar_url: "https://github.com/gaearon.png",
  },
  {
    id: "addyosmani",
    name: "Addy Osmani",
    username: "addyosmani",
    avatar_url: "https://github.com/addyosmani.png",
  }
];

const DUMMY_COMMUNITIES: Community[] = [
  {
    id: 1,
    name: "Web Dev Enthusiasts",
    description: "A community for web developers to share knowledge, showcase projects, and stay updated with the latest web technologies.",
  },
  {
    id: 2,
    name: "AI & Machine Learning",
    description: "Discuss the latest trends in artificial intelligence, deep learning, and neural networks. Share your research and models here.",
  },
  {
    id: 3,
    name: "Open Source Contributors",
    description: "A space dedicated to open source projects, contribution guides, and collaboration on global software initiatives.",
  },
  {
    id: 4,
    name: "UI/UX Designers",
    description: "Connect with fellow designers, share your portfolio, and discuss the latest design systems and user experience trends.",
  }
];

const searchAll = async (q: string): Promise<SearchResult> => {
  const query = q.trim().toLowerCase();
  if (!query) return { communities: [], people: [] };

  // Helper to filter dummy data
  const filteredDummyCommunities = DUMMY_COMMUNITIES.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.description?.toLowerCase().includes(query)
  );

  const filteredDummyPeople = DUMMY_PEOPLE.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.username?.toLowerCase().includes(query)
  );

  // Check if supabase is available
  if (!supabase) {
    return { communities: filteredDummyCommunities, people: filteredDummyPeople };
  }

  try {
    // Communities search by name or description
    const communitiesPromise = supabase
      .from("communities")
      .select("id, name, description")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(8);

    // People search - using only fields that exist in Profiles table
    const peopleViaProfiles = supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .ilike("full_name", `%${query}%`)
      .limit(8);

    const [communitiesRes, profilesRes] = await Promise.allSettled([
      communitiesPromise,
      peopleViaProfiles,
    ]);

    let communities: Community[] = [];
    if (communitiesRes.status === "fulfilled") {
      if (communitiesRes.value.error) {
        console.error("Communities search error:", communitiesRes.value.error);
      } else {
        communities = communitiesRes.value.data as Community[];
      }
    }

    // Merge with dummy data and remove duplicates by ID
    const mergedCommunities = [...communities];
    filteredDummyCommunities.forEach(dummy => {
      if (!mergedCommunities.some(c => c.id === dummy.id)) {
        mergedCommunities.push(dummy);
      }
    });

    let people: Person[] = [];
    if (profilesRes.status === "fulfilled") {
      if (profilesRes.value.error) {
        console.error("Profiles search error:", profilesRes.value.error);
      } else {
        const profs = profilesRes.value.data as ProfileData[];
        people = profs.map((p) => ({
          id: p.id,
          name: p.full_name || "Unknown",
          username: null,
          avatar_url: p.avatar_url || null,
        }));
      }
    }

    // Merge with dummy data and remove duplicates by username/id
    const mergedPeople = [...people];
    filteredDummyPeople.forEach(dummy => {
      if (!mergedPeople.some(p => p.id === dummy.id || p.username === dummy.username)) {
        mergedPeople.push(dummy);
      }
    });

    return { communities: mergedCommunities, people: mergedPeople };
  } catch {
    return { communities: filteredDummyCommunities, people: filteredDummyPeople };
  }
};

const useDebouncedValue = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<SearchResult>({
    queryKey: ["globalSearch", debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setOpen(query.length > 0);
  }, [query]);

  const onSelectCommunity = (id: number) => {
    setOpen(false);
    setQuery("");
    navigate(`/communities/${id}`);
  };

  const onSelectPerson = (id: string | null | undefined) => {
    if (!id) return;
    setOpen(false);
    setQuery("");
    navigate(`/profile/${id}`);
  };

  // Close when pressing Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => data || { communities: [], people: [] }, [data]);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 bg-slate-900/60 border border-cyan-900/30 rounded-lg px-3 py-2 w-full">
        <Search className="w-4 h-4 text-cyan-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(query.length > 0)}
          placeholder="search communities and people"
          className="bg-transparent text-sm font-mono text-gray-200 placeholder:text-gray-500 outline-none w-full"
        />
      </div>

      {open && (
        <div className="absolute mt-2 w-112 max-w-screen-sm bg-slate-900 border border-cyan-900/30 rounded-lg shadow-lg z-50">
          {/* Communities section */}
          <div className="p-3">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Communities</span>
            </div>
            {isLoading && <div className="text-gray-400 font-mono text-sm">searching...</div>}
            {!isLoading && results.communities.length === 0 && (
              <div className="text-gray-500 font-mono text-sm">no matches</div>
            )}
            <ul className="space-y-1">
              {results.communities.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelectCommunity(c.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-cyan-900/20 transition flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-cyan-400 font-mono text-sm group-hover:text-cyan-300 transition-colors">~/</span>
                    <div>
                      <div className="text-gray-200 font-mono text-sm group-hover:text-white transition-colors">{c.name}</div>
                      {c.description && (
                        <div className="text-gray-500 font-mono text-xs line-clamp-1 group-hover:text-gray-400 transition-colors">{c.description}</div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-cyan-900/30" />

          {/* People section */}
          <div className="p-3">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-wider mb-2">
              <User className="w-4 h-4" />
              <span>People</span>
            </div>
            {isLoading && <div className="text-gray-400 font-mono text-sm">searching...</div>}
            {!isLoading && results.people.length === 0 && (
              <div className="text-gray-500 font-mono text-sm">no matches</div>
            )}
            <ul className="space-y-1">
              {results.people.map((p, idx) => (
                <li key={`${p.id ?? "anon"}-${idx}`}>
                  <button
                    onClick={() => onSelectPerson(p.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-cyan-900/20 transition flex items-center gap-3 cursor-pointer group"
                  >
                    {p.avatar_url ? (
                      <img src={p.avatar_url ?? ''} alt={p.name} className="w-6 h-6 rounded-full ring-1 ring-cyan-400/40" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-cyan-900/30 ring-1 ring-cyan-400/40" />
                    )}
                    <div>
                      <div className="text-gray-200 font-mono text-sm group-hover:text-white transition-colors">{p.name}</div>
                      {p.username && (
                        <div className="text-gray-500 font-mono text-xs group-hover:text-gray-400 transition-colors">@{p.username}</div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

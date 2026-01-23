import { useEffect, useState } from "react";
import ContributorsGrid from "../components/contributors/ContributorsGrid";
import { fetchContributors } from "../services/github";
import type { Contributor } from "../types/contributor";

const Contributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContributors()
      .then(setContributors)
      .catch(console.error);
  }, []);

  const filtered = contributors.filter((c) =>
    c.login.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 style={{ color: 'var(--text-primary)' }} className="text-4xl font-bold">
          Hall of Fame
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mt-3">
          The amazing developers who contributed code and ideas.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-md">
        <input
          type="text"
          placeholder="Search contributors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            outline: "none",
            transition: "all 0.2s ease"
          }}
          className="rounded-lg focus:border-cyan-400 focus:outline-none"
        />
      </div>

      <ContributorsGrid contributors={filtered} />
    </section>
  );
};

export default Contributors;
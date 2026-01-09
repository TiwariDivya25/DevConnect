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
        <h1 className="text-4xl font-bold text-slate-100">
          Hall of Fame
        </h1>
        <p className="mt-3 text-slate-400">
          The amazing developers who contributed code and ideas.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-md">
        <input
          type="text"
          placeholder="Search contributors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full rounded-lg border border-slate-800
            bg-slate-950 px-4 py-3 text-slate-200
            placeholder-slate-500
            focus:border-cyan-400 focus:outline-none
          "
        />
      </div>

      <ContributorsGrid contributors={filtered} />
    </section>
  );
};

export default Contributors;

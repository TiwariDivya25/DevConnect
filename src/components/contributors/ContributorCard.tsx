import type { Contributor } from "../../types/contributor";

interface Props {
  contributor: Contributor;
}

const ContributorCard = ({ contributor }: Props) => {
  return (
    <a
      href={contributor.html_url}
      target="_blank"
      rel="noreferrer"
      className="
        group rounded-xl border border-slate-800
        bg-slate-950 p-6 text-center
        transition hover:-translate-y-1 hover:border-cyan-400
      "
    >
      <img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="mx-auto mb-4 h-16 w-16 rounded-full ring-2 ring-slate-800 group-hover:ring-cyan-400"
      />

      <h3 className="text-lg font-semibold text-slate-100">
        {contributor.login}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        <span className="font-medium text-cyan-400">
          {contributor.contributions}
        </span>{" "}
        contributions
      </p>

      <p className="mt-3 text-xs text-slate-600">
        Click to view profile
      </p>
    </a>
  );
};

export default ContributorCard;

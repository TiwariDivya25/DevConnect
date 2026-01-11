import type { Contributor } from "../../types/contributor";
import ContributorCard from "./ContributorCard";

interface Props {
  contributors: Contributor[];
}

const ContributorsGrid = ({ contributors }: Props) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {contributors.map((c) => (
        <ContributorCard key={c.id} contributor={c} />
      ))}
    </div>
  );
};

export default ContributorsGrid;

import type { Contributor } from "../types/contributor";

const OWNER = "TiwariDivya25";
const REPO = "DevConnect";

export const fetchContributors = async (): Promise<Contributor[]> => {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contributors`
  );

  if (!res.ok) {
    throw new Error("Failed to load contributors");
  }

  return res.json();
};

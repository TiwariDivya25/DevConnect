import type { Contributor } from "../types/contributor";
import type { Repository } from "../types/repository";

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

export const fetchUserRepositories = async (username: string): Promise<Repository[]> => {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );

  if (!res.ok) {
    throw new Error("Failed to load repositories");
  }

  return res.json();
};

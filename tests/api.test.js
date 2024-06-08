import { expect, test } from "vitest";

test("GitHub API returns the right response", async () => {
  const data = await fetch(
    "https://api.github.com/repos/mdn/content/stats/commit_activity",
  ).then((res) => res.json());
  // A year has 52 weeks
  expect(data).toHaveLength(52);
  expect(Object.keys(data[0])).toEqual(["total", "week", "days"]);
});

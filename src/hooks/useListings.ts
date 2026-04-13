import { useQuery } from "@tanstack/react-query";
import { fetchSkillsFromGitHub, fetchPluginsFromGitHub } from "@/lib/github";
import { mockSkills, mockPlugins, mockJobs, Listing } from "@/data/mockData";
import { applyOverrides, getSubmissions } from "@/lib/adminStore";

function mergeAndDedupe(githubItems: Listing[], mockItems: Listing[]): Listing[] {
  const ghNames = new Set(githubItems.map((i) => i.name.toLowerCase()));
  const unique = mockItems.filter((m) => !ghNames.has(m.name.toLowerCase()));
  return [...githubItems, ...unique];
}

export function useSkills() {
  return useQuery<Listing[]>({
    queryKey: ["/listings/skills"],
    queryFn: async () => {
      try {
        const gh = await fetchSkillsFromGitHub();
        const merged = mergeAndDedupe(gh, mockSkills);
        const approved = getSubmissions()
          .filter((s) => s.type === "skill" && s.status === "approved")
          .map(({ submitted_at, submitter_email, ...l }) => l as Listing);
        return applyOverrides([...approved, ...merged]);
      } catch {
        const approved = getSubmissions()
          .filter((s) => s.type === "skill" && s.status === "approved")
          .map(({ submitted_at, submitter_email, ...l }) => l as Listing);
        return applyOverrides([...approved, ...mockSkills]);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function usePlugins() {
  return useQuery<Listing[]>({
    queryKey: ["/listings/plugins"],
    queryFn: async () => {
      try {
        const gh = await fetchPluginsFromGitHub();
        const merged = mergeAndDedupe(gh, mockPlugins);
        const approved = getSubmissions()
          .filter((s) => s.type === "plugin" && s.status === "approved")
          .map(({ submitted_at, submitter_email, ...l }) => l as Listing);
        return applyOverrides([...approved, ...merged]);
      } catch {
        const approved = getSubmissions()
          .filter((s) => s.type === "plugin" && s.status === "approved")
          .map(({ submitted_at, submitter_email, ...l }) => l as Listing);
        return applyOverrides([...approved, ...mockPlugins]);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useJobs() {
  return useQuery<Listing[]>({
    queryKey: ["/listings/jobs"],
    queryFn: async () => {
      const approved = getSubmissions()
        .filter((s) => s.type === "job" && s.status === "approved")
        .map(({ submitted_at, submitter_email, ...l }) => l as Listing);
      return applyOverrides([...approved, ...mockJobs]);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllListings() {
  const skills = useSkills();
  const plugins = usePlugins();
  const jobs = useJobs();
  return {
    isLoading: skills.isLoading || plugins.isLoading || jobs.isLoading,
    skills: skills.data || [],
    plugins: plugins.data || [],
    jobs: jobs.data || [],
  };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Listing, Ad } from "@/data/mockData";

export function useListings(type?: string) {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", type],
    queryFn: () => api.getListings({ type }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSkills() {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", "skill"],
    queryFn: () => api.getListings({ type: "skill" }),
    staleTime: 2 * 60 * 1000,
  });
}

export function usePlugins() {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", "plugin"],
    queryFn: () => api.getListings({ type: "plugin" }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMcpServers() {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", "mcp_server"],
    queryFn: () => api.getListings({ type: "mcp_server" }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTemplates() {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", "template"],
    queryFn: () => api.getListings({ type: "template" }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useJobs() {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings", "job"],
    queryFn: () => api.getListings({ type: "job" }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAllListings() {
  const mcp = useMcpServers();
  const skills = useSkills();
  const plugins = usePlugins();
  const templates = useTemplates();
  const jobs = useJobs();
  return {
    isLoading: mcp.isLoading || skills.isLoading || plugins.isLoading || templates.isLoading || jobs.isLoading,
    mcp: mcp.data || [],
    skills: skills.data || [],
    plugins: plugins.data || [],
    templates: templates.data || [],
    jobs: jobs.data || [],
    all: [...(mcp.data || []), ...(skills.data || []), ...(plugins.data || []), ...(templates.data || []), ...(jobs.data || [])],
  };
}

export function useListing(id: number | string) {
  return useQuery<Listing>({
    queryKey: ["/api/listings", id],
    queryFn: () => api.getListing(Number(id)),
    enabled: !!id && !isNaN(Number(id)),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAds() {
  return useQuery<Ad[]>({
    queryKey: ["/api/highlights"],
    queryFn: () => api.getHighlights(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearch(q: string, type?: string) {
  return useQuery<Listing[]>({
    queryKey: ["/api/listings/search", q, type],
    queryFn: () => api.searchListings(q, type),
    enabled: q.trim().length > 0,
    staleTime: 60 * 1000,
  });
}

export function useUpvote(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.upvoteListing(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/listings"] });
    },
  });
}

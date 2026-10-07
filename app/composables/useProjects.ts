import { fetchProjects } from "~/data/projects"

export function useProjects() {
  return useAsyncData("projects", () => fetchProjects())
}

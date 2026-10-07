export interface Project {
  slug: string
  name: string
  year: string
  category: string[]
  services: string[]
  photos: string[]
  descr: string
  challenge: string
  solution: string
}

interface ApiProject {
  slug: string
  title: string
  short_description: string
  services: string
  category: { name: string } | null
  date: string
  challenge: string | null
  solution: string | null
  cover_image: string | null
  images: { url: string }[]
}

interface ProjectsPage {
  data: ApiProject[]
  meta: { last_page: number }
}

const mapProject = (item: ApiProject): Project => ({
  slug: item.slug,
  name: item.title,
  year: item.date,
  category: item.category ? [item.category.name] : [],
  services: item.services
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean),
  photos: [item.cover_image, ...item.images.map((image) => image.url)].filter(
    (src): src is string => Boolean(src)
  ),
  descr: item.short_description,
  challenge: item.challenge ?? "",
  solution: item.solution ?? "",
})

export async function fetchProjects() {
  const projects: Project[] = []
  let page = 1

  try {
    while (page) {
      const response = await $fetch<ProjectsPage>(
        "https://api.blackfire.studio/api/projects",
        {
          headers: { Accept: "application/json" },
          query: { per_page: 100, page },
        }
      )

      projects.push(...response.data.map(mapProject))
      const last = response.meta.last_page || 1
      page = page < last ? page + 1 : 0
    }
  } catch {
    return projects
  }

  return projects
}

export interface ProjectMedia {
  type: "image" | "video"
  url: string
  poster?: string | null
}

export interface Project {
  slug: string
  name: string
  year: string
  category: string[]
  services: string[]
  photos: string[]
  media: ProjectMedia[]
  descr: string
  challenge: string
  solution: string
  website: string
}

interface ApiCategory {
  name: string
}

interface ApiMedia {
  type?: string | null
  url?: string | null
  thumbnail_url?: string | null
  position?: number | null
}

interface ApiProject {
  slug: string
  title: string
  short_description: string | null
  services: string | null
  category?: ApiCategory | null
  categories?: ApiCategory[] | null
  date: string | null
  challenge: string | null
  solution: string | null
  cover_image: string | null
  images?: { url?: string | null }[] | null
  media?: ApiMedia[] | null
  website?: string | null
}

interface ProjectsPage {
  data: ApiProject[]
  meta: { last_page: number }
}

const mapProject = (item: ApiProject): Project => {
  const categories = item.categories?.length
    ? item.categories
    : item.category
      ? [item.category]
      : []

  const media: ProjectMedia[] = []
  if (item.cover_image) media.push({ type: "image", url: item.cover_image })

  const sources = item.media?.length
    ? [...item.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : (item.images ?? []).map((image) => ({
        type: "image",
        url: image.url,
        thumbnail_url: null,
        position: 0,
      }))

  for (const source of sources) {
    if (!source.url) continue
    if (source.type === "video") {
      media.push({ type: "video", url: source.url, poster: source.thumbnail_url })
      continue
    }
    media.push({ type: "image", url: source.url })
  }

  return {
    slug: item.slug,
    name: item.title,
    year: item.date ?? "",
    category: categories.map((category) => category.name).filter(Boolean),
    services: (item.services ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
    photos: media.filter((entry) => entry.type === "image").map((entry) => entry.url),
    media,
    descr: item.short_description ?? "",
    challenge: item.challenge ?? "",
    solution: item.solution ?? "",
    website: normalizeWebsite(item.website),
  }
}

const normalizeWebsite = (value: string | null | undefined) => {
  const url = (value ?? "").trim()
  if (!url) return ""
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

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

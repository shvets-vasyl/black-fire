export interface Project {
  name: string
  year: string
  category: string[]
  services: string[]
  photos: string[]
  descr: string
  websiteLink: string
  challenge: string
  solution: string
}

export const projects: Project[] = [
  {
    category: ["design"],
    services: ["production", "marketing"],
    year: "2025",
    name: "Zinchenko",
    photos: [
      "/images/work/work-1.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
  {
    category: ["development"],
    services: ["design", "production"],
    year: "2025",
    name: "Kovalenko",
    photos: [
      "/images/work/work-2.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
  {
    category: ["marketing"],
    services: ["design", "development"],
    year: "2024",
    name: "Horizon",
    photos: [
      "/images/work/work-3.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
  {
    category: ["production"],
    services: ["development", "marketing"],
    year: "2024",
    name: "Forma",
    photos: [
      "/images/work/work-4.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
  {
    category: ["design", "marketing"],
    services: ["production"],
    year: "2023",
    name: "Mono",
    photos: [
      "/images/work/work-5.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
  {
    category: ["development", "production"],
    services: ["design", "marketing"],
    year: "2023",
    name: "North",
    photos: [
      "/images/work/work-6.webp",
      "/images/work/work-2.webp",
      "/images/work/work-3.webp",
    ],
    descr:
      "NFT collection with Potap and Oleksandr Zinchenko: <br />3 animated cards, designed from scratch.",
    websiteLink: "https://www.youtube.com",
    challenge:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
    solution:
      "To build a product that truly stood apart from its competitors, we set out to rival the biggest international brands and apply global best practices within a uniquely South African market.Through multiple iterations, research, testing.",
  },
]

export const findProject = (name: string) =>
  projects.find((item) => item.name.toLowerCase() === name.toLowerCase())

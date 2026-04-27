export type Repo = {
    name: string
    description: string | null
    url: string
    homepageUrl: string | null
    stargazerCount: number
    forkCount: number
    primaryLanguage: { name: string; color: string } | null
    topics: string[]
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "SebastianPellitero"

export async function getPinnedRepos(): Promise<Repo[]> {
    if (!GITHUB_TOKEN) {
        console.warn("GITHUB_TOKEN not set — pinned repos unavailable")
        return []
    }

    const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              primaryLanguage { name color }
              repositoryTopics(first: 8) {
                nodes { topic { name } }
              }
            }
          }
        }
      }
    }`

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
        next: { revalidate: 86400 },
    })

    if (!res.ok) return []

    const json = await res.json()
    const nodes = json?.data?.user?.pinnedItems?.nodes ?? []

    return nodes.map((n: any): Repo => ({
        name: n.name,
        description: n.description ?? null,
        url: n.url,
        homepageUrl: n.homepageUrl || null,
        stargazerCount: n.stargazerCount,
        forkCount: n.forkCount,
        primaryLanguage: n.primaryLanguage ?? null,
        topics: n.repositoryTopics?.nodes?.map((t: any) => t.topic.name) ?? [],
    }))
}

export async function getPublicRepos(): Promise<Repo[]> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
    }
    if (GITHUB_TOKEN) headers.Authorization = `bearer ${GITHUB_TOKEN}`

    const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=50&type=public`,
        { headers, next: { revalidate: 86400 } }
    )

    if (!res.ok) return []

    const repos: any[] = await res.json()

    return repos.map((r): Repo => ({
        name: r.name,
        description: r.description ?? null,
        url: r.html_url,
        homepageUrl: r.homepage || null,
        stargazerCount: r.stargazers_count,
        forkCount: r.forks_count,
        primaryLanguage: r.language ? { name: r.language, color: languageColor(r.language) } : null,
        topics: r.topics ?? [],
    }))
}

// Fallback colors for common languages (GitHub's exact colors)
function languageColor(lang: string): string {
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Go: "#00ADD8",
        Rust: "#dea584",
        Java: "#b07219",
        "C#": "#178600",
        "C++": "#f34b7d",
        C: "#555555",
        Ruby: "#701516",
        PHP: "#4F5D95",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Dart: "#00B4AB",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Shell: "#89e051",
        Vue: "#41b883",
        Svelte: "#ff3e00",
    }
    return colors[lang] ?? "#8b949e"
}

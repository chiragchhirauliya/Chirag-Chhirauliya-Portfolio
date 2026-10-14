export async function getGitHubData(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'chirag-portfolio',
        },
    });
    if (!response.ok) {
        throw new Error(`GitHub request failed with status ${response.status}.`);
    }
    const repositories = (await response.json());
    const sorted = repositories
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .map((repo) => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
    }));
    return {
        username,
        profileUrl: `https://github.com/${username}`,
        repositoryCount: sorted.length,
        repositories: sorted,
        lastUpdated: new Date().toISOString(),
    };
}

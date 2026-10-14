const candidateUsernames = ['9754850257', 'chiragchhirauliya'];
export async function getLeetCodeData() {
    for (const username of candidateUsernames) {
        try {
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (!response.ok) {
                continue;
            }
            const payload = (await response.json());
            const stats = {
                totalSolved: Number(payload.totalSolved ?? 0),
                easySolved: Number(payload.easySolved ?? 0),
                mediumSolved: Number(payload.mediumSolved ?? 0),
                hardSolved: Number(payload.hardSolved ?? 0),
                acceptanceRate: Number(payload.acceptanceRate ?? 0),
                lastUpdated: new Date().toISOString(),
            };
            return {
                success: true,
                stats,
                lastUpdated: stats.lastUpdated,
            };
        }
        catch {
            continue;
        }
    }
    return {
        success: false,
        message: 'LeetCode service is unavailable or the public profile cannot be accessed right now.',
        stats: null,
        lastUpdated: null,
    };
}

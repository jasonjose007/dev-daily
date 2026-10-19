const GITHUB_API = 'https://api.github.com';

const EXCLUDED_REPOS = ['leetcode', 'leet-code', 'leetcode-solutions', 'daily-solutions'];

export async function fetchGitHubData(username: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers['Authorization'] = `token ${token}`;

  const [prsRes, issuesRes, eventsRes] = await Promise.all([
    fetch(`${GITHUB_API}/search/issues?q=is:pr+is:open+author:${username}&per_page=10`, { headers }),
    fetch(`${GITHUB_API}/search/issues?q=is:issue+is:open+assignee:${username}&per_page=10`, { headers }),
    fetch(`${GITHUB_API}/users/${username}/events?per_page=30`, { headers }),
  ]);

  const [prsData, issuesData, eventsData] = await Promise.all([
    prsRes.json(),
    issuesRes.json(),
    eventsRes.json(),
  ]);

  const isExcluded = (repoName: string) =>
    EXCLUDED_REPOS.some(r => repoName.toLowerCase().includes(r));

  const commits = (Array.isArray(eventsData) ? eventsData : [])
    .filter((e: any) => e.type === 'PushEvent' && !isExcluded(e.repo.name))
    .flatMap((e: any) =>
      (e.payload.commits || []).map((c: any) => ({
        message: c.message.split('\n')[0],
        repo: e.repo.name,
        date: e.created_at,
      }))
    )
    .slice(0, 10);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekEvents = (Array.isArray(eventsData) ? eventsData : []).filter(
    (e: any) => new Date(e.created_at) > weekAgo && !isExcluded(e.repo.name)
  );

  const weeklyCommits = weekEvents
    .filter((e: any) => e.type === 'PushEvent')
    .reduce((sum: number, e: any) => sum + (e.payload.commits?.length || 0), 0);

  const weeklyRepos = [
    ...new Set(weekEvents.map((e: any) => e.repo.name.split('/')[1])),
  ].slice(0, 5) as string[];

  return {
    username,
    openPRs: (prsData.items || []).map((pr: any) => ({
      id: pr.number,
      title: pr.title,
      repo: pr.repository_url?.split('/').slice(-2).join('/') || '',
      url: pr.html_url,
      createdAt: pr.created_at,
      state: pr.state,
    })),
    openIssues: (issuesData.items || []).map((issue: any) => ({
      id: issue.number,
      title: issue.title,
      repo: issue.repository_url?.split('/').slice(-2).join('/') || '',
      url: issue.html_url,
      labels: (issue.labels || []).map((l: any) => l.name),
    })),
    recentCommits: commits,
    weeklyStats: {
      commits: weeklyCommits,
      prsOpened: weekEvents.filter(
        (e: any) => e.type === 'PullRequestEvent' && e.payload.action === 'opened'
      ).length,
      issuesClosed: weekEvents.filter(
        (e: any) => e.type === 'IssuesEvent' && e.payload.action === 'closed'
      ).length,
      repos: weeklyRepos,
    },
  };
}

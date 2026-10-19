import { GitHubData } from '@/types';

export default function GitHubStatsCard({ data }: { data: GitHubData }) {
  return (
    <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-4 text-sm space-y-3">
      <p className="text-cyan-400 font-semibold text-xs uppercase tracking-wider">
        GitHub · {data.username}
      </p>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Open PRs', value: data.openPRs.length },
          { label: 'Issues', value: data.openIssues.length },
          { label: 'Commits (7d)', value: data.weeklyStats.commits },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-900/60 rounded-lg py-2">
            <p className="text-white font-bold text-lg">{value}</p>
            <p className="text-slate-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {data.openPRs.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs mb-1.5 font-medium">Open Pull Requests</p>
          <ul className="space-y-1">
            {data.openPRs.slice(0, 3).map(pr => (
              <li key={pr.id} className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">›</span>
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-cyan-400 transition-colors truncate"
                >
                  {pr.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.weeklyStats.repos.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.weeklyStats.repos.map(r => (
            <span key={r} className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-0.5 rounded-full border border-indigo-700/40">
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface PullRequest {
  id: number;
  title: string;
  repo: string;
  url: string;
  createdAt: string;
  state: string;
}

export interface Issue {
  id: number;
  title: string;
  repo: string;
  url: string;
  labels: string[];
}

export interface Commit {
  message: string;
  repo: string;
  date: string;
}

export interface WeeklyStats {
  commits: number;
  prsOpened: number;
  issuesClosed: number;
  repos: string[];
}

export interface GitHubData {
  username: string;
  openPRs: PullRequest[];
  openIssues: Issue[];
  recentCommits: Commit[];
  weeklyStats: WeeklyStats;
}

export type MessageRole = 'user' | 'alexa';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

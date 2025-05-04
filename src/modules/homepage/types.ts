export interface IGitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export interface IGitHubRepository {
  commit: any;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
  language: string;
  author: {
    login: string;
    avatar_url: string;
  };
  languages_url: string;
  updated_at: string;
  watchers_count: number;
  topics?: string[];
}

export interface GitHubLanguages {
  [key: string]: number;
}

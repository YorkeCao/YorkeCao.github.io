export class CommitObject {
  url: string;
  sha: string;
  html_url: string;
  comments_url: string;
  commit: Commit;
  author: any;
  committer: any;
  parents: any[];
  stats: any;
}

export class Commit {
  url: string;
  author: User;
  commiter: User;
  message: string;
  tree: any;
}

export class User {
  name: string;
  date: string;
  email: string;
}

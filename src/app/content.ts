export class Content {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  download_url: string;
  type: string;
  _links: Links;
}

interface Links {
  self: string;
  html: string;
}
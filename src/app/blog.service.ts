import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as marked from 'marked';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Content } from './content';
import { CommitObject } from './commit-object';

@Injectable()
export class BlogService {
  owner = "yukun.cao";
  repo = "yukun.cao";

  constructor(
    private http: Http
  ) { }

  getBlogs(): Map<string, Content[]> {
    let blogs = new Map<string, Content[]>();

    this.getDirs().subscribe(
      contents => contents.forEach(
          dir => this.getFiles(dir.url).subscribe(
              files => blogs.set(dir.name, files))
        )
      );
    return blogs;
  }

  getDirs(): Observable<Content[]> {
    return this.http
      .get("https://gitee.com/api/v5/repos/" + this.owner + "/" + this.repo + "/contents/assets/articles?ref=osc-pages")
      .map(response => response.json());
  }

  getFiles(url: string): Observable<Content[]> {
    return this.http
      .get(url + "?ref=osc-pages")
      .map(response => response.json());
  }

  getFile(dir: string, name: string): Observable<string> {
    return this.http
      .get("http://" + this.owner +".gitee.io/assets/articles/" + dir + "/" + name)
      .map(response => marked(response.text()));
  }

  getCommits(): Observable<CommitObject[]> {
    return this.http
      .get("https://gitee.com/api/v5/repos/" + this.owner + "/" + this.repo + "/commits?sha=osc-pages&page=1&per_page=7")
      .map(response => response.json());
  }
}

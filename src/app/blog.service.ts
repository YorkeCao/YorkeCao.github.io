import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import * as marked from 'marked';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Blog } from './blog';

@Injectable()
export class BlogService {
  owner = "YorkeCao";
  repo = "YorkeCao.github.io";

  constructor(
    private http: Http
  ) { }

  getBlogList(): Observable<Blog[]> {
    return this.http
      .get("https://api.github.com/repos/" + this.owner + "/" + this.repo + "/contents/assets/articles")
      .map(response => response.json());
  }

  getBlog(title: string): Promise<string> {
    return this.http
      .get("https://raw.githubusercontent.com/" + this.owner + "/" + this.repo + "/master/assets/articles/" + title)
      .toPromise()
      .then(response => marked(response.text()));
  }
}
